import { useChristmas } from "@/hooks/useChristmasMode";
import { Snowfall } from "./Snowfall";

export const ChristmasWrapper = () => {
  const { showSnowfall } = useChristmas();

  return (
    <>
      <Snowfall enabled={showSnowfall} intensity="light" />
    </>
  );
};
