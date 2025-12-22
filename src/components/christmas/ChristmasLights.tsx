import { cn } from '@/lib/utils';

interface ChristmasLightsProps {
  className?: string;
}

const lightColors = [
  'bg-red-500',
  'bg-green-500', 
  'bg-yellow-400',
  'bg-blue-400',
  'bg-pink-400',
  'bg-orange-400',
];

export const ChristmasLights = ({ className }: ChristmasLightsProps) => {
  const lights = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    color: lightColors[i % lightColors.length],
    delay: i * 0.2,
  }));

  return (
    <div className={cn("relative w-full h-8 overflow-hidden", className)}>
      {/* Wire */}
      <div className="absolute top-3 left-0 right-0 h-0.5 bg-green-900" />
      
      {/* Lights */}
      <div className="flex justify-around items-start">
        {lights.map((light) => (
          <div
            key={light.id}
            className="flex flex-col items-center"
          >
            <div className="w-0.5 h-2 bg-green-900" />
            <div
              className={cn(
                "w-3 h-4 rounded-b-full animate-christmas-lights",
                light.color
              )}
              style={{
                animationDelay: `${light.delay}s`,
                boxShadow: `0 0 8px 2px currentColor`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
