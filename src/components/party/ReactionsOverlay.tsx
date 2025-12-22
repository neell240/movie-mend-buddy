import { motion, AnimatePresence } from 'framer-motion';

interface ReactionsOverlayProps {
  reactions: { id: string; emoji: string }[];
}

const ReactionsOverlay = ({ reactions }: ReactionsOverlayProps) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {reactions.map((reaction) => (
          <motion.div
            key={reaction.id}
            initial={{ 
              opacity: 1, 
              scale: 0.5,
              x: Math.random() * window.innerWidth * 0.6 + window.innerWidth * 0.2,
              y: window.innerHeight - 100
            }}
            animate={{ 
              opacity: [1, 1, 0],
              scale: [0.5, 1.5, 1],
              y: window.innerHeight * 0.3,
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 2,
              ease: "easeOut"
            }}
            className="absolute text-5xl"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
          >
            {reaction.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ReactionsOverlay;
