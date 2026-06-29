var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// database-config.ts
import { readFileSync } from "node:fs";
var CERT_VERIFYING_SSL_MODES, TLS_REQUIRING_SSL_MODES, getDatabaseUrl, parseDatabaseUrl, getSslMode, readSslFile, removeSslSearchParams, createDatabaseSslConfig, createDatabasePoolConfig;
var init_database_config = __esm({
  "database-config.ts"() {
    CERT_VERIFYING_SSL_MODES = /* @__PURE__ */ new Set(["verify-ca", "verify-full"]);
    TLS_REQUIRING_SSL_MODES = /* @__PURE__ */ new Set(["allow", "prefer", "require", "no-verify"]);
    getDatabaseUrl = (connectionString) => connectionString || process.env.DATABASE_URL;
    parseDatabaseUrl = (connectionString) => {
      const databaseUrl = getDatabaseUrl(connectionString);
      if (!databaseUrl) return null;
      try {
        return new URL(databaseUrl);
      } catch {
        return null;
      }
    };
    getSslMode = (databaseUrl) => (databaseUrl?.searchParams.get("sslmode") || process.env.PGSSLMODE || "").toLowerCase();
    readSslFile = (path2, label) => {
      if (!path2) return void 0;
      try {
        return readFileSync(path2, "utf8");
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(`[SportRes DB] Could not read ${label} file at ${path2}: ${message}`);
        return void 0;
      }
    };
    removeSslSearchParams = (connectionString) => {
      const databaseUrl = parseDatabaseUrl(connectionString);
      if (!databaseUrl) return getDatabaseUrl(connectionString);
      databaseUrl.searchParams.delete("sslmode");
      databaseUrl.searchParams.delete("sslcert");
      databaseUrl.searchParams.delete("sslkey");
      databaseUrl.searchParams.delete("sslrootcert");
      return databaseUrl.toString();
    };
    createDatabaseSslConfig = (connectionString) => {
      const databaseUrl = parseDatabaseUrl(connectionString);
      const sslmode = getSslMode(databaseUrl);
      const servername = databaseUrl?.hostname;
      const ca = readSslFile(databaseUrl?.searchParams.get("sslrootcert") || process.env.PGSSLROOTCERT, "sslrootcert");
      const cert = readSslFile(databaseUrl?.searchParams.get("sslcert") || process.env.PGSSLCERT, "sslcert");
      const key = readSslFile(databaseUrl?.searchParams.get("sslkey") || process.env.PGSSLKEY, "sslkey");
      const certificateOptions = {
        ...ca ? { ca } : {},
        ...cert ? { cert } : {},
        ...key ? { key } : {}
      };
      if (CERT_VERIFYING_SSL_MODES.has(sslmode) || ca) {
        return {
          rejectUnauthorized: true,
          ...servername ? { servername } : {},
          ...certificateOptions
        };
      }
      if (sslmode === "disable") {
        console.warn("[SportRes DB] Ignoring sslmode=disable because SSL is required for the configured database connection.");
      } else if (sslmode && !TLS_REQUIRING_SSL_MODES.has(sslmode)) {
        console.warn(`[SportRes DB] Unrecognized sslmode=${sslmode}; using encrypted PostgreSQL connection.`);
      }
      return {
        rejectUnauthorized: false,
        ...servername ? { servername } : {},
        ...certificateOptions
      };
    };
    createDatabasePoolConfig = (connectionString) => ({
      connectionString: removeSslSearchParams(connectionString),
      ssl: createDatabaseSslConfig(connectionString)
    });
  }
});

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
    init_database_config();
    ({ Pool } = pg);
    if (!process.env.DATABASE_URL) {
      console.warn("[SportRes DB] DATABASE_URL is not set. Database API routes will fail until it is configured.");
    }
    pool = new Pool(createDatabasePoolConfig());
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
import multer from "multer";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

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
var inferSupabaseUrlFromDatabaseUrl = () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return "";
  try {
    const parsed = new URL(databaseUrl);
    const usernameProjectRef = parsed.username.match(/^postgres\.([a-z0-9]{20})$/i)?.[1];
    const hostProjectRef = parsed.hostname.match(/^db\.([a-z0-9]{20})\.supabase\.co$/i)?.[1];
    const projectRef = usernameProjectRef || hostProjectRef;
    return projectRef ? `https://${projectRef}.supabase.co` : "";
  } catch {
    return "";
  }
};
var SUPABASE_URL = (process.env.SUPABASE_URL || inferSupabaseUrlFromDatabaseUrl()).replace(/\/$/, "");
var SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || "";
var SUPABASE_STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "media";
var IMAGE_UPLOAD_LIMIT_BYTES = 5 * 1024 * 1024;
var SUPPORTED_IMAGE_EXTENSIONS = /* @__PURE__ */ new Set(["jpg", "jpeg", "png", "webp", "gif", "bmp", "avif", "heic", "heif"]);
var SUPPORTED_IMAGE_MIME_EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/bmp": "bmp",
  "image/x-ms-bmp": "bmp",
  "image/avif": "avif",
  "image/heic": "heic",
  "image/heif": "heif"
};
var getStorageConfigError = () => {
  const missing = [];
  if (!SUPABASE_URL) missing.push("SUPABASE_URL");
  if (!SUPABASE_SERVICE_ROLE_KEY) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (!missing.length) return null;
  return "Supabase Storage ch\u01B0a \u0111\u01B0\u1EE3c c\u1EA5u h\xECnh. Vui l\xF2ng thi\u1EBFt l\u1EADp SUPABASE_URL v\xE0 SUPABASE_SERVICE_ROLE_KEY.";
};
var storageConfigError = getStorageConfigError();
if (storageConfigError) {
  console.warn(`[SportRes Storage] ${storageConfigError}`);
}
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
var imageSchemaReady = null;
async function ensureImageSchema() {
  imageSchemaReady ||= (async () => {
    await query2("ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT");
    await query2("ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS owner_cover_url TEXT");
    await query2("ALTER TABLE courts ADD COLUMN IF NOT EXISTS image_url TEXT");
    await query2("ALTER TABLE courts ADD COLUMN IF NOT EXISTS address TEXT");
    await query2("ALTER TABLE courts ADD COLUMN IF NOT EXISTS latitude double precision");
    await query2("ALTER TABLE courts ADD COLUMN IF NOT EXISTS longitude double precision");
  })();
  await imageSchemaReady;
}
var normalizeVietnameseAddress = (value) => {
  const normalized = String(value || "").normalize("NFC").replace(/\s+/g, " ").replace(/\s*,\s*/g, ", ").replace(/,+/g, ",").trim().replace(/^,\s*|,\s*$/g, "");
  if (!normalized) return "";
  const lower = normalized.toLocaleLowerCase("vi-VN");
  return lower.includes("vi\u1EC7t nam") || lower.includes("vietnam") ? normalized : `${normalized}, Vi\u1EC7t Nam`;
};
var GEOCODING_WARNING_MESSAGE = "Kh\xF4ng th\u1EC3 x\xE1c \u0111\u1ECBnh v\u1ECB tr\xED t\u1EEB \u0111\u1ECBa ch\u1EC9 n\xE0y. Vui l\xF2ng nh\u1EADp \u0111\u1ECBa ch\u1EC9 chi ti\u1EBFt h\u01A1n.";
var parseCoordinate = (value, min, max) => {
  if (value === void 0 || value === null || value === "") return void 0;
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric >= min && numeric <= max ? numeric : void 0;
};
var resolveCourtCoordinates = async (address) => {
  const normalizedAddress = normalizeVietnameseAddress(address);
  if (!normalizedAddress) return { latitude: void 0, longitude: void 0, source: "missing" };
  try {
    const params = new URLSearchParams({
      q: normalizedAddress,
      format: "jsonv2",
      limit: "1",
      addressdetails: "1"
    });
    const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
      headers: {
        "Accept": "application/json",
        "Accept-Language": "vi,en",
        "User-Agent": "SportRes/1.0 local-development"
      }
    });
    if (!response.ok) throw new Error(`Nominatim returned ${response.status}`);
    const results = await response.json();
    const first = results[0];
    const geocodedLatitude = parseCoordinate(first?.lat, -90, 90);
    const geocodedLongitude = parseCoordinate(first?.lon, -180, 180);
    if (geocodedLatitude === void 0 || geocodedLongitude === void 0) {
      console.warn("[SportRes geocoding] No coordinates found for address:", normalizedAddress);
      return { latitude: void 0, longitude: void 0, source: "not_found" };
    }
    return { latitude: geocodedLatitude, longitude: geocodedLongitude, source: "geocoded" };
  } catch (error) {
    console.warn("[SportRes geocoding] Failed to geocode address:", normalizedAddress, error?.message || error);
    return { latitude: void 0, longitude: void 0, source: "failed" };
  }
};
var notificationSchemaReady = null;
async function ensureNotificationSchema() {
  notificationSchemaReady ||= (async () => {
    await query2("ALTER TABLE notifications ADD COLUMN IF NOT EXISTS event_key VARCHAR(255)");
    await query2("CREATE UNIQUE INDEX IF NOT EXISTS idx_notifications_event_key ON notifications(event_key)");
  })();
  await notificationSchemaReady;
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
var supabaseAdmin = null;
var mediaBucketReady = null;
var getSupabaseAdmin = () => {
  if (storageConfigError) throw new Error(storageConfigError);
  supabaseAdmin ||= createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  return supabaseAdmin;
};
var ensureMediaBucket = async () => {
  mediaBucketReady ||= (async () => {
    const { error } = await getSupabaseAdmin().storage.getBucket(SUPABASE_STORAGE_BUCKET);
    if (!error) return;
    if (error.message.toLowerCase().includes("not found")) {
      throw new Error("Bucket l\u01B0u \u1EA3nh ch\u01B0a t\u1ED3n t\u1EA1i. Vui l\xF2ng t\u1EA1o bucket media trong Supabase Storage.");
    }
    throw new Error(error.message);
  })();
  await mediaBucketReady;
};
var normalizeImageExtension = (extension) => extension.toLowerCase().replace(/^\./, "") === "jpeg" ? "jpg" : extension.toLowerCase().replace(/^\./, "");
var extensionForOriginalName = (originalName) => {
  const match = originalName?.toLowerCase().match(/\.([a-z0-9]+)$/);
  if (!match) return "";
  const extension = normalizeImageExtension(match[1]);
  return SUPPORTED_IMAGE_EXTENSIONS.has(extension) ? extension : "";
};
var extensionForMimeType = (mimeType = "") => {
  const normalizedMime = mimeType.toLowerCase().split(";")[0].trim();
  if (SUPPORTED_IMAGE_MIME_EXTENSIONS[normalizedMime]) return SUPPORTED_IMAGE_MIME_EXTENSIONS[normalizedMime];
  if (!normalizedMime.startsWith("image/")) return "";
  const subtype = normalizeImageExtension(normalizedMime.split("/")[1] || "");
  return subtype && /^[a-z0-9]+$/.test(subtype) ? subtype : "";
};
var resolveImageExtension = (mimeType = "", originalName) => extensionForOriginalName(originalName) || extensionForMimeType(mimeType);
var isSupportedImageUpload = (mimeType = "", originalName) => Boolean(resolveImageExtension(mimeType, originalName)) || mimeType.toLowerCase().split(";")[0].trim().startsWith("image/");
var validateImageUpload = (mimeType, size, originalName) => {
  if (!isSupportedImageUpload(mimeType, originalName)) {
    throw new Error("File t\u1EA3i l\xEAn ph\u1EA3i l\xE0 \u1EA3nh h\u1EE3p l\u1EC7.");
  }
  if (!size || size > IMAGE_UPLOAD_LIMIT_BYTES) {
    throw new Error("K\xEDch th\u01B0\u1EDBc \u1EA3nh kh\xF4ng \u0111\u01B0\u1EE3c v\u01B0\u1EE3t qu\xE1 gi\u1EDBi h\u1EA1n cho ph\xE9p.");
  }
};
var uniqueImagePath = (folder, ownerId, mimeType, originalName) => `${folder}/${ownerId}/${Date.now()}-${randomUUID()}.${resolveImageExtension(mimeType, originalName) || "img"}`;
async function uploadStorageImage(folder, ownerId, buffer, contentType, originalName) {
  validateImageUpload(contentType, buffer.length, originalName);
  await ensureMediaBucket();
  const objectPath = uniqueImagePath(folder, ownerId, contentType, originalName);
  const { error } = await getSupabaseAdmin().storage.from(SUPABASE_STORAGE_BUCKET).upload(objectPath, buffer, {
    contentType: contentType || "image/*",
    upsert: true,
    cacheControl: "3600"
  });
  if (error) throw new Error(error.message);
  const { data } = getSupabaseAdmin().storage.from(SUPABASE_STORAGE_BUCKET).getPublicUrl(objectPath);
  return data.publicUrl;
}
var memoryImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: IMAGE_UPLOAD_LIMIT_BYTES, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!isSupportedImageUpload(file.mimetype, file.originalname)) {
      callback(new Error("File t\u1EA3i l\xEAn ph\u1EA3i l\xE0 \u1EA3nh h\u1EE3p l\u1EC7."));
      return;
    }
    callback(null, true);
  }
}).any();
var multerImageUpload = (req, res, next) => {
  memoryImageUpload(req, res, (error) => {
    if (error) {
      const message = error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE" ? "K\xEDch th\u01B0\u1EDBc \u1EA3nh kh\xF4ng \u0111\u01B0\u1EE3c v\u01B0\u1EE3t qu\xE1 gi\u1EDBi h\u1EA1n cho ph\xE9p." : error instanceof Error ? error.message : "File t\u1EA3i l\xEAn ph\u1EA3i l\xE0 \u1EA3nh h\u1EE3p l\u1EC7.";
      return res.status(400).json({ error: message });
    }
    const files = req.files || [];
    if (!files.length) return res.status(400).json({ error: "File t\u1EA3i l\xEAn ph\u1EA3i l\xE0 \u1EA3nh h\u1EE3p l\u1EC7." });
    req.file = files[0];
    next();
  });
};
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
var isOwnerRole = (role) => role === "owner" || role === "venue_owner";
var ownerRoleRequired = (req, res, next) => {
  if (!isOwnerRole(req.user?.role)) {
    return res.status(403).json({ error: "B\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n c\u1EADp nh\u1EADt \u1EA3nh b\xECa ch\u1EE7 s\xE2n." });
  }
  next();
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
    avatar: row.avatar_url || "/sportres-logo.png",
    ownerCoverUrl: row.owner_cover_url || "",
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
    `SELECT u.*, up.display_name, up.avatar_url, up.owner_cover_url, up.gender, up.active_area
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
    `SELECT c.*, v.owner_id, v.opening_hour, v.closing_hour,
            v.address AS venue_address, v.district AS venue_district, v.city AS venue_city
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
var mapNotification = (row) => ({
  id: row.id,
  type: row.type,
  recipientUserId: row.user_id,
  referenceId: row.reference_id || void 0,
  title: row.title,
  body: row.body,
  isRead: Boolean(row.is_read),
  createdAt: row.created_at
});
async function createNotification(executor, notification) {
  await ensureNotificationSchema();
  await executor.query(
    `INSERT INTO notifications (user_id, type, title, body, reference_id, event_key)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (event_key) DO NOTHING`,
    [
      notification.userId,
      notification.type,
      notification.title,
      notification.body,
      notification.referenceId || null,
      notification.eventKey || null
    ]
  );
}
async function notifyBookingEvent(executor, bookingId, event) {
  const row = (await executor.query(
    `SELECT b.id, b.user_id, b.booking_code, b.venue_id, b.court_id, b.time_range,
            v.name AS venue_name, v.owner_id, c.name AS court_name
     FROM bookings b
     JOIN venues v ON v.id = b.venue_id
     JOIN courts c ON c.id = b.court_id
     WHERE b.id = $1`,
    [bookingId]
  )).rows[0];
  if (!row) return;
  const label = row.booking_code || bookingCodeFromId(String(row.id));
  const courtName = row.venue_name || row.court_name || "s\xE2n";
  const messages = {
    created: { title: "\u0110\u1EB7t s\xE2n th\xE0nh c\xF4ng", body: `B\u1EA1n \u0111\xE3 \u0111\u1EB7t s\xE2n ${courtName} th\xE0nh c\xF4ng.` },
    pending_payment: { title: "Booking \u0111ang ch\u1EDD thanh to\xE1n", body: `Thanh to\xE1n cho booking #${label} \u0111ang ch\u1EDD x\xE1c nh\u1EADn.` },
    transfer_submitted: { title: "\u0110\xE3 ghi nh\u1EADn thanh to\xE1n", body: `Thanh to\xE1n cho booking #${label} \u0111ang ch\u1EDD qu\u1EA3n tr\u1ECB vi\xEAn x\xE1c nh\u1EADn.` },
    payment_approved: { title: "Thanh to\xE1n \u0111\xE3 x\xE1c nh\u1EADn", body: `Thanh to\xE1n booking #${label} \u0111\xE3 \u0111\u01B0\u1EE3c x\xE1c nh\u1EADn.` },
    confirmed: { title: "Booking \u0111\xE3 x\xE1c nh\u1EADn", body: `Booking #${label} \u0111\xE3 \u0111\u01B0\u1EE3c x\xE1c nh\u1EADn.` },
    payment_rejected: { title: "Thanh to\xE1n b\u1ECB t\u1EEB ch\u1ED1i", body: `Thanh to\xE1n booking #${label} \u0111\xE3 b\u1ECB t\u1EEB ch\u1ED1i.` },
    cancelled: { title: "Booking \u0111\xE3 h\u1EE7y", body: `Booking #${label} \u0111\xE3 \u0111\u01B0\u1EE3c h\u1EE7y.` },
    completed: { title: "Booking ho\xE0n th\xE0nh", body: `Booking #${label} \u0111\xE3 ho\xE0n th\xE0nh.` }
  };
  const message = messages[event];
  await createNotification(executor, {
    userId: row.user_id,
    type: "booking",
    title: message.title,
    body: message.body,
    referenceId: row.id,
    eventKey: `booking:${row.id}:${event}`
  });
  if (["created", "transfer_submitted", "confirmed", "cancelled", "completed"].includes(event)) {
    await createNotification(executor, {
      userId: row.owner_id,
      type: "booking",
      title: message.title,
      body: `Booking #${label} t\u1EA1i ${courtName}: ${message.body}`,
      referenceId: row.id,
      eventKey: `booking:${row.id}:${event}:owner`
    });
  }
}
async function notifyMatchEvent(executor, matchId, event, actorId) {
  const row = (await executor.query(
    `SELECT m.id, m.creator_id, m.title, m.status, u.full_name AS actor_name
     FROM matches m
     LEFT JOIN users u ON u.id = $2
     WHERE m.id = $1`,
    [matchId, actorId || null]
  )).rows[0];
  if (!row) return;
  const actorName = row.actor_name || "Ng\u01B0\u1EDDi ch\u01A1i";
  const messages = {
    created: { title: "T\u1EA1o tr\u1EADn \u0111\u1EA5u m\u1EDBi", body: `B\u1EA1n \u0111\xE3 t\u1EA1o tr\u1EADn \u0111\u1EA5u ${row.title}.` },
    joined: { title: "C\xF3 ng\u01B0\u1EDDi tham gia tr\u1EADn \u0111\u1EA5u", body: `${actorName} \u0111\xE3 tham gia tr\u1EADn \u0111\u1EA5u c\u1EE7a b\u1EA1n.` },
    left: { title: "C\xF3 ng\u01B0\u1EDDi r\u1EDDi tr\u1EADn \u0111\u1EA5u", body: `${actorName} \u0111\xE3 r\u1EDDi tr\u1EADn \u0111\u1EA5u ${row.title}.` },
    full: { title: "Tr\u1EADn \u0111\u1EA5u \u0111\xE3 \u0111\u1EE7 ng\u01B0\u1EDDi", body: `Tr\u1EADn \u0111\u1EA5u ${row.title} \u0111\xE3 \u0111\u1EE7 ng\u01B0\u1EDDi tham gia.` },
    started: { title: "Tr\u1EADn \u0111\u1EA5u b\u1EAFt \u0111\u1EA7u", body: `Tr\u1EADn \u0111\u1EA5u ${row.title} \u0111\xE3 b\u1EAFt \u0111\u1EA7u.` },
    ended: { title: "Tr\u1EADn \u0111\u1EA5u \u0111\xE3 k\u1EBFt th\xFAc", body: "Tr\u1EADn \u0111\u1EA5u \u0111\xE3 k\u1EBFt th\xFAc. H\xE3y \u0111\xE1nh gi\xE1 s\xE2n v\xE0 ng\u01B0\u1EDDi ch\u01A1i." },
    completed: { title: "Tr\u1EADn \u0111\u1EA5u ho\xE0n th\xE0nh", body: `Tr\u1EADn \u0111\u1EA5u ${row.title} \u0111\xE3 ho\xE0n th\xE0nh.` },
    review: { title: "C\xF3 \u0111\xE1nh gi\xE1 m\u1EDBi", body: `Tr\u1EADn \u0111\u1EA5u ${row.title} c\xF3 \u0111\xE1nh gi\xE1 m\u1EDBi sau tr\u1EADn.` }
  };
  const message = messages[event];
  await createNotification(executor, {
    userId: row.creator_id,
    type: "match",
    title: message.title,
    body: message.body,
    referenceId: row.id,
    eventKey: `match:${row.id}:${event}${actorId ? `:${actorId}` : ""}`
  });
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
      `SELECT u.*, up.display_name, up.avatar_url, up.owner_cover_url, up.gender, up.active_area
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
var saveUserAvatarUrl = async (userId, avatarUrl) => {
  await query2(
    `INSERT INTO user_profiles (user_id, display_name, avatar_url)
     SELECT id, full_name, $2 FROM users WHERE id = $1
     ON CONFLICT (user_id) DO UPDATE
     SET avatar_url = EXCLUDED.avatar_url,
         display_name = COALESCE(user_profiles.display_name, EXCLUDED.display_name)`,
    [userId, avatarUrl]
  );
  return userProfileById(userId);
};
app.get("/api/me", authRequired, async (req, res) => {
  const user = await userProfileById(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found." });
  res.json({ user });
});
app.post("/api/profile/change-password", authRequired, async (req, res) => {
  try {
    const currentPassword = typeof req.body.currentPassword === "string" ? req.body.currentPassword : "";
    const newPassword = typeof req.body.newPassword === "string" ? req.body.newPassword : "";
    const confirmPassword = typeof req.body.confirmPassword === "string" ? req.body.confirmPassword : "";
    if (!currentPassword) return res.status(400).json({ error: "M\u1EADt kh\u1EA9u hi\u1EC7n t\u1EA1i l\xE0 b\u1EAFt bu\u1ED9c." });
    if (!newPassword) return res.status(400).json({ error: "M\u1EADt kh\u1EA9u m\u1EDBi l\xE0 b\u1EAFt bu\u1ED9c." });
    if (!confirmPassword) return res.status(400).json({ error: "X\xE1c nh\u1EADn m\u1EADt kh\u1EA9u m\u1EDBi l\xE0 b\u1EAFt bu\u1ED9c." });
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "M\u1EADt kh\u1EA9u m\u1EDBi v\xE0 x\xE1c nh\u1EADn m\u1EADt kh\u1EA9u kh\xF4ng kh\u1EDBp." });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: "M\u1EADt kh\u1EA9u m\u1EDBi ph\u1EA3i c\xF3 \xEDt nh\u1EA5t 8 k\xFD t\u1EF1." });
    }
    const row = (await query2("SELECT password_hash FROM users WHERE id = $1", [req.user.id])).rows[0];
    if (!row) return res.status(404).json({ error: "User not found." });
    const currentPasswordValid = await bcrypt.compare(currentPassword, row.password_hash).catch(() => false);
    if (!currentPasswordValid) {
      return res.status(400).json({ error: "M\u1EADt kh\u1EA9u hi\u1EC7n t\u1EA1i kh\xF4ng \u0111\xFAng." });
    }
    const sameAsCurrentPassword = await bcrypt.compare(newPassword, row.password_hash).catch(() => false);
    if (sameAsCurrentPassword) {
      return res.status(400).json({ error: "M\u1EADt kh\u1EA9u m\u1EDBi kh\xF4ng \u0111\u01B0\u1EE3c tr\xF9ng v\u1EDBi m\u1EADt kh\u1EA9u hi\u1EC7n t\u1EA1i." });
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await query2("UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2", [passwordHash, req.user.id]);
    res.json({ success: true, message: "\u0110\u1ED5i m\u1EADt kh\u1EA9u th\xE0nh c\xF4ng." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/profile/avatar", authRequired, multerImageUpload, async (req, res) => {
  try {
    await ensureImageSchema();
    const file = req.file;
    if (!file) return res.status(400).json({ error: "File t\u1EA3i l\xEAn ph\u1EA3i l\xE0 \u1EA3nh h\u1EE3p l\u1EC7." });
    const avatarUrl = await uploadStorageImage("avatars", req.user.id, file.buffer, file.mimetype, file.originalname);
    const user = await saveUserAvatarUrl(req.user.id, avatarUrl);
    res.json({ avatar_url: avatarUrl, avatarUrl, user });
  } catch (error) {
    res.status(400).json({ error: error.message || "Kh\xF4ng th\u1EC3 thay \u1EA3nh. Vui l\xF2ng th\u1EED l\u1EA1i." });
  }
});
app.post("/api/me/avatar", authRequired, multerImageUpload, async (req, res) => {
  try {
    await ensureImageSchema();
    const file = req.file;
    if (!file) return res.status(400).json({ error: "File t\u1EA3i l\xEAn ph\u1EA3i l\xE0 \u1EA3nh h\u1EE3p l\u1EC7." });
    const avatarUrl = await uploadStorageImage("avatars", req.user.id, file.buffer, file.mimetype, file.originalname);
    const user = await saveUserAvatarUrl(req.user.id, avatarUrl);
    res.json({ avatar_url: avatarUrl, avatarUrl, user });
  } catch (error) {
    res.status(400).json({ error: error.message || "Kh\xF4ng th\u1EC3 thay \u1EA3nh. Vui l\xF2ng th\u1EED l\u1EA1i." });
  }
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
      `SELECT u.*, up.display_name, up.avatar_url, up.owner_cover_url, up.gender, up.active_area
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
      `SELECT u.*, up.display_name, up.avatar_url, up.owner_cover_url, up.gender, up.active_area
       FROM users u
       LEFT JOIN user_profiles up ON up.user_id = u.id
       ORDER BY u.created_at DESC`
    )).rows;
    res.json(rows.map(mapAdminUser));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/admin/revenue-analytics", authRequired, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Admin only." });
  try {
    await ensureBookingPaymentSchema();
    const row = (await query2(
      `WITH bounds AS (
         SELECT
           (NOW() AT TIME ZONE 'Asia/Ho_Chi_Minh')::date AS today,
           DATE_TRUNC('month', NOW() AT TIME ZONE 'Asia/Ho_Chi_Minh')::date AS month_start
       ),
       days AS (
         SELECT GENERATE_SERIES(
           (SELECT today FROM bounds) - INTERVAL '6 days',
           (SELECT today FROM bounds),
           INTERVAL '1 day'
         )::date AS day
       ),
       valid_bookings AS (
         SELECT b.date::date AS booking_date, COALESCE(b.total_price, 0)::bigint AS revenue
         FROM bookings b
         WHERE b.status IN ('confirmed', 'completed')
           AND b.payment_status = 'paid'
       ),
       daily AS (
         SELECT booking_date, SUM(revenue)::bigint AS revenue
         FROM valid_bookings
         WHERE booking_date BETWEEN (SELECT today FROM bounds) - INTERVAL '6 days' AND (SELECT today FROM bounds)
         GROUP BY booking_date
       )
       SELECT
         COALESCE((SELECT SUM(revenue) FROM valid_bookings WHERE booking_date = (SELECT today FROM bounds)), 0)::bigint AS today_revenue,
         COALESCE((SELECT SUM(revenue) FROM valid_bookings WHERE booking_date BETWEEN (SELECT today FROM bounds) - INTERVAL '6 days' AND (SELECT today FROM bounds)), 0)::bigint AS seven_day_revenue,
         COALESCE((SELECT SUM(revenue) FROM valid_bookings WHERE booking_date >= (SELECT month_start FROM bounds) AND booking_date < ((SELECT month_start FROM bounds) + INTERVAL '1 month')::date), 0)::bigint AS monthly_revenue,
         COALESCE(
           JSON_AGG(
             JSON_BUILD_OBJECT('date', days.day::text, 'revenue', COALESCE(daily.revenue, 0))
             ORDER BY days.day
           ),
           '[]'::json
         ) AS daily_revenue_series
       FROM days
       LEFT JOIN daily ON daily.booking_date = days.day`
    )).rows[0];
    res.json({
      todayRevenue: Number(row.today_revenue || 0),
      sevenDayRevenue: Number(row.seven_day_revenue || 0),
      monthlyRevenue: Number(row.monthly_revenue || 0),
      dailyRevenueSeries: (row.daily_revenue_series || []).map((item) => ({
        date: String(item.date),
        revenue: Number(item.revenue || 0)
      }))
    });
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
      `SELECT u.*, up.display_name, up.avatar_url, up.owner_cover_url, up.gender, up.active_area
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
app.post("/api/owner/cover", authRequired, ownerRoleRequired, multerImageUpload, async (req, res) => {
  const client = await pool2.connect();
  try {
    await ensureImageSchema();
    const file = req.file;
    if (!file) return res.status(400).json({ error: "File t\u1EA3i l\xEAn ph\u1EA3i l\xE0 \u1EA3nh h\u1EE3p l\u1EC7." });
    const ownerCoverUrl = await uploadStorageImage("owner-covers", req.user.id, file.buffer, file.mimetype, file.originalname);
    await client.query("BEGIN");
    await client.query(
      `INSERT INTO user_profiles (user_id, display_name, owner_cover_url)
       SELECT id, full_name, $2 FROM users WHERE id = $1
       ON CONFLICT (user_id) DO UPDATE
       SET owner_cover_url = EXCLUDED.owner_cover_url,
           display_name = COALESCE(user_profiles.display_name, EXCLUDED.display_name)`,
      [req.user.id, ownerCoverUrl]
    );
    const updatedCourts = await client.query(
      `UPDATE courts c
       SET image_url = $1
       WHERE EXISTS (
         SELECT 1
         FROM venues v
         WHERE v.id = c.venue_id AND v.owner_id = $2
       )
       RETURNING c.id`,
      [ownerCoverUrl, req.user.id]
    );
    await client.query("COMMIT");
    res.json({
      owner_cover_url: ownerCoverUrl,
      ownerCoverUrl,
      imageUrl: ownerCoverUrl,
      updatedCourtIds: updatedCourts.rows.map((row) => row.id)
    });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => void 0);
    res.status(400).json({ error: error.message || "Kh\xF4ng th\u1EC3 thay \u1EA3nh. Vui l\xF2ng th\u1EED l\u1EA1i." });
  } finally {
    client.release();
  }
});
app.get("/api/owner/courts", authRequired, async (req, res) => {
  if (!["venue_owner", "admin", "staff"].includes(req.user.role)) {
    return res.status(403).json({ error: "Owner court access required." });
  }
  await ensureImageSchema();
  const rows = (await query2(
    `SELECT c.id, c.venue_id, c.name, c.sport, c.status, c.description, c.address,
            c.image_url, c.latitude, c.longitude, c.price_min AS price_per_hour, v.name AS venue_name
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
    address: row.address || "",
    imageUrl: row.image_url || "",
    latitude: row.latitude != null ? Number(row.latitude) : void 0,
    longitude: row.longitude != null ? Number(row.longitude) : void 0,
    pricePerHour: Number(row.price_per_hour || 0)
  })));
});
app.get("/api/courts", authOptional, async (req, res) => {
  try {
    await ensureImageSchema();
    const rows = (await query2(
      `SELECT v.*, up.owner_cover_url,
              c.id AS court_id, c.name AS court_name, c.address AS court_address,
              c.sport, c.price_min, c.price_peak, c.status AS court_status,
              c.description AS court_description, c.image_url AS court_image_url,
              c.latitude AS court_latitude, c.longitude AS court_longitude,
              cs.opening_time AS schedule_opening_time, cs.closing_time AS schedule_closing_time,
              cs.slot_duration AS schedule_slot_duration,
              ts.id AS slot_id, ts.date, ts.date::text AS slot_date, ts.start_time, ts.end_time,
              COALESCE(NULLIF(ts.price, 0), c.price_min) AS slot_price,
              ts.is_peak, ts.is_booked, ts.is_blocked, ts.is_maintenance
       FROM venues v
       LEFT JOIN user_profiles up ON up.user_id = v.owner_id
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
          address: row.court_address || row.address,
          district: row.district || row.city || "",
          rating: Number(row.rating || 0),
          reviewsCount: Number(row.reviews_count || 0),
          imageUrl: row.owner_cover_url || row.image_url || row.court_image_url || "",
          ownerCoverUrl: row.owner_cover_url || "",
          priceMin: Number(row.price_min || 0),
          latitude: row.court_latitude != null ? Number(row.court_latitude) : row.latitude != null ? Number(row.latitude) : void 0,
          longitude: row.court_longitude != null ? Number(row.court_longitude) : row.longitude != null ? Number(row.longitude) : void 0,
          description: row.description || "",
          amenities: row.amenities || [],
          subCourts: []
        });
      }
      const venue = venues.get(row.id);
      if (!venue.address && (row.court_address || row.address)) venue.address = row.court_address || row.address;
      if (venue.latitude == null && row.court_latitude != null) venue.latitude = Number(row.court_latitude);
      if (venue.longitude == null && row.court_longitude != null) venue.longitude = Number(row.court_longitude);
      if (!row.court_id) continue;
      let sub = venue.subCourts.find((item) => item.id === row.court_id);
      if (!sub) {
        sub = {
          id: row.court_id,
          name: row.court_name,
          sport: row.sport,
          status: row.court_status,
          pricePerHour: Number(row.price_min || 0),
          address: row.court_address || row.address,
          description: row.court_description || "",
          imageUrl: row.court_image_url || "",
          latitude: row.court_latitude != null ? Number(row.court_latitude) : void 0,
          longitude: row.court_longitude != null ? Number(row.court_longitude) : void 0,
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
    await ensureNotificationSchema();
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
    await ensureImageSchema();
    const { venueId, name, sport, capacity, description, status = "open" } = req.body;
    const pricePerHour = Math.max(0, Number(req.body.pricePerHour ?? req.body.priceMin ?? 0));
    if (!String(name || "").trim()) return res.status(400).json({ error: "T\xEAn s\xE2n l\xE0 b\u1EAFt bu\u1ED9c." });
    if (!["open", "closed", "maintenance"].includes(status)) return res.status(400).json({ error: "Tr\u1EA1ng th\xE1i s\xE2n kh\xF4ng h\u1EE3p l\u1EC7." });
    const venue = (await query2("SELECT * FROM venues WHERE id = $1 AND owner_id = $2", [venueId, req.user.id])).rows[0];
    if (!venue && req.user.role !== "admin") return res.status(403).json({ error: "You can only add courts to your own venue." });
    const courtAddress = String(req.body.address || [venue?.address, venue?.district, venue?.city].filter(Boolean).join(", ")).trim();
    const coordinates = await resolveCourtCoordinates(courtAddress);
    const geocodingWarning = coordinates.latitude == null || coordinates.longitude == null ? GEOCODING_WARNING_MESSAGE : void 0;
    const row = (await query2(
      `INSERT INTO courts (venue_id, name, sport, price_min, price_peak, capacity, description, status, address, latitude, longitude)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        venueId,
        String(name).trim(),
        sport,
        pricePerHour,
        pricePerHour,
        capacity || null,
        description || null,
        status,
        courtAddress || null,
        coordinates.latitude ?? null,
        coordinates.longitude ?? null
      ]
    )).rows[0];
    res.status(201).json({ ...row, warning: geocodingWarning });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.patch("/api/owner/courts/:courtId", authRequired, async (req, res) => {
  const client = await pool2.connect();
  try {
    await ensureImageSchema();
    const court = await ownerCourt(req.params.courtId, req.user);
    if (!court) return res.status(403).json({ error: "Court not found or access denied." });
    const name = String(req.body.name || court.name).trim();
    const sport = req.body.sport || court.sport;
    const status = req.body.status || court.status;
    const price = Number(req.body.pricePerHour ?? req.body.priceMin ?? court.price_min);
    if (!name) return res.status(400).json({ error: "T\xEAn s\xE2n l\xE0 b\u1EAFt bu\u1ED9c." });
    if (!["open", "closed", "maintenance"].includes(status)) return res.status(400).json({ error: "Tr\u1EA1ng th\xE1i s\xE2n kh\xF4ng h\u1EE3p l\u1EC7." });
    const normalizedPrice = Math.max(0, price || 0);
    const fallbackAddress = [court.venue_address, court.venue_district, court.venue_city].filter(Boolean).join(", ");
    const currentAddress = String(court.address || fallbackAddress || "").trim();
    const courtAddress = String(req.body.address ?? currentAddress).trim();
    const shouldResolveCoordinates = courtAddress !== currentAddress || court.latitude == null || court.longitude == null;
    const coordinates = shouldResolveCoordinates ? await resolveCourtCoordinates(courtAddress) : {
      latitude: court.latitude != null ? Number(court.latitude) : void 0,
      longitude: court.longitude != null ? Number(court.longitude) : void 0
    };
    const geocodingWarning = shouldResolveCoordinates && (coordinates.latitude == null || coordinates.longitude == null) ? GEOCODING_WARNING_MESSAGE : void 0;
    await client.query("BEGIN");
    const updated = (await client.query(
      `UPDATE courts
       SET name = $1, sport = $2, status = $3, price_min = $4, price_peak = $4,
           description = $5, address = $6, latitude = $7, longitude = $8
       WHERE id = $9
       RETURNING *`,
      [
        name,
        sport,
        status,
        normalizedPrice,
        req.body.description || null,
        courtAddress || null,
        shouldResolveCoordinates ? coordinates.latitude ?? null : court.latitude != null ? Number(court.latitude) : null,
        shouldResolveCoordinates ? coordinates.longitude ?? null : court.longitude != null ? Number(court.longitude) : null,
        court.id
      ]
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
    res.json({ ...updated, pricePerHour: Number(updated.price_min || 0), warning: geocodingWarning });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => void 0);
    res.status(400).json({ error: error.message });
  } finally {
    client.release();
  }
});
app.post("/api/owner/courts/:courtId/image", authRequired, multerImageUpload, async (req, res) => {
  try {
    await ensureImageSchema();
    const court = await ownerCourt(req.params.courtId, req.user);
    if (!court) return res.status(403).json({ error: "Court not found or access denied." });
    const file = req.file;
    if (!file) return res.status(400).json({ error: "File t\u1EA3i l\xEAn ph\u1EA3i l\xE0 \u1EA3nh h\u1EE3p l\u1EC7." });
    const imageUrl = await uploadStorageImage("courts", `${court.venue_id}/${court.id}`, file.buffer, file.mimetype, file.originalname);
    const updated = (await query2(
      "UPDATE courts SET image_url = $1 WHERE id = $2 RETURNING *",
      [imageUrl, court.id]
    )).rows[0];
    res.json({ imageUrl, court: { ...updated, imageUrl, pricePerHour: Number(updated.price_min || 0) } });
  } catch (error) {
    res.status(400).json({ error: error.message || "Kh\xF4ng th\u1EC3 thay \u1EA3nh. Vui l\xF2ng th\u1EED l\u1EA1i." });
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
  const rows = (await query2(
    `SELECT v.*,
            up.owner_cover_url,
            COALESCE(up.owner_cover_url, v.image_url) AS image_url
     FROM venues v
     LEFT JOIN user_profiles up ON up.user_id = v.owner_id
     ORDER BY v.created_at DESC`
  )).rows;
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
app.get("/api/notifications", authRequired, async (req, res) => {
  try {
    await ensureNotificationSchema();
    const rows = (await query2(
      `SELECT * FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    )).rows;
    res.json(rows.map(mapNotification));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.patch("/api/notifications/:id/read", authRequired, async (req, res) => {
  try {
    await ensureNotificationSchema();
    const row = (await query2(
      `UPDATE notifications SET is_read = TRUE
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [req.params.id, req.user.id]
    )).rows[0];
    if (!row) return res.status(404).json({ error: "Notification not found." });
    res.json(mapNotification(row));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.post("/api/notifications/read-all", authRequired, async (req, res) => {
  try {
    await ensureNotificationSchema();
    await query2("UPDATE notifications SET is_read = TRUE WHERE user_id = $1", [req.user.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.delete("/api/notifications/:id", authRequired, async (req, res) => {
  try {
    await ensureNotificationSchema();
    const row = (await query2(
      "DELETE FROM notifications WHERE id = $1 AND user_id = $2 RETURNING id",
      [req.params.id, req.user.id]
    )).rows[0];
    if (!row) return res.status(404).json({ error: "Notification not found." });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
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
    await ensureTimeSlotSchema();
    await ensureBookingPaymentSchema();
    await ensureNotificationSchema();
    await client.query("BEGIN");
    const slots = (await client.query(
      `SELECT ts.*, ts.date::text AS slot_date, c.venue_id, c.status AS court_status,
              c.price_min, c.name AS court_name, v.name AS venue_name, v.owner_id, v.status AS venue_status
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
      await notifyBookingEvent(client, booking.id, "created");
      await notifyBookingEvent(client, booking.id, "pending_payment");
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
    await ensureNotificationSchema();
    const updated = (await query2(
      `WITH target AS (
         SELECT booking_group_id FROM bookings WHERE id = $1 AND user_id = $2
       )
       UPDATE bookings
       SET payment_status = 'waiting_admin_confirmation',
           status = 'pending_payment_verification'
       WHERE user_id = $2
         AND payment_status = 'pending_transfer'
         AND (id = $1 OR booking_group_id = (SELECT booking_group_id FROM target))
       RETURNING id`,
      [req.params.id, req.user.id]
    )).rows;
    if (updated.length === 0) return res.status(409).json({ error: "Booking kh\xF4ng t\u1ED3n t\u1EA1i ho\u1EB7c \u0111\xE3 g\u1EEDi x\xE1c nh\u1EADn chuy\u1EC3n kho\u1EA3n." });
    for (const booking2 of updated) {
      await notifyBookingEvent({ query: query2 }, booking2.id, "transfer_submitted");
    }
    const booking = (await bookingRows("WHERE b.id = $1", [updated[0].id]))[0];
    res.json({ success: true, booking });
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
  if (!["admin", "venue_owner", "staff"].includes(req.user.role)) return res.status(403).json({ error: "Payment approval access required." });
  const client = await pool2.connect();
  try {
    if (req.user.role !== "admin") {
      const allowed = (await client.query(
        `SELECT 1 FROM bookings b
         JOIN venues v ON v.id = b.venue_id
         WHERE b.id = $1 AND ($2 = 'staff' OR v.owner_id = $3)`,
        [req.params.id, req.user.role, req.user.id]
      )).rows[0];
      if (!allowed) return res.status(403).json({ error: "Booking not found or access denied." });
    }
    await ensureBookingPaymentSchema();
    await ensureNotificationSchema();
    await client.query("BEGIN");
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
    await notifyBookingEvent(client, booking.id, "payment_approved");
    await notifyBookingEvent(client, booking.id, "confirmed");
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
  if (!["admin", "venue_owner", "staff"].includes(req.user.role)) return res.status(403).json({ error: "Payment approval access required." });
  const client = await pool2.connect();
  try {
    if (req.user.role !== "admin") {
      const allowed = (await client.query(
        `SELECT 1 FROM bookings b
         JOIN venues v ON v.id = b.venue_id
         WHERE b.id = $1 AND ($2 = 'staff' OR v.owner_id = $3)`,
        [req.params.id, req.user.role, req.user.id]
      )).rows[0];
      if (!allowed) return res.status(403).json({ error: "Booking not found or access denied." });
    }
    await ensureBookingPaymentSchema();
    await ensureNotificationSchema();
    await client.query("BEGIN");
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
    await notifyBookingEvent(client, booking.id, "payment_rejected");
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
    await ensureNotificationSchema();
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
    await notifyBookingEvent({ query: query2 }, booking.id, status);
    if (status === "completed") {
      const linkedMatch = (await query2("SELECT id FROM matches WHERE booking_id = $1", [booking.id])).rows[0];
      if (linkedMatch) {
        await notifyMatchEvent({ query: query2 }, linkedMatch.id, "ended", req.user.id);
        await notifyMatchEvent({ query: query2 }, linkedMatch.id, "review", req.user.id);
      }
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
    await ensureMatchSchema();
    await ensureNotificationSchema();
    await client.query("BEGIN");
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
    await notifyMatchEvent(client, match.id, "created", req.user.id);
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
  const client = await pool2.connect();
  try {
    await ensureNotificationSchema();
    await client.query("BEGIN");
    const inserted = (await client.query(
      "INSERT INTO match_participants (match_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING match_id",
      [req.params.id, req.user.id]
    )).rows[0];
    const count = Number((await client.query("SELECT COUNT(*) FROM match_participants WHERE match_id = $1", [req.params.id])).rows[0].count);
    const match = (await client.query("SELECT max_players FROM matches WHERE id = $1", [req.params.id])).rows[0];
    if (inserted) {
      await notifyMatchEvent(client, req.params.id, "joined", req.user.id);
    }
    if (match && count >= Number(match.max_players)) {
      const updated = (await client.query(
        "UPDATE matches SET status = 'full' WHERE id = $1 AND status <> 'full' RETURNING id",
        [req.params.id]
      )).rows[0];
      if (updated) await notifyMatchEvent(client, req.params.id, "full", req.user.id);
    }
    await client.query("COMMIT");
    res.json({ success: true });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => void 0);
    res.status(400).json({ error: error.message });
  } finally {
    client.release();
  }
});
app.post("/api/matches/:id/leave", authRequired, async (req, res) => {
  const client = await pool2.connect();
  try {
    await ensureNotificationSchema();
    await client.query("BEGIN");
    const removed = (await client.query(
      "DELETE FROM match_participants WHERE match_id = $1 AND user_id = $2 RETURNING match_id",
      [req.params.id, req.user.id]
    )).rows[0];
    if (removed) {
      await client.query("UPDATE matches SET status = 'open' WHERE id = $1 AND status = 'full'", [req.params.id]);
      await notifyMatchEvent(client, req.params.id, "left", req.user.id);
    }
    await client.query("COMMIT");
    res.json({ success: true });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => void 0);
    res.status(400).json({ error: error.message });
  } finally {
    client.release();
  }
});
app.patch("/api/matches/:id/status", authRequired, async (req, res) => {
  try {
    const status = String(req.body.status || "");
    if (!["in_progress", "finished"].includes(status)) {
      return res.status(400).json({ error: "Invalid match status." });
    }
    await ensureNotificationSchema();
    const match = (await query2(
      `UPDATE matches
       SET status = $1
       WHERE id = $2
         AND creator_id = $3
         AND status <> $1
       RETURNING id`,
      [status, req.params.id, req.user.id]
    )).rows[0];
    if (!match) return res.status(404).json({ error: "Match not found or status unchanged." });
    await notifyMatchEvent({ query: query2 }, req.params.id, status === "in_progress" ? "started" : "ended", req.user.id);
    if (status === "finished") {
      await notifyMatchEvent({ query: query2 }, req.params.id, "completed", req.user.id);
    }
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
var AI_NOT_CONFIGURED_MESSAGE = "AI ch\u01B0a \u0111\u01B0\u1EE3c c\u1EA5u h\xECnh. Vui l\xF2ng thi\u1EBFt l\u1EADp OPENAI_API_KEY \u1EDF backend.";
var toAiText = (value, maxLength = 120) => String(value || "").replace(/\s+/g, " ").trim().slice(0, maxLength);
var summarizeAiContext = (appContext) => {
  const courts = Array.isArray(appContext?.courts) ? appContext.courts : [];
  const matches = Array.isArray(appContext?.matches) ? appContext.matches : [];
  const tournaments = Array.isArray(appContext?.tournaments) ? appContext.tournaments : [];
  const user = appContext?.user && typeof appContext.user === "object" ? appContext.user : {};
  return JSON.stringify({
    user: {
      name: toAiText(user.name, 80),
      role: toAiText(user.role, 40),
      favoriteSports: Array.isArray(user.favoriteSports) ? user.favoriteSports.slice(0, 8).map((item) => toAiText(item, 30)) : [],
      activeArea: toAiText(user.activeArea, 120)
    },
    courts: courts.slice(0, 12).map((court) => ({
      name: toAiText(court.name, 100),
      sport: toAiText(court.sport, 30),
      district: toAiText(court.district, 80),
      address: toAiText(court.address, 180),
      priceMin: Number(court.priceMin || court.price_per_hour || 0) || void 0,
      rating: Number(court.rating || 0) || void 0,
      status: toAiText(court.status, 40)
    })),
    matches: matches.slice(0, 12).map((match) => ({
      title: toAiText(match.title, 120),
      sport: toAiText(match.sport, 30),
      courtName: toAiText(match.courtName, 100),
      date: toAiText(match.date, 40),
      time: toAiText(match.time, 40),
      level: toAiText(match.level, 40),
      status: toAiText(match.status, 40),
      playerCount: Array.isArray(match.players) ? match.players.length : void 0,
      maxPlayers: Number(match.maxPlayers || 0) || void 0
    })),
    tournaments: tournaments.slice(0, 8).map((tournament) => ({
      title: toAiText(tournament.title, 120),
      sport: toAiText(tournament.sport, 30),
      status: toAiText(tournament.status, 40),
      prizePool: toAiText(tournament.prizePool, 80)
    }))
  });
};
var sportResAiSystemPrompt = `
B\u1EA1n l\xE0 SportRes AI, tr\u1EE3 l\xFD trong \u1EE9ng d\u1EE5ng SportRes.
- Tr\u1EA3 l\u1EDDi b\u1EB1ng ti\u1EBFng Vi\u1EC7t theo m\u1EB7c \u0111\u1ECBnh, th\xE2n thi\u1EC7n, r\xF5 r\xE0ng, ng\u1EAFn g\u1ECDn.
- H\u1ED7 tr\u1EE3 ng\u01B0\u1EDDi d\xF9ng v\u1EC1 \u0111\u1EB7t s\xE2n, gh\xE9p k\xE8o/matchmaking, gi\u1EA3i \u0111\u1EA5u, v\xED/thanh to\xE1n, t\xEDnh n\u0103ng ch\u1EE7 s\xE2n, qu\u1EA3n l\xFD s\xE2n v\xE0 c\xE1ch s\u1EED d\u1EE5ng SportRes.
- Ch\u1EC9 d\xF9ng d\u1EEF li\u1EC7u SportRes \u0111\u01B0\u1EE3c cung c\u1EA5p trong h\u1ED9i tho\u1EA1i ho\u1EB7c ng\u1EEF c\u1EA3nh h\u1EC7 th\u1ED1ng. Kh\xF4ng t\u1EF1 b\u1ECBa t\xEAn s\xE2n, gi\xE1, \u0111\u1ECBa ch\u1EC9, slot tr\u1ED1ng, gi\u1EA3i \u0111\u1EA5u ho\u1EB7c ng\u01B0\u1EDDi ch\u01A1i.
- N\u1EBFu ng\u01B0\u1EDDi d\xF9ng c\u1EA7n t\xECnh tr\u1EA1ng s\xE2n tr\u1ED1ng theo th\u1EDDi gian th\u1EF1c, h\xE3y gi\u1EA3i th\xEDch r\u1EB1ng tr\u1EE3 l\xFD ch\u1EC9 c\xF3 th\u1EC3 d\xF9ng d\u1EEF li\u1EC7u do SportRes cung c\u1EA5p v\xE0 h\u01B0\u1EDBng d\u1EABn h\u1ECD ki\u1EC3m tra tr\u1EF1c ti\u1EBFp trong m\xE0n h\xECnh \u0111\u1EB7t s\xE2n.
- Kh\xF4ng y\xEAu c\u1EA7u, hi\u1EC3n th\u1ECB ho\u1EB7c suy \u0111o\xE1n th\xF4ng tin nh\u1EA1y c\u1EA3m nh\u01B0 m\u1EADt kh\u1EA9u, token, kh\xF3a API.
`.trim();
app.post("/api/ai/chat", async (req, res) => {
  try {
    const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
    if (!message) return res.status(400).json({ error: "message is required" });
    if (message.length > 1e3) return res.status(400).json({ error: "message must be at most 1000 characters" });
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) return res.status(503).json({ error: AI_NOT_CONFIGURED_MESSAGE });
    const history = Array.isArray(req.body?.history) ? req.body.history.slice(-8).map((item) => ({
      role: item?.role === "model" || item?.role === "assistant" ? "assistant" : "user",
      content: toAiText(item?.text || item?.content, 1e3)
    })).filter((item) => item.content) : [];
    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: process.env.AI_MODEL?.trim() || "gpt-4o-mini",
      temperature: 0.5,
      max_tokens: 700,
      messages: [
        { role: "system", content: sportResAiSystemPrompt },
        { role: "system", content: `Ng\u1EEF c\u1EA3nh SportRes hi\u1EC7n c\xF3:
${summarizeAiContext(req.body?.appContext)}` },
        ...history,
        { role: "user", content: message }
      ]
    });
    const reply = completion.choices[0]?.message?.content?.trim() || "Xin l\u1ED7i, t\xF4i ch\u01B0a th\u1EC3 tr\u1EA3 l\u1EDDi l\xFAc n\xE0y. Vui l\xF2ng th\u1EED l\u1EA1i sau.";
    res.json({ reply });
  } catch (error) {
    console.error("[ai:chat] OpenAI request failed:", error?.message || error);
    res.status(500).json({
      error: "\u0110\xE3 x\u1EA3y ra l\u1ED7i h\u1EC7 th\u1ED1ng khi li\xEAn h\u1EC7 tr\u1EE3 l\xFD AI."
    });
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
