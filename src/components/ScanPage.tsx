export default function ScanPage() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#0a5b13]">

      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-[2px] w-[2px] rounded-full bg-green-300 opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* World Map */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src="/world-map.png"
          alt=""
          className="w-[110%] opacity-20 animate-map"
        />
      </div>

      {/* Radar */}
      <div className="absolute inset-0 flex items-center justify-center">

        {/* Infinite Ripples */}
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="absolute radar-ripple"
            style={{
              animationDelay: `${i * 1}s`,
            }}
          />
        ))}

        {/* Radar Sweep */}
        <div className="radar-sweep" />

        {/* Center Glow */}
        <div className="absolute h-5 w-5 rounded-full bg-green-400 shadow-[0_0_40px_#22c55e]" />

      </div>

      {/* Logo */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">

        <img
          src="/scan-logo.png"
          alt=""
          className="w-80 max-w-[90vw] animate-logo drop-shadow-[0_0_30px_rgba(255,255,0,.4)]"
        />

        <h1 className="mt-4 text-5xl font-black italic tracking-tight text-white shimmer">
          IN ACTION
        </h1>

      </div>

    </main>
  );
}
