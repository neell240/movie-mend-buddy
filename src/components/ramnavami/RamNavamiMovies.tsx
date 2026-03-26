import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

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
    description: "Animated epic of Lord Rama's journey",
    tmdbId: 132633,
    poster: "https://image.tmdb.org/t/p/w300/pFBHiDNcdS3NhPnFdOQKf4VGnBi.jpg",
  },
  {
    title: "Ramayan (Ramanand Sagar)",
    year: 1987,
    rating: 9.1,
    description: "The iconic television retelling",
    poster: "https://image.tmdb.org/t/p/w300/5Gk2bOjaxjPLRyGRAPMPbhUmfUn.jpg",
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

      <div className="flex flex-col gap-4">
        {RAMAYANA_MOVIES.map((movie) => (
          <button
            key={movie.title}
            onClick={() => movie.tmdbId && navigate(`/movie/${movie.tmdbId}`)}
            className="flex items-start gap-4 text-left rounded-2xl p-4 transition-all hover:shadow-xl active:scale-[0.99]"
            style={{
              background: "linear-gradient(135deg, #FFFAF2 0%, #FFF2DB 100%)",
              boxShadow: "0 4px 20px hsl(35 40% 50% / 0.12)",
              border: "1px solid hsl(40 45% 88%)",
              cursor: movie.tmdbId ? "pointer" : "default",
            }}
          >
            {/* Poster */}
            <div className="flex-shrink-0 w-[72px] h-[108px] rounded-xl overflow-hidden shadow-md">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 pt-1">
              <h4
                className="font-bold text-base leading-snug line-clamp-2"
                style={{ color: "hsl(25 40% 18%)" }}
              >
                {movie.title}
              </h4>
              <p
                className="text-xs mt-1"
                style={{ color: "hsl(25 25% 50%)" }}
              >
                {movie.year}
              </p>
              <p
                className="text-sm mt-1.5 line-clamp-1"
                style={{ color: "hsl(25 30% 35%)" }}
              >
                {movie.description}
              </p>

              {/* Rating badge */}
              <div
                className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-bold"
                style={{
                  background: "hsl(42 80% 55% / 0.18)",
                  color: "hsl(42 75% 38%)",
                }}
              >
                <Star className="w-3 h-3 fill-current" />
                {movie.rating}
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
