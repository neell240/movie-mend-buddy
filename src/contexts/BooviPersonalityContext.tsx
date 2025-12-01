import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

export type BooviAnimation = 
  | "idle" | "wave" | "jump" | "think" | "loading" | "point" | "celebrate"
  | "eat" | "shocked" | "sad" | "angry" | "laugh" | "shh" | "sleep"
  | "confused" | "excited" | "hug" | "typing" | "fly";

export type BooviMood = 
  | "happy" | "excited" | "focused" | "sad" | "angry" | "confused" 
  | "proud" | "tired" | "neutral" | "celebrating";

export type BooviTrigger = 
  | "app_open" | "scroll_down" | "scroll_up" | "page_bottom" | "page_top"
  | "watchlist_add" | "watchlist_remove" | "search_start" | "search_empty"
  | "search_success" | "trailer_click" | "rating_high" | "rating_low"
  | "inactivity" | "network_offline" | "network_online" | "error"
  | "login" | "logout" | "achievement";

interface BooviState {
  animation: BooviAnimation;
  mood: BooviMood;
  message?: string;
  timestamp: number;
}

interface BooviPersonalityContextType {
  currentState: BooviState;
  trigger: (event: BooviTrigger, metadata?: any) => void;
  setAnimation: (animation: BooviAnimation) => void;
  setMood: (mood: BooviMood) => void;
  showMessage: (message: string, duration?: number) => void;
  isActive: boolean;
  toggleActive: () => void;
}

const BooviPersonalityContext = createContext<BooviPersonalityContextType | undefined>(undefined);

const COOLDOWN_MS = 3000; // Prevent animation spam
const INACTIVITY_TIMEOUT = 10000; // 10 seconds

export const BooviPersonalityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentState, setCurrentState] = useState<BooviState>({
    animation: "idle",
    mood: "neutral",
    timestamp: Date.now(),
  });
  
  const [isActive, setIsActive] = useState(true);
  const lastTriggerRef = useRef<{ [key: string]: number }>({});
  const inactivityTimerRef = useRef<NodeJS.Timeout>();
  const messageTimerRef = useRef<NodeJS.Timeout>();

  // Reset inactivity timer
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    
    if (currentState.animation === "sleep") {
      setCurrentState(prev => ({
        ...prev,
        animation: "wave",
        mood: "happy",
        timestamp: Date.now(),
      }));
      
      setTimeout(() => {
        setCurrentState(prev => ({
          ...prev,
          animation: "idle",
          mood: "neutral",
          timestamp: Date.now(),
        }));
      }, 2000);
    }
    
    inactivityTimerRef.current = setTimeout(() => {
      setCurrentState({
        animation: "sleep",
        mood: "tired",
        message: "Zzz... Wake me when there's movies to watch!",
        timestamp: Date.now(),
      });
    }, INACTIVITY_TIMEOUT);
  }, [currentState.animation]);

  // Check cooldown
  const canTrigger = useCallback((event: BooviTrigger): boolean => {
    const now = Date.now();
    const lastTrigger = lastTriggerRef.current[event] || 0;
    return now - lastTrigger > COOLDOWN_MS;
  }, []);

  const trigger = useCallback((event: BooviTrigger, metadata?: any) => {
    if (!isActive || !canTrigger(event)) return;

    lastTriggerRef.current[event] = Date.now();
    resetInactivityTimer();

    let newState: Partial<BooviState> = { timestamp: Date.now() };

    switch (event) {
      case "app_open":
        newState = { animation: "wave", mood: "happy", message: "Hey! Ready for some movie magic? 🎬" };
        break;
      case "watchlist_add":
        newState = { animation: "hug", mood: "excited", message: "Added to your watchlist! 🍿" };
        break;
      case "watchlist_remove":
        newState = { animation: "sad", mood: "sad", message: "Aww, removing it? Okay..." };
        break;
      case "search_start":
        newState = { animation: "think", mood: "focused", message: "Let me find something great..." };
        break;
      case "search_empty":
        newState = { animation: "confused", mood: "confused", message: "Hmm, no movies found. Try something else?" };
        break;
      case "search_success":
        newState = { animation: "celebrate", mood: "celebrating", message: "Found some awesome picks! 🎉" };
        break;
      case "trailer_click":
        newState = { animation: "excited", mood: "excited", message: "Showtime! 🎥" };
        break;
      case "rating_high":
        newState = { animation: "celebrate", mood: "proud", message: "Great choice! 5 stars! ⭐" };
        break;
      case "rating_low":
        newState = { animation: "sad", mood: "sad", message: "Not a fan? Let's find something better!" };
        break;
      case "network_offline":
        newState = { animation: "sad", mood: "sad", message: "Oh no! We're offline 📡" };
        break;
      case "network_online":
        newState = { animation: "celebrate", mood: "happy", message: "Back online! Let's go! 🚀" };
        break;
      case "error":
        newState = { animation: "shocked", mood: "confused", message: "Oops! Something went wrong!" };
        break;
      case "inactivity":
        newState = { animation: "sleep", mood: "tired", message: "Zzz..." };
        break;
      case "page_bottom":
        newState = { animation: "sleep", mood: "tired", message: "You've scrolled to the end! 😴" };
        break;
      case "login":
        newState = { animation: "celebrate", mood: "celebrating", message: "Welcome back! 🎉" };
        break;
      case "achievement":
        newState = { animation: "celebrate", mood: "proud", message: metadata?.message || "Achievement unlocked! 🏆" };
        break;
      default:
        return;
    }

    setCurrentState(prev => ({ ...prev, ...newState }));

    // Return to idle after animation
    setTimeout(() => {
      if (newState.animation !== "sleep") {
        setCurrentState(prev => ({
          ...prev,
          animation: "idle",
          mood: "neutral",
          message: undefined,
          timestamp: Date.now(),
        }));
      }
    }, 3000);
  }, [isActive, canTrigger, resetInactivityTimer]);

  const setAnimation = useCallback((animation: BooviAnimation) => {
    setCurrentState(prev => ({
      ...prev,
      animation,
      timestamp: Date.now(),
    }));
    resetInactivityTimer();
  }, [resetInactivityTimer]);

  const setMood = useCallback((mood: BooviMood) => {
    setCurrentState(prev => ({
      ...prev,
      mood,
      timestamp: Date.now(),
    }));
  }, []);

  const showMessage = useCallback((message: string, duration: number = 3000) => {
    if (messageTimerRef.current) {
      clearTimeout(messageTimerRef.current);
    }
    
    setCurrentState(prev => ({
      ...prev,
      message,
      timestamp: Date.now(),
    }));

    messageTimerRef.current = setTimeout(() => {
      setCurrentState(prev => ({
        ...prev,
        message: undefined,
        timestamp: Date.now(),
      }));
    }, duration);
  }, []);

  const toggleActive = useCallback(() => {
    setIsActive(prev => !prev);
  }, []);

  // Initialize inactivity timer
  useEffect(() => {
    resetInactivityTimer();
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (messageTimerRef.current) {
        clearTimeout(messageTimerRef.current);
      }
    };
  }, [resetInactivityTimer]);

  return (
    <BooviPersonalityContext.Provider
      value={{
        currentState,
        trigger,
        setAnimation,
        setMood,
        showMessage,
        isActive,
        toggleActive,
      }}
    >
      {children}
    </BooviPersonalityContext.Provider>
  );
};

export const useBooviPersonality = () => {
  const context = useContext(BooviPersonalityContext);
  if (!context) {
    throw new Error('useBooviPersonality must be used within BooviPersonalityProvider');
  }
  return context;
};
