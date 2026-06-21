import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = 3000;

// Parse typical payloads
app.use(express.json());

// Lazy-initialize OpenAI SDK to prevent startup crashes if OPENAI_API_KEY is not defined
let openaiClient: OpenAI | null = null;
function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      throw new Error("دسترسی به کلید OpenAI امکان‌پذیر نیست. لطفاً متغیر OPENAI_API_KEY را تنظیم کنید.");
    }
    openaiClient = new OpenAI({ apiKey: key });
  }
  return openaiClient;
}

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    const openai = getOpenAIClient();
    
    // Build context array
    const messages: any[] = [];
    messages.push({ role: "system", content: "شما دستیار هوش مصنوعی در «کارخانه پرامپت» هستید. کمک کنید به کاربر تا با ابزارهای پلتفرم پرامپت‌های بهتری بسازد و مشکلاتش را حل کند. دوستانه و با زبان ساده فارسی پاسخ دهید." });
    
    if (history && Array.isArray(history)) {
       history.forEach(h => {
          messages.push({ role: h.role === "model" ? "assistant" : "user", content: h.text });
       });
    }
    messages.push({ role: "user", content: message });

    const response = await openai.chat.completions.create({
       model: "gpt-4o-mini",
       messages: messages,
       stream: true,
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
      }
    }
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err: any) {
    console.error("Error in chat:", err);
    res.write(`data: ${JSON.stringify({ error: err.message || "Something went wrong" })}\n\n`);
    res.end();
  }
});

// Lazy-initialize Gemini SDK to prevent startup crashes if GEMINI_API_KEY is not defined
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("دسترسی به کلید طلایی هوش مصنوعی امکان‌پذیر نیست. لطفاً متغیر GEMINI_API_KEY را تنظیم کنید.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Prompt engineering endpoint
app.post("/api/generate", async (req, res) => {
  try {
    const { subject, style, lighting, mood, camera, cameraAngle, zoomLevel, lensType, aspect, artist, octane, type = "image" } = req.body;

    if (!subject || subject.trim() === "") {
      res.status(400).json({ error: "لطفاً موضوع اصلی را وارد کنید." });
      return;
    }

    const ai = getGeminiClient();

    let systemInstruction = "";
    let userInstructions = "";

    if (type === "video") {
      systemInstruction = `You are a professional Prompt Engineer for cutting-edge text-to-video models (such as Sora, Runway Gen-3 Alpha, Luma Dream Machine, Kling AI, and Pika).
Your goal is to parse the user's input (core prompt subject in Persian or English, and dynamic descriptors like camera movements, motion pace, mood, and rendering style), translate the Persian subject into cinematic professional English, and engineer top-tier video generation prompts.

Structure the engineered prompts clearly:
1. [Core Action & Main Subject]: Clear description of character, movement, and physical action.
2. [Environment / Scene]: Background details, atmospheric conditions.
3. [Camera Directives & Motion Transitions]: Sweeping drone, dolly zoom, gimbal orbit, panning, crane lift, or tracking rate.
4. [Cinematic Quality]: Frame rates (like classic 24fps or high-speed slow-motion 60fps), lighting, lens flares, and simulated camera sensor.
5. Ensure all Persian text in the response (styleNameFa, engineeringExplanation) is in premium, natural, friendly educational Persian.`;

      userInstructions = `Let's engineer a stunning, coherent cinematic video generation prompt. Here are the parameters:
- Core Story Subject: "${subject}"
- Motion style / Pacing (or Style selection): "${style}"
- Lighting profile: "${lighting}"
- Visual mood / color scheme: "${mood}"
- Camera Motion / Transition technique: "${camera}"
- Widescreen aspect directive: "${aspect}"
- Visual director / Aesthetic influence: "${artist}"
- Video generation reactor / details modifier: "${octane}"

Please generate:
1. The translated subject in English (clean, dynamic).
2. The optimized main cinematic video generation prompt in English, compiling these action, camera motion, framing, and tech details harmoniously to yield hyper-coherent movement. IMPORTANT: Append your negative parameters safely at the very end of this string (e.g. using "--no static, text, watermark"). Do not use a separate field.
3. Three creative video variations in different styles (such as traditional claymation stop-motion motion, vintage 1970s celluloid film camera action, or hyper-futuristic unreal-engine cinematic teaser) with Persian and English labels. Embed native negative prompts using '--no' into each variation's text as well if appropriate.
4. An explanation in Persian (Farsi) clarifying how you engineered this movement, what panning direction/physics keywords were added, and how to get the most fluid motion possible.`;

    } else if (type === "text") {
      systemInstruction = `You are an elite Prompt Engineer for advanced Large Language Models (such as Gemini 1.5 Pro, Claude 3.5 Sonnet, and GPT-4o).
Your goal is to generate extremely polished, robust system instructions and chatbot guidelines ("System Metaprompts") based on the user's specific query.
You translate plain questions into deep, structured blueprints utilizing advanced developer techniques (role play, persona assignment, tone constraints, thinking steps, formatting guidelines, and edge-case exceptions).

Structure the engineered prompts clearly:
1. [Persona / System Identity]: Assign specialized roles (e.g., Senior Software Developer, master marketer, university research editor).
2. [Target Audience & Depth]: Configure target complexity (e.g., Explain like I'm 5, Specialized deep dive).
3. [Core Guidelines / Reasoning Model]: Step-by-step thinking instructions.
4. [Formatting Expectations]: Expected structure (JSON, Markdown headers, elegant code blocks).
5. Ensure all Persian text (translations, styleNameFa, engineeringExplanation) is in high-craft, friendly Persian.`;

      userInstructions = `Let's engineer a powerful Large Language Model metacommand. Here are the parameters:
- Target task query / Subject: "${subject}"
- Selected Persona / Specialist role: "${style}"
- Tone / Mood: "${mood}"
- Output complexity/audience level: "${camera}"
- Output formatting style: "${octane}"
- Extra guidelines: "${lighting}" (used as customized guidelines)
- Extra perspective context: "${artist}"

Please generate:
1. The translated subject / refined goal in English.
2. The optimized main system prompt in English, utilizing tags like <role>, <instructions>, and <output-format> to construct an unbreakable blueprint for other chatbots. Included inside this prompt, explicitly detail what the assistant should NOT do (Constraints/Negative Prompt).
3. Three creative variation strategies (such as a rigorous step-by-step Socratic debugger, a friendly conversational therapist, or a terse high-impact strategist) with Persian and English labels. Include constraints directly natively in each.
4. An explanation in Persian (Farsi) explaining why this prompt structure is robust and how it prevents common conversational pitfalls.`;

    } else {
      // Default standard image prompt
      systemInstruction = `You are a professional Prompt Engineer for advanced text-to-image models (like Midjourney, Stable Diffusion XL, and Imagen 3).
Your goal is to parse the user's input (subject in Persian/Farsi, and optional attributes like style, lighting, mood, camera, aspect ratio, artist inspiration, rendering/details), translate the Persian subject into rich, descriptive visual English, and engineer a set of highly optimized prompts.

Ensure your engineered prompts use state-of-the-art prompt-craft rules:
1. Describe the subject in vivid sensory detail instead of using generic buzzwords.
2. Structure the prompt clearly: [Subject & Core Action], [Environment & Background], [Art Style & Medium], [Lighting & Color Palette], [Camera Angle, Lens & Composition details], [Cinematic Rendering / Technical qualifiers].
3. For Midjourney, add stylistic descriptions that feel high-craft.
4. Output a JSON object matching the requested schema. Ensure all Persian text (translations, styleNameFa, engineeringExplanation) is in elegant, natural, Persian written with friendly educational tone.`;

      userInstructions = `Let's engineer a masterpiece. Here's the inputs:
- Subject (Farsi/English): "${subject}"
- Selected Style: "${style || "Standard/Photorealistic"}"
- Selected Lighting: "${lighting || "Cinematic"}"
- Selected Mood/Atmosphere: "${mood || "Generative"}"
- Camera Angle: "${cameraAngle || "Eye-level"}"
- Zoom Level: "${zoomLevel || "Medium Shot"}"
- Lens Type: "${lensType || "Standard 50mm"}"
- Aspect Ratio context: "${aspect || "1:1"}"
- Artist Inspiration: "${artist || "None"}"
- Extra Detail Render modifiers: "${octane || "None"}"

Please generate:
1. The translated subject in English (clean, artistic).
2. The optimized main masterpiece prompt in English, compiling these details harmoniously. IMPORTANT: Append your negative parameters safely at the very end of this string (e.g. using "--no blurry, watermark, ugly"). Do not use a separate field.
3. Three creative variations in different style paradigms (like Fantasy Art, Retro Cyberpunk, Minimalist Watercolor, etc.) with both Persian & English labels. Embed native negative prompts using '--no' into each variation's text as well if appropriate.
4. An explanation in Persian (Farsi) clarifying how you engineered this prompt, what keywords were added, and why.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: userInstructions,
      config: {
        systemInstruction: systemInstruction + "\n\nCRITICAL AI BEHAVIOR: Enable Deep Thinking mode. Before generating the final prompt, actively refine and elevate the user's raw 'subject' using creative inferences, making it highly professional and conceptually profound. Avoid basic or shallow interpretations.",
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translatedSubject: {
              type: Type.STRING,
              description: "Elegant and polished English translation / refined goal of the raw Persian subject.",
            },
            optimizedPrompt: {
              type: Type.STRING,
              description: "The main epic engineered generation prompt or chatbot instruction script in English. Ensure you append '--no [negative keywords]' at the end for image/video prompts.",
            },
            variations: {
              type: Type.ARRAY,
              description: "Three distinct creative style variations or chatbot strategy configurations.",
              items: {
                type: Type.OBJECT,
                properties: {
                  styleNameFa: { type: Type.STRING, description: "Persian label for this variation" },
                  styleNameEn: { type: Type.STRING, description: "English label for this variation" },
                  prompt: { type: Type.STRING, description: "The complete engineered prompt or instructions block for this variation. Must also contain '--no [negative keywords]' appended at the end for images/videos." },
                },
                required: ["styleNameFa", "styleNameEn", "prompt"],
              },
            },
            engineeringExplanation: {
              type: Type.STRING,
              description: "A friendly and educational explanation in Persian why these descriptors or formats were chosen and how they elevate output quality.",
            },
          },
          required: [
            "translatedSubject",
            "optimizedPrompt",
            "variations",
            "engineeringExplanation",
          ],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("پاسخی از مدل متنی لود نشد.");
    }

    const payload = JSON.parse(responseText.trim());
    res.json(payload);
  } catch (err: any) {
    console.error("Error generating prompt:", err);
    res.status(500).json({
      error: err.message || "خطایی در برقراری ارتباط با جمینای رخ داد. لطفاً رمز یا کلید معتبر را در Secrets ثبت کنید.",
    });
  }
});

// Vite middleware flow for full stack App
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server bootstrapping finished. Listening on http://0.0.0.0:${PORT}`);
  });
}

bootstrap();
