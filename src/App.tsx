import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Info,
  Layers,
  Star,
  Trash2,
  Sliders,
  ExternalLink,
  Laptop,
  HelpCircle,
  Video,
  Paintbrush,
  Sun,
  Camera,
  Heart,
  MessageCircle,
  X,
  Send,
  MessageSquare,
  Wand2,
  Pin,
  Palette,
  Bot,
  ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PromptRequest, PromptResult, PromptHistoryItem } from "./types";

// Dynamic preset arrays for prompt engineering (At least 21 elements each)
const styles = [
  { value: "Standard/Photorealistic", labelFa: "واقع‌گرایانه / عکاسی حرفه‌ای", labelEn: "Photorealistic, 8K, Hasselblad capture" },
  { value: "3D Pixar Style", labelFa: "کارتونی سه‌بعدی سبک پیکسار", labelEn: "3D render, Pixar style, cute, vibrant, clay material" },
  { value: "Fantasy Concept Art", labelFa: "کانسپت آرت فانتزی حماسی", labelEn: "Fantasy concept art, trending on Artstation, epic scale" },
  { value: "Anime Studio Ghibli", labelFa: "انیمه سبک میازاکی و جیبلی", labelEn: "Studio Ghibli style, hand-drawn anime, vibrant handpainted" },
  { value: "Retro Future Cyberpunk", labelFa: "سایبرپانک آینده‌نگر نئونی", labelEn: "Cyberpunk, neon city dusk ambience, holographic elements" },
  { value: "Classic Oil Painting", labelFa: "نقاشی رنگ روغن امپرسیونیسم", labelEn: "Impressionist oil painting, visible canvas texture, thick strokes" },
  { value: "Vibrant Watercolor", labelFa: "آبرنگ پویا و جوهر مایع", labelEn: "Vibrant watercolor paint, splatter effects, high-contrast ink lines" },
  { value: "Charcoal Sketch", labelFa: "طراحی دست‌نویس با زغال و مداد", labelEn: "Classic charcoal pencil sketch, highly textured" },
  { value: "Pencil Sketch Sketch", labelFa: "طراحی مداد سیاه سفید کلاسیک", labelEn: "academic graphite pencil sketch detail drawing" },
  { value: "Cyberpunk Hologram", labelFa: "هولوگرافیک دیجیتال سه‌بعدی", labelEn: "glitchy transparent 3D holographic wireframe hologram" },
  { value: "Ukiyo-e Japanese Woodblock", labelFa: "اوکی‌یوئه ژاپنی سنتی", labelEn: "Japanese traditional Ukiyo-e ink and woodblock print style" },
  { value: "Claymation / Plasticine", labelFa: "انیمیشن خمیری و استاپ‌موشن", labelEn: "stop-motion claymation, handmade plasticine sculptures" },
  { value: "Minimalist Vector Art", labelFa: "وکتور آرت مینیمال مدرن", labelEn: "flat design vector illustration, clean lines, minimalist shapes" },
  { value: "1980s VHS Synthwave", labelFa: "سینث‌ویو قدیمی دهه ۸۰", labelEn: "neon synthwave aesthetic, retro 1980s VHS scanlines" },
  { value: "Baroque Masterpiece Painting", labelFa: "نقاشی کلاسیک دوران باروک", labelEn: "Baroque oil masterpiece, dramatic Caravaggio tenebrism style" },
  { value: "Psychedelic Acid Art", labelFa: "هنر توهم‌زا با رنگ‌های جیغ", labelEn: "psychedelic 1960s acid art, morphing trippy shapes" },
  { value: "Stained Glass Window", labelFa: "هنر شیشه‌های رنگی کلیسایی", labelEn: "gothic stained glass window mosaic, lead lines holding color plates" },
  { value: "Gothic / Dark Fantasy", labelFa: "گوتیک و فانتزی سیاه تاریک", labelEn: "dark gothic fantasy illustration, grim atmosphere, detailed decay" },
  { value: "Abstract Expressionism", labelFa: "اکسپرسیونیسم انتزاعی", labelEn: "Jackson Pollock style abstract paint splatters, dynamic action painting" },
  { value: "Origami Paper Sculpture", labelFa: "مجسمه کاغذی و اوریگامی سه‌بعدی", labelEn: "delicate paper sculpture origami art, folded paper layers" },
  { value: "Vintage Tintype Photo", labelFa: "عکاسی قدیمی داگرئوتیپ", labelEn: "antique 1800s tintype wet plate photography, scratches and noise" }
];

const lightings = [
  { value: "Cinematic Lighting", labelFa: "سینمایی با کنتراست بالا", labelEn: "Cinematic, rich dramatic shadows, chiaroscuro" },
  { value: "Golden Hour Warmth", labelFa: "ساعت طلایی خورشید غروب", labelEn: "Warm golden hour natural lighting, long soft shadows" },
  { value: "Neon Ultraviolet Glow", labelFa: "نئونی نایتکلاب سایبر", labelEn: "Cyberpunk neon lights, glowing indigo and magenta rim light" },
  { value: "Volumetric God Rays", labelFa: "پرتوهای نوری حجمی و مه‌آلود", labelEn: "Volumetric lighting, dramatic sun rays filtering through haze" },
  { value: "Studio Keylight & Softbox", labelFa: "نورپردازی آتلیه‌ای پرتره", labelEn: "Pro corporate studio photography lighting, softbox fill" },
  { value: "Dramatic Chiaroscuro", labelFa: "سایه‌های مرموز عمیق", labelEn: "Dramatic chiaroscuro shadow aesthetic, highly dark contrast" },
  { value: "Moonlight Silver Glow", labelFa: "نور نقره‌ای رمانتیک مهتاب", labelEn: "mystical pale silver moonlight, dark deep shadows" },
  { value: "Harsh Noon Sunshine", labelFa: "نور شدید بیابان نیمروز", labelEn: "unforgiving harsh direct sun overhead, hard hyper-bright highlights" },
  { value: "Bioluminescent Neon Glow", labelFa: "نور فلوئورسنتی موجودات زنده", labelEn: "bioluminescent glowing spores, organic micro-light nodes" },
  { value: "Rembrandt Side-Lighting", labelFa: "نورپردازی جانبی کلاسیک رامبراند", labelEn: "Rembrandt lighting arrangement, classic triangular cheek light" },
  { value: "Moody Backlight Silhouette", labelFa: "نور پشت ضد نور رمانتیک", labelEn: "romantic low-key backlight casting beautiful golden rim silhouette" },
  { value: "Sub-surface Scattering glow", labelFa: "نور نافذ نیمه‌شفاف", labelEn: "translucent subsurface scattering, light diffusing through skin/waxy surface" },
  { value: "Cyberpunk Glitch Neon", labelFa: "نئون چشمک‌زن شهری", labelEn: "glitchy strobe neon tube pulse, urban alley night look" },
  { value: "Overcast Flat Softlight", labelFa: "نور ابری ملایم و یکدست", labelEn: "overcast sky diffuse shadowless daylight, flat realism" },
  { value: "Prism Rainbow Flares", labelFa: "شکست نور منشور و رنگین‌کمان", labelEn: "optical prism refraction flares, floating chromatic aberration rainbow beams" },
  { value: "Underwater Caustics ripple", labelFa: "رقص نور ته‌دریا و موج آب", labelEn: "shimmering underwater caustics patterns dancing on seafloor" },
  { value: "Candlelight Flicker Warmth", labelFa: "نور ملایم لرزان شمع", labelEn: "warm intimate candlelight flicker, tiny burning flame halo" },
  { value: "Strobe Action Lights", labelFa: "فلاش‌های ورزشی استروبوسکوپیک", labelEn: "strobe flashes freezing action, high velocity athletic capture" },
  { value: "Eerie Sci-Fi Laser Beams", labelFa: "بیم‌های لیزر سبز علمی‌تخیلی", labelEn: "luminous green sci-fi laser grids cutting through dark mist" },
  { value: "Fire Ember Ambient Radiance", labelFa: "تابش نارنجی پرتوهای کرسی و آتش", labelEn: "ambient cozy dancing sparks of fire, warm orange charcoal radiation" },
  { value: "Northern Lights Aura", labelFa: "شفق قطبی اسرارآمیز سبز و صورتی", labelEn: "surreal dynamic aurora borealis curtain dancing in winter night sky" }
];

const colorPalettes = [
  { value: "None", labelFa: "سایر / بدون فیلتر", labelEn: "no specific color palette, natural colors" },
  { value: "Monochromatic Charcoal", labelFa: "سیاه و خاکستری عمیق (ذغال)", labelEn: "monochromatic charcoal black and graphite gray, dark contrast" },
  { value: "Pastel Bubblegum Sunset", labelFa: "پاستلی صورتی و آبی ملایم", labelEn: "soft pastel bubblegum pink, lilac violet, and sky baby blue" },
  { value: "Cyberpunk Purple Indigo", labelFa: "بنفش و کلفت نئونی نایتکلاپ", labelEn: "vibrant cyberpunk neon purple, hot pink, and deep midnight indigo" },
  { value: "Earthly Autumn Warmth", labelFa: "خاکی گرم پاییزی", labelEn: "warm earthy tones, amber orange, rust copper, and forest olive wood" },
  { value: "Vintage Technicolor Retro", labelFa: "تکنی‌کالر کلاسیک سینما", labelEn: "rich archival 3-strip technicolor saturation, vintage cinematic hues" },
  { value: "Acid Lime and Magenta", labelFa: "اسیدی هیجانی (فسفری و سرخابی)", labelEn: "high tension acid electric lime green paired with aggressive magenta ruby" },
  { value: "Deep Ocean Navy and Teal", labelFa: "اقیانوس عمیق (سرمه‌ای و فیروزه‌ای)", labelEn: "submerged dark navy blue, turquoise teal, and deep aquatic teal accents" },
  { value: "Holy Golden White Aura", labelFa: "اشرافی طلایی و سفید مقدس", labelEn: "regal divine ivory white and polished 24k bright gold metallic trim" },
  { value: "Royal Emerald and Amber", labelFa: "سلطنتی زبرجد زمردی و کهربایی", labelEn: "luxurious deep emerald green contrast with warm honey amber amber jewel" },
  { value: "Toxic Industrial Wasteland", labelFa: "صنعتی رادیواکتیو (سبز و زرد)", labelEn: "toxic sulfur yellow, radio-active neon green, and rusty concrete grays" },
  { value: "Nordic Cool Blue Glacial", labelFa: "شمالگان سرد یخی و آبی کریستالی", labelEn: "glacial blue, arctic frost white, cold slate grey, clean ice shadows" },
  { value: "Minimal Cosmic Monastic White", labelFa: "سفیدی مینیمال مدرن کیهانی", labelEn: "futuristic pure paper-white, subtle clinical concrete grays, black outline" },
  { value: "Retro Vaporwave Pastel Gradient", labelFa: "شیب رنگ ویپورویو پودری", labelEn: "faded aesthetic vaporwave sunset gradient, mint green and pale magenta" },
  { value: "Warm Terracotta Sand", labelFa: "شنی داغ کویر و سفالی", labelEn: "warm terracotta clay, hot Sahara sand, dry desert ochre and beige" },
  { value: "Dark Crimson Blood Red", labelFa: "زرشکی تیره خون‌آلود گوتیک", labelEn: "dark brooding crimson, oxblood red, matte obsidian black shadows" },
  { value: "Ethereal Rainbow Iridescent", labelFa: "رنگین‌کمانی جیوه غلیظ و براق", labelEn: "shimmering liquid soap-bubble iridescent glaze, rainbow pearlescent sheen" },
  { value: "Jungle Forest Organic Moss", labelFa: "زیتونی ارگانیک جنگلی و خزه‌ای", labelEn: "rich organic jungle moss, bamboo green, damp earthy brown clay" },
  { value: "Vintage Sepia Classic", labelFa: "قهوه‌ای نوستالژیک عکاسی قدیمی", labelEn: "classic nostalgia sepia tones, dusty warm amber wash, antique look" },
  { value: "Cyber-Military Olive and Orange", labelFa: "نظامی زیتونی تیره و پرتقالی دوزخ", labelEn: "cyber military tactical olive drab accented with high-viz radioactive orange" },
  { value: "Sunset Horizon Coral Amber", labelFa: "مرجانی فیروزه‌ای غروب افق", labelEn: "blazing horizon sunset coral pink, deep golden amber, dark turquoise shadow" },
  { value: "Ghostly Necrotic Slate Green", labelFa: "اسلیتی مرده و سبز گوتیک مهیج", labelEn: "spectral ghost slate grey, dead lichen green, and cold bone white highlight" }
];

// Video production presets
const videoPaces = [
  { value: "High speed slow-motion 60fps capture", labelFa: "عکاسی حرکت آهسته (Slow-Mo)", labelEn: "high-speed slow-motion 60fps tracking depth" },
  { value: "Hyperlapse time-lapse, smooth progression of years", labelFa: "تایم‌لپس سریع زمان (Timelapse)", labelEn: "smooth hyperlapse timelapse, rapid environment flow" },
  { value: "Cinematic 24 frames-per-second, natural fluid motion blur", labelFa: "سینمایی سنتی ۲۴ فریم در ثانیه", labelEn: "epic cinematic 24fps motion capture, natural cinema shutter blur" },
  { value: "High velocity rapid frame flow, action-oriented, quick succession", labelFa: "حرکت فوق‌العاده سریع پرشتاب", labelEn: "high-velocity extreme action flow, dynamic speed-lines" }
];

const cameraMotions = [
  { value: "Sweeping epic drone flyby panning shot, wide spatial navigation", labelFa: "پرواز پهپاد با ارتفاع بالا (Drone)", labelEn: "epic drone flyby overhead sweep, soaring dynamic elevation" },
  { value: "Dynamic gimbal tracking orbit shot around target, seamless parallax", labelFa: "چرخش دایره‌ای دور سوژه (Orbit)", labelEn: "dynamic gimbal tracking orbit camera move, flawless spatial parallax" },
  { value: "Slow hypnotic dolly zoom push-in, focus-pulling dramatic reveal", labelFa: "حرکت دالی زوم رو به جلو (Dolly Zoom)", labelEn: "slow push-in dolly zoom tracker, progressive focus pulling dramatic shift" },
  { value: "Smooth crane lift moving upwards, expanding field of view", labelFa: "بالا رفتن عمودی ملایم (Crane Lift)", labelEn: "smooth physical crane lift camera movement expanding visibility and horizon" },
  { value: "Intense handheld camera shake, GoPro style first-person perspective", labelFa: "تکان‌های طبیعی دوربین دستی (Handheld/GoPro)", labelEn: "intense responsive handheld camera shake, chaotic action GoPro style capture" }
];

const videoEngines = [
  { value: "Runway Gen-3 Alpha Cinematic", labelFa: "شبیه‌سازی ویدیو با Runway Gen-3", labelEn: "Runway Gen-3 Alpha visual physics solver, hyper photorealistic cinematic render" },
  { value: "Luma Dream Machine dynamics", labelFa: "حرکت طبیعی عمیق Luma Dream Machine", labelEn: "physics-coherent motion dynamic simulator in Luma Dream Machine standard" },
  { value: "Sora level physical world consistency", labelFa: "همبستگی فیزیکی فوق‌العاده Sora", labelEn: "Sora spatial coherence, absolute temporal consistency, stunning cinematic realism" },
  { value: "Traditionally animated 2D keyframed animation", labelFa: "کلاسیک انیمیشن ۲ بعدی ژاپنی", labelEn: "meticulous traditionally animated 2D keyframe visual flow, fluid animated outline" }
];

// LLM metacommand structured presets
const textPersonas = [
  { value: "Senior systems architect and elegant clean-code programmer", labelFa: "برنامه‌نویس و معمار ارشد سیستم", labelEn: "Senior Systems Architect & Clean Code Specialist" },
  { value: "Persuasive elite digital marketer and human-centric copywriter", labelFa: "کپی‌رایتر ارشد و متخصص تبلیغات", labelEn: "Elite Digital Copywriter & Conversion Rate Marketer" },
  { value: "Rigorous academic editor, university professor, peer reviewer", labelFa: "ویراستار و داور سخت‌گیر آکادمیک", labelEn: "Rigorous Academic Research Professor & Scientific Peer Reviewer" },
  { value: "Highly meticulous data engineer, statistician, data scientist", labelFa: "دانشمند داده و تحلیلگر تخصصی", labelEn: "Expert Data Analyst, Python Statistician & SQL Architect" },
  { value: "Immersive worldbuilder, fantasy novelist and emotional screenwriter", labelFa: "داستان‌نویس خلاق و کانسپت‌ساز", labelEn: "Creative Fantasy Novelist, Immersive Screenplay & Worldbuilder Writer" }
];

const textTones = [
  { value: "Strictly objective, formal, professional technical literature tone", labelFa: "فنی، رسمی و کاملاً بی‌طرف", labelEn: "Formal technical, objective, precise literature prose" },
  { value: "Warm, highly empathetic, conversational, positive and non-judgmental tone", labelFa: "صمیمی، انگیزشی و صبور", labelEn: "Warm conversational, deeply empathetic, highly supportive and coaching" },
  { value: "Witty, humorous, energetic, slightly sarcastic, highly engaging tone", labelFa: "طنزآمیز، منتقدانه و شیطنت‌آمیز", labelEn: "Sarcastic, witty, energetic, highly dynamic and playful banter" },
  { value: "Extremely direct, brutal simplicity, concise, no redundant introductory pleasantries", labelFa: "بی‌حاشیه، کلام صریح و سریع", labelEn: "Direct, concise, brutal simplistic prose, zero polite fluff" }
];

const textAudiences = [
  { value: "Explained in extremely simple, delightful, metaphorical terms suited for a 5-year-old child ELI5", labelFa: "کودک ۵ ساله (ساده و شیرین)", labelEn: "Explain like I'm 5 (ELI5) with cheerful metaphorical examples" },
  { value: "High-density professional level, assuming advanced expert knowledge, skip basics", labelFa: "متخصص کارکشته (حرفه‌ای عمیق)", labelEn: "Extremely dense academic expert level, skipped fundamental introductions" },
  { value: "Step-by-step instructional roadmap with milestones, clear take-aways", labelFa: "جوان دانشجویی (راهنمای آموزشی)", labelEn: "Interactive structured tutorial roadmapper with educational steps" },
  { value: "Actionable high-impact bulleted summary, focusing solely on strategy and ROI, minimal fluff", labelFa: "مدیر عالی‌رتبه (خلاصه استراتژیک)", labelEn: "Executive dashboard quick briefing format, strategic and result-focused only" }
];

const textFormats = [
  { value: "Structured Markdown, detailed headers, clean JSON or inline code blocks", labelFa: "مارک‌داون تمیز و کدهای مجزا", labelEn: "Strictly formatted Markdown with clear tables, checklists and labeled code blocks" },
  { value: "Interactive diagnostic style, ask me questions first before answering to refine context", labelFa: "پرسش عیب‌یابی تعاملی (Interactive)", labelEn: "Interactive diagnostic loop, must ask clarifying queries first to build custom context" },
  { value: "Highly organized tables comparing dimensions, pros, and cons", labelFa: "جدول‌های مقایسه‌ای ماتریسی", labelEn: "Dual contrast matrix tables with clear dimension benchmarks and pros vs cons list" }
];

// Fallback legacy mood array mapping
const moods = colorPalettes;

const cameras = [
  { value: "Eye-level Portrait", labelFa: "پرتره روبرو کادر بسته", labelEn: "Eye-level cinematic portrait, centered composition, shallow depth of field" },
  { value: "Wide-Angle Panorama", labelFa: "منظره عریض پانوراما", labelEn: "Wide-angle panoramic landscape shot, expansive scenery view, f/8" },
  { value: "Extreme Macro Closeup", labelFa: "نمای فوق نزدیک ماکرو", labelEn: "Extreme macro closeup detail shot, fine textures visible, super bokeh" },
  { value: "Epic Low-Angle Shot", labelFa: "زاویه پایین حماسی به بالا", labelEn: "Epic low-angle shot, heroic perspective, dramatic looking upwards" },
  { value: "Aerial Drone View", labelFa: "نمای بالا چشم پرنده", labelEn: "Breathtaking bird's-eye aerial drone photography, high altitude angle" }
];

const artists = [
  { value: "None", labelFa: "بدون هنرمند خاص", labelEn: "" },
  { value: "Vincent van Gogh", labelFa: "وینسنت ون‌گوگ (ستاره‌باران)", labelEn: "inspired by Vincent van Gogh brushstrokes" },
  { value: "Hayao Miyazaki", labelFa: "هایائو میازاکی (استودیو جیبلی)", labelEn: "illustrated by Hayao Miyazaki, Ghibli colors" },
  { value: "H.R. Giger", labelFa: "اچ‌ار جیگر (فلز بیومکانیک)", labelEn: "biomechanical dark surrealism by H.R. Giger" },
  { value: "Greg Rutkowski", labelFa: "گرگ روتکوفسکی (فانتزی مه‌آلود)", labelEn: "trending on Artstation by Greg Rutkowski" },
  { value: "Ansel Adams", labelFa: "انسل آدامز (سیاه و سفید)", labelEn: "timeless fine-art monochrome photography by Ansel Adams" }
];

const cameraAngles = [
  { value: "Eye-level", labelFa: "هم‌سطح چشم (Eye-level)", labelEn: "eye-level, neutral perspective" },
  { value: "Low Angle", labelFa: "زاویه پایین (Low Angle)", labelEn: "low angle looking up, heroic perspective" },
  { value: "High Angle", labelFa: "زاویه بالا (High Angle)", labelEn: "high angle looking down, slight downward tilt" },
  { value: "Overhead", labelFa: "نمای هوایی (Overhead/Bird's-eye)", labelEn: "overhead top-down drone shot, bird's-eye view" },
  { value: "Dutch Angle", labelFa: "زاویه کج (Dutch Angle)", labelEn: "Dutch angle, canted framing, dynamic tilt" }
];

const zoomLevels = [
  { value: "Medium Shot", labelFa: "مدیوم شات (Medium Shot)", labelEn: "medium shot, waist up framing" },
  { value: "Close-up", labelFa: "کلوزآپ (Close-up)", labelEn: "close-up, intimate framing" },
  { value: "Extreme Close-up", labelFa: "اکستریم کلوزآپ (Extreme Close-up)", labelEn: "extreme close-up, macro detail" },
  { value: "Wide Shot", labelFa: "واید شات (Wide Shot)", labelEn: "wide shot, full body, contextual scene" },
  { value: "Extreme Wide Shot", labelFa: "اکستریم واید (Extreme Wide)", labelEn: "extreme wide panoramic shot, vast scenery" }
];

const lensTypes = [
  { value: "Standard 50mm", labelFa: "لنز ۵۰ میلی‌متری (Standard)", labelEn: "shot on 50mm lens, natural perspective" },
  { value: "Wide Angle 24mm", labelFa: "لنز واید ۲۴ میلی‌متری (Wide)", labelEn: "shot on 24mm wide-angle lens, expansive view" },
  { value: "Telephoto 85mm", labelFa: "تله‌فوتو ۸۵ میلی‌متری (Telephoto)", labelEn: "shot on 85mm telephoto lens, compressed background" },
  { value: "Macro Lens", labelFa: "لنز ماکرو (Macro)", labelEn: "shot on macro lens, microscopic details" },
  { value: "Fisheye", labelFa: "چشم ماهی (Fisheye)", labelEn: "fisheye lens distortion, spherical perspective" }
];

const detailsList = [
  { value: "None", labelFa: "ساده و سریع", labelEn: "" },
  { value: "Unreal Engine 5", labelFa: "موتور آنریل‌انجین ۵ و لومن", labelEn: "rendered in Unreal Engine 5, Lumen global illumination, real-time CGI" },
  { value: "Octane Render & Ray Tracing", labelFa: "رندر اکتان سه‌بعدی با رهگیری نور", labelEn: "smooth Octane Render, raytraced hyper-surface reflection details" },
  { value: "70mm IMAX Capture", labelFa: "فیلمبرداری آی‌مکس ۷۰ میلیمتری", labelEn: "shot on IMAX 70mm camera film, extremely detailed cinematic fidelity" },
  { value: "Highly Detailed 8K UHD", labelFa: "کیفیت ذرات ۸کی با بافت عمیق", labelEn: "intricate textures, ultra realistic 8k resolution, crisp detail edge" }
];

const aspectRatios = [
  { value: "1:1", label: "مربع (1:1)", tag: "--ar 1:1", desc: "پرتره اینستاگرام و آواتار" },
  { value: "16:9", label: "سینمایی (16:9)", tag: "--ar 16:9", desc: "منظره، تصویر زمینه و یوتیوب" },
  { value: "9:16", label: "عمودی (9:16)", tag: "--ar 9:16", desc: "استوری موبایل و تیک‌تاک" },
  { value: "4:3", label: "کلاسیک (4:3)", tag: "--ar 4:3", desc: "عکاسی قدیمی و مانیتور" },
  { value: "3:4", label: "پوستر (3:4)", tag: "--ar 3:4", desc: "پوستر چاپی و گالری هنری" }
];

export default function App() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("prompt_factory_auth") === "true";
  });
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const VALID_PASSWORDS = [
    "AtdT5|xW&W4",
    "APofis643hzaCxz",
    "Oz4$;+$fhstu",
    "Piplvd3vh4hk",
    "#4&fyhDdshfvhr",
    "#&6fes#4fjjkkgfh"
  ];

  const handleAuthenticate = () => {
    const inputPassword = password.trim();
    if (VALID_PASSWORDS.includes(inputPassword)) {
      setIsAuthenticated(true);
      localStorage.setItem("prompt_factory_auth", "true");
      setPasswordError("");
    } else {
      setPasswordError("رمز عبور وارد شده نادرست است. لطفاً مجدداً تلاش کنید.");
    }
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("prompt_factory_auth");
    setPassword("");
  };

  // Inputs state
  const [promptType, setPromptType] = useState<"image" | "video" | "text">("image");
  const [subject, setSubject] = useState("");
  const [style, setStyle] = useState(styles[0].value);
  const [lighting, setLighting] = useState(lightings[0].value);
  const [mood, setMood] = useState(colorPalettes[0].value);
  const [camera, setCamera] = useState(cameras[0].value);
  const [cameraAngle, setCameraAngle] = useState(cameraAngles[0].value);
  const [zoomLevel, setZoomLevel] = useState(zoomLevels[0].value);
  const [lensType, setLensType] = useState(lensTypes[0].value);
  const [artist, setArtist] = useState(artists[0].value);
  const [octane, setOctane] = useState(detailsList[0].value);
  const [aspect, setAspect] = useState("1:1");

  // Midjourney export formatting checkboxes
  const [midjourneyAr, setMidjourneyAr] = useState(true);
  const [midjourneyV6, setMidjourneyV6] = useState(false);

  // Status state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMess, setErrorMess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"builder" | "history">("builder");

  // Generated Result
  const [result, setResult] = useState<PromptResult | null>(null);

  // History state
  const [history, setHistory] = useState<PromptHistoryItem[]>([]);

  // Clipboard feedbacks
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: string, text: string}[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatMessagesEndRef = React.useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isChatOpen]);

  const handleSendChatMessage = async () => {
    if (!chatMessage.trim() || isChatLoading) return;
    
    const newMessage = chatMessage;
    setChatMessage("");
    
    // Add user message to history optimistically
    const currentHistory = [...chatHistory];
    const updatedHistory = [...currentHistory, { role: "user", text: newMessage }];
    
    setChatHistory(updatedHistory);
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage, history: currentHistory })
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      
      let aiResponseText = "";
      setChatHistory([...updatedHistory, { role: "model", text: "" }]);

      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.substring(6);
              if (dataStr === "[DONE]") break;
              try {
                const dataObj = JSON.parse(dataStr);
                if (dataObj.text) {
                  aiResponseText += dataObj.text;
                  setChatHistory(prev => {
                    const next = [...prev];
                    next[next.length - 1].text = aiResponseText;
                    return next;
                  });
                } else if (dataObj.error) {
                    throw new Error(dataObj.error);
                }
              } catch(e) {}
            }
          }
        }
      }
    } catch (e: any) {
      console.error(e);
      setChatHistory(prev => {
        const next = [...prev];
        if (next[next.length - 1].role === "model") {
           next[next.length - 1].text = "متاسفانه خطایی در ارتباط با سرور پیش آمد.";
        } else {
           next.push({ role: "model", text: "متاسفانه خطایی در ارتباط با سرور پیش آمد." });
        }
        return next;
      });
    }
    setIsChatLoading(false);
  };

  // Load history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("prompt_factory_history");
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse history template", e);
      }
    }
  }, []);

  // Sync state values when promptType switches to ensure matching defaults
  useEffect(() => {
    if (promptType === "image") {
      setStyle(styles[0].value);
      setLighting(lightings[0].value);
      setMood(colorPalettes[0].value);
      setCamera(cameras[0].value);
      setCameraAngle(cameraAngles[0].value);
      setZoomLevel(zoomLevels[0].value);
      setLensType(lensTypes[0].value);
      setArtist(artists[0].value);
      setOctane(detailsList[0].value);
    } else if (promptType === "video") {
      setStyle(styles[0].value);
      setLighting(lightings[0].value);
      setMood(colorPalettes[0].value);
      setCamera(cameraMotions[0].value);
      setArtist(videoPaces[0].value);
      setOctane(videoEngines[0].value);
    } else {
      setStyle(textPersonas[0].value);
      setLighting(""); // ignored/not rendered in text
      setMood(textTones[0].value);
      setCamera(textAudiences[0].value);
      setArtist("");
      setOctane(textFormats[0].value);
    }
    // Smoothly clear previous query response to avoid displaying outdated content
    setResult(null);
    setErrorMess(null);
  }, [promptType]);

  // Save history helper
  const saveToHistory = (newResult: PromptResult, req: PromptRequest) => {
    const newItem: PromptHistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }),
      request: { ...req, type: promptType },
      result: newResult
    };
    const updated = [newItem, ...history].slice(0, 20); // Keep last 20 elements
    setHistory(updated);
    localStorage.setItem("prompt_factory_history", JSON.stringify(updated));
  };

  // Delete from history
  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem("prompt_factory_history", JSON.stringify(updated));
  };

  // Pure Client-side Dynamic Generator Algorithm (Instantaneous Pre-Optimization strategy)
  // Ensures that even offline or without Gemini registered, the user has a super pristine engineered prompt
  const generateInstantLocalPrompt = (): PromptResult => {
    // 1. VIDEO Fallback
    if (promptType === "video") {
      const selectedStyleObj = styles.find(s => s.value === style) || styles[0];
      const selectedLightingObj = lightings.find(l => l.value === lighting) || lightings[0];
      const selectedPaletteObj = colorPalettes.find(p => p.value === mood) || colorPalettes[0];
      const selectedMotionObj = cameraMotions.find(c => c.value === camera) || cameraMotions[0];
      const selectedPaceObj = videoPaces.find(p => p.value === artist) || videoPaces[0];
      const selectedEngineObj = videoEngines.find(e => e.value === octane) || videoEngines[0];

      const parts = [
        `[Video Action Subject: ${subject}]`,
        `[Visual Paradigm Style: ${selectedStyleObj?.labelEn || "Cinematic"}]`,
        `[Lighting Profile: ${selectedLightingObj?.labelEn || "Ambient"}]`,
        `[Color Harmony Swatch: ${selectedPaletteObj?.labelEn || "Vibrant"}]`,
        `[Camera Motion Flow: ${selectedMotionObj?.value || "Dynamic drift"}]`,
        `[Motion Pacing: ${selectedPaceObj?.value || "Standard"}]`,
        `[Rendering Physics Simulation: ${selectedEngineObj?.value || "High-End Video Resolver"}]`
      ];

      return {
        translatedSubject: subject,
        optimizedPrompt: parts.join(", ") + ", high-coherency temporal physics, seamless video transitions, pristine simulated movement --no static image, text captions, logo overlays, warped arms, duplicate figures, jarring focal shift, pixelated shadow artifacts",
        variations: [
          {
            styleNameFa: "سرعت آهسته دراماتیک با عمق میدان بالا",
            styleNameEn: "Dramatic High-Speed Slow-Motion 60fps",
            prompt: `Cinematic dynamic movement of ${subject}, captured in 60fps slow-motion, floating ambient embers, close-up tracking shot, photorealistic video simulation --no blur, stutter, cuts`
          },
          {
            styleNameFa: "انیمیشن خمیری خلاقانه استاپ‌موشن",
            styleNameEn: "Handcrafted Stop-Motion Claymation Scene",
            prompt: `Claymation style fluid video showing ${subject}, miniature set details, keyframe dynamic movements, detailed clay texture and cute motion --no hyperrealism, modern UI, text`
          }
        ],
        engineeringExplanation: "توضیحات لوکال کلاینت: پرامپت ویدیویی به لایه‌بندی کارگردانی دوربین، موتور شبیه‌ساز فیزیک و فریم‌ریت تقسیم شد تا فاقد پریدگی فریم یا تغییر شکل‌های ناگهانی کاراکتر باشد."
      };
    }

    // 2. TEXT Fallback
    if (promptType === "text") {
      const selectedPersonaObj = textPersonas.find(p => p.value === style) || textPersonas[0];
      const selectedToneObj = textTones.find(t => t.value === mood) || textTones[0];
      const selectedAudienceObj = textAudiences.find(a => a.value === camera) || textAudiences[0];
      const selectedFormatObj = textFormats.find(f => f.value === octane) || textFormats[0];

      return {
        translatedSubject: subject,
        optimizedPrompt: `<role>\nYou are a professional AI persona configured as: ${selectedPersonaObj?.value || "Expert general assistant"}.\nYour core task is to assist the user with: ${subject}.\n</role>\n\n<instructions>\n- Deliver the response strictly using the tone of: ${selectedToneObj?.value || "professional objective"}.\n- Match your explanation level for the target audience: ${selectedAudienceObj?.value || "advanced industry expert"}.\n- Outline your reasoning step-by-step prior to writing the final code or guidelines.\n- STRICLTY AVOID: conversational small talk, boilerplate introduction pleasantries, generic conclusions like 'In summary', fabricating unverified facts.\n</instructions>\n\n<output-format>\n${selectedFormatObj?.value || "Structured Markdown format with clean code headers"}\n</output-format>`,
        variations: [
          {
            styleNameFa: "استراتژیست بی‌رحم و خلاصه کاربردی",
            styleNameEn: "High-impact Strategic Briefing Vibe",
            prompt: `You are an elite business strategist. Give me a hyper-condensed roadmap regarding ${subject}. Strict bullet-points. No fluff. ROI focused. No conversational intros.`
          },
          {
            styleNameFa: "جلسه عیب‌یابی مربی سقراطی تعاملی",
            styleNameEn: "Interactive Socratic Tutor",
            prompt: `You are a patient Socratic mentor. Do not answer directly. Prompt me with 2-3 brilliant questions first regarding ${subject} to help me figure out the underlying principles myself. Avoid explaining the answers.`
          }
        ],
        engineeringExplanation: "توضیحات لوکال کلاینت: دستور اجرای متنی در قالب برچسب‌های متادیتا نظیر roleb و instructions پیکربندی شد تا سدی نفوذناپذیر در برابر گپ و گفت‌های طولانی و حاشیه رفتن هوش مصنوعی ایجاد کند."
      };
    }

    // 3. IMAGE Fallback (Default)
    const selectedStyleObj = styles.find(s => s.value === style) || styles[0];
    const selectedLightingObj = lightings.find(l => l.value === lighting) || lightings[0];
    const selectedMoodObj = colorPalettes.find(m => m.value === mood) || colorPalettes[0];
    const selectedCameraObj = cameras.find(c => c.value === camera) || cameras[0];
    const selectedCameraAngleObj = cameraAngles.find(c => c.value === cameraAngle) || cameraAngles[0];
    const selectedZoomLevelObj = zoomLevels.find(z => z.value === zoomLevel) || zoomLevels[0];
    const selectedLensTypeObj = lensTypes.find(l => l.value === lensType) || lensTypes[0];
    const selectedArtistObj = artists.find(a => a.value === artist) || artists[0];
    const selectedDetailObj = detailsList.find(d => d.value === octane) || detailsList[0];

    // Dynamic clean translation logic for simple inputs
    let translated = subject.trim();
    const fallbackDict: Record<string, string> = {
      "اژدها": "mythical fire-breathing golden dragon",
      "گربه": "adorable fluffy kitten",
      "فضا": "outer nebula space cosmic background",
      "جنگل": "mystical emerald forest",
      "مرد": "charming wise old man portrait",
      "زن": "elegant beautiful woman portrait",
      "کوهستان": "snowy mountain peak landscape",
      "ماشین": "sleek futuristic solar cyberpunk sports car",
      "خانه": "fairy tale wooden cottage",
      "آسمان": "stellar mesmerizing starry cosmic sky"
    };

    for (const [fa, en] of Object.entries(fallbackDict)) {
      if (translated.toLowerCase().includes(fa)) {
        translated = translated.replace(new RegExp(fa, "g"), en);
      }
    }

    const partsArray: string[] = [];
    partsArray.push(`[Subject: ${translated}]`);

    if (selectedStyleObj) partsArray.push(`[Style: ${selectedStyleObj.labelEn}]`);
    if (selectedLightingObj) partsArray.push(`[Lighting: ${selectedLightingObj.labelEn}]`);
    if (selectedMoodObj) partsArray.push(`[Color Palette: ${selectedMoodObj.labelEn}]`);
    if (selectedCameraAngleObj) partsArray.push(`[Camera Angle: ${selectedCameraAngleObj.labelEn}]`);
    if (selectedZoomLevelObj) partsArray.push(`[Zoom Level: ${selectedZoomLevelObj.labelEn}]`);
    if (selectedLensTypeObj) partsArray.push(`[Lens Type: ${selectedLensTypeObj.labelEn}]`);
    if (selectedArtistObj && selectedArtistObj.value !== "None") partsArray.push(`[Artist Inspired: ${selectedArtistObj.labelEn}]`);
    if (selectedDetailObj && selectedDetailObj.value !== "None") partsArray.push(`[Rendering Engine: ${selectedDetailObj.labelEn}]`);

    partsArray.push("masterpiece", "high quality", "hyper detailed", "trending on artstation");

    const engineeredPrompt = partsArray.join(", ") + " --no blurry, out of focus, duplicate, mutated limbs, ugly, extra fingers, crop, low resolution, jpeg compression artifact, text, watermark, signature";

    const localVariations = [
      {
        styleNameFa: "پرتره تاریک و دراماتیک",
        styleNameEn: "Dramatic High-Contrast Portrait Vibe",
        prompt: `Cinematic dramatic portrait of ${translated}, sharp focus, dark background, intense side lighting, photography aesthetic, cinematic mood, photorealism --no cartoon, illustration, bright colorful, flat`
      },
      {
        styleNameFa: "نقاشی فانتزی رویایی",
        styleNameEn: "Ethereal Dreamlike Watercolor Matte",
        prompt: `Ethereal dreamy fantasy illustration of ${translated}, floating magic sparkles, pastel color palette, soft glowing dust, digital painting, storybook cover, highly artistic --no realism, 3d, photorealistic, dark lighting`
      },
      {
        styleNameFa: "رندر سه‌بعدی آنریل‌انجین ۵",
        styleNameEn: "Vibrant Unreal Engine 5 Scene",
        prompt: `Hyper realistic scenery depicting ${translated}, Unreal Engine 5 render, raytracing details, extreme spatial depth, global illumination, dramatic light, game asset model --no 2d, painting, sketch, low poly, bad modeling`
      }
    ];

    return {
      translatedSubject: translated,
      optimizedPrompt: engineeredPrompt,
      variations: localVariations,
      engineeringExplanation: "توضیحات مهندسی سریع کلاینت: این پرامپت با تکنیک ساختارمند لایه‌ای سازماندهی شده است. سوژه اصلی، سپس لایه پالت نوری، کادر عکاسی و فاکتورهای فنی جهت دریافت بالاترین بازخورد از پردازنده‌های تصویرساز نظیر Midjourney اضافه گردید."
    };
  };

  // Send request to Gemini server
  const handleAIEngineering = async () => {
    if (!subject || subject.trim() === "") {
      setErrorMess("لطفاً موضوع اصلی را در فیلد مربوطه وارد کنید.");
      return;
    }

    setIsLoading(true);
    setErrorMess(null);

    const currentReq: PromptRequest = {
      subject,
      style,
      lighting,
      mood,
      camera,
      ...(promptType === "image" && { cameraAngle, zoomLevel, lensType }),
      aspect,
      artist,
      octane,
      type: promptType
    };

    try {
      const resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentReq)
      });

      if (!resp.ok) {
        const errPayload = await resp.json().catch(() => ({}));
        throw new Error(errPayload.error || "سرور در ارتقای پرامپت با شکست مواجه شد.");
      }

      const backendResult = await resp.json() as PromptResult;
      setResult(backendResult);
      saveToHistory(backendResult, currentReq);
    } catch (err: any) {
      console.warn("AI optimization failed, fallback to high-end local prompt constructor", err);
      // Fallback elegantly
      const fallbackResult = generateInstantLocalPrompt();
      setResult(fallbackResult);
      saveToHistory(fallbackResult, currentReq);
      setErrorMess("کلید اختصاصی جمینای یافت نشد یا در حالت لوکال متصل است. پرامپت شما به صورت فوری با فرمول‌های بومی پلتفرم پردازش شد!");
    } finally {
      setIsLoading(false);
    }
  };

  // Copy text handler with parameters
  const getProcessedPromptText = (baseText: string) => {
    let finalPrompt = baseText;
    
    // Check ratio
    if (promptType === "image" && midjourneyAr) {
      const foundRatio = aspectRatios.find(r => r.value === aspect);
      if (foundRatio) {
        finalPrompt += ` ${foundRatio.tag}`;
      }
    }

    // Check v6
    if (promptType === "image" && midjourneyV6) {
      finalPrompt += " --v 6.0";
    }

    // Backwards compatibility for old history items
    if (result?.negativePrompt && promptType !== "text" && !finalPrompt.includes("--no")) {
      finalPrompt += ` --no ${result.negativePrompt}`;
    }

    return finalPrompt;
  };

  const copyToClipboard = (text: string, sectionId: string) => {
    const finalVal = getProcessedPromptText(text);
    navigator.clipboard.writeText(finalVal).then(
      () => {
        setCopiedSection(sectionId);
        setTimeout(() => setCopiedSection(null), 2000);
      },
      (err) => {
        console.error("Failed to copy", err);
      }
    );
  };

  // Reset helper
  const handleReset = () => {
    setSubject("");
    setAspect("1:1");
    setResult(null);
    setErrorMess(null);
    if (promptType === "image") {
      setStyle(styles[0].value);
      setLighting(lightings[0].value);
      setMood(colorPalettes[0].value);
      setCamera(cameras[0].value);
      setCameraAngle(cameraAngles[0].value);
      setZoomLevel(zoomLevels[0].value);
      setLensType(lensTypes[0].value);
      setArtist(artists[0].value);
      setOctane(detailsList[0].value);
    } else if (promptType === "video") {
      setStyle(styles[0].value);
      setLighting(lightings[0].value);
      setMood(colorPalettes[0].value);
      setCamera(cameraMotions[0].value);
      setArtist(videoPaces[0].value);
      setOctane(videoEngines[0].value);
    } else {
      setStyle(textPersonas[0].value);
      setMood(textTones[0].value);
      setCamera(textAudiences[0].value);
      setOctane(textFormats[0].value);
    }
  };

  const loadHistoryItem = (item: PromptHistoryItem) => {
    const req = item.request;
    setSubject(req.subject);
    
    // Set promptType first so the state matches the parameters properly
    const newType = req.type || "image";
    setPromptType(newType);

    setStyle(req.style);
    setLighting(req.lighting);
    setMood(req.mood);
    setCamera(req.camera);
    if (newType === "image") {
      setCameraAngle(req.cameraAngle || cameraAngles[0].value);
      setZoomLevel(req.zoomLevel || zoomLevels[0].value);
      setLensType(req.lensType || lensTypes[0].value);
    }
    setAspect(req.aspect || "1:1");
    setArtist(req.artist);
    setOctane(req.octane);
    setResult(item.result);
    setActiveTab("builder");
    // Show quick feedback scroll animation to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-[92vh] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden" dir="rtl">
        {/* Ambient neon decorative background lights in brand teal */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-950/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-950/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md space-y-8 relative z-10 text-center">
          
          {/* Minimalist modern branding with original clean layout */}
          <div className="space-y-4 flex flex-col items-center">
            <div className="inline-flex items-center justify-center p-4 bg-cyan-950/30 border border-cyan-500/30 rounded-3xl shadow-[0_0_40px_rgba(0,90,135,0.2)] animate-pulse">
              <Sparkles className="w-10 h-10 text-cyan-400" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight font-display bg-gradient-to-r from-cyan-400 via-[#005a87] to-cyan-200 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(0,90,135,0.3)] pb-1">
                کارخانه پرامپ 🏭
              </h1>
              <p className="text-gray-400 text-sm font-medium">
                رمز عبور را وارد کنید
              </p>
            </div>
          </div>

          {/* Clean Glassmorphic Input Area */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="p-6 rounded-3xl glass backdrop-blur-xl border border-cyan-500/20 shadow-2xl space-y-5 text-right"
          >
            <div className="space-y-2">
              <label className="text-xs text-cyan-300/80 font-bold block mb-1">
                رمز عبور دسترسی
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="رمز عبور خود را وارد کنید..."
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAuthenticate();
                    }
                  }}
                  className="w-full glass-input rounded-2xl py-3.5 px-4 pl-12 text-center text-sm font-bold tracking-widest placeholder:tracking-normal placeholder:text-gray-500 transition-all border border-cyan-900/40 text-white focus:outline-none focus:border-cyan-500"
                  autoFocus
                />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[10px] font-bold text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-lg transition cursor-pointer select-none"
                >
                  {showPassword ? "مخفی" : "نمایش"}
                </button>
              </div>
            </div>

            {passwordError && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-xs text-red-400 font-bold text-center"
              >
                {passwordError}
              </motion.p>
            )}

            <button
              onClick={handleAuthenticate}
              className="w-full glass-btn py-3 px-4 rounded-2xl font-extrabold text-xs tracking-wide transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>ورود به میز کار</span>
              <Wand2 className="w-4 h-4 text-cyan-200" />
            </button>
          </motion.div>

          {/* Underneath Glassmorphic Box for "خرید اشتراک vip" */}
          <motion.a
            href="https://eitaa.com/joinchat/3159885468Ceb753a4e83"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="group glass-capsule p-4.5 rounded-2xl border border-cyan-500/30 bg-cyan-950/15 shadow-xl cursor-pointer hover:border-cyan-400/50 hover:bg-cyan-950/25 transition-all active:scale-[0.98] text-right block"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-400/10 border border-yellow-400/30 rounded-xl text-yellow-400">
                  <Star className="w-4 h-4 fill-yellow-400/80" />
                </div>
                <div className="text-right">
                  <h3 className="text-xs font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors">
                    خرید اشتراک vip
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                    دسترسی نامحدود و ارتقای فرمول‌های هوش مصنوعی با پر سرعت‌ترین سرورها
                  </p>
                </div>
              </div>
              
              <span className="text-[10px] text-cyan-300 font-bold group-hover:translate-x-[-3px] transition-transform flex items-center gap-0.5 whitespace-nowrap min-w-fit">
                عضویت در کانال ایتا
                <ChevronLeft className="w-4.5 h-4.5" />
              </span>
            </div>
          </motion.a>

        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 md:py-12" dir="rtl">
      {/* Dynamic Cosmic Stars and Neon Floating Accents in brand colors */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-950/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 right-10 w-80 h-80 bg-blue-950/25 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="glass rounded-3xl overflow-hidden shadow-2xl border border-cyan-900/40 relative z-10">
        
        {/* Glowing Neon Header */}
        <div className="p-6 md:p-8 bg-gradient-to-b from-cyan-950/40 via-cyan-900/10 to-transparent border-b border-cyan-950/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-950/30 border border-cyan-500/25 rounded-2xl shadow-[0_0_20px_rgba(0,90,135,0.15)] animate-pulse">
              <Sparkles className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 id="app-title" className="text-2xl md:text-3xl font-extrabold tracking-tight mb-1 font-display bg-gradient-to-r from-cyan-400 to-cyan-200 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(0,90,135,0.3)]">
                کارخانه پرامپت 🏭
              </h1>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3">
            <div className="flex bg-cyan-950/60 p-1 rounded-xl border border-cyan-800/20">
              <button
                onClick={() => setActiveTab("builder")}
                className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition cursor-pointer ${
                  activeTab === "builder"
                    ? "bg-[#005A87] text-white shadow-lg shadow-cyan-950/40"
                    : "text-cyan-200 hover:text-white"
                }`}
              >
                میز کار بهینه‌سازی
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "history"
                    ? "bg-[#005A87] text-white shadow-lg shadow-cyan-950/40"
                    : "text-cyan-200 hover:text-white"
                }`}
              >
                تاریخچه خلاقیت
                {history.length > 0 && (
                  <span className="bg-cyan-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-mono">
                    {history.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Screens */}
        <div className="p-6 md:p-8">
          
          <AnimatePresence mode="wait">
            {activeTab === "builder" ? (
              <motion.div
                key="builder"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                
                {/* 1. LEFT SIDE: Inputs Panel */}
                <div className="lg:col-span-6 space-y-6">

                  {/* Multi-mode Prompt Type Pills Selection */}
                  <div className="flex glass-capsule p-1 rounded-2xl gap-2">
                    <button
                      type="button"
                      onClick={() => setPromptType("image")}
                      className={`flex-1 py-3 px-2 rounded-xl text-[10px] md:text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        promptType === "image"
                          ? "glass-btn"
                          : "text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      <Paintbrush className="w-3.5 h-3.5" />
                      <span>مهندسی عکس</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPromptType("video")}
                      className={`flex-1 py-3 px-2 rounded-xl text-[10px] md:text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        promptType === "video"
                          ? "glass-btn"
                          : "text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>سناریو ویدیو</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPromptType("text")}
                      className={`flex-1 py-3 px-2 rounded-xl text-[10px] md:text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        promptType === "text"
                          ? "glass-btn"
                          : "text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>فرمان متنی (LLM)</span>
                    </button>
                  </div>
                  
                  {/* Subject input field */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-bold text-gray-200 flex items-center gap-1.5">
                        {promptType === "image" && (
                          <>
                            <Paintbrush className="w-4 h-4 text-purple-400" />مجموعه یا سوژه اصلی تصویر:
                          </>
                        )}
                        {promptType === "video" && (
                          <>
                            <Video className="w-4 h-4 text-purple-400" />سوژه حرکتی یا سناریوی متحرک ویدیو:
                          </>
                        )}
                        {promptType === "text" && (
                          <>
                            <Sparkles className="w-4 h-4 text-purple-400" />وظیفه، پرسش یا مأموریت چت‌بات:
                          </>
                        )}
                      </label>
                      <span className="text-[10px] text-purple-400 bg-purple-950/80 py-0.5 px-2 rounded-full font-mono">
                        فارسی یا انگلیسی
                      </span>
                    </div>
                      <textarea
                        id="subject-input"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder={
                          promptType === "image"
                            ? "سوژه خود را با جزئیات توصیف کنید... (مثال: یک اژدهای طلایی بر فراز قله‌های برفی تحت نور خورشید)"
                            : promptType === "video"
                            ? "حرکت و سناریوی ویدیو را توصیف کنید... (مثال: راه رفتن فضانورد روی خاک مریخ در زاویه چرخشی با سرعت اسلوموشن)"
                            : "وظیفه یا سوال تخصصی خود را بنویسید... (مثال: کلاس کلاینت گرید درجا برای دریافت اطلاعات از وب‌سرویس تایپ‌اسکریپت)"
                        }
                        className="w-full h-24 p-4 rounded-xl glass-capsule text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm resize-none"
                      />
                  </div>

                  {/* Main modifiers grid conditionally rendered based on promptType */}
                  {promptType === "image" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Art Style */}
                      <div>
                        <label className="block mb-2 text-xs font-bold text-gray-300 flex items-center gap-1">
                          <Sliders className="w-3.5 h-3.5 text-purple-400" />
                          سبک هنری (Art Style):
                        </label>
                        <select
                          id="style-select"
                          value={style}
                          onChange={(e) => setStyle(e.target.value)}
                          className="w-full p-3 rounded-xl glass-capsule text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 text-xs"
                        >
                          {styles.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.labelFa}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Lighting */}
                      <div>
                        <label className="block mb-2 text-xs font-bold text-gray-300 flex items-center gap-1">
                          <Sun className="w-3.5 h-3.5 text-purple-400" />
                          نورپردازی (Lighting):
                        </label>
                        <select
                          id="lighting-select"
                          value={lighting}
                          onChange={(e) => setLighting(e.target.value)}
                          className="w-full p-3 rounded-xl glass-capsule text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 text-xs"
                        >
                          {lightings.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.labelFa}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Mood -> Color Palette mapping */}
                      <div>
                        <label className="block mb-2 text-xs font-bold text-gray-300 flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-purple-400" />
                          پالت رنگی صحنه (Color Palette):
                        </label>
                        <select
                          id="mood-select"
                          value={mood}
                          onChange={(e) => setMood(e.target.value)}
                          className="w-full p-3 rounded-xl glass-capsule text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 text-xs"
                        >
                          {colorPalettes.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.labelFa}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Camera Angle */}
                      <div>
                        <label className="block mb-2 text-xs font-bold text-gray-300 flex items-center gap-1">
                          <Camera className="w-3.5 h-3.5 text-purple-400" />
                          زاویه دوربین (Camera Angle):
                        </label>
                        <select
                          id="camera-angle-select"
                          value={cameraAngle}
                          onChange={(e) => setCameraAngle(e.target.value)}
                          className="w-full p-3 rounded-xl glass-capsule text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 text-xs"
                        >
                          {cameraAngles.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.labelFa}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Zoom Level */}
                      <div>
                        <label className="block mb-2 text-xs font-bold text-gray-300 flex items-center gap-1">
                          <Camera className="w-3.5 h-3.5 text-purple-400" />
                          میدان دید (Zoom Level):
                        </label>
                        <select
                          id="zoom-level-select"
                          value={zoomLevel}
                          onChange={(e) => setZoomLevel(e.target.value)}
                          className="w-full p-3 rounded-xl glass-capsule text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 text-xs"
                        >
                          {zoomLevels.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.labelFa}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Lens Type */}
                      <div>
                        <label className="block mb-2 text-xs font-bold text-gray-300 flex items-center gap-1">
                          <Camera className="w-3.5 h-3.5 text-purple-400" />
                          نوع لنز (Lens Type):
                        </label>
                        <select
                          id="lens-type-select"
                          value={lensType}
                          onChange={(e) => setLensType(e.target.value)}
                          className="w-full p-3 rounded-xl glass-capsule text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 text-xs"
                        >
                          {lensTypes.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.labelFa}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {promptType === "video" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Video cinematic visual style selector */}
                      <div>
                        <label className="block mb-2 text-xs font-bold text-gray-300 flex items-center gap-1">
                          <Sliders className="w-3.5 h-3.5 text-purple-400" />
                          سبک بصری ویدیو (Video Style):
                        </label>
                        <select
                          id="video-style-select"
                          value={style}
                          onChange={(e) => setStyle(e.target.value)}
                          className="w-full p-3 rounded-xl glass-capsule text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 text-xs"
                        >
                          {styles.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.labelFa}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Video lighting */}
                      <div>
                        <label className="block mb-2 text-xs font-bold text-gray-300 flex items-center gap-1">
                          <Sun className="w-3.5 h-3.5 text-purple-400" />
                          نورپردازی فضای ویدیو (Lighting):
                        </label>
                        <select
                          id="video-lighting-select"
                          value={lighting}
                          onChange={(e) => setLighting(e.target.value)}
                          className="w-full p-3 rounded-xl glass-capsule text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 text-xs"
                        >
                          {lightings.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.labelFa}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Video color palette */}
                      <div>
                        <label className="block mb-2 text-xs font-bold text-gray-300 flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-purple-400" />
                          پالت رنگ فضای رنگ‌آمیزی ویدیو:
                        </label>
                        <select
                          id="video-palette-select"
                          value={mood}
                          onChange={(e) => setMood(e.target.value)}
                          className="w-full p-3 rounded-xl glass-capsule text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 text-xs"
                        >
                          {colorPalettes.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.labelFa}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Video camera motion direction */}
                      <div>
                        <label className="block mb-2 text-xs font-bold text-gray-300 flex items-center gap-1">
                          <Camera className="w-3.5 h-3.5 text-purple-400" />
                          حرکت و زوم متناوب دوربین (Camera Motion):
                        </label>
                        <select
                          id="video-camera-select"
                          value={camera}
                          onChange={(e) => setCamera(e.target.value)}
                          className="w-full p-3 rounded-xl glass-capsule text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 text-xs"
                        >
                          {cameraMotions.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.labelFa}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {promptType === "text" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* LLM persona role */}
                      <div>
                        <label className="block mb-2 text-xs font-bold text-gray-300 flex items-center gap-1">
                          <Sliders className="w-3.5 h-3.5 text-purple-400" />
                          نقش و پرسونای تخصصی (AI Role):
                        </label>
                        <select
                          id="text-persona-select"
                          value={style}
                          onChange={(e) => setStyle(e.target.value)}
                          className="w-full p-3 rounded-xl glass-capsule text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 text-xs"
                        >
                          {textPersonas.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.labelFa}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* LLM tone */}
                      <div>
                        <label className="block mb-2 text-xs font-bold text-gray-300 flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-purple-400" />
                          لحن و پالت ادبیاتی جواب‌دهی (Tone):
                        </label>
                        <select
                          id="text-tone-select"
                          value={mood}
                          onChange={(e) => setMood(e.target.value)}
                          className="w-full p-3 rounded-xl glass-capsule text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 text-xs"
                        >
                          {textTones.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.labelFa}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* LLM Target audience */}
                      <div>
                        <label className="block mb-2 text-xs font-bold text-gray-300 flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
                          سطح سواد مخاطب فرضی (Audience):
                        </label>
                        <select
                          id="text-audience-select"
                          value={camera}
                          onChange={(e) => setCamera(e.target.value)}
                          className="w-full p-3 rounded-xl glass-capsule text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 text-xs"
                        >
                          {textAudiences.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.labelFa}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* LLM Output Format layout */}
                      <div>
                        <label className="block mb-2 text-xs font-bold text-gray-300 flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-purple-400" />
                          ساختاربندی و فرمت خروجی (Format):
                        </label>
                        <select
                          id="text-format-select"
                          value={octane}
                          onChange={(e) => setOctane(e.target.value)}
                          className="w-full p-3 rounded-xl glass-capsule text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 text-xs"
                        >
                          {textFormats.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.labelFa}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Accordion / Advanced Options depending on promptType */}
                  {promptType !== "text" && (
                    <div className="bg-purple-950/20 p-4 rounded-2xl border border-purple-900/20 space-y-4">
                      <div className="flex items-center gap-2 text-xs font-extrabold text-purple-300 border-b border-purple-900/30 pb-2">
                        <Layers className="w-4 h-4" />
                        تنظیمات مهندسی تکمیلی (دلخواه)
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {promptType === "image" ? (
                          <>
                            {/* Artist pattern */}
                            <div>
                              <label className="block mb-1.5 text-[11px] text-gray-300">
                                الهام از امضای هنرمند (Artist):
                              </label>
                              <select
                                id="artist-select"
                                value={artist}
                                onChange={(e) => setArtist(e.target.value)}
                                className="w-full p-2.5 rounded-lg glass-capsule text-gray-300 focus:outline-none text-[11px]"
                              >
                                {artists.map((item) => (
                                  <option key={item.value} value={item.value}>
                                    {item.labelFa}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Detail Renderer */}
                            <div>
                              <label className="block mb-1.5 text-[11px] text-gray-300">
                                فناوری و موتور رندر (Details):
                              </label>
                              <select
                                id="render-select"
                                value={octane}
                                onChange={(e) => setOctane(e.target.value)}
                                className="w-full p-2.5 rounded-lg glass-capsule text-gray-300 focus:outline-none text-[11px]"
                              >
                                {detailsList.map((item) => (
                                  <option key={item.value} value={item.value}>
                                    {item.labelFa}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Video frame status/pace */}
                            <div>
                              <label className="block mb-1.5 text-[11px] text-gray-300">
                                سرعت فریم و جریان فیزیک (Pacing):
                              </label>
                              <select
                                id="video-pace-select"
                                value={artist}
                                onChange={(e) => setArtist(e.target.value)}
                                className="w-full p-2.5 rounded-lg glass-capsule text-gray-300 focus:outline-none text-[11px]"
                              >
                                {videoPaces.map((item) => (
                                  <option key={item.value} value={item.value}>
                                    {item.labelFa}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Video simulator engine */}
                            <div>
                              <label className="block mb-1.5 text-[11px] text-gray-300">
                                شبیه‌ساز و بستر محرک فیلم (Simulator):
                              </label>
                              <select
                                id="video-engine-select"
                                value={octane}
                                onChange={(e) => setOctane(e.target.value)}
                                className="w-full p-2.5 rounded-lg glass-capsule text-gray-300 focus:outline-none text-[11px]"
                              >
                                {videoEngines.map((item) => (
                                  <option key={item.value} value={item.value}>
                                    {item.labelFa}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 3. ASPECT RATIO DISPLAY PREVIEW (Conditionally hidden for text prompts) */}
                  {promptType !== "text" && (
                    <div>
                      <label className="block mb-3 text-xs font-bold text-gray-300">
                        ابعاد و کادر نهایی خروجی (Aspect Ratio):
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {aspectRatios.map((r) => {
                          const isSelected = aspect === r.value;
                          return (
                            <button
                              key={r.value}
                              type="button"
                              onClick={() => setAspect(r.value)}
                              className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-purple-600/30 border-purple-500 text-white shadow-lg shadow-purple-900/20 scale-[1.04]"
                                  : "glass-capsule text-gray-400 hover:border-purple-900/40"
                              }`}
                            >
                              {/* Proportional visual box depiction */}
                              <div
                                className={`border-2 mb-1.5 transition-all ${
                                  isSelected ? "border-purple-400" : "border-gray-500"
                                } ${
                                  r.value === "1:1" ? "w-6 h-6" : ""
                                } ${
                                  r.value === "16:9" ? "w-8 h-4.5" : ""
                                } ${
                                  r.value === "9:16" ? "w-4.5 h-8" : ""
                                } ${
                                  r.value === "4:3" ? "w-7 h-5" : ""
                                } ${
                                  r.value === "3:4" ? "w-5 h-7" : ""
                                }`}
                              />
                              <span className="text-[10px] font-bold block">{r.value}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Buttons controls */}
                  <div className="flex gap-4 pt-1">
                    <button
                      id="submit-engine"
                      type="button"
                      disabled={isLoading}
                      onClick={handleAIEngineering}
                      className="flex-1 glass-btn p-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer text-center"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>در حال ارزیابی و مهندسی پرامپت...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          <span>ارتقا و مهندسی هوشمند با هوش مصنوعی</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleReset}
                      title="پاک کردن فرم"
                      className="p-4 glass-btn rounded-xl flex items-center justify-center cursor-pointer"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Client side warn or error dialog smoothly */}
                  {errorMess && (
                    <div className="p-4 bg-purple-950/40 text-purple-300 border border-purple-800/20 rounded-xl text-xs flex items-start gap-2 animate-pulse">
                      <Info className="w-5 h-5 shrink-0 text-purple-400 mt-0.5" />
                      <div>{errorMess}</div>
                    </div>
                  )}

                  {/* Formulations Instruction block */}
                  <div className="text-[11px] text-gray-400/80 leading-relaxed bg-gray-950/30 p-4 rounded-xl space-y-2 border border-purple-950/20">
                    <div className="font-bold text-purple-400 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" />
                      فرمول طلایی ساخت پرامپت‌های مهندسی‌شده چیست؟
                    </div>
                    <div>
                      {promptType === "image" && (
                        <>
                          تصویرسازها بهترین رندرها را زمانی به شما می‌دهند که پرامپت با ترتیب لایه‌ای نوشته شده باشد:
                          <code className="block mt-1 p-2 bg-black/60 text-green-400 rounded text-[10px] font-mono dir-ltr select-all">
                            {"[سوژه و جزئیات] + [محیط و بک‌گراند] + [سبک هنری] + [نورپردازی] + [زاویه عکاسی] + [موتور رندر]"}
                          </code>
                        </>
                      )}
                      {promptType === "video" && (
                        <>
                          هوش‌های فیلمبردار برای ساخت انیمیشن پویا نیاز به همبستگی حرکات به لایه‌های کارگردانی دوربین دارند:
                          <code className="block mt-1 p-2 bg-black/60 text-green-400 rounded text-[10px] font-mono dir-ltr select-all">
                            {"[موضوع متحرک] + [سبک فیلمبرداری] + [نورپردازی صحنه] + [حرکت زاویه دوربین] + [پیسینگ فریم]"}
                          </code>
                        </>
                      )}
                      {promptType === "text" && (
                        <>
                          مدل‌های زبانی چت‌بات زمانی کدهای بی عیب و جواب‌های دقیقی به شما تحویل می‌دهند که پروسه استدلال را جدا کرده و پرسونای تخصصی تعیین کنید:
                          <code className="block mt-1 p-2 bg-black/60 text-green-400 rounded text-[10px] font-mono dir-ltr select-all">
                            {"[پرسونای تخصصی Role] + [وظیفه و محدوده Task] + [شخصیت و لحن Tone] + [دستورات خروجی Format]"}
                          </code>
                        </>
                      )}
                      هوش مصنوعی ما بصورت لایه‌ای توصیفات ساده شما را بازآفرینی می‌کند تا بالاترین خروجی را از ابزارها دریافت کنید.
                    </div>
                  </div>
                </div>

                {/* 2. RIGHT SIDE: Instant Interactive Output Screen */}
                <div id="result-workspace" className="lg:col-span-6 space-y-6">
                  
                  {result ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-6"
                    >
                      
                      {/* Sub-card 1: The Masterpiece main Output */}
                      <div className="bg-purple-950/30 rounded-2xl p-5 border border-purple-500/30 relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600/10 rounded-full blur-2xl" />
                        
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs bg-purple-950/80 px-2.5 py-1 text-purple-300 border border-purple-800/30 rounded-full font-bold">
                            فرمول مهندسی‌شده نهایی (انگلیسی)
                          </span>
                          <span className="text-[10px] text-purple-400 font-mono">
                            Masterpiece Engineered
                          </span>
                        </div>

                        {/* Midjourney Append control checks header */}
                        {promptType === "image" && (
                          <div className="mb-3 flex flex-wrap gap-3 p-2 bg-black/40 rounded-lg text-[10px] text-gray-300">
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={midjourneyAr}
                                onChange={(e) => setMidjourneyAr(e.target.checked)}
                                className="accent-purple-500 rounded"
                              />
                              اعمال مقیاس میدجرنی ({aspectRatios.find(r => r.value === aspect)?.tag})
                            </label>

                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={midjourneyV6}
                                onChange={(e) => setMidjourneyV6(e.target.checked)}
                                className="accent-purple-500 rounded"
                              />
                              بهینه‌ساز نسخه میدجرنی 6 (--v 6.0)
                            </label>
                          </div>
                        )}

                        {/* The actual primary textarea box */}
                        <div className="relative">
                          <textarea
                            readOnly
                            dir="ltr"
                            value={getProcessedPromptText(result.optimizedPrompt)}
                            className="w-full text-xs font-mono text-green-300 glass-capsule p-4 rounded-xl h-36 focus:outline-none resize-none leading-relaxed"
                          />
                          <button
                            type="button"
                            onClick={() => copyToClipboard(result.optimizedPrompt, "main")}
                            className="glass-btn absolute bottom-3 left-3 text-xs py-1.5 px-3 rounded-lg flex items-center gap-1 transition active:scale-95 cursor-pointer"
                          >
                            {copiedSection === "main" ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-green-300" />
                                <span>کپی شد!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>کپی پرامپت</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Translated summary */}
                        <div className="mt-3 text-[11px] text-gray-400 flex items-start gap-1">
                          <span className="font-bold text-purple-400 shrink-0">ترجمه به انگلیسی سوژه:</span>
                          <span className="italic dir-ltr text-left font-mono">{result.translatedSubject}</span>
                        </div>

                      </div>

                      {/* Sub-card 3: Educational Prompt Breakdown */}
                      <div className="glass-capsule p-4 rounded-xl space-y-2 flex flex-col justify-between">
                        <div>
                          <div className="text-[11px] font-bold text-purple-300 flex items-center gap-1 mb-1">
                            <Info className="w-3.5 h-3.5 text-purple-400" />
                            <span>تحلیل و چراغ راه مهندسی پرامپت</span>
                          </div>
                          <p className="text-[10px] text-gray-300 leading-relaxed max-h-24 overflow-y-auto">
                            {result.engineeringExplanation}
                          </p>
                        </div>
                        <div className="text-[9px] text-purple-400 text-left italic border-t border-purple-900/20 pt-1">
                          * پرامپت حذفی (Negative) درون ساختار خود پرامپت ادغام گردید.
                        </div>
                      </div>

                    </motion.div>
                  ) : (
                    <div className="h-full min-h-[400px] glass-capsule border-dashed rounded-2xl flex flex-col items-center justify-center p-8 text-center space-y-4">
                      <div className="p-4 bg-purple-950/40 rounded-full border border-purple-900/20 text-purple-400">
                        <Sliders className="w-8 h-8 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-200">میز کار منتظر شماست</h4>
                        <p className="text-xs text-gray-500 mt-2 max-w-sm">
                          موضوع مد نظر خود را در سمت راست بنویسید، مشخصات فنی را تنظیم کنید و روی دکمه ارتقای هوش مصنوعی کلیک کنید تا محصول نهایی فرآوری پرامپت در این فضا نقش ببندد.
                        </p>
                      </div>

                      {/* Quick structural instant generation shortcut preview */}
                      <button
                        type="button"
                        onClick={() => {
                          if (!subject) setSubject("یک عقاب طلایی در کهکشان ستاره‌ای");
                          setTimeout(() => {
                            const instantResult = generateInstantLocalPrompt();
                            setResult(instantResult);
                          }, 100);
                        }}
                        className="text-xs text-purple-400 hover:text-purple-300 underline underline-offset-4 cursor-pointer"
                      >
                        تولید آنی پیش‌نویس بدون نیاز به هوش مصنوعی (سریع)
                      </button>
                    </div>
                  )}

                </div>

              </motion.div>
            ) : (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-sm font-bold text-purple-300">لیست آخرین پرامپت‌های مهندسی‌شده شما:</h2>
                  {history.length > 0 && (
                    <button
                      onClick={() => {
                        setHistory([]);
                        localStorage.removeItem("prompt_factory_history");
                      }}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>پاک کردن کل حافظه</span>
                    </button>
                  )}
                </div>

                {history.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => loadHistoryItem(item)}
                        className="glass-capsule p-5 rounded-2xl hover:border-purple-500/50 hover:bg-purple-950/20 transition-all cursor-pointer group relative"
                      >
                        <button
                          onClick={(e) => deleteHistoryItem(item.id, e)}
                          title="حذف این آیتم"
                          className="absolute top-4 left-4 p-1 bg-red-950/20 hover:bg-red-900/40 text-red-400 rounded transition opacity-0 group-hover:opacity-100 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        
                        <div className="flex justify-between text-[11px] text-gray-500 mb-2">
                          <span className="font-mono text-xs">{item.timestamp}</span>
                          <span className="text-purple-400/80">{item.request.style}</span>
                        </div>

                        <h4 className="text-xs font-bold text-gray-200 line-clamp-2 mb-3 pr-2 border-r-2 border-purple-500">
                          {item.request.subject}
                        </h4>

                        <p className="text-[10px] text-green-300 font-mono line-clamp-3 bg-black/40 p-2.5 rounded text-left" dir="ltr">
                          {item.result.optimizedPrompt}
                        </p>

                        <div className="mt-3 flex justify-between items-center text-[10px] text-purple-300/60">
                          <span>ابعاد: {item.request.aspect}</span>
                          <span className="text-purple-400 group-hover:underline flex items-center gap-1 font-bold">
                            بارگذاری مجدد در فرمول‌ساز 
                            <ExternalLink className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-purple-900/20 rounded-2xl p-12 text-center text-gray-500 space-y-2">
                    <p className="text-xs">پیوندی در تاریخچه یافت نشد.</p>
                    <p className="text-[11px] text-purple-400/70">
                      هر پرامپتی که می‌سازید در این بخش ذخیره می‌شود تا در دفعات بعدی بتوانید مجدداً بارگذاریش کنید!
                    </p>
                  </div>
                )}

              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Footer info brand */}
        <div className="p-4 bg-black/40 text-center text-[10px] text-gray-500 border-t border-purple-950/40 relative z-10 flex items-center justify-center gap-1">
          <span>ساخته شده با عشق به عنوان ابزار کمک خلاقیت برای طراحان هوش مصنوعی</span>
          <Heart className="w-3 h-3 text-red-500 fill-red-500" />
        </div>

      </div>

      {/* Floating Chat Button */}
      <button
         onClick={() => setIsChatOpen(!isChatOpen)}
         className="fixed bottom-6 right-6 z-50 glass-btn w-14 h-14 rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:bg-purple-500/80 border-purple-400/50"
      >
         {isChatOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[350px] md:w-[400px] h-[500px] bg-gray-950/90 backdrop-blur-xl border border-purple-500/40 rounded-2xl shadow-[0_10px_40px_rgba(168,85,247,0.3)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-purple-600/30 border-b border-purple-500/20 p-4 flex items-center gap-3">
              <div className="bg-purple-500 p-2 rounded-full">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white text-sm font-bold">پشتیبانی و دستیار 🏭</h3>
                <p className="text-[10px] text-purple-200/80">ChatGPT API / آماده پاسخگویی</p>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar flex flex-col">
              {chatHistory.length === 0 ? (
                <div className="text-center text-xs text-gray-400 mt-auto mb-auto bg-gray-900/50 p-6 rounded-2xl border border-purple-900/30">
                  سلام! من پشتیبان هوشمند کارخانه پرامپت هستم. برای ساختن یا ایده‌پردازی به کمک نیاز داری؟
                </div>
              ) : (
                chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-[11px] md:text-xs leading-relaxed whitespace-pre-wrap ${msg.role === "user" ? "bg-purple-600 text-white rounded-tr-none" : "glass-capsule text-gray-200 rounded-tl-none border-purple-500/30"}`}>
                        {msg.text}
                    </div>
                  </div>
                ))
              )}
              {isChatLoading && chatHistory[chatHistory.length - 1]?.role !== "model" && (
                <div className="flex justify-end">
                  <div className="max-w-[85%] p-3 rounded-2xl text-xs glass-capsule text-gray-200 rounded-tl-none border-purple-500/30">
                    <div className="flex space-x-1 space-x-reverse items-center h-4">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatMessagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-3 bg-black/40 border-t border-purple-500/20">
               <div className="flex gap-2">
                 <input 
                   type="text" 
                   value={chatMessage}
                   onChange={e => setChatMessage(e.target.value)}
                   onKeyDown={e => e.key === "Enter" && handleSendChatMessage()}
                   placeholder="چطور مدل انیمه را تنظیم کنم؟"
                   className="flex-1 glass-input rounded-xl px-3 text-xs text-white focus:outline-none focus:border-purple-500"
                 />
                 <button 
                   onClick={handleSendChatMessage}
                   disabled={isChatLoading || !chatMessage.trim()}
                   className="glass-btn p-3 rounded-xl disabled:opacity-50 flex-shrink-0 flex items-center justify-center cursor-pointer"
                 >
                   <Send className="w-4 h-4" />
                 </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
