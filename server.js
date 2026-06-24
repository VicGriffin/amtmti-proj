/* eslint-disable @typescript-eslint/no-require-imports */
const { createServer } = require("http");
const next = require("next");
const { parse } = require("url");
const path = require("path");
const fs = require("fs");

// Load environment variables if .env.local exists
const envPath = path.join(__dirname, ".env.local");
if (fs.existsSync(envPath)) {
  try {
    require("dotenv").config({ path: envPath });
  } catch {
    // dotenv not installed, that's ok - env vars can be set via cPanel
  }
}

// Configuration
const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const nodeEnv = process.env.NODE_ENV || "development";

// Validate required environment variables
const requiredVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"];
const missing = requiredVars.filter(v => !process.env[v]);

if (missing.length > 0 && nodeEnv === "production") {
  console.error("❌ ERROR: Missing required environment variables:");
  missing.forEach(v => console.error(`   - ${v}`));
  console.error("\n📝 Please configure these variables in:");
  console.error("   1. cPanel → Node.js → Environment Variables");
  console.error("   2. Or create .env.local file with these variables");
  process.exit(1);
}

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Prevent crashes from unhandled promise rejections in production
process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught exception:", err);
  process.exit(1);
});

app.prepare().then(() => {
  createServer((req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      
      // Add security headers
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("X-Frame-Options", "SAMEORIGIN");
      res.setHeader("X-XSS-Protection", "1; mode=block");
      res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
      
      handle(req, res, parsedUrl);
    } catch (err) {
      console.error("❌ Request error:", err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  }).listen(port, hostname, (err) => {
    if (err) throw err;
    console.log(`\n✅ AMTMTI Platform Started`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`🚀 Server running on http://${hostname}:${port}`);
    console.log(`📱 Environment: ${nodeEnv}`);
    console.log(`🌐 Access: https://your-domain.com`);
    console.log(`🔐 Admin: https://your-domain.com/admin/login`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  });
}).catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
