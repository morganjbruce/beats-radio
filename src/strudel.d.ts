// Type declarations for Strudel packages
declare module '@strudel/codemirror' {
  export class StrudelMirror {
    constructor(options: unknown);
    code: string;
    editor: unknown;
    setCode(code: string): void;
    stop(): Promise<void>;
    evaluate(): Promise<void>;
    setFontFamily?(font: string): void;
    setLineNumbersDisplayed?(show: boolean): void;
    setLineWrappingEnabled?(enabled: boolean): void;
    reconfigureExtension?(name: string, value: unknown): void;
  }
  
  interface Setting<T> {
    get(): T;
    set(value: T): void;
  }
  
  export const codemirrorSettings: {
    isPatternHighlightingEnabled: Setting<boolean>;
    isFlashEnabled: Setting<boolean>;
    isLineNumbersDisplayed: Setting<boolean>;
    isLineWrappingEnabled: Setting<boolean>;
    fontFamily: Setting<string>;
    fontSize: Setting<number>;
  };
}

declare module '@strudel/transpiler' {
  export const transpiler: unknown;
}

declare module '@strudel/webaudio' {
  export function getAudioContext(): AudioContext;
  export const webaudioOutput: unknown;
  export function initAudioOnFirstClick(): void;
  export function registerSynthSounds(): Promise<void>;
  export function samples(url: string): Promise<void>;
  export function setLogger(handler: (msg: string) => void): void;
  export function registerSound(name: string, onTrigger: unknown, data?: unknown): void;
  export const soundMap: {
    get(): Record<string, { onTrigger?: unknown; data?: unknown } | undefined>;
  };
  // re-exported from superdough: schedules one voice; used for zero-gain sample warm-up
  export function superdough(value: Record<string, unknown>, t: number, dur: number): Promise<unknown>;
}

declare module '@strudel/core' {
  export function evalScope(...imports: Promise<unknown>[]): Promise<void>;
  export const silence: unknown;
  export class Pattern {
    static prototype: {
      silence?: () => unknown;
      o?: (oct: number) => unknown;
      octave(oct: number): unknown;
    };
  }
}

declare module '@strudel/soundfonts' {
  // v1.2.6 registers synchronously and returns void; typed loosely for safety.
  export function registerSoundfonts(): void | Promise<void>;
}

declare module '@strudel/draw' {
  export function setTheme(theme: {
    background?: string;
    foreground?: string;
    caret?: string;
    selection?: string;
    selectionMatch?: string;
    lineHighlight?: string;
    gutterBackground?: string;
    gutterForeground?: string;
  }): void;
}

declare module '@strudel/mini' {
  // Mini-notation module
}

declare module '@strudel/tonal' {
  // Tonal/music theory module
}
