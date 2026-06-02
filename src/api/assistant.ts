import { GoogleGenAI } from '@google/genai';

interface AssistantRequest {
  message: string;
  history: { role: 'user' | 'model'; parts: { text: string }[] }[];
  appContext: {
    user: any;
    courts: any[];
    matches: any[];
    tournaments: any[];
  };
}

export async function handleAssistantRequest(body: AssistantRequest, apiKey: string | undefined) {
  const { message, history, appContext } = body;

  console.log('AI Assistant received request:', message);

  // If no Gemini API Key is configured, generate a high-quality dynamic mock response
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return generateMockResponse(message, appContext);
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Structure our context for the Gemini model to make it exceptionally smart
    const systemInstruction = `
Bạn là "SportRes AI", trợ lý thể thao cá nhân thông minh trong ứng dụng SportRes (Nền tảng tìm sân, đặt sân và kết nối ghép cặp thể thao tại Việt Nam).
Mục tiêu của bạn là giúp đỡ người dùng, đặc biệt là người dùng hiện tại có thông tin sau:
- Tên người dùng: ${appContext.user.name}
- Trình độ thế thao: Bóng đá (${appContext.user.skillLevels.soccer}), Cầu lông (${appContext.user.skillLevels.badminton}), Tennis (${appContext.user.skillLevels.tennis}), Bóng rổ (${appContext.user.skillLevels.basketball})
- Hạng thành viên: ${appContext.user.tier} (Điểm tích lũy: ${appContext.user.points} điểm)
- Số dư ví hiện tại: ${appContext.user.walletBalance.toLocaleString('vi-VN')} VND
- Môn thể thao yêu thích: ${appContext.user.favoriteSports.join(', ')}

Dưới đây là dữ liệu thời gian thực hiện tại của hệ thống SportRes:

DANH SÁCH SÂN THỂ THAO ĐANG HOẠT ĐỘNG:
${appContext.courts.map(c => `- [ID: ${c.id}] ${c.name} (${c.sport === 'soccer' ? 'Bóng đá' : c.sport === 'badminton' ? 'Cầu lông' : c.sport === 'tennis' ? 'Tennis' : 'Bóng rổ'}): Khu vực ${c.district}. Giá từ ${c.priceMin.toLocaleString('vi-VN')}đ/giờ. Đánh giá: ${c.rating}⭐ (${c.reviewsCount} bài đánh giá). Địa chỉ: ${c.address}. Tiện ích: ${c.amenities.join(', ')}.`).join('\n')}

DANH SÁCH CÁC TRẬN ĐẤU GHÉP CẶP ĐANG TUYỂN NGƯỜI (MATCHMAKING):
${appContext.matches.map(m => `- [ID: ${m.id}] "${m.title}" do ${m.creatorName} tạo. Bộ môn: ${m.sport}. Sân: ${m.courtName}. Thời gian: ${m.time}, Ngày: ${m.date}. Trình độ yêu cầu: ${m.level}. Số người hiện có: ${m.players.length}/${m.maxPlayers} người. Lệ phí chia đều: ${m.pricePerPlayer.toLocaleString('vi-VN')}đ/người.`).join('\n')}

DANH SÁCH GIẢI ĐẤU (TOURNAMENTS):
${appContext.tournaments.map(t => `- [ID: ${t.id}] "${t.title}". Bộ môn: ${t.sport}. Trạng thái: ${t.status === 'ongoing' ? 'Đang diễn ra' : 'Đang mở đăng ký'}. Quỹ giải thưởng: ${t.prizePool}.`).join('\n')}

HƯỚNG DẪN ỨNG XỬ:
1. Luôn trả lời bằng tiếng Việt thân thiện, nhiệt tình, năng động và chuyên nghiệp của một chuyên gia thể thao.
2. Dựa vào sở thích, trình độ thể thao và số dư tài khoản của người dùng để đưa ra gợi ý sân hoặc trận ghép cặp (Matchmaking) phù hợp nhất.
3. Khi giới thiệu sân hoặc kèo ghép cặp, hãy nêu rõ Tên sân, Quận huyện, Phân khúc giá và vì sao sân đó phù hợp với cá nhân họ.
4. Tránh lặp lại quá nhiều về mặt kỹ thuật, tập trung vào việc tạo sự khích lệ vận động, rèn luyện thể thao.
5. Nếu họ hỏi về xếp hạng hay làm sao nâng hạng, hãy chỉ cho họ cách tham gia các trận đấu matchmaking hoặc giải đấu để tích lũy điểm thưởng SportRes!
`;

    // Process history into content parts
    const contents: any[] = history.map(h => ({
      role: h.role === 'model' ? 'model' : 'user',
      parts: h.parts
    }));

    // Append the current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
    });

    return {
      text: response.text || 'Xin lỗi, tôi chưa thể trả lời lúc này.',
      success: true,
    };
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return {
      text: `Chào ${appContext.user.name}, chúc một ngày đầy sức trẻ! Rất tiếc, kết nối đến máy chủ AI đang bận tí chút, tuy nhiên dựa vào dữ liệu hệ thống, tôi đề xuất bạn nên trải nghiệm **${appContext.courts[0]?.name || 'Sân bóng Kỳ Hòa'}** nằm ở ${appContext.courts[0]?.district || 'Quận 10'} hoặc kết nối với kèo **"${appContext.matches[0]?.title || 'Giao lưu cầu lông'}"** đang rất nóng! Chúc bạn có những giờ phút thể thao sảng khoái!`,
      success: false,
      error: error.message,
    };
  }
}

// Smart local fallback to provide amazing UX when no API key is specified
function generateMockResponse(message: string, appContext: any) {
  const query = message.toLowerCase();
  const userName = appContext.user.name;

  let text = '';

  if (query.includes('sân') || query.includes('tìm') || query.includes('đặt')) {
    const recommendedCourt = appContext.courts[Math.floor(Math.random() * appContext.courts.length)];
    text = `Chào **${userName}**! 🏟️ Để hỗ trợ bạn tìm sân đấu lý tưởng, tôi phát hiện sân **${recommendedCourt.name}** tại ${recommendedCourt.district} sở hữu đánh giá rất cao (${recommendedCourt.rating}⭐) và cực kỳ phù hợp cho trình thể thao của bạn.\n\nNgoài ra, bạn cũng có thể mở tab **"Tìm Sân"** trong ứng dụng bằng cách gõ thanh tìm kiếm, chọn lọc quận mong muốn và bấm Đặt slot phù hợp nhất để thanh toán tự động ngay tức thì!`;
  } else if (query.includes('ghép') || query.includes('kết nối') || query.includes('trận') || query.includes('đối')) {
    const openMatch = appContext.matches.find((m: any) => m.status === 'open');
    if (openMatch) {
      text = `Chào **${userName}**! 🤝 Trên hệ thống hiện đang tuyển quân khẩn cấp cho trận: **"${openMatch.title}"** tại *${openMatch.courtName}* (${openMatch.time} ngày hôm nay).\n\nTrận đấu này yêu cầu trình độ **${openMatch.level}** và hiện có ${openMatch.players.length}/${openMatch.maxPlayers} người. Bạn có thể sang thẳng tab **"Ghép Kèo"** để tham gia ngay để giao lưu sức khỏe và mở rộng vòng kết nối!`;
    } else {
      text = `Chào **${userName}**! Hiện tại các kèo đấu đang tạm kín chỗ. Tuy nhiên bạn hoàn toàn có thể tự tạo một kèo đấu mới tại mục **"Ghép Kèo" ➔ "Tạo trận đấu"**, hệ thống sẽ lập tức thông báo và gợi ý cho những người cùng trình độ thể thao tại khu vực lân cận gia nhập cùng bạn!`;
    }
  } else if (query.includes('giải') || query.includes('đấu') || query.includes('tournament')) {
    const tour = appContext.tournaments[0];
    text = `Chào **${userName}**! 🏆 Hiện tại SportRes đang tài trợ chính cho giải đấu cực hot: **"${tour.title}"** quy tụ các đội tuyển phong trào mạnh nhất với tổng giải thưởng lên đến **${tour.prizePool}**!\n\nBạn hãy vào tab **"Giải đấu & Ranking"** để kiểm tra bảng đấu, thứ hạng hiện tại và đăng ký tranh tài nhé!`;
  } else {
    text = `Chào **${userName}**! Rất vui được đồng hành cùng bạn trên ứng dụng SportRes. 🚀\n\nTôi có thể giúp gì cho bạn hôm nay?\n- 🏟️ **Tìm và đề xuất sân đấu trống** gần bạn.\n- 🤝 **Tìm đối thủ và ghép kèo giao lưu** đúng trình độ của bạn.\n- 🏆 **Thông tin các giải đấu** phong trào đang diễn ra.\n- ⚡ **Giải đáp thắc mắc** kỹ thuật tập luyện hoặc quản lý lịch sân cho chủ sân.\n\nHãy chia sẻ môn thể thao bạn muốn chơi hôm nay nhé!`;
  }

  return {
    text: text,
    success: true,
  };
}
