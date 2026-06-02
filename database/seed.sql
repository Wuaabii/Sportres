-- ============================================================
-- SportRes Platform — Demo Seed Data
-- Version: 2.5.0
-- Created: 2026-05-31
-- Description: Seed data with demo accounts, venues, courts,
--              bookings, matches, tournaments, and more.
-- NOTE: Passwords shown here are for DEMO ONLY.
--       In production, use bcrypt hashed passwords.
-- ============================================================

-- ============================================================
-- DEMO USERS
-- Password format: plaintext shown in comments, stored as
-- bcrypt hash placeholder. Replace with real bcrypt hashes
-- in production.
-- ============================================================

-- Players
-- player1 / Sport@123
INSERT INTO users (id, username, email, phone, password_hash, role, status) VALUES
('a1000001-0000-0000-0000-000000000001', 'player1', 'minhquan@sportres.vn', '0901234001', '$2b$10$DEMO_HASH_player1_Sport123', 'player', 'active');

-- player2 / Sport@123
INSERT INTO users (id, username, email, phone, password_hash, role, status) VALUES
('a1000001-0000-0000-0000-000000000002', 'player2', 'vandat@sportres.vn', '0901234002', '$2b$10$DEMO_HASH_player2_Sport123', 'player', 'active');

-- player3 / Sport@123
INSERT INTO users (id, username, email, phone, password_hash, role, status) VALUES
('a1000001-0000-0000-0000-000000000003', 'player3', 'duykhanh@sportres.vn', '0901234003', '$2b$10$DEMO_HASH_player3_Sport123', 'player', 'active');

-- player4 / Sport@123
INSERT INTO users (id, username, email, phone, password_hash, role, status) VALUES
('a1000001-0000-0000-0000-000000000004', 'player4', 'minhduc@sportres.vn', '0901234004', '$2b$10$DEMO_HASH_player4_Sport123', 'player', 'active');

-- player5 / Sport@123
INSERT INTO users (id, username, email, phone, password_hash, role, status) VALUES
('a1000001-0000-0000-0000-000000000005', 'player5', 'thihoa@sportres.vn', '0901234005', '$2b$10$DEMO_HASH_player5_Sport123', 'player', 'active');

-- Venue Owners
-- owner1 / Owner@123
INSERT INTO users (id, username, email, phone, password_hash, role, status) VALUES
('b2000001-0000-0000-0000-000000000001', 'owner1', 'grasslands@sportres.vn', '0987654001', '$2b$10$DEMO_HASH_owner1_Owner123', 'venue_owner', 'active');

-- owner2 / Owner@123
INSERT INTO users (id, username, email, phone, password_hash, role, status) VALUES
('b2000001-0000-0000-0000-000000000002', 'owner2', 'hungvuong@sportres.vn', '0987654002', '$2b$10$DEMO_HASH_owner2_Owner123', 'venue_owner', 'active');

-- Staff
-- staff1 / Staff@123
INSERT INTO users (id, username, email, phone, password_hash, role, status) VALUES
('c3000001-0000-0000-0000-000000000001', 'staff1', 'nhanvien1@sportres.vn', '0976543001', '$2b$10$DEMO_HASH_staff1_Staff123', 'staff', 'active');

-- staff2 / Staff@123
INSERT INTO users (id, username, email, phone, password_hash, role, status) VALUES
('c3000001-0000-0000-0000-000000000002', 'staff2', 'tieptan1@sportres.vn', '0976543002', '$2b$10$DEMO_HASH_staff2_Staff123', 'staff', 'active');

-- Admin
-- admin / Admin@123
INSERT INTO users (id, username, email, phone, password_hash, role, status) VALUES
('d4000001-0000-0000-0000-000000000001', 'admin', 'admin@sportres.vn', '0900000001', '$2b$10$DEMO_HASH_admin_Admin123', 'admin', 'active');


-- ============================================================
-- USER PROFILES
-- ============================================================

INSERT INTO user_profiles (user_id, display_name, avatar_url, gender, active_area, wallet_balance, points, tier) VALUES
('a1000001-0000-0000-0000-000000000001', 'Trần Minh Quân', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200', 'Nam', 'Thạch Thất, Hà Nội', 450000, 1540, 'Vàng'),
('a1000001-0000-0000-0000-000000000002', 'Nguyễn Văn Đạt', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', 'Nam', 'Cầu Giấy, Hà Nội', 320000, 2420, 'Vàng'),
('a1000001-0000-0000-0000-000000000003', 'Lê Duy Khánh', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', 'Nam', 'Thạch Thất, Hà Nội', 580000, 2980, 'Kim cương'),
('a1000001-0000-0000-0000-000000000004', 'Phạm Minh Đức', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', 'Nam', 'Hòa Lạc, Hà Nội', 750000, 2850, 'Kim cương'),
('a1000001-0000-0000-0000-000000000005', 'Nguyễn Thị Hoa', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', 'Nữ', 'Cầu Giấy, Hà Nội', 200000, 1980, 'Vàng'),
('b2000001-0000-0000-0000-000000000001', 'Nguyễn Văn Sân', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150', 'Nam', 'Thạch Thất, Hà Nội', 12500000, 0, 'Đồng'),
('b2000001-0000-0000-0000-000000000002', 'Trần Thị Lan', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', 'Nữ', 'Quận 5, TP.HCM', 8900000, 0, 'Đồng'),
('c3000001-0000-0000-0000-000000000001', 'Lê Văn Nhân Viên', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', 'Nam', 'Thạch Thất, Hà Nội', 0, 0, 'Đồng'),
('c3000001-0000-0000-0000-000000000002', 'Phạm Thị Tiếp Tân', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', 'Nữ', 'Hòa Lạc, Hà Nội', 0, 0, 'Đồng'),
('d4000001-0000-0000-0000-000000000001', 'SportRes Admin', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150', 'Nam', 'Hà Nội', 0, 0, 'Kim cương');


-- ============================================================
-- USER SPORT SKILLS
-- ============================================================

-- Player 1: Trần Minh Quân
INSERT INTO user_sport_skills (user_id, sport, skill, is_favorite) VALUES
('a1000001-0000-0000-0000-000000000001', 'soccer', 'Intermediate', TRUE),
('a1000001-0000-0000-0000-000000000001', 'badminton', 'Advanced', TRUE),
('a1000001-0000-0000-0000-000000000001', 'tennis', 'Beginner', FALSE),
('a1000001-0000-0000-0000-000000000001', 'basketball', 'Intermediate', FALSE);

-- Player 2: Nguyễn Văn Đạt
INSERT INTO user_sport_skills (user_id, sport, skill, is_favorite) VALUES
('a1000001-0000-0000-0000-000000000002', 'soccer', 'Advanced', TRUE),
('a1000001-0000-0000-0000-000000000002', 'badminton', 'Intermediate', FALSE);

-- Player 3: Lê Duy Khánh
INSERT INTO user_sport_skills (user_id, sport, skill, is_favorite) VALUES
('a1000001-0000-0000-0000-000000000003', 'badminton', 'Pro', TRUE),
('a1000001-0000-0000-0000-000000000003', 'soccer', 'Advanced', TRUE);

-- Player 4: Phạm Minh Đức
INSERT INTO user_sport_skills (user_id, sport, skill, is_favorite) VALUES
('a1000001-0000-0000-0000-000000000004', 'soccer', 'Pro', TRUE),
('a1000001-0000-0000-0000-000000000004', 'badminton', 'Advanced', TRUE);

-- Player 5: Nguyễn Thị Hoa
INSERT INTO user_sport_skills (user_id, sport, skill, is_favorite) VALUES
('a1000001-0000-0000-0000-000000000005', 'badminton', 'Advanced', TRUE),
('a1000001-0000-0000-0000-000000000005', 'pickleball', 'Beginner', TRUE);


-- ============================================================
-- VENUES (Sample — first 4 venues)
-- ============================================================

INSERT INTO venues (id, owner_id, name, address, district, city, description, image_url, rating, reviews_count, status, amenities) VALUES
('v1000001-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000001',
 'Sân bóng Grasslands Sư Vạn Hạnh',
 '824 Sư Vạn Hạnh, Phường 12, Quận 10, TP. Hồ Chí Minh',
 'Quận 10', 'TP. Hồ Chí Minh',
 'Sân cỏ nhân tạo chất lượng cao chuẩn FIFA, hệ thống chiếu sáng LED hiện đại xuyên đêm.',
 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800',
 4.8, 142, 'active',
 ARRAY['Trực tiếp bóng đá', 'Bãi xe ô tô', 'Căn tin nước', 'Tắm vòi sen', 'Băng vết thương miễn phí']),

('v1000001-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000002',
 'CLB Cầu lông Hùng Vương Plaza',
 '126 Hồng Bàng, Phường 12, Quận 5, TP. Hồ Chí Minh',
 'Quận 5', 'TP. Hồ Chí Minh',
 'Thảm cầu lông Yonex nhập khẩu cực êm chân, trần cao không bị chói đèn.',
 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800',
 4.6, 98, 'active',
 ARRAY['Thuê vợt Yonex', 'Phòng máy lạnh nghỉ ngơi', 'Wifi miễn phí', 'Tủ đồ an toàn', 'Cửa hàng dụng cụ']),

('v1000001-0000-0000-0000-000000000003', 'b2000001-0000-0000-0000-000000000001',
 'Sân Tennis Lan Anh Club',
 '291 Cách Mạng Tháng 8, Phường 12, Quận 10, TP. Hồ Chí Minh',
 'Quận 10', 'TP. Hồ Chí Minh',
 'Cum sân quần vợt đẳng cấp chuyên nghiệp nhất thành phố.',
 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=800',
 4.9, 210, 'active',
 ARRAY['Huấn luyện viên', 'Nhà hàng ẩm thực', 'Hồ bơi thư giãn', 'Phòng tắm hơi', 'Cho thuê máy giao bóng']),

('v1000001-0000-0000-0000-000000000004', 'b2000001-0000-0000-0000-000000000001',
 'Khu thể thao rổ Phú Thọ',
 '221 Lý Thường Kiệt, Phường 15, Quận 11, TP. Hồ Chí Minh',
 'Quận 11', 'TP. Hồ Chí Minh',
 'Sân bóng rổ trong nhà chất liệu sàn gỗ cao cấp chống trơn trượt.',
 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&q=80&w=800',
 4.5, 76, 'active',
ARRAY['Bóng Spalding chuẩn', 'Khu tắm rửa', 'Đồng hồ đếm giây điện tử', 'Xà đu thể lực']);

UPDATE venues SET latitude = 10.7699, longitude = 106.6672 WHERE id = 'v1000001-0000-0000-0000-000000000001';
UPDATE venues SET latitude = 10.7550, longitude = 106.6573 WHERE id = 'v1000001-0000-0000-0000-000000000002';
UPDATE venues SET latitude = 10.7790, longitude = 106.6685 WHERE id = 'v1000001-0000-0000-0000-000000000003';
UPDATE venues SET latitude = 10.7658, longitude = 106.6512 WHERE id = 'v1000001-0000-0000-0000-000000000004';


-- ============================================================
-- COURTS (Sub-courts for each venue)
-- ============================================================

INSERT INTO courts (id, venue_id, name, sport, status, price_min, price_peak) VALUES
('ct000001-0000-0000-0000-000000000001', 'v1000001-0000-0000-0000-000000000001', 'Sân 1 (Sân 5 người)', 'soccer', 'open', 250000, 500000),
('ct000001-0000-0000-0000-000000000002', 'v1000001-0000-0000-0000-000000000001', 'Sân 2 (Sân 7 người)', 'soccer', 'open', 280000, 500000),
('ct000001-0000-0000-0000-000000000003', 'v1000001-0000-0000-0000-000000000002', 'Sân số 1 (Premium)', 'badminton', 'open', 70000, 120000),
('ct000001-0000-0000-0000-000000000004', 'v1000001-0000-0000-0000-000000000002', 'Sân số 2', 'badminton', 'open', 70000, 120000),
('ct000001-0000-0000-0000-000000000005', 'v1000001-0000-0000-0000-000000000002', 'Sân số 3', 'badminton', 'open', 70000, 110000),
('ct000001-0000-0000-0000-000000000006', 'v1000001-0000-0000-0000-000000000003', 'Sân Trung tâm (Khán đài)', 'tennis', 'open', 150000, 260000),
('ct000001-0000-0000-0000-000000000007', 'v1000001-0000-0000-0000-000000000003', 'Sân số 2 Bán nguyệt', 'tennis', 'open', 150000, 240000),
('ct000001-0000-0000-0000-000000000008', 'v1000001-0000-0000-0000-000000000004', 'Sân Gỗ Trực Diện (Trong Nhà)', 'basketball', 'open', 180000, 320000),
('ct000001-0000-0000-0000-000000000009', 'v1000001-0000-0000-0000-000000000004', 'Sân Nhựa Tổng Hợp (Ngoài Trời)', 'basketball', 'open', 150000, 280000);


-- ============================================================
-- SAMPLE BOOKINGS
-- ============================================================

INSERT INTO time_slots (id, court_id, date, start_time, end_time, price, is_peak, is_booked, booked_by) VALUES
('ts000001-0000-0000-0000-000000000001', 'ct000001-0000-0000-0000-000000000001', CURRENT_DATE, '17:00', '18:00', 500000, TRUE, TRUE, 'a1000001-0000-0000-0000-000000000001'),
('ts000001-0000-0000-0000-000000000002', 'ct000001-0000-0000-0000-000000000003', CURRENT_DATE + 1, '08:00', '09:00', 80000, FALSE, TRUE, 'a1000001-0000-0000-0000-000000000002'),
('ts000001-0000-0000-0000-000000000003', 'ct000001-0000-0000-0000-000000000006', CURRENT_DATE - 2, '15:00', '16:00', 200000, FALSE, TRUE, 'a1000001-0000-0000-0000-000000000001');

INSERT INTO bookings (id, user_id, court_id, venue_id, time_slot_id, date, time_range, total_price, status, qr_code) VALUES
('bk000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000001', 'ct000001-0000-0000-0000-000000000001', 'v1000001-0000-0000-0000-000000000001', 'ts000001-0000-0000-0000-000000000001', CURRENT_DATE, '17:00 - 18:00', 500000, 'confirmed', 'SPORTRES-BK-001'),
('bk000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000002', 'ct000001-0000-0000-0000-000000000003', 'v1000001-0000-0000-0000-000000000002', 'ts000001-0000-0000-0000-000000000002', CURRENT_DATE + 1, '08:00 - 09:00', 80000, 'confirmed', 'SPORTRES-BK-002'),
('bk000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000001', 'ct000001-0000-0000-0000-000000000006', 'v1000001-0000-0000-0000-000000000003', 'ts000001-0000-0000-0000-000000000003', CURRENT_DATE - 2, '15:00 - 16:00', 200000, 'completed', 'SPORTRES-BK-003');


-- ============================================================
-- SAMPLE MATCHES
-- ============================================================

INSERT INTO matches (id, creator_id, court_id, venue_id, title, sport, address, match_date, match_time, skill_level, max_players, price_per_player, status, description) VALUES
('mt000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000003', 'ct000001-0000-0000-0000-000000000001', 'v1000001-0000-0000-0000-000000000001',
 'Sân Bóng Đại Nam', 'soccer', 'Thạch Thất, HN', CURRENT_DATE, '19:00', 'Intermediate', 10, 50000, 'open',
 'Kèo giao hữu phủi 5v5 chia nước sân vui vẻ, cần thêm anh em chạy cánh nhiệt tình!'),

('mt000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000004', 'ct000001-0000-0000-0000-000000000003', 'v1000001-0000-0000-0000-000000000002',
 'CLB Cầu Lông Kỳ Hòa', 'badminton', 'Thạch Thất, HN', CURRENT_DATE + 1, '08:00', 'Pro', 3, 35000, 'open',
 'Tuyển thêm một tay vợt cứng đánh đôi giao lưu nâng cao trình độ.'),

('mt000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000005', NULL, NULL,
 'Sân Pickleball Thủ Thiêm', 'pickleball', 'Thạch Thất, HN', CURRENT_DATE + 3, '17:30', 'Beginner', 4, 60000, 'open',
 'Sân chơi giao hữu vui vẻ cho các bạn mới làm quen với Pickleball.');

-- Match participants
INSERT INTO match_participants (match_id, user_id) VALUES
('mt000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000003'),
('mt000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000001'),
('mt000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000002'),
('mt000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000004'),
('mt000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000005');


-- ============================================================
-- SAMPLE TOURNAMENTS
-- ============================================================

INSERT INTO tournaments (id, organizer_id, title, sport, status, start_date, end_date, venue_name, participants_limit, registered_count, prize_pool, image_url, bracket_data) VALUES
('tn000001-0000-0000-0000-000000000001', 'd4000001-0000-0000-0000-000000000001',
 'SportRes Copa Saigon 2026', 'soccer', 'ongoing',
 '2026-05-15', '2026-06-15',
 'Sân bóng Sư Vạn Hạnh', 8, 8, '15.000.000 VND',
 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=800',
 '{"quarterFinals": [{"team1": "FC Kỳ Hòa", "team2": "Saigon Warriors", "score1": 3, "score2": 1, "winner": "FC Kỳ Hòa"}, {"team1": "Cướp Biển FC", "team2": "Quận 10 United", "score1": 2, "score2": 4, "winner": "Quận 10 United"}, {"team1": "BadBoys FC", "team2": "Lão Tướng FC", "score1": 0, "score2": 2, "winner": "Lão Tướng FC"}, {"team1": "Golden Stars", "team2": "Trẻ Đa Kao", "score1": 1, "score2": 1, "winner": "Golden Stars"}], "semiFinals": [{"team1": "FC Kỳ Hòa", "team2": "Quận 10 United", "score1": 2, "score2": 2, "winner": "FC Kỳ Hòa"}, {"team1": "Lão Tướng FC", "team2": "Golden Stars", "score1": 1, "score2": 3, "winner": "Golden Stars"}], "finals": [{"team1": "FC Kỳ Hòa", "team2": "Golden Stars"}]}'::jsonb),

('tn000001-0000-0000-0000-000000000002', 'd4000001-0000-0000-0000-000000000001',
 'Vô địch cầu lông nghiệp dư Cúp SportRes', 'badminton', 'upcoming',
 '2026-06-10', '2026-06-12',
 'CLB Cầu lông Hùng Vương Plaza', 16, 11, '8.000.000 VND',
 'https://images.pexels.com/photos/8007171/pexels-photo-8007171.jpeg?auto=compress&cs=tinysrgb&w=800',
 NULL);


-- Additional venue owners for Hòa Lạc sample data
INSERT INTO users (id, username, email, phone, password_hash, role, status) VALUES
('b2000001-0000-0000-0000-000000000003', 'owner3', 'hoalac1@sportres.vn', '0987654003', '$2b$10$DEMO_HASH_owner3_Owner123', 'venue_owner', 'active'),
('b2000001-0000-0000-0000-000000000004', 'owner4', 'fptarena@sportres.vn', '0987654004', '$2b$10$DEMO_HASH_owner4_Owner123', 'venue_owner', 'active'),
('b2000001-0000-0000-0000-000000000005', 'owner5', 'quocgiahoalac@sportres.vn', '0987654005', '$2b$10$DEMO_HASH_owner5_Owner123', 'venue_owner', 'active'),
('b2000001-0000-0000-0000-000000000006', 'owner6', 'pickleballhl@sportres.vn', '0987654006', '$2b$10$DEMO_HASH_owner6_Owner123', 'venue_owner', 'active');

INSERT INTO user_profiles (user_id, display_name, avatar_url, gender, active_area, wallet_balance, points, tier) VALUES
('b2000001-0000-0000-0000-000000000003', 'Trần Văn Hòa', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200', 'Nam', 'Khu Công Nghệ Cao Hòa Lạc', 1500000, 0, 'Đồng'),
('b2000001-0000-0000-0000-000000000004', 'Nguyễn Thị Lan', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200', 'Nữ', 'Đại học FPT Hà Nội', 2100000, 0, 'Đồng'),
('b2000001-0000-0000-0000-000000000005', 'Lê Minh Hòa', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'Nam', 'Đại học Quốc gia Hà Nội Hòa Lạc', 1300000, 0, 'Đồng'),
('b2000001-0000-0000-0000-000000000006', 'Phạm Thu Hà', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'Nữ', 'Hòa Lạc, Hà Nội', 980000, 0, 'Đồng');

-- Hòa Lạc venue collection
INSERT INTO venues (id, owner_id, name, address, district, city, description, image_url, rating, reviews_count, status, amenities) VALUES
('v2000001-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000003',
 'Hòa Lạc Sports Complex',
 'Khu Công Nghệ Cao Hòa Lạc, Thạch Thất, Hà Nội',
 'Thạch Thất', 'Hà Nội',
 'Khu thể thao đa năng Hòa Lạc với sân bóng đá, tennis, pickleball và bóng rổ phục vụ luyện tập đội nhóm.',
 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800',
 4.7, 138, 'active', ARRAY['Bãi xe rộng', 'Đèn chiếu sáng', 'Phòng thay đồ', 'Cửa hàng nước uống']),
('v2000001-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000004',
 'FPT University Sports Arena',
 'Đại học FPT Hà Nội, Khu Công Nghệ Cao Hòa Lạc, Hà Nội',
 'Thạch Thất', 'Hà Nội',
 'Sân thể thao sinh viên đa chức năng, phục vụ cầu lông, tennis, bóng chuyền và bóng rổ.',
 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&q=80&w=800',
 4.6, 96, 'active', ARRAY['Khu cafe', 'Wifi miễn phí', 'Phòng họp đội', 'Trọng tài chuyên nghiệp']),
('v2000001-0000-0000-0000-000000000003', 'b2000001-0000-0000-0000-000000000005',
 'Đại học Quốc gia Hà Nội Hòa Lạc Sports Center',
 'Đại học Quốc gia Hà Nội Hòa Lạc, Hòa Lạc, Hà Nội',
 'Hòa Lạc', 'Hà Nội',
 'Trung tâm thể thao trường đại học với sân soccer mini, tennis và khu tập gym hiện đại.',
 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800',
 4.8, 120, 'active', ARRAY['Sân bóng cỏ', 'Tư vấn VĐV', 'Cho thuê dụng cụ', 'Khu nghỉ ngơi']),
('v2000001-0000-0000-0000-000000000004', 'b2000001-0000-0000-0000-000000000003',
 'Sân Bóng Đá Xuân Mai',
 'Khu Đô Thị Mới Xuân Mai, Xuân Mai, Hà Nội',
 'Xuân Mai', 'Hà Nội',
 'Sân bóng đá mini 5 người và 7 người nằm ở khu vực đông dân cư, dễ truy cập từ đường quốc lộ.',
 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800',
 4.5, 58, 'active', ARRAY['Đèn sân ban đêm', 'Bảo vệ 24/7', 'Phòng thay đồ', 'Vòi nước lạnh']),
('v2000001-0000-0000-0000-000000000005', 'b2000001-0000-0000-0000-000000000004',
 'Khu Thể Thao Quốc Oai',
 'Quốc Oai, Hà Nội',
 'Quốc Oai', 'Hà Nội',
 'Khu thể thao công cộng phục vụ cầu lông, pickleball, tennis và bóng chuyền cho các đội địa phương.',
 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800',
 4.4, 72, 'active', ARRAY['Sân mái che', 'Bãi xe miễn phí', 'Nhà vệ sinh sạch', 'Thuê dụng cụ']),
('v2000001-0000-0000-0000-000000000006', 'b2000001-0000-0000-0000-000000000005',
 'Sân Cầu Lông Thạch Thất',
 'Thạch Thất, Hà Nội',
 'Thạch Thất', 'Hà Nội',
 'Sân cầu lông trong nhà chuyên phục vụ đánh đôi, giải giao hữu và huấn luyện năng khiếu.',
 'https://images.pexels.com/photos/8007171/pexels-photo-8007171.jpeg?auto=compress&cs=tinysrgb&w=800',
 4.6, 84, 'active', ARRAY['Chiếu sáng LED', 'Adidas shuttlecock', 'Huấn luyện viên', 'Phòng thay đồ']),
('v2000001-0000-0000-0000-000000000007', 'b2000001-0000-0000-0000-000000000006',
 'Pickleball Hòa Lạc Club',
 'Khu Công Nghệ Cao Hòa Lạc, Hòa Lạc, Hà Nội',
 'Hòa Lạc', 'Hà Nội',
 'Câu lạc bộ pickleball chuyên nghiệp đầu tiên ở Hòa Lạc với nhiều sân đá đối kháng.',
 'https://images.pexels.com/photos/15390858/pexels-photo-15390858.jpeg?auto=compress&cs=tinysrgb&w=800',
 4.7, 60, 'active', ARRAY['Sân nhựa chuyên dụng', 'Đèn chiếu sáng', 'Nước uống thể thao', 'Thuê vợt']),
('v2000001-0000-0000-0000-000000000008', 'b2000001-0000-0000-0000-000000000006',
 'Hòa Lạc Volleyball Hub',
 'Đại học Quốc gia Hà Nội Hòa Lạc, Hà Nội',
 'Hòa Lạc', 'Hà Nội',
 'Địa chỉ cho các đội bóng chuyền trong nhà và ngoài trời với trang thiết bị hiện đại.',
 'https://images.unsplash.com/photo-1509223197845-458d87318791?auto=format&fit=crop&q=80&w=800',
 4.6, 52, 'active', ARRAY['Sân ngoài trời', 'Lưới cao cấp', 'Ghế khán giả', 'Âm thanh sự kiện']),
('v2000001-0000-0000-0000-000000000009', 'b2000001-0000-0000-0000-000000000001',
 'Cơ sở TDTT Thạch Thất',
 '123 Đường Hùng Vương, Xã Bình Yên, Thạch Thất, Hà Nội',
 'Thạch Thất', 'Hà Nội',
 'Trung tâm thể thao đa chức năng phục vụ bóng đá, cầu lông, tennis, pickleball và bóng rổ cho cộng đồng địa phương.',
 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
4.7, 156, 'active', ARRAY['Sân bóng cỏ nhân tạo', 'Chiếu sáng LED đêm', 'Phòng thay đồ hiện đại', 'Bãi xe rộng', 'Khu ăn uống', 'Phòng y tế', 'Huấn luyện viên chuyên nghiệp', 'Cho thuê dụng cụ']);

UPDATE venues SET latitude = 21.0142, longitude = 105.5258 WHERE id = 'v2000001-0000-0000-0000-000000000001';
UPDATE venues SET latitude = 21.0138, longitude = 105.5250 WHERE id = 'v2000001-0000-0000-0000-000000000002';
UPDATE venues SET latitude = 21.0033, longitude = 105.5424 WHERE id = 'v2000001-0000-0000-0000-000000000003';
UPDATE venues SET latitude = 20.8992, longitude = 105.5811 WHERE id = 'v2000001-0000-0000-0000-000000000004';
UPDATE venues SET latitude = 20.9918, longitude = 105.6402 WHERE id = 'v2000001-0000-0000-0000-000000000005';
UPDATE venues SET latitude = 21.0115, longitude = 105.5260 WHERE id = 'v2000001-0000-0000-0000-000000000006';
UPDATE venues SET latitude = 21.0155, longitude = 105.5245 WHERE id = 'v2000001-0000-0000-0000-000000000007';
UPDATE venues SET latitude = 21.0041, longitude = 105.5418 WHERE id = 'v2000001-0000-0000-0000-000000000008';
UPDATE venues SET latitude = 21.0095, longitude = 105.5285 WHERE id = 'v2000001-0000-0000-0000-000000000009';

-- Courts for new Hòa Lạc venues and Thạch Thất TDTT
INSERT INTO courts (id, venue_id, name, sport, status, price_min, price_peak, capacity, description) VALUES
('ct200001-0000-0000-0000-000000000001', 'v2000001-0000-0000-0000-000000000001', 'Hòa Lạc 5 người', 'soccer', 'open', 220000, 380000, 10, 'Sân bóng mini 5 người mặt cỏ nhân tạo hiện đại.'),
('ct200002-0000-0000-0000-000000000002', 'v2000001-0000-0000-0000-000000000001', 'Hòa Lạc 7 người', 'soccer', 'open', 280000, 520000, 14, 'Sân 7 người có hệ thống chiếu sáng ban đêm.'),
('ct200003-0000-0000-0000-000000000003', 'v2000001-0000-0000-0000-000000000001', 'Sân bóng rổ indoor', 'basketball', 'open', 170000, 300000, 10, 'Sân bóng rổ trong nhà với sàn cao su tiêu chuẩn.'),
('ct200004-0000-0000-0000-000000000004', 'v2000001-0000-0000-0000-000000000001', 'Sân tennis trung tâm', 'tennis', 'open', 180000, 330000, 4, 'Sân tennis đất nện chuẩn thi đấu.'),
('ct200005-0000-0000-0000-000000000005', 'v2000001-0000-0000-0000-000000000001', 'Sân pickleball Hòa Lạc', 'pickleball', 'open', 120000, 180000, 4, 'Sân pickleball chuyên dụng với lưới chuẩn quốc tế.'),
('ct200006-0000-0000-0000-000000000006', 'v2000001-0000-0000-0000-000000000001', 'Sân bóng chuyền đa năng', 'volleyball', 'open', 140000, 220000, 10, 'Sân bóng chuyền trong nhà phù hợp đội 6 người.'),
('ct200007-0000-0000-0000-000000000007', 'v2000001-0000-0000-0000-000000000002', 'Cầu lông A', 'badminton', 'open', 80000, 140000, 2, 'Sân cầu lông phủi đôi chất lượng cao.'),
('ct200008-0000-0000-0000-000000000008', 'v2000001-0000-0000-0000-000000000002', 'Cầu lông B', 'badminton', 'open', 76000, 130000, 2, 'Sân cầu lông sáng sủa khu vực sinh viên.'),
('ct200009-0000-0000-0000-000000000009', 'v2000001-0000-0000-0000-000000000002', 'Sân tennis FPT', 'tennis', 'open', 160000, 290000, 4, 'Sân tennis ngoài trời dành cho học viên.'),
('ct200010-0000-0000-0000-000000000010', 'v2000001-0000-0000-0000-000000000002', 'Sân bóng chuyền FPT', 'volleyball', 'open', 130000, 210000, 10, 'Sân bóng chuyền trong nhà phục vụ đội sinh viên.'),
('ct200011-0000-0000-0000-000000000011', 'v2000001-0000-0000-0000-000000000002', 'Sân bóng rổ FPT', 'basketball', 'open', 155000, 270000, 10, 'Sân bóng rổ tiêu chuẩn dành cho tập luyện.'),
('ct200012-0000-0000-0000-000000000012', 'v2000001-0000-0000-0000-000000000003', 'Soccer ĐHQG 5 người', 'soccer', 'open', 210000, 360000, 10, 'Sân soccer mini dành cho sinh viên và đội tập.'),
('ct200013-0000-0000-0000-000000000013', 'v2000001-0000-0000-0000-000000000003', 'Sân tennis trường', 'tennis', 'open', 170000, 310000, 4, 'Sân tennis sân trường với mặt sân chịu lực tốt.'),
('ct200014-0000-0000-0000-000000000014', 'v2000001-0000-0000-0000-000000000003', 'Sân cầu lông ĐHQG', 'badminton', 'open', 78000, 135000, 2, 'Sân cầu lông hiện đại phục vụ đội tuyển trường.'),
('ct200015-0000-0000-0000-000000000015', 'v2000001-0000-0000-0000-000000000003', 'Sân bóng rổ ĐHQG', 'basketball', 'open', 165000, 290000, 10, 'Sân bóng rổ trong nhà với bảng rổ tiêu chuẩn.'),
('ct200016-0000-0000-0000-000000000016', 'v2000001-0000-0000-0000-000000000004', 'Sân Xuân Mai 5 người', 'soccer', 'open', 200000, 340000, 10, 'Sân bóng cỏ nhân tạo 5 người tại Xuân Mai.'),
('ct200017-0000-0000-0000-000000000017', 'v2000001-0000-0000-0000-000000000004', 'Sân Xuân Mai 7 người', 'soccer', 'open', 260000, 470000, 14, 'Sân 7 người có hệ thống chiếu sáng LED.'),
('ct200018-0000-0000-0000-000000000018', 'v2000001-0000-0000-0000-000000000004', 'Sân bóng chuyền Xuân Mai', 'volleyball', 'open', 135000, 205000, 10, 'Sân bóng chuyền ngoài trời có lưới cao cấp.'),
('ct200019-0000-0000-0000-000000000019', 'v2000001-0000-0000-0000-000000000004', 'Sân cầu lông Xuân Mai', 'badminton', 'open', 72000, 118000, 2, 'Sân cầu lông mái che cho đánh đôi.'),
('ct200020-0000-0000-0000-000000000020', 'v2000001-0000-0000-0000-000000000004', 'Sân pickleball Xuân Mai', 'pickleball', 'open', 115000, 170000, 4, 'Sân pickleball nhỏ gọn cho nhóm bạn.'),
('ct200021-0000-0000-0000-000000000021', 'v2000001-0000-0000-0000-000000000005', 'Cầu lông Quốc Oai 1', 'badminton', 'open', 74000, 125000, 2, 'Sân cầu lông Quốc Oai phù hợp đánh đôi.'),
('ct200022-0000-0000-0000-000000000022', 'v2000001-0000-0000-0000-000000000005', 'Pickleball Quốc Oai', 'pickleball', 'open', 118000, 178000, 4, 'Sân pickleball chuyên dụng cho giải nhỏ.'),
('ct200023-0000-0000-0000-000000000023', 'v2000001-0000-0000-0000-000000000005', 'Bóng chuyền Quốc Oai', 'volleyball', 'open', 132000, 210000, 10, 'Sân bóng chuyền trong nhà cho đội mạnh.'),
('ct200024-0000-0000-0000-000000000024', 'v2000001-0000-0000-0000-000000000005', 'Sân tennis Quốc Oai', 'tennis', 'open', 158000, 285000, 4, 'Sân tennis bạt chịu lực cho tập luyện.'),
('ct200025-0000-0000-0000-000000000025', 'v2000001-0000-0000-0000-000000000006', 'Cầu lông 1 Thạch Thất', 'badminton', 'open', 72000, 118000, 2, 'Sân cầu lông Thạch Thất chất lượng cao.'),
('ct200026-0000-0000-0000-000000000026', 'v2000001-0000-0000-0000-000000000006', 'Cầu lông 2 Thạch Thất', 'badminton', 'open', 72000, 118000, 2, 'Sân cầu lông cho đánh đôi giao lưu.'),
('ct200027-0000-0000-0000-000000000027', 'v2000001-0000-0000-0000-000000000006', 'Cầu lông 3 Thạch Thất', 'badminton', 'open', 76000, 124000, 2, 'Sân cầu lông trong nhà rộng rãi.'),
('ct200028-0000-0000-0000-000000000028', 'v2000001-0000-0000-0000-000000000006', 'Cầu lông 4 Thạch Thất', 'badminton', 'open', 76000, 124000, 2, 'Sân cầu lông có hệ thống thông gió tốt.'),
('ct200029-0000-0000-0000-000000000029', 'v2000001-0000-0000-0000-000000000006', 'Cầu lông 5 Thạch Thất', 'badminton', 'open', 78000, 130000, 2, 'Sân cầu lông chuẩn thi đấu nội bộ.'),
('ct200030-0000-0000-0000-000000000030', 'v2000001-0000-0000-0000-000000000006', 'Sân tennis Thạch Thất', 'tennis', 'open', 165000, 300000, 4, 'Sân tennis ngoài trời sử dụng lớp phủ chất lượng.'),
-- TDTT Thạch Thất Courts
('ct300001-0000-0000-0000-000000000001', 'v2000001-0000-0000-0000-000000000009', 'Sân bóng 5 người - TDTT Thạch Thất', 'soccer', 'open', 200000, 350000, 10, 'Sân bóng đá mini cỏ nhân tạo chất lượng cao tại TDTT.'),
('ct300002-0000-0000-0000-000000000002', 'v2000001-0000-0000-0000-000000000009', 'Sân bóng 7 người - TDTT Thạch Thất', 'soccer', 'open', 280000, 450000, 14, 'Sân bóng đá 7 người cỏ nhân tạo với đèn chiếu sáng ban đêm.'),
('ct300003-0000-0000-0000-000000000003', 'v2000001-0000-0000-0000-000000000009', 'Sân cầu lông 1 - TDTT Thạch Thất', 'badminton', 'open', 70000, 120000, 2, 'Sân cầu lông trong nhà với sàn gỗ chuyên dụng.'),
('ct300004-0000-0000-0000-000000000004', 'v2000001-0000-0000-0000-000000000009', 'Sân cầu lông 2 - TDTT Thạch Thất', 'badminton', 'open', 70000, 120000, 2, 'Sân cầu lông cao cấp tiêu chuẩn quốc tế.'),
('ct300005-0000-0000-0000-000000000005', 'v2000001-0000-0000-0000-000000000009', 'Sân tennis - TDTT Thạch Thất', 'tennis', 'open', 120000, 200000, 4, 'Sân tennis sáo cứng với đèn LED sáng rõ.'),
('ct300006-0000-0000-0000-000000000006', 'v2000001-0000-0000-0000-000000000009', 'Sân bóng rổ - TDTT Thạch Thất', 'basketball', 'open', 180000, 320000, 10, 'Sân bóng rổ trong nhà với sàn gỗ tiêu chuẩn.'),
('ct300007-0000-0000-0000-000000000007', 'v2000001-0000-0000-0000-000000000009', 'Sân pickleball - TDTT Thạch Thất', 'pickleball', 'open', 100000, 180000, 4, 'Sân pickleball ngoài trời mặt nhựa chuyên dụng.'),
('ct300008-0000-0000-0000-000000000008', 'v2000001-0000-0000-0000-000000000009', 'Sân bóng chuyền - TDTT Thạch Thất', 'volleyball', 'open', 150000, 260000, 12, 'Sân bóng chuyền ngoài trời với lưới cao cấp.');

-- Additional matchmaking records near Hòa Lạc
INSERT INTO matches (id, creator_id, court_id, venue_id, title, sport, address, match_date, match_time, skill_level, max_players, price_per_player, status, description) VALUES
('mt200001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000001', 'ct200001-0000-0000-0000-000000000001', 'v2000001-0000-0000-0000-000000000001', 'Giao hữu bóng đá Hòa Lạc 5v5', 'soccer', 'Khu Công Nghệ Cao Hòa Lạc, Thạch Thất, Hà Nội', '2026-06-05', '18:30', 'Intermediate', 10, 50000, 'open', 'Kèo giao hữu 5v5 chiều thứ Bảy, cần thêm 2 tiền đạo và 1 thủ môn.'),
('mt200002-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000002', 'ct200002-0000-0000-0000-000000000002', 'v2000001-0000-0000-0000-000000000001', 'Bóng đá 7 người Hòa Lạc', 'soccer', 'Khu Công Nghệ Cao Hòa Lạc, Thạch Thất, Hà Nội', '2026-06-06', '20:00', 'Advanced', 14, 45000, 'full', 'Đã đủ cầu thủ, mở cho người chơi dự bị theo dõi lịch thay người.'),
('mt200003-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000003', 'ct200003-0000-0000-0000-000000000003', 'v2000001-0000-0000-0000-000000000001', 'Rổ chiều tối Hòa Lạc', 'basketball', 'Khu Công Nghệ Cao Hòa Lạc, Thạch Thất, Hà Nội', '2026-06-07', '19:15', 'Beginner', 10, 30000, 'open', 'Mời anh em đánh bóng rổ nhẹ, ưu tiên người mới làm quen.'),
('mt200004-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000004', 'ct200004-0000-0000-0000-000000000004', 'v2000001-0000-0000-0000-000000000001', 'Tennis đôi Hòa Lạc', 'tennis', 'Khu Công Nghệ Cao Hòa Lạc, Thạch Thất, Hà Nội', '2026-06-08', '16:00', 'Intermediate', 4, 60000, 'open', 'Cần 1 đôi điền kinh đánh đôi giao lưu sân đất nện.'),
('mt200005-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000005', 'ct200005-0000-0000-0000-000000000005', 'v2000001-0000-0000-0000-000000000001', 'Pickleball Hòa Lạc mở cửa', 'pickleball', 'Khu Công Nghệ Cao Hòa Lạc, Thạch Thất, Hà Nội', '2026-06-09', '17:00', 'Beginner', 4, 65000, 'open', 'Kèo pickleball cho nhóm mới tập, không cần kinh nghiệm.'),
('mt200006-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000001', 'ct200006-0000-0000-0000-000000000006', 'v2000001-0000-0000-0000-000000000001', 'Bóng chuyền Thứ Bảy', 'volleyball', 'Khu Công Nghệ Cao Hòa Lạc, Thạch Thất, Hà Nội', '2026-06-10', '15:30', 'Open', 10, 30000, 'open', 'Hoạt động bóng chuyền cuối tuần, cần thêm 4 người.'),
('mt200007-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000002', 'ct200007-0000-0000-0000-000000000007', 'v2000001-0000-0000-0000-000000000002', 'Cầu lông FPT sáng sớm', 'badminton', 'Đại học FPT Hà Nội, Thạch Thất, Hà Nội', '2026-06-06', '07:30', 'Beginner', 2, 25000, 'open', 'Match cầu lông đơn dành cho thành viên mới, vui vẻ.'),
('mt200008-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000003', 'ct200008-0000-0000-0000-000000000008', 'v2000001-0000-0000-0000-000000000002', 'Cầu lông đôi FPT', 'badminton', 'Đại học FPT Hà Nội, Thạch Thất, Hà Nội', '2026-06-10', '18:00', 'Intermediate', 4, 32000, 'full', 'Đã đủ người cho kèo đôi, mở chờ người dự bị.'),
('mt200009-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000001', 'ct200009-0000-0000-0000-000000000009', 'v2000001-0000-0000-0000-000000000002', 'Tennis FPT buổi chiều', 'tennis', 'Đại học FPT Hà Nội, Thạch Thất, Hà Nội', '2026-06-11', '14:00', 'Advanced', 4, 70000, 'open', 'Cần 1 đối tác chơi đánh đôi theo phong cách trao đổi bóng nhanh.'),
('mt200010-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000005', 'ct200010-0000-0000-0000-000000000010', 'v2000001-0000-0000-0000-000000000002', 'Bóng chuyền FPT', 'volleyball', 'Đại học FPT Hà Nội, Thạch Thất, Hà Nội', '2026-06-11', '19:00', 'Intermediate', 10, 35000, 'open', 'Mời các đội FPT giao lưu bóng chuyền vào buổi tối.'),
('mt200011-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000001', 'ct200012-0000-0000-0000-000000000012', 'v2000001-0000-0000-0000-000000000003', 'Soccer ĐHQG 5v5', 'soccer', 'Đại học Quốc gia Hà Nội Hòa Lạc, Hòa Lạc, Hà Nội', '2026-06-12', '17:00', 'Intermediate', 10, 48000, 'open', 'Kèo 5 người dành cho bạn học sinh và cựu sinh viên.'),
('mt200012-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000004', 'ct200013-0000-0000-0000-000000000013', 'v2000001-0000-0000-0000-000000000003', 'Tennis ĐHQG chiều', 'tennis', 'Đại học Quốc gia Hà Nội Hòa Lạc, Hòa Lạc, Hà Nội', '2026-06-12', '16:30', 'Beginner', 4, 55000, 'open', 'Đôi tennis cho người mới thích chơi giải trí.'),
('mt200013-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000005', 'ct200014-0000-0000-0000-000000000014', 'v2000001-0000-0000-0000-000000000003', 'Cầu lông ĐHQG tối', 'badminton', 'Đại học Quốc gia Hà Nội Hòa Lạc, Hòa Lạc, Hà Nội', '2026-06-13', '19:00', 'Advanced', 4, 36000, 'in_progress', 'Đang diễn ra kèo cầu lông 2 vs 2 cho các tay vợt trung cấp.'),
('mt200014-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000001', 'ct200015-0000-0000-0000-000000000015', 'v2000001-0000-0000-0000-000000000003', 'Bóng rổ ĐHQG cuối tuần', 'basketball', 'Đại học Quốc gia Hà Nội Hòa Lạc, Hòa Lạc, Hà Nội', '2026-06-14', '18:30', 'Intermediate', 10, 33000, 'open', 'Mời đội bóng rổ sinh viên đánh giao lưu cuối tuần.'),
('mt200015-0000-0000-0000-000000000004', 'a1000001-0000-0000-0000-000000000002', 'ct200016-0000-0000-0000-000000000016', 'v2000001-0000-0000-0000-000000000004', 'Xuân Mai 5 người', 'soccer', 'Khu Đô Thị Mới Xuân Mai, Xuân Mai, Hà Nội', '2026-06-13', '18:00', 'Beginner', 10, 42000, 'open', 'Sân 5 người giao hữu dành cho người mới chơi.'),
('mt200016-0000-0000-0000-000000000004', 'a1000001-0000-0000-0000-000000000003', 'ct200017-0000-0000-0000-000000000017', 'v2000001-0000-0000-0000-000000000004', 'Xuân Mai 7 người', 'soccer', 'Khu Đô Thị Mới Xuân Mai, Xuân Mai, Hà Nội', '2026-06-14', '20:00', 'Advanced', 14, 47000, 'finished', 'Kèo 7 người đã kết thúc; chờ công bố kết quả cuối cùng.'),
('mt200017-0000-0000-0000-000000000005', 'a1000001-0000-0000-0000-000000000001', 'ct200018-0000-0000-0000-000000000018', 'v2000001-0000-0000-0000-000000000004', 'Bóng chuyền Xuân Mai', 'volleyball', 'Khu Đô Thị Mới Xuân Mai, Xuân Mai, Hà Nội', '2026-06-15', '17:00', 'Intermediate', 10, 31000, 'open', 'Mời đội bóng chuyền giao hữu 6 người.'),
('mt200018-0000-0000-0000-000000000005', 'a1000001-0000-0000-0000-000000000002', 'ct200019-0000-0000-0000-000000000019', 'v2000001-0000-0000-0000-000000000004', 'Cầu lông Xuân Mai', 'badminton', 'Khu Đô Thị Mới Xuân Mai, Xuân Mai, Hà Nội', '2026-06-16', '15:30', 'Intermediate', 4, 30000, 'full', 'Đã đủ người cho kèo đôi, mở chờ người dự bị.'),
('mt200019-0000-0000-0000-000000000006', 'a1000001-0000-0000-0000-000000000003', 'ct200020-0000-0000-0000-000000000020', 'v2000001-0000-0000-0000-000000000004', 'Pickleball Xuân Mai', 'pickleball', 'Khu Đô Thị Mới Xuân Mai, Xuân Mai, Hà Nội', '2026-06-16', '18:00', 'Beginner', 4, 62000, 'open', 'Lịch pickleball dành cho người mới làm quen. Mang dép mềm.'),
('mt200020-0000-0000-0000-000000000005', 'a1000001-0000-0000-0000-000000000001', 'ct200021-0000-0000-0000-000000000021', 'v2000001-0000-0000-0000-000000000005', 'Cầu lông Quốc Oai sáng', 'badminton', 'Quốc Oai, Hà Nội', '2026-06-17', '08:00', 'Beginner', 2, 24000, 'open', 'Kèo đánh đơn buổi sáng cuối tuần cho người mới.'),
('mt200021-0000-0000-0000-000000000005', 'a1000001-0000-0000-0000-000000000002', 'ct200022-0000-0000-0000-000000000022', 'v2000001-0000-0000-0000-000000000005', 'Pickleball Quốc Oai', 'pickleball', 'Quốc Oai, Hà Nội', '2026-06-17', '16:30', 'Intermediate', 4, 65000, 'open', 'Bữa chiều pickleball giao lưu cho nhóm bạn.'),
('mt200022-0000-0000-0000-000000000005', 'a1000001-0000-0000-0000-000000000003', 'ct200023-0000-0000-0000-000000000023', 'v2000001-0000-0000-0000-000000000005', 'Bóng chuyền Quốc Oai', 'volleyball', 'Quốc Oai, Hà Nội', '2026-06-18', '19:00', 'Advanced', 10, 34000, 'in_progress', 'Đang diễn ra kèo bóng chuyền nội bộ Quốc Oai.'),
('mt200023-0000-0000-0000-000000000006', 'a1000001-0000-0000-0000-000000000003', 'ct200024-0000-0000-0000-000000000024', 'v2000001-0000-0000-0000-000000000005', 'Tennis Quốc Oai dạ quang', 'tennis', 'Quốc Oai, Hà Nội', '2026-06-19', '20:00', 'Advanced', 4, 69000, 'open', 'Đôi tennis trước giờ thi đấu, đánh với đèn đêm.'),
('mt200024-0000-0000-0000-000000000006', 'a1000001-0000-0000-0000-000000000001', 'ct200025-0000-0000-0000-000000000025', 'v2000001-0000-0000-0000-000000000006', 'Cầu lông Thạch Thất sáng', 'badminton', 'Thạch Thất, Hà Nội', '2026-06-20', '07:00', 'Beginner', 2, 26000, 'open', 'Kèo sáng sớm cho người mới tập đôi.'),
('mt200025-0000-0000-0000-000000000006', 'a1000001-0000-0000-0000-000000000002', 'ct200026-0000-0000-0000-000000000026', 'v2000001-0000-0000-0000-000000000006', 'Cầu lông Thạch Thất trưa', 'badminton', 'Thạch Thất, Hà Nội', '2026-06-20', '12:00', 'Intermediate', 2, 28000, 'finished', 'Kèo cầu lông đã kết thúc, chờ review.'),
('mt200026-0000-0000-0000-000000000006', 'a1000001-0000-0000-0000-000000000001', 'ct200027-0000-0000-0000-000000000027', 'v2000001-0000-0000-0000-000000000006', 'Cầu lông Thạch Thất chiều', 'badminton', 'Thạch Thất, Hà Nội', '2026-06-21', '17:00', 'Advanced', 4, 33000, 'open', 'Kèo đôi hay dành cho các tay vợt trung cấp.'),
('mt200027-0000-0000-0000-000000000006', 'a1000001-0000-0000-0000-000000000003', 'ct200028-0000-0000-0000-000000000028', 'v2000001-0000-0000-0000-000000000006', 'Cầu lông Thạch Thất tối', 'badminton', 'Thạch Thất, Hà Nội', '2026-06-21', '19:30', 'Intermediate', 4, 32000, 'open', 'Kèo cuối ngày cho nhóm cầu lông thành thạo.'),
('mt200028-0000-0000-0000-000000000006', 'a1000001-0000-0000-0000-000000000001', 'ct200029-0000-0000-0000-000000000029', 'v2000001-0000-0000-0000-000000000006', 'Cầu lông Thạch Thất tối 2', 'badminton', 'Thạch Thất, Hà Nội', '2026-06-22', '20:00', 'Advanced', 4, 33000, 'open', 'Kèo đánh đôi muộn cho nhóm cầu lông kinh nghiệm.'),
('mt200029-0000-0000-0000-000000000006', 'a1000001-0000-0000-0000-000000000002', 'ct200030-0000-0000-0000-000000000030', 'v2000001-0000-0000-0000-000000000006', 'Tennis Thạch Thất đêm', 'tennis', 'Thạch Thất, Hà Nội', '2026-06-22', '20:30', 'Intermediate', 4, 71000, 'open', 'Sân tennis đêm với đèn LED, phù hợp đôi tập luyện.'),
-- TDTT Thạch Thất Matches
('mt300001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000001', 'ct300001-0000-0000-0000-000000000001', 'v2000001-0000-0000-0000-000000000009', 'Bóng đá TDTT Thạch Thất 5v5', 'soccer', 'Thạch Thất, Hà Nội', '2026-06-22', '19:00', 'Intermediate', 10, 50000, 'open', 'Kèo giao hữu 5v5 tại TDTT Thạch Thất, đèn chiếu sáng đêm, cần thêm 2 tiền đạo.'),
('mt300002-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000002', 'ct300002-0000-0000-0000-000000000002', 'v2000001-0000-0000-0000-000000000009', 'Bóng đá TDTT Thạch Thất 7v7', 'soccer', 'Thạch Thất, Hà Nội', '2026-06-23', '20:00', 'Advanced', 14, 55000, 'open', 'Kèo bóng đá 7v7 cạnh tranh tại TDTT, cho các tuyển thủ mạnh.'),
('mt300003-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000003', 'ct300003-0000-0000-0000-000000000003', 'v2000001-0000-0000-0000-000000000009', 'Cầu lông TDTT Thạch Thất sáng', 'badminton', 'Thạch Thất, Hà Nội', '2026-06-21', '07:30', 'Beginner', 2, 28000, 'open', 'Kèo cầu lông sáng sớm tại TDTT cho người mới tập đôi.'),
('mt300004-0000-0000-0000-000000000004', 'a1000001-0000-0000-0000-000000000004', 'ct300005-0000-0000-0000-000000000005', 'v2000001-0000-0000-0000-000000000009', 'Tennis TDTT Thạch Thất chiều', 'tennis', 'Thạch Thất, Hà Nội', '2026-06-21', '16:00', 'Intermediate', 4, 65000, 'open', 'Đôi tennis luyện tập tại sân tennis TDTT, phù hợp trung cấp.'),
('mt300005-0000-0000-0000-000000000005', 'a1000001-0000-0000-0000-000000000005', 'ct300006-0000-0000-0000-000000000006', 'v2000001-0000-0000-0000-000000000009', 'Bóng rổ TDTT Thạch Thất giao hữu', 'basketball', 'Thạch Thất, Hà Nội', '2026-06-24', '18:30', 'Intermediate', 10, 50000, 'open', 'Bóng rổ giao hữu vui vẻ tại sân trong nhà TDTT.'),
('mt300006-0000-0000-0000-000000000006', 'a1000001-0000-0000-0000-000000000001', 'ct300004-0000-0000-0000-000000000004', 'v2000001-0000-0000-0000-000000000009', 'Cầu lông TDTT Thạch Thất tối', 'badminton', 'Thạch Thất, Hà Nội', '2026-06-25', '19:30', 'Intermediate', 4, 32000, 'open', 'Kèo cầu lông chiều tối tại TDTT cho nhóm cầu lông thành thạo.'),
('mt300007-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000002', 'ct300007-0000-0000-0000-000000000007', 'v2000001-0000-0000-0000-000000000009', 'Pickleball TDTT Thạch Thất', 'pickleball', 'Thạch Thất, Hà Nội', '2026-06-25', '17:00', 'Beginner', 4, 62000, 'open', 'Pickleball giải trí cho nhóm mới bắt đầu tại sân TDTT.'),
('mt300008-0000-0000-0000-000000000008', 'a1000001-0000-0000-0000-000000000003', 'ct300008-0000-0000-0000-000000000008', 'v2000001-0000-0000-0000-000000000009', 'Bóng chuyền TDTT Thạch Thất', 'volleyball', 'Thạch Thất, Hà Nội', '2026-06-26', '19:00', 'Intermediate', 12, 35000, 'open', 'Bóng chuyền ngoài trời tại TDTT, cần thêm 4 cầu thủ.');

-- Additional tournaments in Hòa Lạc
INSERT INTO tournaments (id, organizer_id, title, sport, status, start_date, end_date, venue_name, venue_address, participants_limit, registered_count, prize_pool, entry_fee, image_url, description, rules) VALUES
('tn200001-0000-0000-0000-000000000001', 'd4000001-0000-0000-0000-000000000001', 'FPT University Football Cup 2026', 'soccer', 'upcoming', '2026-06-25', '2026-06-27', 'FPT University Sports Arena', 'Đại học FPT Hà Nội, Khu CNC Hòa Lạc, Hà Nội', 12, 10, '25.000.000 VND', 60000, 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800', 'Giải đấu bóng đá mini 5 người dành cho sinh viên và nhân viên FPT.', 'Đội 5+1, luật FIFA mini, thay người tối đa 5 lần.'),
('tn200002-0000-0000-0000-000000000002', 'd4000001-0000-0000-0000-000000000001', 'Hòa Lạc Badminton Open', 'badminton', 'upcoming', '2026-07-02', '2026-07-04', 'Hòa Lạc Sports Complex', 'Khu CNC Hòa Lạc, Thạch Thất, Hà Nội', 24, 18, '12.000.000 VND', 40000, 'https://images.unsplash.com/photo-1597466765990-64ad1c35dafc?auto=format&fit=crop&q=80&w=800', 'Giải đấu cầu lông đôi và đơn dành cho người chơi từ Beginner đến Advanced.', 'Đánh đôi và đánh đơn theo quy định quốc tế.'),
('tn200003-0000-0000-0000-000000000003', 'd4000001-0000-0000-0000-000000000001', 'ĐHQG Hà Nội Tennis Classic', 'tennis', 'upcoming', '2026-07-08', '2026-07-09', 'Đại học Quốc gia Hà Nội Hòa Lạc Sports Center', 'ĐHQG Hà Nội Hòa Lạc, Hà Nội', 16, 12, '18.000.000 VND', 50000, 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800', 'Giải tennis đôi và đơn phong trào dành cho sinh viên và tuyển thủ địa phương.', 'Luật ITF, tự chuẩn bị vợt và bóng.'),
('tn200004-0000-0000-0000-000000000004', 'd4000001-0000-0000-0000-000000000001', 'Hòa Lạc Pickleball Championship', 'pickleball', 'upcoming', '2026-07-15', '2026-07-16', 'Pickleball Hòa Lạc Club', 'Khu CNC Hòa Lạc, Hà Nội', 16, 13, '10.000.000 VND', 45000, 'https://images.pexels.com/photos/15390858/pexels-photo-15390858.jpeg?auto=compress&cs=tinysrgb&w=800', 'Giải pickleball mở cho các đội đôi nam, nữ và hỗn hợp.', 'Luật USAPA, bóng và vợt chuẩn thi đấu.'),
('tn200005-0000-0000-0000-000000000005', 'd4000001-0000-0000-0000-000000000001', 'Quốc Oai Volleyball Festival', 'volleyball', 'upcoming', '2026-07-18', '2026-07-19', 'Khu Thể Thao Quốc Oai', 'Quốc Oai, Hà Nội', 12, 8, '9.000.000 VND', 30000, 'https://images.unsplash.com/photo-1509223197845-458d87318791?auto=format&fit=crop&q=80&w=800', 'Giải giao hữu bóng chuyền 6 người giữa các câu lạc bộ địa phương.', 'Luật 6 vs 6 theo chuẩn VBF.'),
('tn200006-0000-0000-0000-000000000006', 'd4000001-0000-0000-0000-000000000001', 'Xuân Mai Mini Football Tournament', 'soccer', 'ongoing', '2026-06-20', '2026-06-22', 'Sân Bóng Đá Xuân Mai', 'Khu Đô Thị Mới Xuân Mai, Hà Nội', 10, 10, '8.000.000 VND', 50000, 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800', 'Giải bóng đá mini 5 người đã vào vòng bảng.', 'Luật mini 5 người, thay người không giới hạn.'),
('tn200007-0000-0000-0000-000000000007', 'd4000001-0000-0000-0000-000000000001', 'Thạch Thất Badminton Doubles Cup', 'badminton', 'in_progress', '2026-06-12', '2026-06-13', 'Sân Cầu Lông Thạch Thất', 'Thạch Thất, Hà Nội', 20, 18, '7.500.000 VND', 35000, 'https://images.pexels.com/photos/8007171/pexels-photo-8007171.jpeg?auto=compress&cs=tinysrgb&w=800', 'Giải cầu lông đôi mở rộng cho các CLB và đội học sinh.', 'Đánh đôi theo quy định VBF.'),
('tn200008-0000-0000-0000-000000000008', 'd4000001-0000-0000-0000-000000000001', 'Hòa Lạc Basketball League', 'basketball', 'upcoming', '2026-07-23', '2026-07-25', 'Hòa Lạc Sports Complex', 'Khu CNC Hòa Lạc, Hà Nội', 10, 7, '11.000.000 VND', 60000, 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800', 'Giải bóng rổ 3x3 giao hữu giữa các đội trẻ và bán chuyên.', 'Luật 3x3 FIBA, hiệp 10 phút.');


-- ============================================================
-- SAMPLE WALLET TRANSACTIONS
-- ============================================================

INSERT INTO wallet_transactions (user_id, type, amount, balance_after, description) VALUES
('a1000001-0000-0000-0000-000000000001', 'deposit', 500000, 500000, 'Nạp tiền qua MoMo'),
('a1000001-0000-0000-0000-000000000001', 'booking_payment', -500000, 0, 'Thanh toán đặt sân Grasslands SVH - 17:00'),
('a1000001-0000-0000-0000-000000000001', 'deposit', 450000, 450000, 'Nạp tiền qua MoMo'),
('a1000001-0000-0000-0000-000000000002', 'deposit', 400000, 400000, 'Nạp tiền qua Vietcombank'),
('a1000001-0000-0000-0000-000000000002', 'booking_payment', -80000, 320000, 'Thanh toán CLB Hùng Vương - 08:00');


-- ============================================================
-- SAMPLE REVIEWS
-- ============================================================

INSERT INTO reviews (reviewer_id, venue_id, rating, comment) VALUES
('a1000001-0000-0000-0000-000000000001', 'v1000001-0000-0000-0000-000000000001', 5, 'Sân cỏ rất đẹp, đèn sáng, nhân viên nhiệt tình. Sẽ quay lại!'),
('a1000001-0000-0000-0000-000000000002', 'v1000001-0000-0000-0000-000000000001', 4, 'Sân tốt nhưng bãi xe hơi chật vào giờ cao điểm.'),
('a1000001-0000-0000-0000-000000000003', 'v1000001-0000-0000-0000-000000000002', 5, 'Thảm Yonex cực chất, không bị trơn. Giá hợp lý.'),
('a1000001-0000-0000-0000-000000000005', 'v1000001-0000-0000-0000-000000000002', 5, 'Sân rộng, thoáng, thuê vợt cũng xịn lắm!'),
('a1000001-0000-0000-0000-000000000001', 'v1000001-0000-0000-0000-000000000003', 5, 'Sân quần vợt đẳng cấp nhất mình từng chơi.');


-- ============================================================
-- SAMPLE NOTIFICATIONS
-- ============================================================

INSERT INTO notifications (user_id, type, title, body) VALUES
('a1000001-0000-0000-0000-000000000001', 'booking', 'Đặt sân thành công!', 'Bạn đã đặt Sân 1 tại Grasslands SVH lúc 17:00 hôm nay.'),
('a1000001-0000-0000-0000-000000000001', 'match', 'Ghép kèo mới!', 'Sân Bóng Đại Nam đang tuyển thêm 2 người cho kèo 5v5 tối nay.'),
('a1000001-0000-0000-0000-000000000001', 'promotion', '🎉 Ưu đãi cuối tuần', 'Giảm 25% giá sân cầu lông tại CLB Hùng Vương cho đơn từ thứ 6 đến CN.'),
('a1000001-0000-0000-0000-000000000002', 'booking', 'Đặt sân thành công!', 'Bạn đã đặt Sân Premium tại CLB Hùng Vương lúc 08:00 ngày mai.'),
('a1000001-0000-0000-0000-000000000005', 'match', 'Bạn đã tạo kèo đấu', 'Kèo Pickleball tại Thủ Thiêm đã được tạo. Đang chờ thêm 3 người nữa.');


-- ============================================================
-- SAMPLE FAVORITES
-- ============================================================

INSERT INTO favorites (user_id, venue_id) VALUES
('a1000001-0000-0000-0000-000000000001', 'v1000001-0000-0000-0000-000000000001'),
('a1000001-0000-0000-0000-000000000001', 'v1000001-0000-0000-0000-000000000002'),
('a1000001-0000-0000-0000-000000000003', 'v1000001-0000-0000-0000-000000000002'),
('a1000001-0000-0000-0000-000000000005', 'v1000001-0000-0000-0000-000000000002');


-- ============================================================
-- END OF SEED DATA
-- ============================================================
