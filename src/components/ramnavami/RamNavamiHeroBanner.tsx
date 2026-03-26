import booviRamNavami from "@/assets/boovi-ramnavami.png";

export const RamNavamiHeroBanner = () => {
  return (
    <section
      className="relative overflow-hidden rounded-3xl p-6 sm:p-8"
      style={{
        background: "linear-gradient(135deg, #FFF8EE 0%, #F4C27A 100%)",
        boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
      }}
    >
      {/* Subtle glass overlay */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, hsl(42 80% 95% / 0.6) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 flex items-center gap-6">
        {/* Boovi — LEFT */}
        <div className="relative flex-shrink-0">
          <div
            className="absolute inset-0 -m-8 rounded-full"
            style={{
              background:
                "radial-gradient(circle, hsl(42 80% 65% / 0.4) 0%, transparent 70%)",
              filter: "blur(8px)",
            }}
          />
          <img
            src={booviRamNavami}
            alt="Boovi in kurta"
            className="w-28 h-28 sm:w-36 sm:h-36 object-contain relative z-10"
          />
        </div>

        {/* Text — RIGHT */}
        <div className="flex-1 min-w-0">
          <span
            className="inline-block text-[10px] font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-2"
            style={{
              background: "hsl(42 75% 55% / 0.18)",
              color: "hsl(42 70% 38%)",
            }}
          >
            Curated for today
          </span>
          <h2
            className="text-xl sm:text-2xl font-bold leading-tight"
            style={{ color: "hsl(25 40% 18%)" }}
          >
            Ram Navami 🪔
          </h2>
          <p
            className="text-sm sm:text-base mt-2 leading-relaxed"
            style={{ color: "hsl(25 30% 30%)" }}
          >
            Wishing you peace, joy, and meaningful moments.
          </p>
        </div>
      </div>
    </section>
  );
};
