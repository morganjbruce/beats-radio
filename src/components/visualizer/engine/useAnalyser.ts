import { useEffect, useRef } from 'react'

export const useAnalyser = (audioContext: AudioContext | null, sourceNode: AudioNode | null) => {
  const analyserRef = useRef<AnalyserNode | null>(null)
  const frequencyRef = useRef<Uint8Array<ArrayBuffer>>(new Uint8Array(0))
  const waveformRef = useRef<Uint8Array<ArrayBuffer>>(new Uint8Array(0))

  useEffect(() => {
    if (!audioContext || !sourceNode) return

    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 4096
    analyser.smoothingTimeConstant = 0.8
    sourceNode.connect(analyser)
    analyserRef.current = analyser
    frequencyRef.current = new Uint8Array(analyser.frequencyBinCount)
    waveformRef.current = new Uint8Array(analyser.fftSize)

    return () => {
      try {
        sourceNode.disconnect(analyser)
      } catch {
        // The source may already have been torn down.
      }
      analyserRef.current = null
    }
  }, [audioContext, sourceNode])

  return { analyserRef, frequencyRef, waveformRef }
}
