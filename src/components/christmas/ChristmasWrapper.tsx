import { useSeasonal } from "@/hooks/useChristmasMode";
import { useEffect } from "react";
import { Fireworks } from "./Fireworks";
import { FallingHearts } from "../valentine/FallingHearts";

export const ChristmasWrapper = () => {
  const { isChristmas, isNewYear, isValentine, isRamNavami, showHearts } = useSeasonal();

  // Apply theme class to body
  useEffect(() => {
    const body = document.body;

    // Remove all theme classes first
    body.classList.remove('theme-christmas', 'theme-newyear', 'theme-valentine', 'theme-ramnavami');

    // Apply appropriate theme
    if (isRamNavami) {
      body.classList.add('theme-ramnavami');
    } else if (isValentine) {
      body.classList.add('theme-valentine');
    } else if (isChristmas) {
      body.classList.add('theme-christmas');
    } else if (isNewYear) {
      body.classList.add('theme-newyear');
    }

    return () => {
      body.classList.remove('theme-christmas', 'theme-newyear', 'theme-valentine', 'theme-ramnavami');
    };
  }, [isChristmas, isNewYear, isValentine, isRamNavami]);

  // Show fireworks during New Year
  if (isNewYear) {
    return <Fireworks />;
  }

  // Show falling hearts during Valentine's
  if (isValentine && showHearts) {
    return <FallingHearts enabled={showHearts} />;
  }

  return null;
};
