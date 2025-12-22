import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, Ghost } from 'lucide-react';
import { useSeasonal } from '@/hooks/useChristmasMode';
import { ChristmasBoovi } from '@/components/christmas/ChristmasBoovi';
import { BooviAnimated } from '@/components/BooviAnimated';

interface PartyNotFoundProps {
  onGoBack: () => void;
  code?: string;
}

const PartyNotFound = ({ onGoBack, code }: PartyNotFoundProps) => {
  const { isChristmas } = useSeasonal();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={{ 
            y: [0, -5, 0],
            rotate: [-5, 5, -5]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3,
            ease: "easeInOut"
          }}
        >
          {isChristmas ? (
            <ChristmasBoovi size="lg" variant="cozy" />
          ) : (
            <BooviAnimated animation="think" size="xl" />
          )}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 text-center max-w-sm"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Ghost className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-2xl font-bold">Party Not Found</h2>
        </div>
        
        {code && (
          <div className="bg-muted rounded-lg px-4 py-2 mb-4 inline-block">
            <span className="font-mono text-lg tracking-widest">{code}</span>
          </div>
        )}
        
        <p className="text-muted-foreground mb-6">
          This party doesn't exist or has ended. Check the code and try again, or create a new party!
        </p>

        <div className="flex flex-col gap-3">
          <Button onClick={onGoBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          
          <Button onClick={onGoBack} variant="outline" className="gap-2">
            <Search className="w-4 h-4" />
            Try Another Code
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default PartyNotFound;
