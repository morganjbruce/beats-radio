import { useRef, useEffect, useState } from "react";
import { EngineLoading } from "./EngineLoading";
import { connectOutput, workerSetInterval, workerClearInterval } from "../background-audio";
import {
  SAMPLE_MANIFESTS,
  CUSTOM_SAMPLE_MAPS,
  SOUNDFONT_ALIASES,
  USE_SOUNDFONTS,
  SYNTH_NAMES as SYNTH_NAMES_LIST,
  PITCHED as PITCHED_LIST,
} from "../sounds-manifest";

export interface StrudelAdapter {
  setCode: (code: string) => void;
  run: () => Promise<void>;
  stop: () => Promise<void>;
  getAudioContext: () => AudioContext | null;
  getOutputNode: () => AudioNode | null;
  /** The scheduler's live cps — only meaningful after run() has resolved. */
  getCps: () => number | null;
  /** Fire inaudible triggers for every sound a song uses so its sample buffers are
   *  fetched & cached BEFORE they're needed (samples otherwise load lazily on first hit). */
  warmup: (code: string) => void;
}

interface StrudelHostProps {
  onReady?: (adapter: StrudelAdapter) => void;
  onPlayingChange?: (playing: boolean) => void;
}

// --- sample warm-up ------------------------------------------------------------------
// superdough fetches each sample buffer lazily on its first trigger, so a song's opening
// notes (or an instrument entering mid-song) can miss while the buffer downloads. warmup()
// parses a song's s("...") literals (+ same-line .bank()) and fires zero-gain 10ms triggers
// through the same superdough path, caching every buffer up front. Synths need no warming.
type SuperdoughFn = (value: Record<string, unknown>, t: number, dur: number) => Promise<unknown>;
const SYNTH_NAMES = new Set(SYNTH_NAMES_LIST);
const PITCHED = new Set(PITCHED_LIST);
const warmedSounds = new Set<string>();
// whole code strings already warmed — skips re-running extractSounds' regexes on every
// repeated warmup call (playAt warms current+next per track; the queue sweep re-visits)
const warmedCode = new Set<string>();
function extractSounds(code: string): { name: string; bank?: string }[] {
  const found: { name: string; bank?: string }[] = [];
  for (const line of code.split("\n")) {
    const bank = /\.bank\(\s*["']([^"']+)["']\s*\)/.exec(line)?.[1];
    for (const sm of line.matchAll(/(?:^|[^\w])s\(\s*["'`]([^"'`]+)["'`]/g)) {
      for (const tok of sm[1].match(/[a-zA-Z_][\w]*(?::\d+)?/g) ?? []) {
        if (!SYNTH_NAMES.has(tok)) found.push({ name: tok, bank });
      }
    }
  }
  return found;
}

const defaultCode = `// Beats engine — songs stream in from the radio queue.
// This demo pattern is only what plays if you run the editor by hand.

setcps(90/60/4)

stack(
  s("bd sd bd sd"),
  s("hh*8").gain(0.5)
)
`;

function StrudelHost({ onReady, onPlayingChange }: StrudelHostProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const strudelRef = useRef<any>(null);
    const audioContextGetterRef = useRef<(() => AudioContext) | null>(null);
    const superdoughRef = useRef<SuperdoughFn | null>(null);
    const resetGlobalEffectsRef = useRef<(() => void) | null>(null);
    const outputGainNodeRef = useRef<GainNode | null>(null);
    const [loading, setLoading] = useState(true);
    const [playing, setPlaying] = useState(false);
    const onReadyCalledRef = useRef(false);

    // Notify parent of playing state changes
    useEffect(() => {
      onPlayingChange?.(playing);
    }, [playing, onPlayingChange]);

    useEffect(() => {
      // Suppress specific Strudel/superdough errors
      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        const msg = event.reason?.message || '';
        if (msg.includes('not found') || msg.includes('duck target orbit')) {
          event.preventDefault();
        }
      };
      
      window.addEventListener('unhandledrejection', handleUnhandledRejection);
      return () => {
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      };
    }, []);

    useEffect(() => {
      if (!wrapperRef.current || !strudelRef.current) return;

      const triggerLayout = () => {
        if (strudelRef.current?.editor) {
          strudelRef.current.editor.requestMeasure();
        }
      };

      const resizeObserver = new ResizeObserver(triggerLayout);
      resizeObserver.observe(wrapperRef.current);

      window.addEventListener("resize", triggerLayout);
      window.addEventListener("orientationchange", triggerLayout);

      return () => {
        resizeObserver.disconnect();
        window.removeEventListener("resize", triggerLayout);
        window.removeEventListener("orientationchange", triggerLayout);
      };
    }, [loading]);

    useEffect(() => {
      if (!containerRef.current) return;
      if (strudelRef.current) return;

      let isCleanedUp = false;

      const init = async () => {
        try {
          // the five module loads are independent — fetch/evaluate them in parallel
          const [{ StrudelMirror }, { transpiler }, webaudioModule, { registerSoundfonts }, { evalScope, silence, Pattern }] =
            await Promise.all([
              import("@strudel/codemirror"),
              import("@strudel/transpiler"),
              import("@strudel/webaudio"),
              import("@strudel/soundfonts"),
              import("@strudel/core"),
            ]);
          const { getAudioContext, webaudioOutput, initAudioOnFirstClick, registerSynthSounds, samples, registerSound, soundMap, superdough } = webaudioModule;
          superdoughRef.current = superdough as unknown as SuperdoughFn;
          const { getSuperdoughAudioController, initAudio, resetGlobalEffects } = webaudioModule as unknown as {
            getSuperdoughAudioController: () => { output: { destinationGain: GainNode } };
            initAudio: () => Promise<void>;
            resetGlobalEffects?: () => void; // re-exported from superdough, missing from inferred types
          };

          audioContextGetterRef.current = getAudioContext;

          // Master tap between superdough's output and the speakers: the visualizer reads it
          // (getOutputNode) and adapter.run() fades it (the ghost-audio fix).
          const ctx = getAudioContext();
          if (ctx && !outputGainNodeRef.current) {
            const gainNode = ctx.createGain();
            gainNode.gain.value = 1.0;
            // On iOS this routes through a media element so the radio keeps playing in
            // the background; elsewhere it's a plain connect to ctx.destination.
            connectOutput(ctx, gainNode);
            outputGainNodeRef.current = gainNode;
          }

          // superdough routes every orbit through one destinationGain; pointing it at the
          // tap replaces the old page-wide connect() monkey-patch.
          const routeThroughTap = () => {
            const tap = outputGainNodeRef.current;
            if (!tap) return;
            try {
              const out = getSuperdoughAudioController().output;
              out.destinationGain.disconnect();
              out.destinationGain.connect(tap);
            } catch (err) {
              console.warn("[strudelhost] output re-route failed:", err);
            }
          };
          routeThroughTap();
          // resetGlobalEffects rebuilds destinationGain wired straight to the speakers, so
          // every reset must re-route — composed here so no call site can forget it.
          resetGlobalEffectsRef.current = resetGlobalEffects
            ? () => {
                resetGlobalEffects();
                routeThroughTap();
              }
            : null;

          // Lazy-mounted post-Start-click, so initAudioOnFirstClick would need a SECOND
          // click; init directly instead (playAt's ctx.resume() is the backstop).
          void initAudio().catch(() => {});

          if (isCleanedUp) return;

          if (containerRef.current) containerRef.current.innerHTML = "";

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mirror = new (StrudelMirror as any)({
            defaultOutput: webaudioOutput,
            getTime: () => getAudioContext().currentTime,
            // Drive the scheduler clock from a Worker: main-thread setInterval gets
            // throttled to >=1s in background pages, which starves zyklus' ~200ms
            // lookahead and makes backgrounded playback stutter. Forwarded down
            // StrudelMirror -> repl -> Cyclist -> createClock.
            setInterval: workerSetInterval,
            clearInterval: workerClearInterval,
            transpiler,
            root: containerRef.current,
            initialCode: defaultCode,
            drawTime: [-2, 2],
            prebake: async () => {
              initAudioOnFirstClick();
              
              const loadModules = evalScope(
                import("@strudel/core"),
                import("@strudel/codemirror"),
                import("@strudel/webaudio"),
                import("@strudel/draw"),
                import("@strudel/mini"),
                import("@strudel/tonal"),
              );
              
              // Sample sources + custom aliases come from the shared inventory
              // (src/sounds-manifest.ts) so the CLI's `beats-radio sounds` can't drift.
              // The (map, baseUrl) overload of samples() exists at runtime but isn't in the
              // inferred JSDoc types.
              const samplesMap = samples as unknown as (map: Record<string, string[]>, base: string) => Promise<void>;

              await Promise.all([
                loadModules,
                registerSynthSounds(),
                // General MIDI instruments (gm_epiano1 = Rhodes-style EP, organs, etc.).
                // Deferred via Promise.resolve().then so it's resilient whether
                // registerSoundfonts returns a promise or void (it's void in v1.2.6),
                // catches sync throws, and stays non-fatal to the rest of audio init.
                ...(USE_SOUNDFONTS
                  ? [Promise.resolve().then(() => registerSoundfonts()).catch((e) => console.warn('soundfonts registration failed:', e))]
                  : []),
                ...SAMPLE_MANIFESTS.map((m) => samples(m.url)),
                ...CUSTOM_SAMPLE_MAPS.map((m) => samplesMap(m.map, m.baseUrl)),
              ]);

              // Soundfont-backed aliases (e.g. rhodes -> gm_epiano1), now that soundfonts are
              // registered. Delegates to the soundfont's trigger so the bare name resolves.
              // Guarded: a registry-shape change must never break audio init.
              for (const { alias, soundfont } of SOUNDFONT_ALIASES) {
                try {
                  const src = soundMap.get()?.[soundfont];
                  if (src?.onTrigger) {
                    registerSound(alias, src.onTrigger, src.data);
                  }
                } catch (err) {
                  console.warn(`${alias} alias skipped:`, err);
                }
              }
              
              // Patch setLogger to suppress noisy errors
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const webaudioMod = webaudioModule as any;
              if (webaudioMod.setLogger) {
                webaudioMod.setLogger((msg: string, type?: string) => {
                  // 'duck target orbit' is benign spam — drop it entirely. Everything else
                  // (esp. 'not found' sounds and 'not a note'/parse errors) surfaces in the
                  // dev console — silent-fail song bugs are debugged there.
                  if (msg.includes('duck target orbit')) return;
                  if (type === 'warning') console.warn(msg);
                  else console.error(msg);
                });
              }

              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              if (!(Pattern.prototype as any).silence) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (Pattern.prototype as any).silence = function() {
                  return silence;
                };
              }
              
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              if (!(Pattern.prototype as any).o) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (Pattern.prototype as any).o = function(oct: number) {
                  return this.octave(oct);
                };
              }
            },
            onChange: (update: { docChanged: boolean; state: { doc: { toString: () => string } } }) => {
              if (update.docChanged && strudelRef.current) {
                strudelRef.current.code = update.state.doc.toString();
              }
            },
            onToggle: (started: boolean) => {
              if (!isCleanedUp) setPlaying(started);
            },
          });
          
          // Set light theme
          mirror.setTheme("xcodeLight");

          if (isCleanedUp) {
            mirror.stop?.();
            return;
          }

          strudelRef.current = mirror;

          // Configure editor appearance
          if (mirror.setFontFamily) mirror.setFontFamily("'IBM Plex Mono', ui-monospace, monospace");
          if (mirror.setLineNumbersDisplayed) mirror.setLineNumbersDisplayed(true);
          if (mirror.setLineWrappingEnabled) mirror.setLineWrappingEnabled(true);

          if (!isCleanedUp) setLoading(false);
          
        } catch (err) {
          console.error("failed to initialize strudel:", err);
          if (!isCleanedUp) setLoading(false);
        }
      };

      init();

      return () => {
        isCleanedUp = true;
        if (strudelRef.current) {
          strudelRef.current.stop?.();
          strudelRef.current = null;
        }
        onReadyCalledRef.current = false;
      };
    }, []);

    useEffect(() => {
      if (!loading && strudelRef.current && onReady && !onReadyCalledRef.current) {
        onReadyCalledRef.current = true;
        
        const adapter: StrudelAdapter = {
          setCode: (code: string) => {
            if (strudelRef.current) {
              strudelRef.current.setCode(code);
              strudelRef.current.code = code;
            }
          },
          run: async () => {
            if (strudelRef.current) {
              try {
                await strudelRef.current.stop();
                // scheduler.stop() cancels nothing already scheduled: superdough voices are
                // live WebAudio sources with their own end times (plus delay/reverb tails),
                // so the old song ghosts into the next one. Tearing down the orbit output
                // chain orphans them all; the next trigger rebuilds it lazily. Fade the
                // master gain out first — disconnecting live sources mid-waveform clicks.
                const ctx = audioContextGetterRef.current?.();
                const gain = outputGainNodeRef.current?.gain;
                if (ctx && gain && ctx.state === "running") {
                  gain.cancelScheduledValues(ctx.currentTime);
                  gain.setValueAtTime(gain.value, ctx.currentTime);
                  gain.linearRampToValueAtTime(0, ctx.currentTime + 0.08);
                  await new Promise(resolve => setTimeout(resolve, 100));
                }
                resetGlobalEffectsRef.current?.();
                if (ctx && gain) {
                  gain.cancelScheduledValues(ctx.currentTime);
                  gain.setValueAtTime(0, ctx.currentTime);
                  gain.linearRampToValueAtTime(1, ctx.currentTime + 0.02);
                }
                await new Promise(resolve => setTimeout(resolve, 50));
                await strudelRef.current.evaluate();
              } catch (err) {
                console.error("[strudelhost] evaluate error:", err);
                throw err;
              }
            }
          },
          stop: async () => {
            if (strudelRef.current) {
              await strudelRef.current.stop();
            }
          },
          getAudioContext: () => {
            if (audioContextGetterRef.current) {
              return audioContextGetterRef.current();
            }
            return null;
          },
          getOutputNode: () => {
            return outputGainNodeRef.current;
          },
          getCps: () => {
            const cps = strudelRef.current?.repl?.scheduler?.cps;
            return typeof cps === "number" && isFinite(cps) && cps > 0 ? cps : null;
          },
          warmup: (code: string) => {
            const sd = superdoughRef.current;
            const ctx = audioContextGetterRef.current?.();
            if (!sd || !ctx || ctx.state !== "running") return;
            if (warmedCode.has(code)) return; // already parsed + warmed this exact song
            warmedCode.add(code);
            for (const { name, bank } of extractSounds(code)) {
              const key = `${bank ?? ""}/${name}`;
              if (warmedSounds.has(key)) continue; // buffers cache globally — warm once per session
              warmedSounds.add(key);
              const [s, n] = name.split(":");
              const t = ctx.currentTime + 0.05;
              const base: Record<string, unknown> = { s, n: Number(n ?? 0), gain: 0 };
              if (bank) base.bank = bank;
              const fire = (v: Record<string, unknown>) => void sd(v, t, 0.01).catch(() => {});
              fire(base);
              if (PITCHED.has(s)) for (const note of [48, 60, 72]) fire({ ...base, note });
            }
          },
        };
        onReady(adapter);
      }
    }, [loading, onReady]);

    return (
      <div 
        ref={wrapperRef}
        className="h-full w-full min-h-0 min-w-0 relative strudel-container flex flex-col"
      >
        {loading && <EngineLoading />}

        {/* Editor container */}
        <div
          ref={containerRef}
          className="flex-1 min-h-0 min-w-0 strudel-host"
          style={{
            visibility: loading ? "hidden" : "visible",
          }}
        />
      </div>
    );
}

export default StrudelHost;
