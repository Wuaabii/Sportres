import OpenAI from 'openai';

const AI_NOT_CONFIGURED_MESSAGE = 'AI chưa được cấu hình. Vui lòng thiết lập OPENAI_API_KEY ở backend.';

interface AssistantRequest {
  message: string;
  history?: Array<{
    role?: 'user' | 'model' | 'assistant';
    text?: string;
    content?: string;
    parts?: { text?: string }[];
  }>;
  appContext: {
    user: any;
    courts: any[];
    matches: any[];
    tournaments: any[];
  };
}

const toAiText = (value: unknown, maxLength = 120) =>
  String(value || '').replace(/\s+/g, ' ').trim().slice(0, maxLength);

const historyText = (item: AssistantRequest['history'][number]) =>
  toAiText(
    item?.text
    || item?.content
    || (Array.isArray(item?.parts) ? item.parts.map(part => part?.text || '').join('\n') : ''),
    1000,
  );

const sportName = (sport: string) =>
  sport === 'soccer'
    ? 'Bóng đá'
    : sport === 'badminton'
      ? 'Cầu lông'
      : sport === 'tennis'
        ? 'Tennis'
        : sport === 'basketball'
          ? 'Bóng rổ'
          : sport || 'Thể thao';

const buildSportResSystemPrompt = (appContext: AssistantRequest['appContext']) => {
  const user = appContext.user || {};
  const courts = Array.isArray(appContext.courts) ? appContext.courts : [];
  const matches = Array.isArray(appContext.matches) ? appContext.matches : [];
  const tournaments = Array.isArray(appContext.tournaments) ? appContext.tournaments : [];
  const skillLevels = user.skillLevels || {};
  const favoriteSports = Array.isArray(user.favoriteSports) ? user.favoriteSports : [];

  return `
Bạn là "SportRes AI", trợ lý thể thao cá nhân thông minh trong ứng dụng SportRes (Nền tảng tìm sân, đặt sân và kết nối ghép cặp thể thao tại Việt Nam).
Mục tiêu của bạn là giúp đỡ người dùng, đặc biệt là người dùng hiện tại có thông tin sau:
- Tên người dùng: ${user.name || 'Người dùng SportRes'}
- Trình độ thể thao: Bóng đá (${skillLevels.soccer || 'Chưa cập nhật'}), Cầu lông (${skillLevels.badminton || 'Chưa cập nhật'}), Tennis (${skillLevels.tennis || 'Chưa cập nhật'}), Bóng rổ (${skillLevels.basketball || 'Chưa cập nhật'})
- Môn thể thao yêu thích: ${favoriteSports.length ? favoriteSports.join(', ') : 'Chưa cập nhật'}

Dưới đây là dữ liệu thời gian thực hiện tại của hệ thống SportRes:

DANH SÁCH SÂN THỂ THAO ĐANG HOẠT ĐỘNG:
${courts.map(c => `- [ID: ${c.id}] ${c.name} (${sportName(c.sport)}): Khu vực ${c.district}. Giá từ ${Number(c.priceMin || c.price_per_hour || 0).toLocaleString('vi-VN')}đ/giờ. Đánh giá: ${c.rating || 0}⭐ (${c.reviewsCount || 0} bài đánh giá). Địa chỉ: ${c.address || 'Chưa cập nhật'}. Tiện ích: ${Array.isArray(c.amenities) ? c.amenities.join(', ') : 'Chưa cập nhật'}.`).join('\n') || '- Chưa có dữ liệu sân.'}

DANH SÁCH CÁC TRẬN ĐẤU GHÉP CẶP ĐANG TUYỂN NGƯỜI (MATCHMAKING):
${matches.map(m => `- [ID: ${m.id}] "${m.title}" do ${m.creatorName || 'người dùng SportRes'} tạo. Bộ môn: ${sportName(m.sport)}. Sân: ${m.courtName}. Thời gian: ${m.time}, Ngày: ${m.date}. Trình độ yêu cầu: ${m.level}. Số người hiện có: ${Array.isArray(m.players) ? m.players.length : 0}/${m.maxPlayers || 0} người. Lệ phí chia đều: ${Number(m.pricePerPlayer || 0).toLocaleString('vi-VN')}đ/người.`).join('\n') || '- Chưa có dữ liệu trận ghép.'}

DANH SÁCH GIẢI ĐẤU (TOURNAMENTS):
${tournaments.map(t => `- [ID: ${t.id}] "${t.title}". Bộ môn: ${sportName(t.sport)}. Trạng thái: ${t.status === 'ongoing' ? 'Đang diễn ra' : 'Đang mở đăng ký'}. Quỹ giải thưởng: ${t.prizePool}.`).join('\n') || '- Chưa có dữ liệu giải đấu.'}

HƯỚNG DẪN ỨNG XỬ:
1. Luôn trả lời bằng tiếng Việt thân thiện, nhiệt tình, năng động và chuyên nghiệp của một chuyên gia thể thao.
2. Dựa vào sở thích và trình độ thể thao của người dùng để đưa ra gợi ý sân hoặc trận ghép cặp (Matchmaking) phù hợp nhất.
3. Khi giới thiệu sân hoặc kèo ghép cặp, hãy nêu rõ Tên sân, Quận huyện, Phân khúc giá và vì sao sân đó phù hợp với cá nhân họ.
4. Tránh lặp lại quá nhiều về mặt kỹ thuật, tập trung vào việc tạo sự khích lệ vận động, rèn luyện thể thao.
5. Không yêu cầu, hiển thị hoặc suy đoán thông tin nhạy cảm như mật khẩu, token hoặc khóa API.
`.trim();
};

export async function handleAssistantRequest(body: AssistantRequest) {
  const message = typeof body?.message === 'string' ? body.message.trim() : '';
  const appContext = body?.appContext || { user: {}, courts: [], matches: [], tournaments: [] };

  if (!message) {
    return { text: 'message is required', success: false, error: 'message is required', statusCode: 400 };
  }

  if (message.length > 1000) {
    return {
      text: 'Tin nhắn quá dài. Vui lòng nhập tối đa 1000 ký tự.',
      success: false,
      error: 'message must be at most 1000 characters',
      statusCode: 400,
    };
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return {
      text: AI_NOT_CONFIGURED_MESSAGE,
      success: false,
      error: AI_NOT_CONFIGURED_MESSAGE,
      statusCode: 503,
    };
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const history = Array.isArray(body.history)
      ? body.history
          .slice(-8)
          .map(item => ({
            role: item?.role === 'model' || item?.role === 'assistant' ? 'assistant' as const : 'user' as const,
            content: historyText(item),
          }))
          .filter(item => item.content)
      : [];

    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL?.trim() || 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 1000,
      messages: [
        { role: 'system', content: buildSportResSystemPrompt(appContext) },
        ...history,
        { role: 'user', content: message },
      ],
    });

    return {
      text: completion.choices[0]?.message?.content?.trim() || 'Xin lỗi, tôi chưa thể trả lời lúc này.',
      success: true,
    };
  } catch (error: any) {
    console.error('[ai:assistant] OpenAI request failed:', error?.message || error);
    const fallback = generateMockResponse(message, appContext);
    return {
      ...fallback,
      success: false,
      error: error?.message || 'OpenAI request failed',
    };
  }
}

function generateMockResponse(message: string, appContext: any) {
  const query = message.toLowerCase();
  const user = appContext?.user || {};
  const userName = user.name || 'bạn';
  const courts = Array.isArray(appContext?.courts) ? appContext.courts : [];
  const matches = Array.isArray(appContext?.matches) ? appContext.matches : [];
  const tournaments = Array.isArray(appContext?.tournaments) ? appContext.tournaments : [];

  let text = '';

  if (query.includes('sân') || query.includes('tìm') || query.includes('đặt')) {
    const recommendedCourt = courts[Math.floor(Math.random() * courts.length)];
    text = recommendedCourt
      ? `Chào **${userName}**! Để hỗ trợ bạn tìm sân đấu lý tưởng, tôi phát hiện sân **${recommendedCourt.name}** tại ${recommendedCourt.district} sở hữu đánh giá rất cao (${recommendedCourt.rating || 0}⭐) và phù hợp với trình thể thao của bạn.\n\nBạn có thể mở tab **"Tìm Sân"**, chọn khu vực mong muốn và bấm Đặt slot phù hợp nhất.`
      : `Chào **${userName}**! Hiện tôi chưa thấy dữ liệu sân phù hợp trong ngữ cảnh hiện tại. Bạn hãy mở tab **"Tìm Sân"** để lọc theo khu vực, môn thể thao và khung giờ mong muốn nhé.`;
  } else if (query.includes('ghép') || query.includes('kết nối') || query.includes('trận') || query.includes('đối')) {
    const openMatch = matches.find((m: any) => m.status === 'open');
    if (openMatch) {
      text = `Chào **${userName}**! Trên hệ thống hiện đang tuyển người cho trận: **"${openMatch.title}"** tại *${openMatch.courtName}* (${openMatch.time} ngày ${openMatch.date}).\n\nTrận này yêu cầu trình độ **${openMatch.level}** và hiện có ${Array.isArray(openMatch.players) ? openMatch.players.length : 0}/${openMatch.maxPlayers || 0} người. Bạn có thể sang tab **"Ghép Kèo"** để tham gia.`;
    } else {
      text = `Chào **${userName}**! Hiện tại các kèo đấu đang tạm kín chỗ hoặc chưa có dữ liệu phù hợp. Bạn có thể tự tạo một kèo mới tại mục **"Ghép Kèo" -> "Tạo trận đấu"** để mời người chơi cùng trình độ tham gia.`;
    }
  } else if (query.includes('giải') || query.includes('đấu') || query.includes('tournament')) {
    const tour = tournaments[0];
    text = tour
      ? `Chào **${userName}**! Hiện SportRes đang có giải đấu **"${tour.title}"** với bộ môn ${sportName(tour.sport)} và tổng giải thưởng **${tour.prizePool}**.\n\nBạn hãy vào tab **"Sự kiện & Giải đấu"** để xem thông tin, lịch thi đấu và đăng ký tham gia nhé.`
      : `Chào **${userName}**! Hiện tôi chưa thấy dữ liệu giải đấu trong ngữ cảnh hiện tại. Bạn hãy kiểm tra tab **"Sự kiện & Giải đấu"** để xem các giải mới nhất nhé.`;
  } else {
    text = `Chào **${userName}**! Rất vui được đồng hành cùng bạn trên ứng dụng SportRes.\n\nTôi có thể giúp bạn tìm sân, gợi ý kèo ghép phù hợp, xem thông tin giải đấu, hoặc hướng dẫn các tính năng ví/thanh toán và quản lý sân. Hãy chia sẻ môn thể thao bạn muốn chơi hôm nay nhé!`;
  }

  return {
    text,
    success: true,
  };
}
