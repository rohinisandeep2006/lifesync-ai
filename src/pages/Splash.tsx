export default function Splash() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-lifesync-navy text-white animate-fade-in">
      <div className="animate-slide-up flex flex-col items-center gap-4">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl"
          style={{ backgroundColor: 'var(--theme-primary, #2dd4bf)' }}
        >
          ♻
        </div>
        <h1 className="font-sans font-bold text-4xl tracking-tight">LifeSync AI</h1>
        <p className="text-lifesync-mint/80 text-sm font-medium">Sync your life. One day at a time.</p>
      </div>
    </div>
  )
}
