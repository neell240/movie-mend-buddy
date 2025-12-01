import { useState, useCallback } from 'react';

type BooviAnimation = 
  | "wave" 
  | "idle" 
  | "jump" 
  | "think" 
  | "loading" 
  | "point"
  | "celebrate"
  | "none";

export const useBooviAnimation = (defaultAnimation: BooviAnimation = "idle") => {
  const [animation, setAnimation] = useState<BooviAnimation>(defaultAnimation);

  const celebrate = useCallback(() => {
    setAnimation("celebrate");
    setTimeout(() => setAnimation("idle"), 2000);
  }, []);

  const jump = useCallback(() => {
    setAnimation("jump");
    setTimeout(() => setAnimation("idle"), 1000);
  }, []);

  const wave = useCallback(() => {
    setAnimation("wave");
    setTimeout(() => setAnimation("idle"), 2000);
  }, []);

  const think = useCallback(() => {
    setAnimation("think");
  }, []);

  const stopThinking = useCallback(() => {
    setAnimation("idle");
  }, []);

  return {
    animation,
    setAnimation,
    celebrate,
    jump,
    wave,
    think,
    stopThinking,
  };
};
