import { motion } from 'framer-motion';
import { useSeasonal } from '@/hooks/useChristmasMode';
import { ChristmasBoovi } from '@/components/christmas/ChristmasBoovi';
import { BooviAnimated } from '@/components/BooviAnimated';

interface PartyLoadingProps {
  message?: string;
}

const PartyLoading = ({ message = "Loading party..." }: PartyLoadingProps) => {
  const { isChristmas } = useSeasonal();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <motion.div
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2,
          ease: "easeInOut"
        }}
      >
        {isChristmas ? (
          <ChristmasBoovi size="lg" variant="excited" />
        ) : (
          <BooviAnimated animation="loading" size="xl" />
        )}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-center"
      >
        <p className="text-lg text-muted-foreground">{message}</p>
        
        <motion.div 
          className="flex justify-center gap-1 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1,
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PartyLoading;
