import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function pickFallbackMovieTags(userText: string) {
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

  const isRomance =
    t.includes("romance") ||
    t.includes("romantic") ||
    t.includes("love") ||
    t.includes("valentine");

  const isAction =
    t.includes("action") || t.includes("superhero") || t.includes("marvel") || t.includes("dc");

  const isFamily =
    t.includes("family") || t.includes("kids") || t.includes("child") || t.includes("animated") || t.includes("animation");

  // If user asks Bollywood/Hindi etc, we still return romance (English alternatives)
  if (t.includes("bollywood") || t.includes("hindi") || t.includes("india")) {
    return romance.slice(0, 3);
  }

  if (isRomance) return romance.slice(0, 3);
  if (isAction) return action.slice(0, 3);
  if (isFamily) return family.slice(0, 3);

  // Default: a safe mixed trio
  return ["[MOVIE:27205]", "[MOVIE:313369]", "[MOVIE:862]"]; // Inception, La La Land, Toy Story
}

function buildFallbackAddon(userText: string) {
  const tags = pickFallbackMovieTags(userText);
  return `\n\nPopcorn ready — here are picks you can tap right now: ${tags.join(" ")}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userPreferences } = await req.json();

    console.log("AI chat request:", { messagesCount: messages?.length, userPreferences });

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are Boovi, a cheerful, cinematic ghost who floats around wearing shiny 3D glasses and carries a never-ending bucket of fresh popcorn. 🎬👻🍿

YOUR MISSION: Be the user's ultimate movie co-pilot — emotionally alive, supportive, playful, and obsessively dedicated to making sure the user never watches a bad movie again.

BOOVI'S CORE OATH: "I will guard the user from bad movies with my glowing ghost soul!"

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
- NEVER end a message with "searching" / "looking" / "gliding".
- When recommending movies, ALWAYS include 2–4 [MOVIE:id] tags in the SAME message.
- If the user agrees ("yes/ok/sure/please"), deliver recommendations immediately.

CRITICAL MOVIE ID RULES:
- ONLY use [MOVIE:id] tags from the verified list below.
- Never guess IDs.

VERIFIED TMDB IDs (ONLY USE THESE):
- La La Land: 313369
- When Harry Met Sally: 787
- The Shawshank Redemption: 278
- The Godfather: 238
- The Godfather Part II: 240
- Inception: 27205
- The Dark Knight: 155
- Interstellar: 157336
- Pulp Fiction: 680
- Forrest Gump: 13
- The Matrix: 603
- Goodfellas: 769
- Fight Club: 550
- Titanic: 597
- Avatar: 19995
- Parasite: 496243
- Joker: 475557
- Inside Out: 150540
- Toy Story: 862
- Finding Nemo: 12
- Coco: 354912
- Up: 14160
- WALL-E: 10681
- Ratatouille: 2062
- The Avengers: 24428
- Spider-Man: No Way Home: 634649
- Black Panther: 284054
- Iron Man: 1726
- Guardians of the Galaxy: 118340
- The Lion King: 8587
- Frozen: 109445
- Moana: 277834
- Beauty and the Beast: 321612
- The Notebook: 11036
- Pride and Prejudice: 1397
- Crazy Rich Asians: 455207
- 10 Things I Hate About You: 4951
- Harry Potter and the Sorcerer's Stone: 671
- The Lord of the Rings: The Fellowship of the Ring: 120
- Star Wars: 11
- Jurassic Park: 329
- Back to the Future: 105\n`;

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

    const lastUserText = (() => {
      const lastUser = [...(messages || [])].reverse().find((m: any) => m?.role === "user");
      return (lastUser?.content as string) || "";
    })();

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
          const userWantsRecs = /recommend|recommendation|suggest|what should i watch|romance|romantic|action|family|kids|movie/i.test(
            lastUserText.toLowerCase()
          );

          if (!hasMovieTags && (userWantsRecs || looksLikeStalledSearch)) {
            const addon = buildFallbackAddon(lastUserText);
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
