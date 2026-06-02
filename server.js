// server.ts
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

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
- H\u1EA1ng th\xE0nh vi\xEAn: ${appContext.user.tier} (\u0110i\u1EC3m t\xEDch l\u0169y: ${appContext.user.points} \u0111i\u1EC3m)
- S\u1ED1 d\u01B0 v\xED hi\u1EC7n t\u1EA1i: ${appContext.user.walletBalance.toLocaleString("vi-VN")} VND
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
2. D\u1EF1a v\xE0o s\u1EDF th\xEDch, tr\xECnh \u0111\u1ED9 th\u1EC3 thao v\xE0 s\u1ED1 d\u01B0 t\xE0i kho\u1EA3n c\u1EE7a ng\u01B0\u1EDDi d\xF9ng \u0111\u1EC3 \u0111\u01B0a ra g\u1EE3i \xFD s\xE2n ho\u1EB7c tr\u1EADn gh\xE9p c\u1EB7p (Matchmaking) ph\xF9 h\u1EE3p nh\u1EA5t.
3. Khi gi\u1EDBi thi\u1EC7u s\xE2n ho\u1EB7c k\xE8o gh\xE9p c\u1EB7p, h\xE3y n\xEAu r\xF5 T\xEAn s\xE2n, Qu\u1EADn huy\u1EC7n, Ph\xE2n kh\xFAc gi\xE1 v\xE0 v\xEC sao s\xE2n \u0111\xF3 ph\xF9 h\u1EE3p v\u1EDBi c\xE1 nh\xE2n h\u1ECD.
4. Tr\xE1nh l\u1EB7p l\u1EA1i qu\xE1 nhi\u1EC1u v\u1EC1 m\u1EB7t k\u1EF9 thu\u1EADt, t\u1EADp trung v\xE0o vi\u1EC7c t\u1EA1o s\u1EF1 kh\xEDch l\u1EC7 v\u1EADn \u0111\u1ED9ng, r\xE8n luy\u1EC7n th\u1EC3 thao.
5. N\u1EBFu h\u1ECD h\u1ECFi v\u1EC1 x\u1EBFp h\u1EA1ng hay l\xE0m sao n\xE2ng h\u1EA1ng, h\xE3y ch\u1EC9 cho h\u1ECD c\xE1ch tham gia c\xE1c tr\u1EADn \u0111\u1EA5u matchmaking ho\u1EB7c gi\u1EA3i \u0111\u1EA5u \u0111\u1EC3 t\xEDch l\u0169y \u0111i\u1EC3m th\u01B0\u1EDFng SportRes!
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
  const query = message.toLowerCase();
  const userName = appContext.user.name;
  let text = "";
  if (query.includes("s\xE2n") || query.includes("t\xECm") || query.includes("\u0111\u1EB7t")) {
    const recommendedCourt = appContext.courts[Math.floor(Math.random() * appContext.courts.length)];
    text = `Ch\xE0o **${userName}**! \u{1F3DF}\uFE0F \u0110\u1EC3 h\u1ED7 tr\u1EE3 b\u1EA1n t\xECm s\xE2n \u0111\u1EA5u l\xFD t\u01B0\u1EDFng, t\xF4i ph\xE1t hi\u1EC7n s\xE2n **${recommendedCourt.name}** t\u1EA1i ${recommendedCourt.district} s\u1EDF h\u1EEFu \u0111\xE1nh gi\xE1 r\u1EA5t cao (${recommendedCourt.rating}\u2B50) v\xE0 c\u1EF1c k\u1EF3 ph\xF9 h\u1EE3p cho tr\xECnh th\u1EC3 thao c\u1EE7a b\u1EA1n.

Ngo\xE0i ra, b\u1EA1n c\u0169ng c\xF3 th\u1EC3 m\u1EDF tab **"T\xECm S\xE2n"** trong \u1EE9ng d\u1EE5ng b\u1EB1ng c\xE1ch g\xF5 thanh t\xECm ki\u1EBFm, ch\u1ECDn l\u1ECDc qu\u1EADn mong mu\u1ED1n v\xE0 b\u1EA5m \u0110\u1EB7t slot ph\xF9 h\u1EE3p nh\u1EA5t \u0111\u1EC3 thanh to\xE1n t\u1EF1 \u0111\u1ED9ng ngay t\u1EE9c th\xEC!`;
  } else if (query.includes("gh\xE9p") || query.includes("k\u1EBFt n\u1ED1i") || query.includes("tr\u1EADn") || query.includes("\u0111\u1ED1i")) {
    const openMatch = appContext.matches.find((m) => m.status === "open");
    if (openMatch) {
      text = `Ch\xE0o **${userName}**! \u{1F91D} Tr\xEAn h\u1EC7 th\u1ED1ng hi\u1EC7n \u0111ang tuy\u1EC3n qu\xE2n kh\u1EA9n c\u1EA5p cho tr\u1EADn: **"${openMatch.title}"** t\u1EA1i *${openMatch.courtName}* (${openMatch.time} ng\xE0y h\xF4m nay).

Tr\u1EADn \u0111\u1EA5u n\xE0y y\xEAu c\u1EA7u tr\xECnh \u0111\u1ED9 **${openMatch.level}** v\xE0 hi\u1EC7n c\xF3 ${openMatch.players.length}/${openMatch.maxPlayers} ng\u01B0\u1EDDi. B\u1EA1n c\xF3 th\u1EC3 sang th\u1EB3ng tab **"Gh\xE9p K\xE8o"** \u0111\u1EC3 tham gia ngay \u0111\u1EC3 giao l\u01B0u s\u1EE9c kh\u1ECFe v\xE0 m\u1EDF r\u1ED9ng v\xF2ng k\u1EBFt n\u1ED1i!`;
    } else {
      text = `Ch\xE0o **${userName}**! Hi\u1EC7n t\u1EA1i c\xE1c k\xE8o \u0111\u1EA5u \u0111ang t\u1EA1m k\xEDn ch\u1ED7. Tuy nhi\xEAn b\u1EA1n ho\xE0n to\xE0n c\xF3 th\u1EC3 t\u1EF1 t\u1EA1o m\u1ED9t k\xE8o \u0111\u1EA5u m\u1EDBi t\u1EA1i m\u1EE5c **"Gh\xE9p K\xE8o" \u2794 "T\u1EA1o tr\u1EADn \u0111\u1EA5u"**, h\u1EC7 th\u1ED1ng s\u1EBD l\u1EADp t\u1EE9c th\xF4ng b\xE1o v\xE0 g\u1EE3i \xFD cho nh\u1EEFng ng\u01B0\u1EDDi c\xF9ng tr\xECnh \u0111\u1ED9 th\u1EC3 thao t\u1EA1i khu v\u1EF1c l\xE2n c\u1EADn gia nh\u1EADp c\xF9ng b\u1EA1n!`;
    }
  } else if (query.includes("gi\u1EA3i") || query.includes("\u0111\u1EA5u") || query.includes("tournament")) {
    const tour = appContext.tournaments[0];
    text = `Ch\xE0o **${userName}**! \u{1F3C6} Hi\u1EC7n t\u1EA1i SportRes \u0111ang t\xE0i tr\u1EE3 ch\xEDnh cho gi\u1EA3i \u0111\u1EA5u c\u1EF1c hot: **"${tour.title}"** quy t\u1EE5 c\xE1c \u0111\u1ED9i tuy\u1EC3n phong tr\xE0o m\u1EA1nh nh\u1EA5t v\u1EDBi t\u1ED5ng gi\u1EA3i th\u01B0\u1EDFng l\xEAn \u0111\u1EBFn **${tour.prizePool}**!

B\u1EA1n h\xE3y v\xE0o tab **"Gi\u1EA3i \u0111\u1EA5u & Ranking"** \u0111\u1EC3 ki\u1EC3m tra b\u1EA3ng \u0111\u1EA5u, th\u1EE9 h\u1EA1ng hi\u1EC7n t\u1EA1i v\xE0 \u0111\u0103ng k\xFD tranh t\xE0i nh\xE9!`;
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
var app = express();
app.use(express.json());
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
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
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString() });
});
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
var PORT = 3e3;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`[SportRes API Server] Listening on http://localhost:${PORT}`);
});
