var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// database.ts
var database_exports = {};
__export(database_exports, {
  pool: () => pool,
  query: () => query
});
import pg from "pg";
var Pool, pool, query;
var init_database = __esm({
  "database.ts"() {
    ({ Pool } = pg);
    if (!process.env.DATABASE_URL) {
      console.warn("[SportRes DB] DATABASE_URL is not set. Database API routes will fail until it is configured.");
    }
    pool = new Pool({
      connectionString: process.env.DATABASE_URL
    });
    query = (text, params) => pool.query(text, params);
  }
});

// server.ts
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

// src/api/assistant.ts
import { GoogleGenAI } from "@google/genai";
async function handleAssistantRequest(body, apiKey) {
  const { message, history, appContext } = body;
  console.log("AI Assistant received request:", message);
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return generateMockResponse(message, appContext);
  }
  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
    const systemInstruction = `
B\u1EA1n l\xE0 "SportRes AI", tr\u1EE3 l\xFD th\u1EC3 thao c\xE1 nh\xE2n th\xF4ng minh trong \u1EE9ng d\u1EE5ng SportRes (N\u1EC1n t\u1EA3ng t\xECm s\xE2n, \u0111\u1EB7t s\xE2n v\xE0 k\u1EBFt n\u1ED1i gh\xE9p c\u1EB7p th\u1EC3 thao t\u1EA1i Vi\u1EC7t Nam).
M\u1EE5c ti\xEAu c\u1EE7a b\u1EA1n l\xE0 gi\xFAp \u0111\u1EE1 ng\u01B0\u1EDDi d\xF9ng, \u0111\u1EB7c bi\u1EC7t l\xE0 ng\u01B0\u1EDDi d\xF9ng hi\u1EC7n t\u1EA1i c\xF3 th\xF4ng tin sau:
- T\xEAn ng\u01B0\u1EDDi d\xF9ng: ${appContext.user.name}
- Tr\xECnh \u0111\u1ED9 th\u1EBF thao: B\xF3ng \u0111\xE1 (${appContext.user.skillLevels.soccer}), C\u1EA7u l\xF4ng (${appContext.user.skillLevels.badminton}), Tennis (${appContext.user.skillLevels.tennis}), B\xF3ng r\u1ED5 (${appContext.user.skillLevels.basketball})
- M\xF4n th\u1EC3 thao y\xEAu th\xEDch: ${appContext.user.favoriteSports.join(", ")}

D\u01B0\u1EDBi \u0111\xE2y l\xE0 d\u1EEF li\u1EC7u th\u1EDDi gian th\u1EF1c hi\u1EC7n t\u1EA1i c\u1EE7a h\u1EC7 th\u1ED1ng SportRes:

DANH S\xC1CH S\xC2N TH\u1EC2 THAO \u0110ANG HO\u1EA0T \u0110\u1ED8NG:
${appContext.courts.map((c) => `- [ID: ${c.id}] ${c.name} (${c.sport === "soccer" ? "B\xF3ng \u0111\xE1" : c.sport === "badminton" ? "C\u1EA7u l\xF4ng" : c.sport === "tennis" ? "Tennis" : "B\xF3ng r\u1ED5"}): Khu v\u1EF1c ${c.district}. Gi\xE1 t\u1EEB ${c.priceMin.toLocaleString("vi-VN")}\u0111/gi\u1EDD. \u0110\xE1nh gi\xE1: ${c.rating}\u2B50 (${c.reviewsCount} b\xE0i \u0111\xE1nh gi\xE1). \u0110\u1ECBa ch\u1EC9: ${c.address}. Ti\u1EC7n \xEDch: ${c.amenities.join(", ")}.`).join("\n")}

DANH S\xC1CH C\xC1C TR\u1EACN \u0110\u1EA4U GH\xC9P C\u1EB6P \u0110ANG TUY\u1EC2N NG\u01AF\u1EDCI (MATCHMAKING):
${appContext.matches.map((m) => `- [ID: ${m.id}] "${m.title}" do ${m.creatorName} t\u1EA1o. B\u1ED9 m\xF4n: ${m.sport}. S\xE2n: ${m.courtName}. Th\u1EDDi gian: ${m.time}, Ng\xE0y: ${m.date}. Tr\xECnh \u0111\u1ED9 y\xEAu c\u1EA7u: ${m.level}. S\u1ED1 ng\u01B0\u1EDDi hi\u1EC7n c\xF3: ${m.players.length}/${m.maxPlayers} ng\u01B0\u1EDDi. L\u1EC7 ph\xED chia \u0111\u1EC1u: ${m.pricePerPlayer.toLocaleString("vi-VN")}\u0111/ng\u01B0\u1EDDi.`).join("\n")}

DANH S\xC1CH GI\u1EA2I \u0110\u1EA4U (TOURNAMENTS):
${appContext.tournaments.map((t) => `- [ID: ${t.id}] "${t.title}". B\u1ED9 m\xF4n: ${t.sport}. Tr\u1EA1ng th\xE1i: ${t.status === "ongoing" ? "\u0110ang di\u1EC5n ra" : "\u0110ang m\u1EDF \u0111\u0103ng k\xFD"}. Qu\u1EF9 gi\u1EA3i th\u01B0\u1EDFng: ${t.prizePool}.`).join("\n")}

H\u01AF\u1EDANG D\u1EAAN \u1EE8NG X\u1EEC:
1. Lu\xF4n tr\u1EA3 l\u1EDDi b\u1EB1ng ti\u1EBFng Vi\u1EC7t th\xE2n thi\u1EC7n, nhi\u1EC7t t\xECnh, n\u0103ng \u0111\u1ED9ng v\xE0 chuy\xEAn nghi\u1EC7p c\u1EE7a m\u1ED9t chuy\xEAn gia th\u1EC3 thao.
2. D\u1EF1a v\xE0o s\u1EDF th\xEDch v\xE0 tr\xECnh \u0111\u1ED9 th\u1EC3 thao c\u1EE7a ng\u01B0\u1EDDi d\xF9ng \u0111\u1EC3 \u0111\u01B0a ra g\u1EE3i \xFD s\xE2n ho\u1EB7c tr\u1EADn gh\xE9p c\u1EB7p (Matchmaking) ph\xF9 h\u1EE3p nh\u1EA5t.
3. Khi gi\u1EDBi thi\u1EC7u s\xE2n ho\u1EB7c k\xE8o gh\xE9p c\u1EB7p, h\xE3y n\xEAu r\xF5 T\xEAn s\xE2n, Qu\u1EADn huy\u1EC7n, Ph\xE2n kh\xFAc gi\xE1 v\xE0 v\xEC sao s\xE2n \u0111\xF3 ph\xF9 h\u1EE3p v\u1EDBi c\xE1 nh\xE2n h\u1ECD.
4. Tr\xE1nh l\u1EB7p l\u1EA1i qu\xE1 nhi\u1EC1u v\u1EC1 m\u1EB7t k\u1EF9 thu\u1EADt, t\u1EADp trung v\xE0o vi\u1EC7c t\u1EA1o s\u1EF1 kh\xEDch l\u1EC7 v\u1EADn \u0111\u1ED9ng, r\xE8n luy\u1EC7n th\u1EC3 thao.
`;
    const contents = history.map((h) => ({
      role: h.role === "model" ? "model" : "user",
      parts: h.parts
    }));
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 1e3
      }
    });
    return {
      text: response.text || "Xin l\u1ED7i, t\xF4i ch\u01B0a th\u1EC3 tr\u1EA3 l\u1EDDi l\xFAc n\xE0y.",
      success: true
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: `Ch\xE0o ${appContext.user.name}, ch\xFAc m\u1ED9t ng\xE0y \u0111\u1EA7y s\u1EE9c tr\u1EBB! R\u1EA5t ti\u1EBFc, k\u1EBFt n\u1ED1i \u0111\u1EBFn m\xE1y ch\u1EE7 AI \u0111ang b\u1EADn t\xED ch\xFAt, tuy nhi\xEAn d\u1EF1a v\xE0o d\u1EEF li\u1EC7u h\u1EC7 th\u1ED1ng, t\xF4i \u0111\u1EC1 xu\u1EA5t b\u1EA1n n\xEAn tr\u1EA3i nghi\u1EC7m **${appContext.courts[0]?.name || "S\xE2n b\xF3ng K\u1EF3 H\xF2a"}** n\u1EB1m \u1EDF ${appContext.courts[0]?.district || "Qu\u1EADn 10"} ho\u1EB7c k\u1EBFt n\u1ED1i v\u1EDBi k\xE8o **"${appContext.matches[0]?.title || "Giao l\u01B0u c\u1EA7u l\xF4ng"}"** \u0111ang r\u1EA5t n\xF3ng! Ch\xFAc b\u1EA1n c\xF3 nh\u1EEFng gi\u1EDD ph\xFAt th\u1EC3 thao s\u1EA3ng kho\xE1i!`,
      success: false,
      error: error.message
    };
  }
}
function generateMockResponse(message, appContext) {
  const query3 = message.toLowerCase();
  const userName = appContext.user.name;
  let text = "";
  if (query3.includes("s\xE2n") || query3.includes("t\xECm") || query3.includes("\u0111\u1EB7t")) {
    const recommendedCourt = appContext.courts[Math.floor(Math.random() * appContext.courts.length)];
    text = `Ch\xE0o **${userName}**! \u{1F3DF}\uFE0F \u0110\u1EC3 h\u1ED7 tr\u1EE3 b\u1EA1n t\xECm s\xE2n \u0111\u1EA5u l\xFD t\u01B0\u1EDFng, t\xF4i ph\xE1t hi\u1EC7n s\xE2n **${recommendedCourt.name}** t\u1EA1i ${recommendedCourt.district} s\u1EDF h\u1EEFu \u0111\xE1nh gi\xE1 r\u1EA5t cao (${recommendedCourt.rating}\u2B50) v\xE0 c\u1EF1c k\u1EF3 ph\xF9 h\u1EE3p cho tr\xECnh th\u1EC3 thao c\u1EE7a b\u1EA1n.

Ngo\xE0i ra, b\u1EA1n c\u0169ng c\xF3 th\u1EC3 m\u1EDF tab **"T\xECm S\xE2n"** trong \u1EE9ng d\u1EE5ng b\u1EB1ng c\xE1ch g\xF5 thanh t\xECm ki\u1EBFm, ch\u1ECDn l\u1ECDc qu\u1EADn mong mu\u1ED1n v\xE0 b\u1EA5m \u0110\u1EB7t slot ph\xF9 h\u1EE3p nh\u1EA5t \u0111\u1EC3 thanh to\xE1n t\u1EF1 \u0111\u1ED9ng ngay t\u1EE9c th\xEC!`;
  } else if (query3.includes("gh\xE9p") || query3.includes("k\u1EBFt n\u1ED1i") || query3.includes("tr\u1EADn") || query3.includes("\u0111\u1ED1i")) {
    const openMatch = appContext.matches.find((m) => m.status === "open");
    if (openMatch) {
      text = `Ch\xE0o **${userName}**! \u{1F91D} Tr\xEAn h\u1EC7 th\u1ED1ng hi\u1EC7n \u0111ang tuy\u1EC3n qu\xE2n kh\u1EA9n c\u1EA5p cho tr\u1EADn: **"${openMatch.title}"** t\u1EA1i *${openMatch.courtName}* (${openMatch.time} ng\xE0y h\xF4m nay).

Tr\u1EADn \u0111\u1EA5u n\xE0y y\xEAu c\u1EA7u tr\xECnh \u0111\u1ED9 **${openMatch.level}** v\xE0 hi\u1EC7n c\xF3 ${openMatch.players.length}/${openMatch.maxPlayers} ng\u01B0\u1EDDi. B\u1EA1n c\xF3 th\u1EC3 sang th\u1EB3ng tab **"Gh\xE9p K\xE8o"** \u0111\u1EC3 tham gia ngay \u0111\u1EC3 giao l\u01B0u s\u1EE9c kh\u1ECFe v\xE0 m\u1EDF r\u1ED9ng v\xF2ng k\u1EBFt n\u1ED1i!`;
    } else {
      text = `Ch\xE0o **${userName}**! Hi\u1EC7n t\u1EA1i c\xE1c k\xE8o \u0111\u1EA5u \u0111ang t\u1EA1m k\xEDn ch\u1ED7. Tuy nhi\xEAn b\u1EA1n ho\xE0n to\xE0n c\xF3 th\u1EC3 t\u1EF1 t\u1EA1o m\u1ED9t k\xE8o \u0111\u1EA5u m\u1EDBi t\u1EA1i m\u1EE5c **"Gh\xE9p K\xE8o" \u2794 "T\u1EA1o tr\u1EADn \u0111\u1EA5u"**, h\u1EC7 th\u1ED1ng s\u1EBD l\u1EADp t\u1EE9c th\xF4ng b\xE1o v\xE0 g\u1EE3i \xFD cho nh\u1EEFng ng\u01B0\u1EDDi c\xF9ng tr\xECnh \u0111\u1ED9 th\u1EC3 thao t\u1EA1i khu v\u1EF1c l\xE2n c\u1EADn gia nh\u1EADp c\xF9ng b\u1EA1n!`;
    }
  } else if (query3.includes("gi\u1EA3i") || query3.includes("\u0111\u1EA5u") || query3.includes("tournament")) {
    const tour = appContext.tournaments[0];
    text = `Ch\xE0o **${userName}**! \u{1F3C6} Hi\u1EC7n t\u1EA1i SportRes \u0111ang t\xE0i tr\u1EE3 ch\xEDnh cho gi\u1EA3i \u0111\u1EA5u c\u1EF1c hot: **"${tour.title}"** quy t\u1EE5 c\xE1c \u0111\u1ED9i tuy\u1EC3n phong tr\xE0o m\u1EA1nh nh\u1EA5t v\u1EDBi t\u1ED5ng gi\u1EA3i th\u01B0\u1EDFng l\xEAn \u0111\u1EBFn **${tour.prizePool}**!

B\u1EA1n h\xE3y v\xE0o tab **"S\u1EF1 ki\u1EC7n & Gi\u1EA3i \u0111\u1EA5u"** \u0111\u1EC3 xem th\xF4ng tin, l\u1ECBch thi \u0111\u1EA5u v\xE0 \u0111\u0103ng k\xFD tham gia nh\xE9!`;
  } else {
    text = `Ch\xE0o **${userName}**! R\u1EA5t vui \u0111\u01B0\u1EE3c \u0111\u1ED3ng h\xE0nh c\xF9ng b\u1EA1n tr\xEAn \u1EE9ng d\u1EE5ng SportRes. \u{1F680}

T\xF4i c\xF3 th\u1EC3 gi\xFAp g\xEC cho b\u1EA1n h\xF4m nay?
- \u{1F3DF}\uFE0F **T\xECm v\xE0 \u0111\u1EC1 xu\u1EA5t s\xE2n \u0111\u1EA5u tr\u1ED1ng** g\u1EA7n b\u1EA1n.
- \u{1F91D} **T\xECm \u0111\u1ED1i th\u1EE7 v\xE0 gh\xE9p k\xE8o giao l\u01B0u** \u0111\xFAng tr\xECnh \u0111\u1ED9 c\u1EE7a b\u1EA1n.
- \u{1F3C6} **Th\xF4ng tin c\xE1c gi\u1EA3i \u0111\u1EA5u** phong tr\xE0o \u0111ang di\u1EC5n ra.
- \u26A1 **Gi\u1EA3i \u0111\xE1p th\u1EAFc m\u1EAFc** k\u1EF9 thu\u1EADt t\u1EADp luy\u1EC7n ho\u1EB7c qu\u1EA3n l\xFD l\u1ECBch s\xE2n cho ch\u1EE7 s\xE2n.

H\xE3y chia s\u1EBB m\xF4n th\u1EC3 thao b\u1EA1n mu\u1ED1n ch\u01A1i h\xF4m nay nh\xE9!`;
  }
  return {
    text,
    success: true
  };
}

// server.ts
dotenv.config();
var { query: query2, pool: pool2 } = await Promise.resolve().then(() => (init_database(), database_exports));
var app = express();
app.use(express.json({ limit: "2mb" }));
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var JWT_SECRET = process.env.JWT_SECRET || "sportres-dev-secret";
var PAYMENT_BANK_INFO = {
  bankName: "MBBank",
  accountNumber: "3386558805",
  accountHolder: "Nguyen Minh Quan",
  qrImageUrl: "https://img.vietqr.io/image/MB-3386558805-compact.png"
};
var bookingCodeFromId = (bookingId) => `SPORTRES_${bookingId.replaceAll("-", "").slice(0, 12).toUpperCase()}`;
var DEMO_PASSWORDS = {
  owner1: "Owner@123",
  admin: "Admin@123"
};
var normalizePhone = (value) => String(value || "").replace(/[^\d+]/g, "").trim();
var isValidPhone = (phone) => /^\+?\d{8,15}$/.test(phone);
var userSchemaReady = null;
async function ensureUserSchema() {
  userSchemaReady ||= (async () => {
    await query2("ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(100)");
    await query2(
      `UPDATE users u
       SET full_name = COALESCE(NULLIF(BTRIM(up.display_name), ''), NULLIF(BTRIM(u.username), ''), u.phone)
       FROM user_profiles up
       WHERE up.user_id = u.id AND (u.full_name IS NULL OR BTRIM(u.full_name) = '')`
    );
    await query2(
      `UPDATE users
       SET full_name = COALESCE(NULLIF(BTRIM(username), ''), phone)
       WHERE full_name IS NULL OR BTRIM(full_name) = ''`
    );
    await query2("ALTER TABLE users ALTER COLUMN full_name SET NOT NULL");
    await query2("ALTER TABLE users ALTER COLUMN phone SET NOT NULL");
  })();
  await userSchemaReady;
}
var adminVenueOwnerSchemaReady = null;
async function ensureAdminVenueOwnerSchema() {
  adminVenueOwnerSchemaReady ||= (async () => {
    await ensureUserSchema();
    await query2("ALTER TABLE venues ADD COLUMN IF NOT EXISTS primary_sport sport_type");
  })();
  await adminVenueOwnerSchemaReady;
}
var mapAdminUser = (row) => ({
  username: row.username,
  role: row.role === "owner" ? "venue_owner" : row.role,
  profile: toUserProfile(row)
});
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});
app.use("/api", (_req, res, next) => {
  res.header("Content-Type", "application/json; charset=utf-8");
  next();
});
app.use("/api/owner", (req, res, next) => {
  const startedAt = Date.now();
  res.on("finish", () => {
    console.info("[owner-schedule]", {
      method: req.method,
      endpoint: req.originalUrl,
      status: res.statusCode,
      userId: req.user?.id || "unauthenticated",
      role: req.user?.role || "none",
      durationMs: Date.now() - startedAt
    });
  });
  next();
});
var tokenFor = (user) => jwt.sign({ id: user.id, role: user.role === "owner" ? "venue_owner" : user.role }, JWT_SECRET, { expiresIn: "7d" });
var authOptional = (req, _res, next) => {
  const token = req.header("Authorization")?.replace(/^Bearer\s+/i, "");
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = { ...payload, role: payload.role === "owner" ? "venue_owner" : payload.role };
    } catch {
      req.user = void 0;
    }
  }
  next();
};
var authRequired = (req, res, next) => {
  authOptional(req, res, () => {
    if (!req.user) {
      console.warn("[auth] Missing or invalid bearer token", { method: req.method, endpoint: req.originalUrl });
      return res.status(401).json({ error: "Vui l\xF2ng \u0111\u0103ng nh\u1EADp l\u1EA1i." });
    }
    next();
  });
};
var SUPPORTED_SPORTS = ["soccer", "badminton", "tennis", "basketball", "pickleball", "volleyball", "golf"];
var SUPPORTED_SKILLS = ["Beginner", "Intermediate", "Advanced", "Pro"];
var toUserProfile = (row, sportSkills = []) => {
  const skillLevels = Object.fromEntries(
    SUPPORTED_SPORTS.map((sport) => [sport, "Beginner"])
  );
  for (const item of sportSkills) skillLevels[item.sport] = item.skill;
  return {
    id: row.id,
    full_name: row.full_name || row.display_name || row.username || row.phone,
    name: row.full_name || row.display_name || row.username || row.phone,
    avatar: row.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
    phone: row.phone || "",
    role: row.role,
    skillLevels: {
      ...skillLevels,
      all: "Beginner"
    },
    favoriteSports: sportSkills.filter((item) => item.is_favorite).map((item) => item.sport),
    gender: row.gender || "",
    activeArea: row.active_area || ""
  };
};
async function userProfileById(userId) {
  await ensureUserSchema();
  const row = (await query2(
    `SELECT u.*, up.display_name, up.avatar_url, up.gender, up.active_area
     FROM users u LEFT JOIN user_profiles up ON up.user_id = u.id
     WHERE u.id = $1`,
    [userId]
  )).rows[0];
  if (!row) return null;
  const skills = (await query2(
    "SELECT sport, skill, is_favorite FROM user_sport_skills WHERE user_id = $1",
    [userId]
  )).rows;
  return toUserProfile(row, skills);
}
var courtPricePerHour = (court) => Math.max(0, Number(court.price_per_hour ?? court.price_min ?? 0));
var priceForSlot = (court) => courtPricePerHour(court);
var formatLocalDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
var formatDatabaseDate = (value) => {
  if (value instanceof Date) return formatLocalDate(value);
  const text = String(value || "");
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) return text.slice(0, 10);
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? text.slice(0, 10) : formatLocalDate(parsed);
};
var dateOffsets = () => Array.from({ length: 14 }, (_, index) => {
  const date = /* @__PURE__ */ new Date();
  date.setDate(date.getDate() + index);
  return formatLocalDate(date);
});
var isDateString = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
var timeSlotSchemaReady = null;
async function ensureTimeSlotSchema() {
  timeSlotSchemaReady ||= (async () => {
    await query2("ALTER TABLE time_slots ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN NOT NULL DEFAULT FALSE");
    await query2("ALTER TABLE time_slots ADD COLUMN IF NOT EXISTS is_maintenance BOOLEAN NOT NULL DEFAULT FALSE");
    await query2(
      `CREATE TABLE IF NOT EXISTS court_schedules (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        court_id UUID NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        opening_time TIME NOT NULL DEFAULT '06:00',
        closing_time TIME NOT NULL DEFAULT '22:00',
        slot_duration INTEGER NOT NULL DEFAULT 60 CHECK (slot_duration IN (30, 60, 90, 120)),
        status court_status NOT NULL DEFAULT 'open',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (court_id, date)
      )`
    );
  })();
  await timeSlotSchemaReady;
}
var matchSchemaReady = null;
async function ensureMatchSchema() {
  matchSchemaReady ||= (async () => {
    await query2("ALTER TABLE matches ADD COLUMN IF NOT EXISTS booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL");
    await query2("CREATE UNIQUE INDEX IF NOT EXISTS idx_matches_booking_id ON matches(booking_id) WHERE booking_id IS NOT NULL");
  })();
  await matchSchemaReady;
}
var bookingPaymentSchemaReady = null;
async function ensureBookingPaymentSchema() {
  bookingPaymentSchemaReady ||= (async () => {
    await query2(`ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'pending_payment_verification'`);
    await query2(`ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'payment_rejected'`);
    await query2(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_status VARCHAR(40)`);
    await query2(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_group_id UUID`);
    await query2(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_code VARCHAR(50)`);
    await query2(`ALTER TABLE bookings ALTER COLUMN booking_code TYPE VARCHAR(50)`);
    await query2(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS transfer_content VARCHAR(60)`);
    await query2(`UPDATE bookings SET
      payment_status = CASE
        WHEN status IN ('confirmed', 'completed') THEN 'paid'
        WHEN status = 'payment_rejected' THEN 'rejected'
        WHEN status = 'cancelled' THEN COALESCE(payment_status, 'rejected')
        ELSE COALESCE(payment_status, 'pending_transfer')
      END,
      booking_code = CASE
        WHEN booking_code IS NULL OR booking_code NOT LIKE 'SPORTRES_%'
          THEN 'SPORTRES_' || UPPER(SUBSTRING(REPLACE(id::text, '-', '') FROM 1 FOR 12))
        ELSE booking_code
      END
      WHERE payment_status IS NULL OR booking_code IS NULL OR booking_code NOT LIKE 'SPORTRES_%'`);
    await query2(`UPDATE bookings SET transfer_content = booking_code WHERE transfer_content IS DISTINCT FROM booking_code`);
    await query2(`ALTER TABLE bookings ALTER COLUMN payment_status SET DEFAULT 'pending_transfer'`);
    await query2(`ALTER TABLE bookings ALTER COLUMN booking_code SET NOT NULL`);
    await query2(`ALTER TABLE bookings ALTER COLUMN transfer_content SET NOT NULL`);
    await query2(`CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_booking_code ON bookings(booking_code)`);
    await query2(`CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status)`);
    await query2(`CREATE INDEX IF NOT EXISTS idx_bookings_group_id ON bookings(booking_group_id)`);
    await query2(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'bookings_transfer_content_matches_code'
            AND conrelid = 'bookings'::regclass
        ) THEN
          ALTER TABLE bookings
          ADD CONSTRAINT bookings_transfer_content_matches_code
          CHECK (transfer_content = booking_code);
        END IF;
      END
      $$;
    `);
  })();
  await bookingPaymentSchemaReady;
}
var minutesFromTime = (value) => {
  const [hour, minute] = value.slice(0, 5).split(":").map(Number);
  return hour * 60 + minute;
};
var timeFromMinutes = (value) => `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
var buildSlotRanges = (openingTime, closingTime, duration) => {
  const start = minutesFromTime(openingTime);
  const end = minutesFromTime(closingTime);
  const ranges = [];
  for (let cursor = start; cursor + duration <= end; cursor += duration) {
    ranges.push([timeFromMinutes(cursor), timeFromMinutes(cursor + duration)]);
  }
  return ranges;
};
async function ownerCourt(courtId, user) {
  const role = user.role === "owner" ? "venue_owner" : user.role;
  return (await query2(
    `SELECT c.*, v.owner_id, v.opening_hour, v.closing_hour
     FROM courts c JOIN venues v ON v.id = c.venue_id
     WHERE c.id = $1 AND ($2 = 'admin' OR $2 = 'staff' OR v.owner_id = $3)`,
    [courtId, role, user.id]
  )).rows[0];
}
var mapSlot = (row) => ({
  id: row.id,
  court_id: row.court_id,
  venue_id: row.venue_id,
  date: String(row.slot_date || formatDatabaseDate(row.date)),
  start_time: String(row.start_time).slice(0, 5),
  end_time: String(row.end_time).slice(0, 5),
  status: row.is_maintenance ? "maintenance" : row.is_booked ? "booked" : row.is_blocked ? "blocked" : "available",
  time: `${String(row.start_time).slice(0, 5)} - ${String(row.end_time).slice(0, 5)}`,
  price: Number(row.price) > 0 ? Number(row.price) : courtPricePerHour(row),
  isPeak: Boolean(row.is_peak),
  isBooked: Boolean(row.is_booked),
  isBlocked: Boolean(row.is_blocked),
  isMaintenance: Boolean(row.is_maintenance)
});
async function ensureCourtTimeSlots(courtId, date) {
  if (!isDateString(date)) throw new Error("Invalid date. Expected YYYY-MM-DD.");
  await ensureTimeSlotSchema();
  const court = (await query2(
    `SELECT c.id, c.status, c.price_min, c.price_peak, v.opening_hour, v.closing_hour
     FROM courts c
     JOIN venues v ON v.id = c.venue_id
     WHERE c.id = $1`,
    [courtId]
  )).rows[0];
  if (!court) throw new Error("Court not found.");
  if (court.status !== "open") return;
  await query2(
    `INSERT INTO court_schedules (court_id, date, opening_time, closing_time, slot_duration, status)
     VALUES ($1, $2, '06:00', '22:00', 60, 'open')
     ON CONFLICT (court_id, date) DO NOTHING`,
    [courtId, date]
  );
  const schedule = (await query2(
    "SELECT * FROM court_schedules WHERE court_id = $1 AND date = $2",
    [courtId, date]
  )).rows[0];
  if (schedule.status !== "open") return;
  const times = buildSlotRanges(
    String(schedule.opening_time).slice(0, 5),
    String(schedule.closing_time).slice(0, 5),
    Number(schedule.slot_duration)
  );
  if (!times.length) return;
  const starts = times.map(([start]) => start);
  const ends = times.map(([, end]) => end);
  const prices = starts.map(() => priceForSlot(court));
  const peaks = starts.map((start) => Number(start.slice(0, 2)) >= 16 && Number(start.slice(0, 2)) <= 20);
  const usesDefaultSchedule = String(schedule.opening_time).slice(0, 5) === "06:00" && String(schedule.closing_time).slice(0, 5) === "22:00" && Number(schedule.slot_duration) === 60;
  if (usesDefaultSchedule) {
    await query2(
      `DELETE FROM time_slots ts
       WHERE ts.court_id = $1
         AND ts.date = $2
         AND ts.is_booked = FALSE
         AND ts.is_blocked = FALSE
         AND ts.is_maintenance = FALSE
         AND NOT EXISTS (
           SELECT 1
           FROM UNNEST($3::time[], $4::time[]) AS expected(start_time, end_time)
           WHERE expected.start_time = ts.start_time AND expected.end_time = ts.end_time
         )`,
      [court.id, date, starts, ends]
    );
  }
  await query2(
    `INSERT INTO time_slots (court_id, date, start_time, end_time, price, is_peak)
     SELECT $1, $2, generated.start_time, generated.end_time, generated.price, generated.is_peak
     FROM UNNEST($3::time[], $4::time[], $5::integer[], $6::boolean[])
       AS generated(start_time, end_time, price, is_peak)
     ON CONFLICT (court_id, date, start_time, end_time) DO NOTHING`,
    [court.id, date, starts, ends, prices, peaks]
  );
}
async function ensureTimeSlots() {
  const courts = (await query2("SELECT id FROM courts WHERE status = $1", ["open"])).rows;
  for (const court of courts) {
    for (const date of dateOffsets()) {
      await ensureCourtTimeSlots(court.id, date);
    }
  }
}
function mapBooking(row) {
  return {
    id: row.id,
    courtId: row.venue_id,
    venueId: row.venue_id,
    ownerId: row.owner_id,
    courtName: row.venue_name,
    subCourtId: row.court_id,
    timeSlotId: row.time_slot_id,
    subCourtName: row.court_name,
    sport: row.sport,
    customerId: row.user_id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone || "",
    date: String(row.booking_date || formatDatabaseDate(row.date)),
    timeSlot: row.time_range,
    price: Number(row.total_price || 0),
    status: row.status,
    paymentStatus: row.payment_status || (["confirmed", "completed"].includes(row.status) ? "paid" : "pending_transfer"),
    bookingGroupId: row.booking_group_id || void 0,
    bookingGroupTotal: Number(row.booking_group_total || row.total_price || 0),
    bookingCode: row.booking_code || bookingCodeFromId(String(row.id)),
    transferContent: row.transfer_content || row.booking_code || bookingCodeFromId(String(row.id)),
    createdAt: row.created_at,
    qrcode: row.qr_code || `SPORTRES-B-${row.id}`,
    isMatchBooking: false,
    participantCount: 1,
    reviewPlayers: false,
    participants: []
  };
}
async function bookingRows(where = "", params = []) {
  await ensureBookingPaymentSchema();
  await ensureMatchSchema();
  const rows = (await query2(
    `SELECT b.*, b.date::text AS booking_date,
            SUM(b.total_price) OVER (PARTITION BY COALESCE(b.booking_group_id, b.id)) AS booking_group_total,
            v.name AS venue_name, v.owner_id, c.name AS court_name, c.sport,
            u.full_name AS customer_name, u.phone AS customer_phone
     FROM bookings b
     JOIN venues v ON v.id = b.venue_id
     JOIN courts c ON c.id = b.court_id
     JOIN users u ON u.id = b.user_id
     LEFT JOIN user_profiles up ON up.user_id = u.id
     ${where}
     ORDER BY b.created_at DESC`,
    params
  )).rows;
  const bookings = rows.map(mapBooking);
  if (bookings.length === 0) return bookings;
  const bookingIds = bookings.map((booking) => booking.id);
  const linkedMatches = (await query2(
    "SELECT id, booking_id FROM matches WHERE booking_id = ANY($1::uuid[])",
    [bookingIds]
  )).rows;
  const matchByBookingId = new Map(linkedMatches.map((row) => [row.booking_id, row.id]));
  const matchIds = linkedMatches.map((row) => row.id);
  const participantRows = matchIds.length > 0 ? (await query2(
    `SELECT mp.match_id, mp.user_id, u.full_name AS display_name, up.avatar_url
         FROM match_participants mp
         JOIN users u ON u.id = mp.user_id
         LEFT JOIN user_profiles up ON up.user_id = u.id
         WHERE mp.match_id = ANY($1::uuid[])
         ORDER BY mp.joined_at`,
    [matchIds]
  )).rows : [];
  return bookings.map((booking) => {
    const matchId = matchByBookingId.get(booking.id);
    const participants = matchId ? participantRows.filter((participant) => participant.match_id === matchId).map((participant) => ({
      id: participant.user_id,
      name: participant.display_name || "SportRes Player",
      avatar: participant.avatar_url || ""
    })) : [];
    const participantCount = matchId ? participants.length : 1;
    return {
      ...booking,
      isMatchBooking: Boolean(matchId),
      participantCount,
      reviewPlayers: participantCount > 1,
      participants
    };
  });
}
async function matchRows() {
  await ensureMatchSchema();
  const rows = (await query2(
    `SELECT m.*, v.name AS venue_name, c.name AS court_name, u.full_name AS creator_name, up.avatar_url AS creator_avatar
     FROM matches m
     JOIN users u ON u.id = m.creator_id
     LEFT JOIN venues v ON v.id = m.venue_id
     LEFT JOIN courts c ON c.id = m.court_id
     LEFT JOIN user_profiles up ON up.user_id = m.creator_id
     ORDER BY m.created_at DESC`
  )).rows;
  const participants = (await query2(
    `SELECT mp.match_id, u.id, u.full_name AS display_name, up.avatar_url, mp.joined_at
     FROM match_participants mp
     JOIN users u ON u.id = mp.user_id
     LEFT JOIN user_profiles up ON up.user_id = u.id`
  )).rows;
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    sport: row.sport,
    courtId: row.venue_id || row.court_id || "",
    courtName: row.venue_name || row.court_name || "S\xE2n t\u1EF1 ch\u1ECDn",
    address: row.address || "",
    date: String(row.match_date).slice(0, 10),
    time: String(row.match_time).slice(0, 5),
    level: row.skill_level,
    creatorId: row.creator_id,
    creatorName: row.creator_name || "SportRes Player",
    creatorAvatar: row.creator_avatar || "",
    players: participants.filter((p) => p.match_id === row.id).map((p) => ({
      id: p.id,
      name: p.display_name || "SportRes Player",
      avatar: p.avatar_url || "",
      skill: row.skill_level,
      sport: row.sport,
      status: "joined",
      joinedAt: p.joined_at
    })),
    maxPlayers: Number(row.max_players || 10),
    pricePerPlayer: Number(row.price_per_player || 0),
    status: row.status === "in_progress" || row.status === "cancelled" ? "open" : row.status,
    description: row.description || "",
    bookingId: row.booking_id || void 0
  }));
}
app.post("/api/auth/register", async (req, res) => {
  const client = await pool2.connect();
  try {
    await ensureUserSchema();
    const { fullName: rawFullName, phone: rawPhone, password } = req.body;
    const phone = normalizePhone(rawPhone);
    const fullName = String(rawFullName || "").trim();
    if (!fullName || !phone || !password) {
      return res.status(400).json({ error: "H\u1ECD t\xEAn, s\u1ED1 \u0111i\u1EC7n tho\u1EA1i v\xE0 m\u1EADt kh\u1EA9u l\xE0 b\u1EAFt bu\u1ED9c." });
    }
    if (!isValidPhone(phone)) return res.status(400).json({ error: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i kh\xF4ng h\u1EE3p l\u1EC7." });
    await client.query("BEGIN");
    const duplicatePhone = await client.query("SELECT 1 FROM users WHERE phone = $1", [phone]);
    if (duplicatePhone.rowCount) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i n\xE0y \u0111\xE3 \u0111\u01B0\u1EE3c \u0111\u0103ng k\xFD." });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const userResult = await client.query(
      `INSERT INTO users (username, full_name, phone, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [phone, fullName, phone, passwordHash, "player"]
    );
    const user = userResult.rows[0];
    await client.query(
      `INSERT INTO user_profiles (user_id, display_name, gender, active_area, avatar_url)
       VALUES ($1, $2, $3, $4, $5)`,
      [user.id, fullName, null, null, null]
    );
    await client.query("COMMIT");
    res.json({ token: tokenFor(user), user: await userProfileById(user.id) });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(error.code === "23505" ? 409 : 400).json({
      error: error.code === "23505" ? "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i n\xE0y \u0111\xE3 \u0111\u01B0\u1EE3c \u0111\u0103ng k\xFD." : error.message
    });
  } finally {
    client.release();
  }
});
app.post("/api/auth/login", async (req, res) => {
  try {
    await ensureUserSchema();
    const { phone: rawPhone, password } = req.body;
    const phone = normalizePhone(rawPhone);
    if (!phone || !password) return res.status(400).json({ error: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i v\xE0 m\u1EADt kh\u1EA9u l\xE0 b\u1EAFt bu\u1ED9c." });
    if (!isValidPhone(phone)) return res.status(400).json({ error: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i kh\xF4ng h\u1EE3p l\u1EC7." });
    const row = (await query2(
      `SELECT u.*, up.display_name, up.avatar_url, up.gender, up.active_area
       FROM users u LEFT JOIN user_profiles up ON up.user_id = u.id
       WHERE u.phone = $1`,
      [phone]
    )).rows[0];
    if (!row) return res.status(401).json({ error: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i ho\u1EB7c m\u1EADt kh\u1EA9u kh\xF4ng \u0111\xFAng." });
    const valid = await bcrypt.compare(password, row.password_hash).catch(() => false);
    const demoValid = row.password_hash?.includes("DEMO_HASH") && DEMO_PASSWORDS[row.username] === password;
    if (!valid && !demoValid) return res.status(401).json({ error: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i ho\u1EB7c m\u1EADt kh\u1EA9u kh\xF4ng \u0111\xFAng." });
    await query2("UPDATE users SET last_login_at = NOW() WHERE id = $1", [row.id]);
    res.json({ token: tokenFor(row), user: await userProfileById(row.id), role: row.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/me", authRequired, async (req, res) => {
  const user = await userProfileById(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found." });
  res.json({ user });
});
app.patch("/api/me/profile", authRequired, async (req, res) => {
  const client = await pool2.connect();
  try {
    await ensureUserSchema();
    const fullName = String(req.body.fullName || req.body.name || "").trim();
    const gender = req.body.gender ? String(req.body.gender) : null;
    const activeArea = req.body.activeArea ? String(req.body.activeArea).trim() : null;
    const avatarProvided = req.body.avatarUrl !== void 0;
    const avatarUrl = avatarProvided ? String(req.body.avatarUrl || "").trim() || null : null;
    const favoriteSports = Array.isArray(req.body.favoriteSports) ? [...new Set(req.body.favoriteSports.filter((sport) => SUPPORTED_SPORTS.includes(sport)))] : [];
    const skillLevels = req.body.skillLevels && typeof req.body.skillLevels === "object" ? req.body.skillLevels : {};
    if (!fullName) return res.status(400).json({ error: "Full name is required." });
    if (gender && !["Nam", "N\u1EEF", "Kh\xE1c"].includes(gender)) {
      return res.status(400).json({ error: "Invalid gender." });
    }
    await client.query("BEGIN");
    await client.query("UPDATE users SET full_name = $1 WHERE id = $2", [fullName, req.user.id]);
    await client.query(
      `INSERT INTO user_profiles (user_id, display_name, gender, active_area, avatar_url)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (user_id) DO UPDATE SET
         display_name = EXCLUDED.display_name,
         gender = EXCLUDED.gender,
         active_area = EXCLUDED.active_area,
         avatar_url = CASE WHEN $6::boolean THEN EXCLUDED.avatar_url ELSE user_profiles.avatar_url END,
         updated_at = NOW()`,
      [
        req.user.id,
        fullName,
        gender,
        activeArea,
        avatarUrl,
        avatarProvided
      ]
    );
    for (const sport of SUPPORTED_SPORTS) {
      const requestedSkill = skillLevels[sport];
      const skill = SUPPORTED_SKILLS.includes(requestedSkill) ? requestedSkill : "Beginner";
      await client.query(
        `INSERT INTO user_sport_skills (user_id, sport, skill, is_favorite)
         VALUES ($1,$2,$3,$4)
         ON CONFLICT (user_id, sport) DO UPDATE SET
           skill = EXCLUDED.skill,
           is_favorite = EXCLUDED.is_favorite`,
        [req.user.id, sport, skill, favoriteSports.includes(sport)]
      );
    }
    await client.query("COMMIT");
    res.json({ user: await userProfileById(req.user.id) });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => void 0);
    res.status(400).json({ error: error.message });
  } finally {
    client.release();
  }
});
app.patch("/api/me", authRequired, async (req, res) => {
  const client = await pool2.connect();
  try {
    await ensureUserSchema();
    const fullName = String(req.body.fullName || req.body.name || "").trim();
    if (!fullName) return res.status(400).json({ error: "H\u1ECD v\xE0 t\xEAn l\xE0 b\u1EAFt bu\u1ED9c." });
    await client.query("BEGIN");
    await client.query("UPDATE users SET full_name = $1 WHERE id = $2", [fullName, req.user.id]);
    await client.query(
      `UPDATE user_profiles
       SET display_name = $1, gender = $2, active_area = $3
       WHERE user_id = $4`,
      [fullName, req.body.gender || null, req.body.activeArea || null, req.user.id]
    );
    await client.query("COMMIT");
    const row = (await query2(
      `SELECT u.*, up.display_name, up.avatar_url, up.gender, up.active_area
       FROM users u LEFT JOIN user_profiles up ON up.user_id = u.id WHERE u.id = $1`,
      [req.user.id]
    )).rows[0];
    res.json({ user: toUserProfile(row) });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(400).json({ error: error.message });
  } finally {
    client.release();
  }
});
app.get("/api/admin/users", authRequired, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Admin only." });
  try {
    await ensureUserSchema();
    const rows = (await query2(
      `SELECT u.*, up.display_name, up.avatar_url, up.gender, up.active_area
       FROM users u
       LEFT JOIN user_profiles up ON up.user_id = u.id
       ORDER BY u.created_at DESC`
    )).rows;
    res.json(rows.map(mapAdminUser));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/admin/venue-owners", authRequired, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Admin only." });
  const client = await pool2.connect();
  try {
    await ensureAdminVenueOwnerSchema();
    const {
      fullName: rawFullName,
      phone: rawPhone,
      temporaryPassword,
      venueName: rawVenueName,
      address: rawAddress,
      district: rawDistrict,
      sport
    } = req.body;
    const fullName = String(rawFullName || "").trim();
    const phone = normalizePhone(rawPhone);
    const venueName = String(rawVenueName || "").trim();
    const address = String(rawAddress || "").trim();
    const district = String(rawDistrict || "").trim();
    const password = String(temporaryPassword || "");
    const supportedSports = ["soccer", "badminton", "tennis", "basketball", "pickleball", "volleyball", "golf"];
    if (!fullName || !phone || !password || !venueName || !address || !district || !supportedSports.includes(sport)) {
      return res.status(400).json({ error: "Vui l\xF2ng nh\u1EADp \u0111\u1EA7y \u0111\u1EE7 th\xF4ng tin ch\u1EE7 s\xE2n v\xE0 c\u01A1 s\u1EDF." });
    }
    if (!isValidPhone(phone)) return res.status(400).json({ error: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i kh\xF4ng h\u1EE3p l\u1EC7." });
    if (password.length < 6) return res.status(400).json({ error: "M\u1EADt kh\u1EA9u t\u1EA1m th\u1EDDi ph\u1EA3i c\xF3 \xEDt nh\u1EA5t 6 k\xFD t\u1EF1." });
    await client.query("BEGIN");
    const duplicatePhone = await client.query("SELECT 1 FROM users WHERE phone = $1", [phone]);
    if (duplicatePhone.rowCount) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i n\xE0y \u0111\xE3 t\u1ED3n t\u1EA1i" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const owner = (await client.query(
      `INSERT INTO users (username, full_name, phone, password_hash, role, status)
       VALUES ($1, $2, $3, $4, 'venue_owner', 'active')
       RETURNING id, username, full_name, phone, role, status, created_at`,
      [phone, fullName, phone, passwordHash]
    )).rows[0];
    await client.query(
      `INSERT INTO user_profiles (user_id, display_name, active_area)
       VALUES ($1, $2, $3)`,
      [owner.id, fullName, district]
    );
    const venue = (await client.query(
      `INSERT INTO venues (owner_id, name, address, district, city, description, status, primary_sport)
       VALUES ($1, $2, $3, $4, 'H\xE0 N\u1ED9i', NULL, 'active', $5)
       RETURNING *`,
      [owner.id, venueName, address, district, sport]
    )).rows[0];
    await client.query("COMMIT");
    const ownerProfile = (await query2(
      `SELECT u.*, up.display_name, up.avatar_url, up.gender, up.active_area
       FROM users u LEFT JOIN user_profiles up ON up.user_id = u.id
       WHERE u.id = $1`,
      [owner.id]
    )).rows[0];
    res.status(201).json({
      success: true,
      owner: mapAdminUser(ownerProfile),
      venue: {
        id: venue.id,
        ownerId: venue.owner_id,
        name: venue.name,
        address: venue.address,
        district: venue.district,
        status: venue.status,
        sport
      }
    });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => void 0);
    res.status(error.code === "23505" ? 409 : 400).json({
      error: error.code === "23505" ? "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i n\xE0y \u0111\xE3 t\u1ED3n t\u1EA1i" : error.message
    });
  } finally {
    client.release();
  }
});
app.get("/api/owner/courts", authRequired, async (req, res) => {
  if (!["venue_owner", "admin", "staff"].includes(req.user.role)) {
    return res.status(403).json({ error: "Owner court access required." });
  }
  const rows = (await query2(
    `SELECT c.id, c.venue_id, c.name, c.sport, c.status, c.description,
            c.price_min AS price_per_hour, v.name AS venue_name
     FROM courts c
     JOIN venues v ON v.id = c.venue_id
     WHERE $1::text IN ('admin', 'staff') OR v.owner_id = $2
     ORDER BY v.name, c.name`,
    [req.user.role, req.user.id]
  )).rows;
  res.json(rows.map((row) => ({
    id: row.id,
    venueId: row.venue_id,
    venueName: row.venue_name,
    name: row.name,
    sport: row.sport,
    status: row.status,
    description: row.description || "",
    pricePerHour: Number(row.price_per_hour || 0)
  })));
});
app.get("/api/courts", authOptional, async (req, res) => {
  try {
    const rows = (await query2(
      `SELECT v.*, c.id AS court_id, c.name AS court_name, c.sport, c.price_min, c.price_peak, c.status AS court_status,
              c.description AS court_description,
              cs.opening_time AS schedule_opening_time, cs.closing_time AS schedule_closing_time,
              cs.slot_duration AS schedule_slot_duration,
              ts.id AS slot_id, ts.date, ts.date::text AS slot_date, ts.start_time, ts.end_time,
              COALESCE(NULLIF(ts.price, 0), c.price_min) AS slot_price,
              ts.is_peak, ts.is_booked, ts.is_blocked, ts.is_maintenance
       FROM venues v
       LEFT JOIN courts c ON c.venue_id = v.id
       LEFT JOIN court_schedules cs ON cs.court_id = c.id AND cs.date = CURRENT_DATE
       LEFT JOIN time_slots ts ON ts.court_id = c.id AND ts.date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '13 days'
       WHERE v.status IN ('active', 'pending', 'pending_approval')
         AND ($1::text IS NULL OR v.owner_id::text = $1)
         AND (
           $2::text IN ('venue_owner', 'admin', 'staff')
           OR (
             v.status = 'active'
             AND c.status = 'open'
             AND (ts.id IS NULL OR (ts.is_booked = FALSE AND ts.is_blocked = FALSE AND ts.is_maintenance = FALSE))
           )
         )
       ORDER BY v.created_at DESC, c.name, ts.date, ts.start_time`,
      [req.user?.role === "venue_owner" ? req.user.id : null, req.user?.role || "public"]
    )).rows;
    const venues = /* @__PURE__ */ new Map();
    for (const row of rows) {
      if (!venues.has(row.id)) {
        venues.set(row.id, {
          id: row.id,
          venueId: row.id,
          ownerId: row.owner_id,
          name: row.name,
          sport: row.sport || row.primary_sport || "all",
          address: row.address,
          district: row.district || row.city || "",
          rating: Number(row.rating || 0),
          reviewsCount: Number(row.reviews_count || 0),
          imageUrl: row.image_url || "",
          priceMin: Number(row.price_min || 0),
          latitude: row.latitude ? Number(row.latitude) : void 0,
          longitude: row.longitude ? Number(row.longitude) : void 0,
          description: row.description || "",
          amenities: row.amenities || [],
          subCourts: []
        });
      }
      const venue = venues.get(row.id);
      if (!row.court_id) continue;
      let sub = venue.subCourts.find((item) => item.id === row.court_id);
      if (!sub) {
        sub = {
          id: row.court_id,
          name: row.court_name,
          sport: row.sport,
          status: row.court_status,
          pricePerHour: Number(row.price_min || 0),
          description: row.court_description || "",
          openingTime: row.schedule_opening_time ? String(row.schedule_opening_time).slice(0, 5) : "06:00",
          closingTime: row.schedule_closing_time ? String(row.schedule_closing_time).slice(0, 5) : "22:00",
          slotDuration: Number(row.schedule_slot_duration || 60),
          slots: {}
        };
        venue.subCourts.push(sub);
      }
      if (row.slot_id) {
        const date = String(row.slot_date || formatDatabaseDate(row.date));
        sub.slots[date] ||= [];
        sub.slots[date].push({
          id: row.slot_id,
          court_id: row.court_id,
          venue_id: row.id,
          date,
          start_time: String(row.start_time).slice(0, 5),
          end_time: String(row.end_time).slice(0, 5),
          status: row.is_maintenance ? "maintenance" : row.is_booked ? "booked" : row.is_blocked ? "blocked" : "available",
          time: `${String(row.start_time).slice(0, 5)} - ${String(row.end_time).slice(0, 5)}`,
          price: Number(row.slot_price || row.price_min || 0),
          isPeak: row.is_peak,
          isBooked: row.is_booked,
          isBlocked: row.is_blocked,
          isMaintenance: row.is_maintenance
        });
      }
    }
    res.json([...venues.values()]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/courts/:id/time-slots", authOptional, async (req, res) => {
  try {
    const date = String(req.query.date || "");
    if (!isDateString(date)) return res.status(400).json({ error: "Invalid date. Expected YYYY-MM-DD." });
    const courtAccess = (await query2(
      `SELECT c.status, v.owner_id
       FROM courts c JOIN venues v ON v.id = c.venue_id
       WHERE c.id = $1`,
      [req.params.id]
    )).rows[0];
    if (!courtAccess) return res.status(404).json({ error: "Court not found." });
    const canManage = req.user && (["admin", "staff"].includes(req.user.role) || courtAccess.owner_id === req.user.id);
    if (courtAccess.status !== "open" && !canManage) return res.json([]);
    await ensureCourtTimeSlots(req.params.id, date);
    const rows = (await query2(
      `SELECT ts.*, ts.date::text AS slot_date, c.venue_id, c.price_min
       FROM time_slots ts
       JOIN courts c ON c.id = ts.court_id
       WHERE ts.court_id = $1 AND ts.date = $2
         AND ($3::boolean OR (ts.is_booked = FALSE AND ts.is_blocked = FALSE AND ts.is_maintenance = FALSE))
       ORDER BY start_time`,
      [req.params.id, date, Boolean(canManage)]
    )).rows;
    if (!rows.length) {
      console.warn(`[time-slots] No slots available for court ${req.params.id} on ${date}. The court may be closed.`);
    }
    res.json(rows.map(mapSlot));
  } catch (error) {
    const status = error.message === "Court not found." ? 404 : 500;
    console.error("[time-slots:get]", error);
    res.status(status).json({ error: error.message });
  }
});
app.patch("/api/courts/:courtId/time-slots/:slotId", authRequired, async (req, res) => {
  try {
    await ensureTimeSlotSchema();
    const blocked = Boolean(req.body.blocked);
    const slot = (await query2(
      `UPDATE time_slots ts
       SET is_blocked = $1
       FROM courts c
       JOIN venues v ON v.id = c.venue_id
       WHERE ts.id = $2 AND ts.court_id = $3 AND c.id = ts.court_id
         AND ($4 = 'admin' OR v.owner_id = $5)
         AND (NOT $1 OR NOT ts.is_booked)
       RETURNING ts.*`,
      [blocked, req.params.slotId, req.params.courtId, req.user.role, req.user.id]
    )).rows[0];
    if (!slot) return res.status(409).json({ error: "Time slot not found, access denied, or the slot is already booked." });
    res.json({ success: true, isBlocked: blocked });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.get("/api/owner/courts/:courtId/time-slots", authRequired, async (req, res) => {
  try {
    await ensureTimeSlotSchema();
    const date = String(req.query.date || "");
    if (!isDateString(date)) return res.status(400).json({ error: "Invalid date. Expected YYYY-MM-DD." });
    const court = await ownerCourt(req.params.courtId, req.user);
    if (!court) return res.status(403).json({ error: "Court not found or access denied." });
    await ensureCourtTimeSlots(court.id, date);
    const schedule = (await query2(
      "SELECT * FROM court_schedules WHERE court_id = $1 AND date = $2",
      [court.id, date]
    )).rows[0];
    const slots = (await query2(
      `SELECT ts.*, ts.date::text AS slot_date, c.venue_id, c.price_min
       FROM time_slots ts JOIN courts c ON c.id = ts.court_id
       WHERE ts.court_id = $1 AND ts.date = $2 ORDER BY ts.start_time`,
      [court.id, date]
    )).rows;
    res.json({
      courtId: court.id,
      date,
      openingTime: String(schedule?.opening_time || court.opening_hour || "06:00").slice(0, 5),
      closingTime: String(schedule?.closing_time || court.closing_hour || "22:00").slice(0, 5),
      slotDuration: Number(schedule?.slot_duration || 60),
      status: court.status,
      pricePerHour: courtPricePerHour(court),
      slots: slots.map(mapSlot)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/owner/dashboard-stats", authRequired, async (req, res) => {
  try {
    await ensureBookingPaymentSchema();
    if (!["venue_owner", "admin", "staff"].includes(req.user.role)) {
      return res.status(403).json({ error: "Owner dashboard access required." });
    }
    const ownerFilter = req.user.role === "venue_owner" ? "WHERE v.owner_id = $1" : "";
    const params = req.user.role === "venue_owner" ? [req.user.id] : [];
    const bookingStats = (await query2(
      `SELECT
         COUNT(*)::integer AS total_bookings,
         COUNT(*) FILTER (WHERE b.status = 'pending_payment_verification')::integer AS pending_bookings,
         COALESCE(SUM(b.total_price) FILTER (
           WHERE b.status IN ('confirmed', 'completed') AND b.payment_status = 'paid'
             AND b.date = CURRENT_DATE
         ), 0)::bigint AS today_revenue,
         COALESCE(SUM(b.total_price) FILTER (
           WHERE b.status IN ('confirmed', 'completed') AND b.payment_status = 'paid'
             AND b.date >= DATE_TRUNC('month', CURRENT_DATE)::date
             AND b.date < (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month')::date
         ), 0)::bigint AS monthly_revenue
       FROM bookings b
       JOIN venues v ON v.id = b.venue_id
       ${ownerFilter}`,
      params
    )).rows[0];
    const occupancy = (await query2(
      `SELECT
         COUNT(ts.id)::integer AS total_slots,
         COUNT(ts.id) FILTER (WHERE ts.is_booked = TRUE)::integer AS occupied_slots
       FROM time_slots ts
       JOIN courts c ON c.id = ts.court_id
       JOIN venues v ON v.id = c.venue_id
       ${ownerFilter}${ownerFilter ? " AND" : " WHERE"} ts.date = CURRENT_DATE`,
      params
    )).rows[0];
    const totalSlots = Number(occupancy.total_slots || 0);
    const occupiedSlots = Number(occupancy.occupied_slots || 0);
    res.json({
      totalBookings: Number(bookingStats.total_bookings || 0),
      pendingBookings: Number(bookingStats.pending_bookings || 0),
      todayRevenue: Number(bookingStats.today_revenue || 0),
      monthlyRevenue: Number(bookingStats.monthly_revenue || 0),
      occupancyRate: totalSlots ? Math.round(occupiedSlots / totalSlots * 100) : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.patch("/api/owner/courts/:courtId/schedule", authRequired, async (req, res) => {
  try {
    await ensureTimeSlotSchema();
    const { date, openingTime, closingTime, slotDuration = 60, status = "open" } = req.body;
    if (!isDateString(date)) return res.status(400).json({ error: "Invalid date. Expected YYYY-MM-DD." });
    if (![30, 60, 90, 120].includes(Number(slotDuration))) return res.status(400).json({ error: "Invalid slot duration." });
    if (!["open", "closed", "maintenance"].includes(status)) return res.status(400).json({ error: "Invalid court status." });
    if (minutesFromTime(openingTime) >= minutesFromTime(closingTime)) return res.status(400).json({ error: "Closing time must be after opening time." });
    const court = await ownerCourt(req.params.courtId, req.user);
    if (!court) return res.status(403).json({ error: "Court not found or access denied." });
    await query2(
      `INSERT INTO court_schedules (court_id, date, opening_time, closing_time, slot_duration, status)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (court_id, date) DO UPDATE SET
         opening_time = EXCLUDED.opening_time,
         closing_time = EXCLUDED.closing_time,
         slot_duration = EXCLUDED.slot_duration,
         status = EXCLUDED.status,
         updated_at = NOW()`,
      [court.id, date, openingTime, closingTime, Number(slotDuration), status]
    );
    await query2("UPDATE courts SET status = $1 WHERE id = $2", [status, court.id]);
    if (status !== "open") {
      await query2(
        `UPDATE time_slots SET is_blocked = TRUE, is_maintenance = $3
         WHERE court_id = $1 AND date = $2 AND is_booked = FALSE`,
        [court.id, date, status === "maintenance"]
      );
    } else {
      await query2(
        `UPDATE time_slots SET is_blocked = FALSE, is_maintenance = FALSE
         WHERE court_id = $1 AND date = $2 AND is_booked = FALSE`,
        [court.id, date]
      );
    }
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.post("/api/owner/courts/:courtId/time-slots/generate", authRequired, async (req, res) => {
  const client = await pool2.connect();
  try {
    await ensureTimeSlotSchema();
    const { date, openingTime, closingTime, slotDuration = 60, status = "open" } = req.body;
    if (!isDateString(date)) return res.status(400).json({ error: "Invalid date. Expected YYYY-MM-DD." });
    if (![30, 60, 90, 120].includes(Number(slotDuration))) return res.status(400).json({ error: "Invalid slot duration." });
    if (!["open", "closed", "maintenance"].includes(status)) return res.status(400).json({ error: "Invalid court status." });
    const court = await ownerCourt(req.params.courtId, req.user);
    if (!court) return res.status(403).json({ error: "Court not found or access denied." });
    if (minutesFromTime(openingTime) >= minutesFromTime(closingTime)) return res.status(400).json({ error: "Closing time must be after opening time." });
    await client.query("BEGIN");
    await client.query(
      `INSERT INTO court_schedules (court_id, date, opening_time, closing_time, slot_duration, status)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (court_id, date) DO UPDATE SET
         opening_time = EXCLUDED.opening_time, closing_time = EXCLUDED.closing_time,
         slot_duration = EXCLUDED.slot_duration, status = EXCLUDED.status, updated_at = NOW()`,
      [court.id, date, openingTime, closingTime, Number(slotDuration), status]
    );
    await client.query("UPDATE courts SET status = $1 WHERE id = $2", [status, court.id]);
    if (status === "open") {
      await client.query("DELETE FROM time_slots WHERE court_id = $1 AND date = $2 AND is_booked = FALSE", [court.id, date]);
      const booked = (await client.query(
        "SELECT start_time, end_time FROM time_slots WHERE court_id = $1 AND date = $2 AND is_booked = TRUE",
        [court.id, date]
      )).rows;
      for (const [start, end] of buildSlotRanges(openingTime, closingTime, Number(slotDuration))) {
        const overlapsBooked = booked.some((slot) => minutesFromTime(start) < minutesFromTime(String(slot.end_time)) && minutesFromTime(end) > minutesFromTime(String(slot.start_time)));
        if (overlapsBooked) continue;
        await client.query(
          `INSERT INTO time_slots (court_id, date, start_time, end_time, price, is_peak, is_blocked, is_maintenance)
           VALUES ($1,$2,$3,$4,$5,$6,FALSE,FALSE)
           ON CONFLICT (court_id, date, start_time, end_time) DO NOTHING`,
          [court.id, date, start, end, priceForSlot(court), Number(start.slice(0, 2)) >= 16 && Number(start.slice(0, 2)) <= 20]
        );
      }
    } else {
      await client.query(
        `UPDATE time_slots SET is_blocked = TRUE, is_maintenance = $3
         WHERE court_id = $1 AND date = $2 AND is_booked = FALSE`,
        [court.id, date, status === "maintenance"]
      );
    }
    await client.query("COMMIT");
    const slots = (await query2(
      `SELECT ts.*, ts.date::text AS slot_date, c.venue_id, c.price_min
       FROM time_slots ts JOIN courts c ON c.id = ts.court_id
       WHERE ts.court_id = $1 AND ts.date = $2 ORDER BY ts.start_time`,
      [court.id, date]
    )).rows;
    res.json({ success: true, slots: slots.map(mapSlot) });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(400).json({ error: error.message });
  } finally {
    client.release();
  }
});
app.patch("/api/owner/time-slots/:slotId", authRequired, async (req, res) => {
  try {
    await ensureTimeSlotSchema();
    const status = String(req.body.status || "");
    if (!["available", "locked", "maintenance"].includes(status)) return res.status(400).json({ error: "Invalid slot status." });
    const slot = (await query2(
      `UPDATE time_slots ts SET
         is_blocked = $1,
         is_maintenance = $2
       FROM courts c JOIN venues v ON v.id = c.venue_id
       WHERE ts.id = $3 AND c.id = ts.court_id
         AND ($4 = 'admin' OR $4 = 'staff' OR v.owner_id = $5)
         AND ts.is_booked = FALSE
       RETURNING ts.*`,
      [status !== "available", status === "maintenance", req.params.slotId, req.user.role, req.user.id]
    )).rows[0];
    if (!slot) return res.status(409).json({ error: "Booked slot cannot be edited, or access was denied." });
    res.json(mapSlot(slot));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.post("/api/courts", authRequired, async (req, res) => {
  try {
    const { venueId, name, sport, capacity, description, status = "open" } = req.body;
    const pricePerHour = Math.max(0, Number(req.body.pricePerHour ?? req.body.priceMin ?? 0));
    if (!String(name || "").trim()) return res.status(400).json({ error: "T\xEAn s\xE2n l\xE0 b\u1EAFt bu\u1ED9c." });
    if (!["open", "closed", "maintenance"].includes(status)) return res.status(400).json({ error: "Tr\u1EA1ng th\xE1i s\xE2n kh\xF4ng h\u1EE3p l\u1EC7." });
    const venue = (await query2("SELECT * FROM venues WHERE id = $1 AND owner_id = $2", [venueId, req.user.id])).rows[0];
    if (!venue && req.user.role !== "admin") return res.status(403).json({ error: "You can only add courts to your own venue." });
    const row = (await query2(
      `INSERT INTO courts (venue_id, name, sport, price_min, price_peak, capacity, description, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [venueId, String(name).trim(), sport, pricePerHour, pricePerHour, capacity || null, description || null, status]
    )).rows[0];
    res.status(201).json(row);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.patch("/api/owner/courts/:courtId", authRequired, async (req, res) => {
  const client = await pool2.connect();
  try {
    const court = await ownerCourt(req.params.courtId, req.user);
    if (!court) return res.status(403).json({ error: "Court not found or access denied." });
    const name = String(req.body.name || court.name).trim();
    const sport = req.body.sport || court.sport;
    const status = req.body.status || court.status;
    const price = Number(req.body.pricePerHour ?? req.body.priceMin ?? court.price_min);
    if (!name) return res.status(400).json({ error: "T\xEAn s\xE2n l\xE0 b\u1EAFt bu\u1ED9c." });
    if (!["open", "closed", "maintenance"].includes(status)) return res.status(400).json({ error: "Tr\u1EA1ng th\xE1i s\xE2n kh\xF4ng h\u1EE3p l\u1EC7." });
    const normalizedPrice = Math.max(0, price || 0);
    await client.query("BEGIN");
    const updated = (await client.query(
      `UPDATE courts
       SET name = $1, sport = $2, status = $3, price_min = $4, price_peak = $4,
           description = $5
       WHERE id = $6
       RETURNING *`,
      [name, sport, status, normalizedPrice, req.body.description || null, court.id]
    )).rows[0];
    await client.query(
      `UPDATE time_slots ts
       SET price = $2
       WHERE ts.court_id = $1
         AND ts.date >= CURRENT_DATE
         AND ts.is_booked = FALSE
         AND NOT EXISTS (
           SELECT 1 FROM bookings b
           WHERE b.time_slot_id = ts.id
             AND b.status NOT IN ('cancelled', 'payment_rejected')
         )`,
      [court.id, normalizedPrice]
    );
    if (status !== "open") {
      await client.query(
        `UPDATE time_slots
         SET is_blocked = TRUE, is_maintenance = $2
         WHERE court_id = $1 AND is_booked = FALSE
           AND NOT EXISTS (
             SELECT 1 FROM bookings b
             WHERE b.time_slot_id = time_slots.id
               AND b.status NOT IN ('cancelled', 'payment_rejected')
           )`,
        [court.id, status === "maintenance"]
      );
    } else {
      await client.query(
        `UPDATE time_slots
         SET is_blocked = FALSE, is_maintenance = FALSE
         WHERE court_id = $1 AND is_booked = FALSE
           AND NOT EXISTS (
             SELECT 1 FROM bookings b
             WHERE b.time_slot_id = time_slots.id
               AND b.status NOT IN ('cancelled', 'payment_rejected')
           )`,
        [court.id]
      );
    }
    await client.query("COMMIT");
    res.json({ ...updated, pricePerHour: Number(updated.price_min || 0) });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => void 0);
    res.status(400).json({ error: error.message });
  } finally {
    client.release();
  }
});
app.delete("/api/owner/courts/:courtId", authRequired, async (req, res) => {
  const client = await pool2.connect();
  try {
    await client.query("BEGIN");
    const court = await ownerCourt(req.params.courtId, req.user);
    if (!court) throw new Error("Court not found or access denied.");
    const bookingCount = Number((await client.query(
      "SELECT COUNT(*) FROM bookings WHERE court_id = $1",
      [court.id]
    )).rows[0].count);
    if (bookingCount > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "Kh\xF4ng th\u1EC3 x\xF3a s\xE2n \u0111\xE3 c\xF3 booking." });
    }
    await client.query("DELETE FROM courts WHERE id = $1", [court.id]);
    await client.query("COMMIT");
    res.json({ success: true });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => void 0);
    res.status(400).json({ error: error.message });
  } finally {
    client.release();
  }
});
app.get("/api/venues", authOptional, async (_req, res) => {
  const rows = (await query2("SELECT * FROM venues ORDER BY created_at DESC")).rows;
  res.json(rows);
});
app.post("/api/venues", authRequired, async (req, res) => {
  const client = await pool2.connect();
  try {
    const { name, address, district, sport, pricePerHour, openingHour, closingHour, closedDays, description, imageUrl } = req.body;
    await client.query("BEGIN");
    const request = (await client.query(
      `INSERT INTO venue_requests (owner_id, name, address, district, sport, price_per_hour, opening_hour, closing_hour, closed_days, description, image_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [req.user.id, name, address, district, sport, pricePerHour || 0, openingHour || "05:00", closingHour || "22:00", closedDays || "Kh\xF4ng", description || null, imageUrl || null]
    )).rows[0];
    await client.query("COMMIT");
    res.status(201).json(request);
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(400).json({ error: error.message });
  } finally {
    client.release();
  }
});
app.get("/api/venue-requests", authOptional, async (req, res) => {
  const rows = (await query2(
    `SELECT vr.*, u.full_name AS owner_name, u.phone AS owner_phone
     FROM venue_requests vr
     JOIN users u ON u.id = vr.owner_id
     LEFT JOIN user_profiles up ON up.user_id = u.id
     WHERE $1::text IS NULL OR vr.owner_id::text = $1
     ORDER BY vr.created_at DESC`,
    [req.user?.role === "venue_owner" ? req.user.id : null]
  )).rows;
  res.json(rows.map((row) => ({
    id: row.id,
    ownerId: row.owner_id,
    ownerName: row.owner_name || "",
    ownerPhone: row.owner_phone || "",
    name: row.name,
    address: row.address,
    district: row.district || "",
    sport: row.sport,
    pricePerHour: Number(row.price_per_hour || 0),
    openingHour: String(row.opening_hour).slice(0, 5),
    closingHour: String(row.closing_hour).slice(0, 5),
    closedDays: row.closed_days,
    description: row.description || "",
    imageUrl: row.image_url || "",
    status: row.status === "pending_approval" ? "pending" : row.status === "active" ? "approved" : row.status === "closed" ? "rejected" : row.status,
    rejectionReason: row.rejection_reason || "",
    createdAt: row.created_at,
    reviewedAt: row.reviewed_at
  })));
});
app.post("/api/venue-requests/:id/approve", authRequired, async (req, res) => {
  const client = await pool2.connect();
  try {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Admin only" });
    await client.query("BEGIN");
    const request = (await client.query("SELECT * FROM venue_requests WHERE id = $1 FOR UPDATE", [req.params.id])).rows[0];
    if (!request) return res.status(404).json({ error: "Request not found" });
    await client.query("UPDATE venue_requests SET status = $1, reviewed_at = NOW() WHERE id = $2", ["active", req.params.id]);
    const venue = (await client.query(
      `INSERT INTO venues (
         owner_id, name, address, district, description, image_url, status,
         opening_hour, closing_hour, primary_sport
       )
       VALUES ($1,$2,$3,$4,$5,$6,'active',$7,$8,$9) RETURNING *`,
      [
        request.owner_id,
        request.name,
        request.address,
        request.district,
        request.description,
        request.image_url,
        request.opening_hour,
        request.closing_hour,
        request.sport
      ]
    )).rows[0];
    await client.query("COMMIT");
    res.json({ success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(400).json({ error: error.message });
  } finally {
    client.release();
  }
});
app.post("/api/venue-requests/:id/reject", authRequired, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Admin only" });
  await query2("UPDATE venue_requests SET status = $1, rejection_reason = $2, reviewed_at = NOW() WHERE id = $3", ["closed", req.body.reason || "Rejected", req.params.id]);
  res.json({ success: true });
});
app.get("/api/bookings", authOptional, async (req, res) => {
  try {
    if (!req.user) return res.json([]);
    if (req.user.role === "venue_owner") {
      return res.json(await bookingRows("WHERE v.owner_id = $1", [req.user.id]));
    }
    if (req.user.role === "admin" || req.user.role === "staff") return res.json(await bookingRows());
    res.json(await bookingRows("WHERE b.user_id = $1", [req.user.id]));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/bookings/history", authRequired, async (req, res) => {
  try {
    res.json(await bookingRows("WHERE b.user_id = $1", [req.user.id]));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/bookings/:id/payment-info", authRequired, async (req, res) => {
  try {
    const bookings = await bookingRows(
      `WHERE b.id = $1 AND (b.user_id = $2 OR $3 IN ('admin', 'staff') OR v.owner_id = $2)`,
      [req.params.id, req.user.id, req.user.role]
    );
    const booking = bookings[0];
    if (!booking) return res.status(404).json({ error: "Booking not found." });
    const groupAmount = booking.bookingGroupId ? Number((await query2(
      "SELECT COALESCE(SUM(total_price), 0) AS amount FROM bookings WHERE booking_group_id = $1",
      [booking.bookingGroupId]
    )).rows[0].amount) : booking.price;
    res.json({
      bookingId: booking.id,
      bookingCode: booking.bookingCode,
      amount: groupAmount,
      ...PAYMENT_BANK_INFO,
      paymentStatus: booking.paymentStatus,
      bookingStatus: booking.status
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/bookings", authRequired, async (req, res) => {
  const client = await pool2.connect();
  try {
    const { subCourtId, date, slotId, timeSlotIds, extrasPrice = 0, notes } = req.body;
    const requestedSlotIds = [...new Set(
      (Array.isArray(timeSlotIds) ? timeSlotIds : [slotId]).filter((id) => typeof id === "string" && id.length > 0)
    )];
    if (requestedSlotIds.length === 0) {
      return res.status(400).json({ error: "Khung gi\u1EDD n\xE0y ch\u01B0a \u0111\u01B0\u1EE3c t\u1EA1o trong h\u1EC7 th\u1ED1ng. Vui l\xF2ng th\u1EED l\u1EA1i ho\u1EB7c ch\u1ECDn ng\xE0y kh\xE1c." });
    }
    if (requestedSlotIds.some((id) => !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id))) {
      return res.status(400).json({ error: "Khung gi\u1EDD n\xE0y ch\u01B0a \u0111\u01B0\u1EE3c t\u1EA1o trong h\u1EC7 th\u1ED1ng. Vui l\xF2ng th\u1EED l\u1EA1i ho\u1EB7c ch\u1ECDn ng\xE0y kh\xE1c." });
    }
    await client.query("BEGIN");
    await ensureTimeSlotSchema();
    await ensureBookingPaymentSchema();
    const slots = (await client.query(
      `SELECT ts.*, ts.date::text AS slot_date, c.venue_id, c.status AS court_status,
              c.price_min, v.status AS venue_status
       FROM time_slots ts
       JOIN courts c ON c.id = ts.court_id
       JOIN venues v ON v.id = c.venue_id
       WHERE ts.id = ANY($1::uuid[])
       FOR UPDATE`,
      [requestedSlotIds]
    )).rows;
    if (slots.length !== requestedSlotIds.length) {
      throw new Error("Khung gi\u1EDD n\xE0y ch\u01B0a \u0111\u01B0\u1EE3c t\u1EA1o trong h\u1EC7 th\u1ED1ng. Vui l\xF2ng th\u1EED l\u1EA1i ho\u1EB7c ch\u1ECDn ng\xE0y kh\xE1c.");
    }
    const slotById = new Map(slots.map((slot) => [slot.id, slot]));
    const orderedSlots = requestedSlotIds.map((id) => slotById.get(id));
    for (const slot of orderedSlots) {
      if (date && String(slot.slot_date) !== date) throw new Error("Ng\xE0y c\u1EE7a khung gi\u1EDD kh\xF4ng h\u1EE3p l\u1EC7.");
      if (subCourtId && requestedSlotIds.length === 1 && slot.court_id !== subCourtId) throw new Error("Khung gi\u1EDD kh\xF4ng thu\u1ED9c s\xE2n \u0111\xE3 ch\u1ECDn.");
      if (slot.court_status !== "open") {
        throw new Error("S\xE2n \u0111ang t\u1EA1m \u0111\xF3ng ho\u1EB7c b\u1EA3o tr\xEC.");
      }
      if (slot.venue_status !== "active") {
        throw new Error("C\u01A1 s\u1EDF hi\u1EC7n kh\xF4ng nh\u1EADn \u0111\u1EB7t s\xE2n.");
      }
      if (slot.is_booked || slot.is_blocked || slot.is_maintenance) {
        throw new Error("M\u1ED9t ho\u1EB7c nhi\u1EC1u khung gi\u1EDD kh\xF4ng c\xF2n kh\u1EA3 d\u1EE5ng.");
      }
    }
    await client.query(
      `UPDATE time_slots SET is_blocked = TRUE, booked_by = $1 WHERE id = ANY($2::uuid[])`,
      [req.user.id, requestedSlotIds]
    );
    const bookingGroupId = randomUUID();
    const createdBookingIds = [];
    for (let index = 0; index < orderedSlots.length; index += 1) {
      const slot = orderedSlots[index];
      const bookingId = randomUUID();
      const bookingCode = bookingCodeFromId(bookingId);
      const timeRange = `${String(slot.start_time).slice(0, 5)} - ${String(slot.end_time).slice(0, 5)}`;
      const databaseSlotPrice = Number(slot.price) > 0 ? Number(slot.price) : courtPricePerHour(slot);
      const total = databaseSlotPrice + (index === 0 ? Math.max(0, Number(extrasPrice || 0)) : 0);
      const booking = (await client.query(
        `INSERT INTO bookings (
           id, user_id, court_id, venue_id, time_slot_id, date, time_range, total_price,
           status, payment_status, booking_group_id, booking_code, transfer_content, qr_code, notes
         )
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'pending_payment_verification','pending_transfer',$9,$10,$11,$12,$13)
         RETURNING id`,
        [bookingId, req.user.id, slot.court_id, slot.venue_id, slot.id, slot.slot_date, timeRange, total, bookingGroupId, bookingCode, bookingCode, `SPORTRES-B-${bookingCode}`, notes || null]
      )).rows[0];
      createdBookingIds.push(booking.id);
    }
    await client.query("COMMIT");
    const createdBookings = await bookingRows("WHERE b.id = ANY($1::uuid[])", [createdBookingIds]);
    res.status(201).json({
      bookings: createdBookingIds.map((id) => createdBookings.find((booking) => booking.id === id))
    });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(400).json({ error: error.message });
  } finally {
    client.release();
  }
});
app.post("/api/bookings/:id/confirm-transfer", authRequired, async (req, res) => {
  try {
    await ensureBookingPaymentSchema();
    const booking = (await query2(
      `WITH target AS (
         SELECT booking_group_id FROM bookings WHERE id = $1 AND user_id = $2
       )
       UPDATE bookings
       SET payment_status = 'waiting_admin_confirmation',
           status = 'pending_payment_verification'
       WHERE user_id = $2
         AND payment_status = 'pending_transfer'
         AND (id = $1 OR booking_group_id = (SELECT booking_group_id FROM target))
       RETURNING *`,
      [req.params.id, req.user.id]
    )).rows[0];
    if (!booking) return res.status(409).json({ error: "Booking kh\xF4ng t\u1ED3n t\u1EA1i ho\u1EB7c \u0111\xE3 g\u1EEDi x\xE1c nh\u1EADn chuy\u1EC3n kho\u1EA3n." });
    res.json({ success: true, booking: mapBooking(booking) });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.get("/api/admin/bookings/pending-payments", authRequired, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Admin only." });
  try {
    res.json(await bookingRows(`WHERE b.payment_status = 'waiting_admin_confirmation'`));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/admin/bookings/:id/approve-payment", authRequired, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Admin only." });
  const client = await pool2.connect();
  try {
    await client.query("BEGIN");
    await ensureBookingPaymentSchema();
    const booking = (await client.query(
      `WITH target AS (
         SELECT booking_group_id FROM bookings WHERE id = $1
       )
       UPDATE bookings
       SET payment_status = 'paid', status = 'confirmed'
       WHERE payment_status = 'waiting_admin_confirmation'
         AND status = 'pending_payment_verification'
         AND (id = $1 OR booking_group_id = (SELECT booking_group_id FROM target))
       RETURNING *`,
      [req.params.id]
    )).rows[0];
    if (!booking) throw new Error("Booking kh\xF4ng c\xF2n \u1EDF tr\u1EA1ng th\xE1i ch\u1EDD x\xE1c minh.");
    await client.query(
      `UPDATE time_slots ts
       SET is_booked = TRUE, is_blocked = FALSE, booked_by = b.user_id
       FROM bookings b
       WHERE ts.id = b.time_slot_id
         AND (b.id = $1 OR b.booking_group_id = $2)`,
      [booking.id, booking.booking_group_id]
    );
    await client.query("COMMIT");
    res.json({ success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(409).json({ error: error.message });
  } finally {
    client.release();
  }
});
app.post("/api/admin/bookings/:id/reject-payment", authRequired, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Admin only." });
  const client = await pool2.connect();
  try {
    await client.query("BEGIN");
    await ensureBookingPaymentSchema();
    const booking = (await client.query(
      `WITH target AS (
         SELECT booking_group_id FROM bookings WHERE id = $1
       )
       UPDATE bookings
       SET payment_status = 'rejected', status = 'payment_rejected'
       WHERE payment_status IN ('pending_transfer', 'waiting_admin_confirmation')
         AND status = 'pending_payment_verification'
         AND (id = $1 OR booking_group_id = (SELECT booking_group_id FROM target))
       RETURNING *`,
      [req.params.id]
    )).rows[0];
    if (!booking) throw new Error("Booking kh\xF4ng c\xF2n \u1EDF tr\u1EA1ng th\xE1i c\xF3 th\u1EC3 t\u1EEB ch\u1ED1i.");
    await client.query(
      `UPDATE time_slots ts
       SET is_booked = FALSE, is_blocked = FALSE, booked_by = NULL
       FROM bookings b
       WHERE ts.id = b.time_slot_id
         AND (b.id = $1 OR b.booking_group_id = $2)`,
      [booking.id, booking.booking_group_id]
    );
    await client.query("COMMIT");
    res.json({ success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(409).json({ error: error.message });
  } finally {
    client.release();
  }
});
app.patch("/api/bookings/:id/status", authRequired, async (req, res) => {
  try {
    const status = String(req.body.status || "");
    if (!["completed", "cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid booking status." });
    }
    const booking = (await query2(
      `UPDATE bookings b
       SET status = $1,
           payment_status = CASE
             WHEN $1 = 'cancelled' AND b.payment_status IN ('pending_transfer', 'waiting_admin_confirmation') THEN 'rejected'
             ELSE b.payment_status
           END,
           completed_at = CASE WHEN $1 = 'completed' THEN NOW() ELSE b.completed_at END,
           cancelled_at = CASE WHEN $1 = 'cancelled' THEN NOW() ELSE b.cancelled_at END
       FROM venues v
       WHERE b.id = $2
         AND v.id = b.venue_id
         AND (
           $3 IN ('admin', 'staff')
           OR ($3 = 'player' AND b.user_id = $4 AND $1 IN ('cancelled', 'completed'))
         )
       RETURNING b.*`,
      [status, req.params.id, req.user.role, req.user.id]
    )).rows[0];
    if (!booking) return res.status(403).json({ error: "Booking not found or status update is not allowed." });
    if (status === "cancelled") {
      await query2("UPDATE time_slots SET is_booked = FALSE, is_blocked = FALSE, booked_by = NULL WHERE id = $1", [booking.time_slot_id]);
    }
    res.json({ success: true, booking: mapBooking(booking) });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.get("/api/matches", authOptional, async (_req, res) => {
  try {
    res.json(await matchRows());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/matches", authRequired, async (req, res) => {
  const client = await pool2.connect();
  try {
    const { title, sport, courtId, bookingId, address, date, time, level, maxPlayers, pricePerPlayer, description } = req.body;
    await client.query("BEGIN");
    await ensureMatchSchema();
    const linkedBooking = bookingId ? (await client.query(
      `SELECT b.*
           FROM bookings b
           WHERE b.id = $1 AND b.user_id = $2
           FOR UPDATE`,
      [bookingId, req.user.id]
    )).rows[0] : null;
    if (bookingId && !linkedBooking) {
      throw new Error("Booking kh\xF4ng h\u1EE3p l\u1EC7 ho\u1EB7c kh\xF4ng thu\u1ED9c ng\u01B0\u1EDDi d\xF9ng hi\u1EC7n t\u1EA1i.");
    }
    const court = linkedBooking ? (await client.query("SELECT * FROM courts WHERE id = $1", [linkedBooking.court_id])).rows[0] : (await client.query("SELECT * FROM courts WHERE venue_id = $1 LIMIT 1", [courtId])).rows[0];
    const venue = court ? court.venue_id : null;
    const match = (await client.query(
      `INSERT INTO matches (creator_id, booking_id, court_id, venue_id, title, sport, address, match_date, match_time, skill_level, max_players, price_per_player, status, description)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'open',$13) RETURNING *`,
      [req.user.id, linkedBooking?.id || null, court?.id || null, venue, title, sport, address || null, date, String(time).slice(0, 5), level, maxPlayers || 10, pricePerPlayer || 0, description || null]
    )).rows[0];
    await client.query("INSERT INTO match_participants (match_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [match.id, req.user.id]);
    await client.query("COMMIT");
    res.status(201).json((await matchRows()).find((item) => item.id === match.id));
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(400).json({ error: error.message });
  } finally {
    client.release();
  }
});
app.post("/api/matches/:id/join", authRequired, async (req, res) => {
  try {
    await query2("INSERT INTO match_participants (match_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [req.params.id, req.user.id]);
    const count = Number((await query2("SELECT COUNT(*) FROM match_participants WHERE match_id = $1", [req.params.id])).rows[0].count);
    const match = (await query2("SELECT max_players FROM matches WHERE id = $1", [req.params.id])).rows[0];
    if (match && count >= Number(match.max_players)) {
      await query2("UPDATE matches SET status = $1 WHERE id = $2", ["full", req.params.id]);
    }
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.post("/api/assistant", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const response = await handleAssistantRequest(req.body, apiKey);
    res.json(response);
  } catch (error) {
    console.error("Server side error handling assistant request:", error);
    res.status(500).json({
      success: false,
      text: "\u0110\xE3 x\u1EA3y ra l\u1ED7i h\u1EC7 th\u1ED1ng khi li\xEAn h\u1EC7 tr\u1EE3 l\xFD \u1EA3o.",
      error: error.message
    });
  }
});
app.get("/api/health", async (_req, res) => {
  try {
    await query2("SELECT 1");
    res.json({ status: "ok", database: "ok", time: (/* @__PURE__ */ new Date()).toISOString() });
  } catch (error) {
    res.status(500).json({ status: "error", database: error.message, time: (/* @__PURE__ */ new Date()).toISOString() });
  }
});
app.use(express.static(path.join(__dirname, "dist")));
app.all("/api/*", (req, res) => {
  console.warn("[api] Route not found", { method: req.method, endpoint: req.originalUrl });
  res.status(404).json({ error: `API route not found: ${req.method} ${req.path}` });
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
var PORT = Number(process.env.PORT || 3e3);
app.listen(PORT, "0.0.0.0", () => {
  console.log(`[SportRes API Server] Listening on http://localhost:${PORT}`);
  ensureTimeSlots().then(() => console.log("[SportRes slots] Default 06:00-22:00 availability repaired for the next 14 days.")).catch((error) => console.error("[SportRes slots] Startup availability repair failed:", error));
});
