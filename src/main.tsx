import { createRoot } from "react-dom/client";
import { BooviPersonalityProvider } from "@/contexts/BooviPersonalityContext";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BooviPersonalityProvider>
    <App />
  </BooviPersonalityProvider>
);
