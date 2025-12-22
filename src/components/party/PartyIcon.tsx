import { Popcorn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useSeasonal } from '@/hooks/useChristmasMode';

interface PartyIconProps {
  className?: string;
}

export const PartyIcon = ({ className }: PartyIconProps) => {
  const { isChristmas } = useSeasonal();

  return (
    <Button
      size="icon"
      variant="ghost"
      asChild
      className={cn(
        isChristmas
          ? "text-[hsl(45,60%,92%)] hover:text-[hsl(42,85%,70%)] hover:bg-[hsl(355,45%,25%)]"
          : "",
        className
      )}
    >
      <Link to="/party">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <Popcorn className="w-5 h-5" />
        </motion.div>
      </Link>
    </Button>
  );
};
