// Shown both as the lazy-chunk Suspense fallback and StrudelHost's init overlay, so the
// two back-to-back loading phases render identically.
export function EngineLoading() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
      <div className="text-faint text-sm flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
        loading strudel...
      </div>
    </div>
  )
}
