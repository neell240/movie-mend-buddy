import booviRamNavami from "@/assets/boovi-ramnavami.png";

export const RamNavamiHeroBanner = () => {
  return (
    <section
      className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
      style={{
        background: "linear-gradient(135deg, #FFF8EE 0%, #F4C27A 100%)",
        boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
      }}
    >
      <div className="flex items-center gap-6">
        {/* Boovi — LEFT, bigger */}
        <div className="relative flex-shrink-0">
          <div
            className="absolute inset-0 -m-6 rounded-full"
            style={{
              background:
                "radial-gradient(circle, hsl(42 80% 65% / 0.35) 0%, transparent 70%)",
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
