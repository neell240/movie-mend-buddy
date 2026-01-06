import { useSeasonal } from "@/hooks/useChristmasMode";
import { useEffect } from "react";
import { Fireworks } from "./Fireworks";

export const ChristmasWrapper = () => {
  const { isChristmas, isNewYear } = useSeasonal();

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

  // Show fireworks during New Year
  if (isNewYear) {
    return <Fireworks />;
  }

  return null;
};
