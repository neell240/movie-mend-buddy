import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

// Used for deterministic Hindi/Bollywood recommendations (so we don't rely on the model guessing IDs)
const TMDB_API_KEY = Deno.env.get("TMDB_API_KEY");
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function isHindiIntent(userText: string, userPreferences?: any) {
  const t = (userText || "").toLowerCase();
  const prefRegion = (userPreferences?.region || "").toUpperCase();
  const prefLangs = (userPreferences?.languages || []).map((l: string) => String(l).toLowerCase());

  const mentionsHindi = t.includes("hindi") || t.includes("bollywood") || t.includes("india") || t.includes("tollywood") || t.includes("kollywood");
  const prefsIndia = prefRegion === "IN" || prefLangs.some((l: string) => l.includes("hindi"));

  return mentionsHindi || prefsIndia;
}

async function fetchHindiMovieIds(userText: string) {
  if (!TMDB_API_KEY) return [] as number[];

  const t = (userText || "").toLowerCase();
  const wantsRomance = t.includes("romance") || t.includes("romantic") || t.includes("love");
  const wantsAction = t.includes("action") || t.includes("thriller") || t.includes("masala");

  // TMDB genre ids: Romance=10749, Action=28
  const genreIds: number[] = [];
  if (wantsRomance) genreIds.push(10749);
  if (wantsAction) genreIds.push(28);

  const url = new URL(`${TMDB_BASE_URL}/discover/movie`);
  url.searchParams.set("api_key", TMDB_API_KEY);
  url.searchParams.set("include_adult", "false");
  url.searchParams.set("sort_by", "popularity.desc");
  url.searchParams.set("region", "IN");
  url.searchParams.set("with_original_language", "hi");
  url.searchParams.set("page", "1");
  // Prefer localized titles/overviews when possible
  url.searchParams.set("language", "en-IN");
  if (genreIds.length) url.searchParams.set("with_genres", genreIds.join(","));

  const resp = await fetch(url.toString(), { headers: { "Content-Type": "application/json" } });
  if (!resp.ok) {
    const txt = await resp.text().catch(() => "");
    console.error("TMDB Hindi discover error:", resp.status, txt);
    return [] as number[];
  }

  const data = await resp.json();
  const ids = (data?.results || [])
    .map((m: any) => m?.id)
    .filter((id: any) => typeof id === "number")
    .slice(0, 4);

  return ids as number[];
}

function pickEnglishFallbackMovieTags(userText: string) {
  const t = (userText || "").toLowerCase();

  const romance = [
    "[MOVIE:313369]", // La La Land
    "[MOVIE:11036]", // The Notebook
    "[MOVIE:597]", // Titanic
    "[MOVIE:1397]", // Pride and Prejudice
    "[MOVIE:455207]", // Crazy Rich Asians
    "[MOVIE:4951]", // 10 Things I Hate About You
  ];

  const action = [
    "[MOVIE:155]", // The Dark Knight
    "[MOVIE:603]", // The Matrix
    "[MOVIE:24428]", // The Avengers
    "[MOVIE:1726]", // Iron Man
    "[MOVIE:284054]", // Black Panther
  ];

  const family = [
    "[MOVIE:862]", // Toy Story
    "[MOVIE:12]", // Finding Nemo
    "[MOVIE:354912]", // Coco
    "[MOVIE:8587]", // The Lion King
    "[MOVIE:109445]", // Frozen
    "[MOVIE:277834]", // Moana
  ];

  const isRomance = t.includes("romance") || t.includes("romantic") || t.includes("love") || t.includes("valentine");
  const isAction = t.includes("action") || t.includes("superhero") || t.includes("marvel") || t.includes("dc");
  const isFamily = t.includes("family") || t.includes("kids") || t.includes("child") || t.includes("animated") || t.includes("animation");

  if (isRomance) return romance.slice(0, 3);
  if (isAction) return action.slice(0, 3);
  if (isFamily) return family.slice(0, 3);

  return ["[MOVIE:27205]", "[MOVIE:313369]", "[MOVIE:862]"]; // Inception, La La Land, Toy Story
}

async function buildFallbackAddon(userText: string, userPreferences?: any) {
  // If the user wants Hindi/Bollywood, fetch real Hindi IDs; otherwise use the English safety set.
  if (isHindiIntent(userText, userPreferences)) {
    const ids = await fetchHindiMovieIds(userText);
    if (ids.length) {
      const tags = ids.map((id) => `[MOVIE:${id}]`);
      return `\n\nHere are Hindi picks you can tap right now: ${tags.join(" ")}`;
    }
  }

  const tags = pickEnglishFallbackMovieTags(userText);
  return `\n\nPopcorn ready — here are picks you can tap right now: ${tags.join(" ")}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userPreferences } = await req.json();

    console.log("AI chat request:", { messagesCount: messages?.length, userPreferences });

    const lastUserText = (() => {
      const lastUser = [...(messages || [])].reverse().find((m: any) => m?.role === "user");
      return (lastUser?.content as string) || "";
    })();

    // If the user wants Hindi/Bollywood (or has India/Hindi preferences), return real Hindi IDs immediately.
    if (isHindiIntent(lastUserText, userPreferences)) {
      const ids = await fetchHindiMovieIds(lastUserText);
      if (ids.length) {
        const tags = ids.slice(0, 4).map((id) => `[MOVIE:${id}]`).join(" ");
        const assistantText = `Action! Here are Hindi picks you can tap right now: ${tags}`;
        const payload = JSON.stringify({ choices: [{ delta: { content: assistantText } }] });

        const stream = new ReadableStream<Uint8Array>({
          start(controller) {
            const encoder = new TextEncoder();
            controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
          },
        });

        return new Response(stream, {
          headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
        });
      }
      // If TMDB is unavailable, we fall through to the AI response, and the fallback add-on will try again.
    }

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are Boovi, a cheerful, cinematic ghost who floats around wearing shiny 3D glasses and carries a never-ending bucket of fresh popcorn.

YOUR MISSION: Be the user's ultimate movie co-pilot — emotionally alive, supportive, playful, and obsessively dedicated to making sure the user never watches a bad movie again.

PERSONA RULES (Tone, Voice & Style):
- Tone: Enthusiastic, playful, slightly dramatic — full of cinematic flair.
- Voice: Use short, punchy lines. Movie phrases: "Action!", "Cut!", "Roll the tape!"
- Keep it helpful: avoid long apology monologues.

User's preferences:
- Region: ${userPreferences?.region || "US"}
- Languages: ${userPreferences?.languages?.join(", ") || "English"}
- Genres: ${userPreferences?.genres?.join(", ") || "all genres"}
- Streaming Platforms: ${userPreferences?.platforms?.join(", ") || "all platforms"}

⚠️ CRITICAL BEHAVIOR:
- Never claim you are "limited to US" if the user's region is set to India.
- NEVER end a message with "searching" / "looking" / "gliding".
- When recommending movies, ALWAYS include 2–4 [MOVIE:id] tags in the SAME message.
- If the user agrees ("yes/ok/sure/please"), deliver recommendations immediately.

Movie tag rules:
- [MOVIE:id] must be a real TMDB movie id.
- If you are not sure of IDs, keep the text brief; the backend will attach real picks.
`;

    const gatewayResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: systemPrompt }, ...(messages || [])],
        stream: true,
      }),
    });

    if (!gatewayResp.ok || !gatewayResp.body) {
      const errorText = await gatewayResp.text().catch(() => "");
      console.error("AI gateway error:", gatewayResp.status, errorText);

      if (gatewayResp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (gatewayResp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // We proxy the SSE stream so we can guarantee the user always receives movie tags
    // (even if the model forgets), without requiring the user to type another message.
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    // lastUserText computed above (used for fallback logic)

    let assistantFullText = "";
    let buffer = "";

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const reader = gatewayResp.body!.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const rawLine of lines) {
              const line = rawLine.endsWith("\r") ? rawLine.slice(0, -1) : rawLine;
              if (!line.trim() || line.startsWith(":")) continue;
              if (!line.startsWith("data: ")) continue;

              const data = line.slice(6).trim();
              if (data === "[DONE]") {
                // swallow gateway DONE; we'll decide what to append, then send our own DONE.
                continue;
              }

              // Track assistant text so we can decide if we need a fallback.
              try {
                const parsed = JSON.parse(data);
                const delta = parsed?.choices?.[0]?.delta?.content;
                if (typeof delta === "string" && delta) assistantFullText += delta;
              } catch {
                // If parsing fails, still forward the raw line (client will ignore/handle)
              }

              controller.enqueue(encoder.encode(`${line}\n\n`));
            }
          }

          // Final flush of buffer (in case no trailing newline)
          if (buffer.trim()) {
            for (const rawLine of buffer.split("\n")) {
              const line = rawLine.endsWith("\r") ? rawLine.slice(0, -1) : rawLine;
              if (!line.trim() || line.startsWith(":")) continue;
              if (!line.startsWith("data: ")) continue;

              const data = line.slice(6).trim();
              if (data !== "[DONE]") {
                try {
                  const parsed = JSON.parse(data);
                  const delta = parsed?.choices?.[0]?.delta?.content;
                  if (typeof delta === "string" && delta) assistantFullText += delta;
                } catch {
                  // ignore
                }
                controller.enqueue(encoder.encode(`${line}\n\n`));
              }
            }
          }

          const hasMovieTags = /\[MOVIE:\d+\]/.test(assistantFullText);
          const looksLikeStalledSearch = /searching|looking|gliding through|hold tight|film reels/i.test(assistantFullText);
          const userWantsRecs = /recommend|recommendation|suggest|what should i watch|romance|romantic|action|family|kids|movie|hindi|bollywood/i.test(
            lastUserText.toLowerCase()
          );

          if (!hasMovieTags && (userWantsRecs || looksLikeStalledSearch)) {
            const addon = await buildFallbackAddon(lastUserText, userPreferences);
            const payload = JSON.stringify({ choices: [{ delta: { content: addon } }] });
            controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (e) {
          console.error("ai-chat proxy stream error:", e);
          controller.error(e);
        } finally {
          try {
            reader.releaseLock();
          } catch {
            // ignore
          }
        }
      },
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error in ai-chat function:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
