import { useNavigate } from "react-router-dom";

interface RamayanaMovie {
  title: string;
  year: number;
  rating: number;
  description: string;
  tmdbId?: number;
}

const RAMAYANA_MOVIES: RamayanaMovie[] = [
  {
    title: "Ramayana: The Legend of Prince Rama",
    year: 1993,
    rating: 8.1,
    description: "Animated epic of Lord Rama's journey",
    tmdbId: 132633,
  },
  {
    title: "Ramayan (Ramanand Sagar)",
    year: 1987,
    rating: 9.1,
    description: "The iconic television retelling",
  },
];

export const RamNavamiMovies = () => {
  const navigate = useNavigate();

  return (
    <section>
      <h3
        className="text-lg font-bold mb-4 flex items-center gap-2"
        style={{ color: "hsl(25 40% 20%)" }}
      >
        🪔 Stories of Ramayana
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {RAMAYANA_MOVIES.map((movie) => (
          <button
            key={movie.title}
            onClick={() => movie.tmdbId && navigate(`/movie/${movie.tmdbId}`)}
            className="text-left rounded-2xl p-5 transition-shadow hover:shadow-lg"
            style={{
              background: "#FFF6E8",
              boxShadow: "0 4px 16px hsl(35 40% 50% / 0.12)",
              border: "1px solid hsl(40 50% 88%)",
              cursor: movie.tmdbId ? "pointer" : "default",
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-base" style={{ color: "hsl(25 40% 18%)" }}>
                  {movie.title}
                </h4>
                <p className="text-xs mt-1" style={{ color: "hsl(25 25% 45%)" }}>
                  {movie.year}
                </p>
              </div>
              <span
                className="text-sm font-bold flex items-center gap-1 flex-shrink-0"
                style={{ color: "hsl(42 80% 42%)" }}
              >
                ⭐ {movie.rating}
              </span>
            </div>
            <p className="text-sm mt-2" style={{ color: "hsl(25 30% 35%)" }}>
              {movie.description}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
};
