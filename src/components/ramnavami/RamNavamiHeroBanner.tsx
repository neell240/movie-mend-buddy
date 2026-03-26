import booviRamNavami from "@/assets/boovi-ramnavami.png";

export const RamNavamiHeroBanner = () => {
  return (
    <section
      className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
      style={{
        background: "linear-gradient(135deg, #FFF6E8 0%, #F4C27A 100%)",
        boxShadow: "0 12px 40px -10px hsl(35 50% 40% / 0.2)",
      }}
    >
      <div className="flex items-center gap-5">
        {/* Boovi with glow */}
        <div className="relative flex-shrink-0">
          <div
            className="absolute inset-0 -m-4 rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(42 80% 65% / 0.35) 0%, transparent 70%)",
            }}
          />
          <img
            src={booviRamNavami}
            alt="Boovi in kurta"
            className="w-24 h-24 sm:w-28 sm:h-28 object-contain relative z-10"
          />
        </div>

        {/* Text */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold" style={{ color: "hsl(25 40% 18%)" }}>
            Ram Navami 🪔
          </h2>
          <p className="text-sm sm:text-base mt-1" style={{ color: "hsl(25 30% 32%)" }}>
            Wishing you peace and happiness
          </p>
        </div>
      </div>
    </section>
  );
};
