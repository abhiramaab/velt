const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const FRAMES_DIR = path.join(__dirname, "frames");
const OUTPUT_VIDEO = path.join(__dirname, "output", "velt_ad_feed_4x5.mp4");

if (fs.existsSync(FRAMES_DIR)) {
  fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
}
fs.mkdirSync(FRAMES_DIR, { recursive: true });

async function generateAd() {
  console.log("Launching headless Chromium...");
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/chromium",
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--font-render-hinting=none",
    ],
    defaultViewport: {
      width: 1080,
      height: 1350,
      deviceScaleFactor: 1,
    },
  });

  const page = await browser.newPage();

  // Create an engaging animated HTML ad container
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;1,600&display=swap');
  
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1080px;
    height: 1350px;
    background: #090d16;
    font-family: 'Instrument Sans', sans-serif;
    color: #ffffff;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 60px;
  }

  /* Ambient light */
  .glow {
    position: absolute;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(0, 139, 227, 0.25) 0%, rgba(124, 122, 240, 0.15) 50%, transparent 70%);
    top: -100px;
    right: -100px;
    pointer-events: none;
    filter: blur(40px);
  }

  /* Header Brand */
  .brand-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 10;
  }
  .logo {
    font-family: 'Playfair Display', serif;
    font-size: 38px;
    font-weight: 600;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .badge {
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 8px 18px;
    border-radius: 999px;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #60a5fa;
  }

  /* Hook */
  .hook {
    margin-top: 30px;
    z-index: 10;
  }
  .hook h1 {
    font-size: 52px;
    line-height: 1.15;
    font-weight: 700;
    letter-spacing: -0.03em;
    background: linear-gradient(180deg, #ffffff 40%, rgba(255,255,255,0.7) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  /* Studio Prompt Box */
  .prompt-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 24px;
    padding: 24px 30px;
    margin-top: 35px;
    backdrop-filter: blur(12px);
    z-index: 10;
  }
  .prompt-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-weight: 600;
  }
  .prompt-text {
    margin-top: 14px;
    font-size: 24px;
    line-height: 1.4;
    color: #f8fafc;
    min-height: 68px;
  }
  .cursor {
    display: inline-block;
    width: 3px;
    height: 24px;
    background: #008be3;
    margin-left: 4px;
    vertical-align: middle;
    animation: blink 0.8s infinite;
  }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

  /* Output Preview Showcase Canvas */
  .preview-wrapper {
    flex: 1;
    margin-top: 35px;
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    background: #faf7f2;
    color: #1a1a1a;
    overflow: hidden;
    position: relative;
    box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: column;
    z-index: 10;
    transition: transform 0.4s ease;
  }
  .mock-browser-header {
    background: #ebe6df;
    padding: 14px 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid #d9d2c7;
  }
  .dot { width: 12px; height: 12px; border-radius: 50%; }
  .dot-r { background: #ff5f56; }
  .dot-y { background: #ffbd2e; }
  .dot-g { background: #27c93f; }
  .browser-url {
    margin-left: 16px;
    background: #ffffff;
    border-radius: 8px;
    padding: 4px 16px;
    font-size: 13px;
    color: #78716c;
    font-family: monospace;
    width: 340px;
  }

  /* Rendered website layout inside */
  .rendered-doc {
    padding: 36px 44px;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .rendered-doc.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .render-tag {
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: #008be3;
    font-weight: 600;
  }
  .render-title {
    font-family: 'Playfair Display', serif;
    font-size: 42px;
    line-height: 1.1;
    margin-top: 10px;
    color: #18181b;
  }
  .render-sub {
    margin-top: 12px;
    font-size: 17px;
    color: #71717a;
    max-width: 580px;
    line-height: 1.5;
  }
  .render-grid {
    margin-top: 28px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  .grid-card {
    background: #ffffff;
    border: 1px solid #e4e4e7;
    border-radius: 16px;
    padding: 18px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.04);
  }
  .grid-card h4 {
    font-size: 16px;
    color: #09090b;
    font-weight: 600;
  }
  .grid-card p {
    font-size: 13px;
    color: #71717a;
    margin-top: 6px;
    line-height: 1.4;
  }

  /* Footer Call To Action */
  .cta-bar {
    margin-top: 35px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 10;
  }
  .cta-text {
    font-size: 20px;
    font-weight: 600;
    color: #e2e8f0;
  }
  .cta-sub {
    font-size: 14px;
    color: #94a3b8;
    margin-top: 2px;
  }
  .cta-button {
    background: #008be3;
    color: #ffffff;
    padding: 16px 36px;
    border-radius: 999px;
    font-weight: 700;
    font-size: 18px;
    letter-spacing: -0.01em;
    box-shadow: 0 10px 25px rgba(0, 139, 227, 0.4);
    display: flex;
    align-items: center;
    gap: 8px;
  }
</style>
</head>
<body>
  <div class="glow"></div>

  <div class="brand-bar">
    <div class="logo">
      <span>Velt</span>
    </div>
    <div class="badge">AI Design Studio</div>
  </div>

  <div class="hook">
    <h1>From prompt to live design in 8 seconds.</h1>
  </div>

  <div class="prompt-card">
    <div class="prompt-header">
      <span>✨ Prompt Input</span>
    </div>
    <div class="prompt-text"><span id="typed"></span><span class="cursor" id="cursor"></span></div>
  </div>

  <div class="preview-wrapper" id="previewBox">
    <div class="mock-browser-header">
      <div class="dot dot-r"></div>
      <div class="dot dot-y"></div>
      <div class="dot dot-g"></div>
      <div class="browser-url">https://kyotoceramics.velt.app</div>
    </div>
    <div class="rendered-doc" id="renderedDoc">
      <div class="render-tag">Ceramic Artistry // Kyoto</div>
      <h2 class="render-title">Wabi-sabi Clay &amp; Mindful Living</h2>
      <p class="render-sub">Hand-thrown stoneware baked in wood-fired kilns. Rooted in Japanese tradition, crafted for the modern home.</p>
      <div class="render-grid">
        <div class="grid-card">
          <h4>Matcha Bowls</h4>
          <p>Coarse Shigaraki clay with rich feldspar accents.</p>
        </div>
        <div class="grid-card">
          <h4>Pouring Vessels</h4>
          <p>Ergonomic stoneware designed for tea rituals.</p>
        </div>
        <div class="grid-card">
          <h4>Ikebana Vases</h4>
          <p>Sculptural forms emphasizing asymmetric balance.</p>
        </div>
      </div>
    </div>
  </div>

  <div class="cta-bar">
    <div>
      <div class="cta-text">Start creating with 40 free credits</div>
      <div class="cta-sub">Plans from $6/mo • Cancel anytime</div>
    </div>
    <div class="cta-button">
      <span>Try Velt Free →</span>
    </div>
  </div>

  <script>
    const fullText = "A quiet ceramic studio in Kyoto. Wabi-sabi, warm clay, one deep indigo accent.";
    const typedEl = document.getElementById("typed");
    const docEl = document.getElementById("renderedDoc");

    window.updateFrame = function(progress) {
      // Phase 1 (0 to 0.45): Typing animation
      if (progress < 0.45) {
        const textProgress = progress / 0.45;
        const charCount = Math.floor(textProgress * fullText.length);
        typedEl.textContent = fullText.slice(0, charCount);
        docEl.classList.remove("visible");
      } 
      // Phase 2 (0.45 to 1.0): Reveal design layout
      else {
        typedEl.textContent = fullText;
        docEl.classList.add("visible");
      }
    };
  </script>
</body>
</html>
  `;

  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const TOTAL_FRAMES = 60; // 60 frames = 4 seconds at 15fps (or 2 seconds at 30fps)
  console.log(`Rendering ${TOTAL_FRAMES} frames...`);

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const progress = i / (TOTAL_FRAMES - 1);
    await page.evaluate((p) => window.updateFrame(p), progress);
    const framePath = path.join(FRAMES_DIR, `frame_${String(i).padStart(4, "0")}.png`);
    await page.screenshot({ path: framePath });
  }

  await browser.close();
  console.log("Frames captured successfully.");

  // Stitch frames into MP4 with FFmpeg
  console.log("Encoding MP4 video using FFmpeg...");
  const ffmpegCmd = `ffmpeg -y -framerate 15 -i "${FRAMES_DIR}/frame_%04d.png" -c:v libx264 -pix_fmt yuv420p -movflags +faststart "${OUTPUT_VIDEO}"`;
  execSync(ffmpegCmd, { stdio: "inherit" });

  console.log(`Video created successfully at: ${OUTPUT_VIDEO}`);
}

generateAd().catch((err) => {
  console.error("Error generating ad:", err);
  process.exit(1);
});
