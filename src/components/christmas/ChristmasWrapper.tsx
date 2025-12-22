import { useSeasonal } from "@/hooks/useChristmasMode";
import { Snowfall } from "./Snowfall";
import { useEffect } from "react";

export const ChristmasWrapper = () => {
  const { isChristmas, isNewYear, showSnowfall } = useSeasonal();

  // Apply theme class to body
  useEffect(() => {
    const body = document.body;
    
    // Remove all theme classes first
    body.classList.remove('theme-christmas', 'theme-newyear');
    
    // Apply appropriate theme
    if (isChristmas) {
      body.classList.add('theme-christmas');
    } else if (isNewYear) {
      body.classList.add('theme-newyear');
    }

    return () => {
      body.classList.remove('theme-christmas', 'theme-newyear');
    };
  }, [isChristmas, isNewYear]);

  return (
    <>
      <Snowfall enabled={showSnowfall} intensity="light" />
    </>
  );
};
