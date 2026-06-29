export default function ScanPage() {
  return (
    <main className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#0d5f16]">

      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Floating Particles */}
      <div className="particles absolute inset-0" />

      {/* World Map */}
      <div className="absolute opacity-20">
        <img
          src="/world-map.png"
          alt=""
          className="w-[900px] max-w-none"
        />
      </div>

      {/* Radar */}
      <div className="absolute flex items-center justify-center">

        {/* Rings */}
        <div className="radar-ring w-[500px] h-[500px]" />
        <div className="radar-ring delay-200 w-[380px] h-[380px]" />
        <div className="radar-ring delay-500 w-[260px] h-[260px]" />
        <div className="radar-ring delay-700 w-[140px] h-[140px]" />

        {/* Rotating Sweep */}
        <div className="radar-sweep" />

        {/* Center Dot */}
        <div className="absolute h-5 w-5 rounded-full bg-green-400 shadow-[0_0_30px_#22c55e]" />
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center">

        {/* Logo */}
        <img
          src="/scan-logo.png"
          className="w-72 md:w-96 drop-shadow-2xl"
        />

        <h1 className="mt-3 text-6xl font-black italic text-white tracking-tight">
          IN ACTION
        </h1>

        <div className="mt-2 h-1 w-72 rounded-full bg-green-400 animate-pulse" />

      </div>
    </main>
  );
}
