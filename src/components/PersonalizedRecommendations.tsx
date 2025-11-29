import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TMDBMovie } from "@/types/tmdb";
import { MovieCard } from "./MovieCard";
import { Card } from "./ui/card";
import { Sparkles, TrendingUp, Film } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface RecommendationResponse {
  recommendations: TMDBMovie[];
  userProfile: {
    watchedCount: number;
    topRatedCount: number;
    favoriteGenres: string[];
  };
}

export const PersonalizedRecommendations = () => {
  const [recommendations, setRecommendations] = useState<TMDBMovie[]>([]);
  const [userProfile, setUserProfile] = useState<RecommendationResponse['userProfile'] | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('recommendations');

      if (error) {
        console.error('Error fetching recommendations:', error);
        if (error.message?.includes('Rate limit')) {
          toast.error('Too many requests. Please wait a moment and try again.');
        } else if (error.message?.includes('Payment required')) {
          toast.error('AI service unavailable. Please contact support.');
        } else {
          toast.error('Failed to load personalized recommendations');
        }
        return;
      }

      if (data?.recommendations) {
        setRecommendations(data.recommendations);
        setUserProfile(data.userProfile);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong loading recommendations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          <h2 className="text-xl font-bold">Analyzing your taste...</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!recommendations.length) {
    return (
      <Card className="p-8 text-center space-y-4">
        <Film className="w-12 h-12 mx-auto text-muted-foreground" />
        <div>
          <h3 className="text-lg font-semibold mb-2">Start Building Your Profile!</h3>
          <p className="text-muted-foreground">
            Rate some movies in your watchlist to get personalized recommendations
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold">Picked Just For You</h2>
        </div>
        {userProfile && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>{userProfile.watchedCount} watched</span>
            </div>
            <span>•</span>
            <span>{userProfile.topRatedCount} highly rated</span>
            {userProfile.favoriteGenres.length > 0 && (
              <>
                <span>•</span>
                <span>Loves: {userProfile.favoriteGenres.join(', ')}</span>
              </>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {recommendations.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={() => navigate(`/movie/${movie.id}`)}
          />
        ))}
      </div>
    </div>
  );
};