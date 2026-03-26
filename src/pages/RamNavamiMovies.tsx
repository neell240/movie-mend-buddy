import { useNavigate } from "react-router-dom";
import { Star, Sparkles, MessageCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import booviRamNavami from "@/assets/boovi-ramnavami.png";

interface RamayanaMovie {
  title: string;
  year: number;
  rating: number;
  description: string;
  tmdbId?: number;
  poster: string;
}

const RAMAYANA_MOVIES: RamayanaMovie[] = [
  {
    title: "Ramayana: The Legend of Prince Rama",
    year: 1993,
    rating: 8.1,
    description: "Animated epic of Lord Rama's journey, a beloved Indo-Japanese collaboration.",
    tmdbId: 132633,
    poster: "https://image.tmdb.org/t/p/w500/pFBHiDNcdS3NhPnFdOQKf4VGnBi.jpg",
  },
  {
    title: "Ramayan (Ramanand Sagar)",
    year: 1987,
    rating: 9.1,
    description: "The iconic television retelling that united an entire nation.",
    poster: "https://image.tmdb.org/t/p/w500/5Gk2bOjaxjPLRyGRAPMPbhUmfUn.jpg",
  },
  {
    title: "Siya Ke Ram",
    year: 2015,
    rating: 8.4,
    description: "A modern retelling from Sita's perspective, beautifully crafted.",
    poster: "https://image.tmdb.org/t/p/w500/uWeEiB9wOCfnooMQz7Iz2MXBHUV.jpg",
  },
];

const RamNavamiMoviesPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen pb-24"
      style={{
        background: "linear-gradient(180deg, hsl(40 65% 88%) 0%, hsl(38 60% 94%) 100%)",
      }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-40 backdrop-blur-md border-b"
        style={{
          background: "hsl(40 60% 92% / 0.95)",
          borderColor: "hsl(40 45% 80%)",
        }}
      >
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl transition-colors"
            style={{ color: "hsl(25 40% 25%)" }}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1
            className="text-lg font-bold"
            style={{ color: "hsl(25 40% 18%)" }}
          >
            🪔 Ram Navami
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-8">
        {/* Hero cover */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl p-6"
          style={{
            background: "linear-gradient(135deg, hsl(40 70% 94%) 0%, hsl(38 80% 78%) 100%)",
            boxShadow: "0 12px 30px hsl(35 40% 50% / 0.15)",
          }}
        >
          <div className="relative z-10 flex items-center gap-5">
            <div className="relative flex-shrink-0">
              <div
                className="absolute inset-0 -m-6 rounded-full"
                style={{
                  background: "radial-gradient(circle, hsl(42 80% 65% / 0.35) 0%, transparent 70%)",
                  filter: "blur(6px)",
                }}
              />
              <img
                src={booviRamNavami}
                alt="Boovi in kurta"
                className="w-24 h-24 sm:w-28 sm:h-28 object-contain relative z-10"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2
                className="text-xl sm:text-2xl font-bold leading-tight"
                style={{ color: "hsl(25 40% 18%)" }}
              >
                Stories of Ramayana
              </h2>
              <p
                className="text-sm mt-2 leading-relaxed"
                style={{ color: "hsl(25 30% 35%)" }}
              >
                Celebrate the spirit of Ram Navami with these timeless stories of dharma, courage, and devotion.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Movie cards — large poster covers */}
        <section className="space-y-5">
          {RAMAYANA_MOVIES.map((movie, i) => (
            <motion.button
              key={movie.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 * i, ease: "easeOut" }}
              onClick={() => movie.tmdbId && navigate(`/movie/${movie.tmdbId}`)}
              className="relative w-full text-left rounded-[20px] overflow-hidden transition-all hover:shadow-xl active:scale-[0.99]"
              style={{
                background: "hsl(40 50% 98%)",
                boxShadow: "0 6px 18px hsl(35 40% 50% / 0.1)",
                border: "1px solid hsl(40 45% 90%)",
                cursor: movie.tmdbId ? "pointer" : "default",
              }}
            >
              {/* Large poster cover */}
              <div className="relative w-full aspect-[16/9] overflow-hidden">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(180deg, transparent 40%, hsl(25 30% 12% / 0.7) 100%)",
                  }}
                />
                {/* Rating badge overlay */}
                <div
                  className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{
                    background: "hsl(42 80% 55% / 0.9)",
                    color: "hsl(25 40% 15%)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <Star className="w-3 h-3 fill-current" />
                  {movie.rating}
                </div>
                {/* Title on cover */}
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-white font-bold text-lg leading-snug drop-shadow-lg">
                    {movie.title}
                  </h3>
                  <p className="text-white/70 text-xs mt-0.5">{movie.year}</p>
                </div>
              </div>

              {/* Description bar */}
              <div className="px-4 py-3">
                <p
                  className="text-sm line-clamp-2"
                  style={{ color: "hsl(25 30% 35%)" }}
                >
                  {movie.description}
                </p>
              </div>
            </motion.button>
          ))}
        </section>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <Button
            onClick={() => navigate("/ai-chat")}
            className="w-full rounded-2xl h-12 text-base font-bold shadow-lg"
            style={{
              background: "linear-gradient(135deg, hsl(42 85% 55%) 0%, hsl(35 80% 48%) 100%)",
              color: "hsl(25 40% 15%)",
              border: "none",
            }}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Get a Recommendation
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/ai-chat")}
            className="w-full rounded-2xl h-11 text-sm font-semibold"
            style={{
              borderColor: "hsl(35 40% 78%)",
              color: "hsl(25 35% 30%)",
              background: "transparent",
            }}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Ask Boovi
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default RamNavamiMoviesPage;
