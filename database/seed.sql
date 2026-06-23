SET client_encoding = 'UTF8';

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
INSERT INTO users (id, username, full_name, phone, password_hash, role, status) VALUES
('a1000001-0000-0000-0000-000000000001', 'player1', 'Nguyễn Minh Quân', '0901234001', '$2b$10$u5wLHvWDdgL/FCNRNTbTi.rhXLcUpc8PdcoBU7IFSiQrx/i1GnGmq', 'player', 'active');

-- player2 / Sport@123
INSERT INTO users (id, username, full_name, phone, password_hash, role, status) VALUES
('a1000001-0000-0000-0000-000000000002', 'player2', 'Nguyễn Văn Đạt', '0901234002', '$2b$10$u5wLHvWDdgL/FCNRNTbTi.rhXLcUpc8PdcoBU7IFSiQrx/i1GnGmq', 'player', 'active');

-- player3 / Sport@123
INSERT INTO users (id, username, full_name, phone, password_hash, role, status) VALUES
('a1000001-0000-0000-0000-000000000003', 'player3', 'Lê Duy Khánh', '0901234003', '$2b$10$u5wLHvWDdgL/FCNRNTbTi.rhXLcUpc8PdcoBU7IFSiQrx/i1GnGmq', 'player', 'active');

-- player4 / Sport@123
INSERT INTO users (id, username, full_name, phone, password_hash, role, status) VALUES
('a1000001-0000-0000-0000-000000000004', 'player4', 'Phạm Minh Đức', '0901234004', '$2b$10$u5wLHvWDdgL/FCNRNTbTi.rhXLcUpc8PdcoBU7IFSiQrx/i1GnGmq', 'player', 'active');

-- player5 / Sport@123
INSERT INTO users (id, username, full_name, phone, password_hash, role, status) VALUES
('a1000001-0000-0000-0000-000000000005', 'player5', 'Nguyễn Thị Hoa', '0901234005', '$2b$10$u5wLHvWDdgL/FCNRNTbTi.rhXLcUpc8PdcoBU7IFSiQrx/i1GnGmq', 'player', 'active');

-- Venue Owners
-- owner1 / Owner@123
INSERT INTO users (id, username, full_name, phone, password_hash, role, status) VALUES
('b2000001-0000-0000-0000-000000000001', 'owner1', 'Chủ sân Grasslands', '0987654001', '$2b$10$v.8lcyl1UMKqpYTpN7bLQ.SatbkvYvHYS8cI9WF6oW58BFf6big6e', 'venue_owner', 'active');

-- owner2 / Owner@123
INSERT INTO users (id, username, full_name, phone, password_hash, role, status) VALUES
('b2000001-0000-0000-0000-000000000002', 'owner2', 'Trần Thị Lan', '0987654002', '$2b$10$v.8lcyl1UMKqpYTpN7bLQ.SatbkvYvHYS8cI9WF6oW58BFf6big6e', 'venue_owner', 'active');

-- Staff
-- staff1 / Staff@123
INSERT INTO users (id, username, full_name, phone, password_hash, role, status) VALUES
('c3000001-0000-0000-0000-000000000001', 'staff1', 'Lê Văn Nhân Viên', '0976543001', '$2b$10$p/EhCHldCAEKOw0xGfHjL.SM4kjhMv9i95YqeVnc2d4t7W1uqX9gi', 'staff', 'active');

-- staff2 / Staff@123
INSERT INTO users (id, username, full_name, phone, password_hash, role, status) VALUES
('c3000001-0000-0000-0000-000000000002', 'staff2', 'Phạm Thị Tiếp Tân', '0976543002', '$2b$10$p/EhCHldCAEKOw0xGfHjL.SM4kjhMv9i95YqeVnc2d4t7W1uqX9gi', 'staff', 'active');

-- Admin
-- admin / Admin@123
INSERT INTO users (id, username, full_name, phone, password_hash, role, status) VALUES
('d4000001-0000-0000-0000-000000000001', 'admin', 'SportRes Admin', '0900000001', '$2b$10$P.Xtdq3bYv4fs36XXA0.BuZoERAeZtE4VA0gWeNDxAPecpsz2kBYy', 'admin', 'active');


-- ============================================================
-- USER PROFILES
-- ============================================================

INSERT INTO user_profiles (user_id, display_name, avatar_url, gender, active_area, wallet_balance, points, tier) VALUES
('a1000001-0000-0000-0000-000000000001', 'Nguyễn Minh Quân', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200', 'Nam', 'Thạch Thất, Hà Nội', 450000, 1540, 'Vàng'),
('a1000001-0000-0000-0000-000000000002', 'Nguyễn Văn Đạt', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', 'Nam', 'Cầu Giấy, Hà Nội', 320000, 2420, 'Vàng'),
('a1000001-0000-0000-0000-000000000003', 'Lê Duy Khánh', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', 'Nam', 'Thạch Thất, Hà Nội', 580000, 2980, 'Kim cương'),
('a1000001-0000-0000-0000-000000000004', 'Phạm Minh Đức', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', 'Nam', 'Hòa Lạc, Hà Nội', 750000, 2850, 'Kim cương'),
('a1000001-0000-0000-0000-000000000005', 'Nguyễn Thị Hoa', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', 'Nữ', 'Cầu Giấy, Hà Nội', 200000, 1980, 'Vàng'),
('b2000001-0000-0000-0000-000000000001', 'Chủ sân Grasslands', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150', 'Nam', 'Thạch Thất, Hà Nội', 12500000, 0, 'Đồng'),
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
('8e081570-85c6-c24a-82c1-e2e7603f393f', 'b2000001-0000-0000-0000-000000000001',
 'Sân bóng Grasslands Sư Vạn Hạnh',
 '824 Sư Vạn Hạnh, Phường 12, Quận 10, TP. Hồ Chí Minh',
 'Quận 10', 'TP. Hồ Chí Minh',
 'Sân cỏ nhân tạo chất lượng cao chuẩn FIFA, hệ thống chiếu sáng LED hiện đại xuyên đêm.',
 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800',
 4.8, 142, 'active',
 ARRAY['Trực tiếp bóng đá', 'Bãi xe ô tô', 'Căn tin nước', 'Tắm vòi sen', 'Băng vết thương miễn phí']),

('a60ddd35-562f-3ee8-100c-92c18abb8d2d', 'b2000001-0000-0000-0000-000000000002',
 'CLB Cầu lông Hùng Vương Plaza',
 '126 Hồng Bàng, Phường 12, Quận 5, TP. Hồ Chí Minh',
 'Quận 5', 'TP. Hồ Chí Minh',
 'Thảm cầu lông Yonex nhập khẩu cực êm chân, trần cao không bị chói đèn.',
 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800',
 4.6, 98, 'active',
 ARRAY['Thuê vợt Yonex', 'Phòng máy lạnh nghỉ ngơi', 'Wifi miễn phí', 'Tủ đồ an toàn', 'Cửa hàng dụng cụ']),

('e9ef097e-a81e-7b93-2404-b3c4f0a40611', 'b2000001-0000-0000-0000-000000000001',
 'Sân Tennis Lan Anh Club',
 '291 Cách Mạng Tháng 8, Phường 12, Quận 10, TP. Hồ Chí Minh',
 'Quận 10', 'TP. Hồ Chí Minh',
 'Cum sân quần vợt đẳng cấp chuyên nghiệp nhất thành phố.',
 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=800',
 4.9, 210, 'active',
 ARRAY['Huấn luyện viên', 'Nhà hàng ẩm thực', 'Hồ bơi thư giãn', 'Phòng tắm hơi', 'Cho thuê máy giao bóng']),

('34c7fc50-6ac7-b971-4f04-cfcb323dd5b3', 'b2000001-0000-0000-0000-000000000001',
 'Khu thể thao rổ Phú Thọ',
 '221 Lý Thường Kiệt, Phường 15, Quận 11, TP. Hồ Chí Minh',
 'Quận 11', 'TP. Hồ Chí Minh',
 'Sân bóng rổ trong nhà chất liệu sàn gỗ cao cấp chống trơn trượt.',
 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&q=80&w=800',
 4.5, 76, 'active',
ARRAY['Bóng Spalding chuẩn', 'Khu tắm rửa', 'Đồng hồ đếm giây điện tử', 'Xà đu thể lực']);

UPDATE venues SET latitude = 10.7699, longitude = 106.6672 WHERE id = '8e081570-85c6-c24a-82c1-e2e7603f393f';
UPDATE venues SET latitude = 10.7550, longitude = 106.6573 WHERE id = 'a60ddd35-562f-3ee8-100c-92c18abb8d2d';
UPDATE venues SET latitude = 10.7790, longitude = 106.6685 WHERE id = 'e9ef097e-a81e-7b93-2404-b3c4f0a40611';
UPDATE venues SET latitude = 10.7658, longitude = 106.6512 WHERE id = '34c7fc50-6ac7-b971-4f04-cfcb323dd5b3';


-- ============================================================
-- COURTS (Sub-courts for each venue)
-- ============================================================

INSERT INTO courts (id, venue_id, name, sport, status, price_min, price_peak) VALUES
('e3c64542-ad42-d125-1a3c-37c37d88cb69', '8e081570-85c6-c24a-82c1-e2e7603f393f', 'Sân 1 (Sân 5 người)', 'soccer', 'open', 250000, 500000),
('1d48c046-41e9-1c86-59db-137df6b1fcc4', '8e081570-85c6-c24a-82c1-e2e7603f393f', 'Sân 2 (Sân 7 người)', 'soccer', 'open', 280000, 500000),
('df247f0b-210a-8686-67f7-e1e58f0a8865', 'a60ddd35-562f-3ee8-100c-92c18abb8d2d', 'Sân số 1 (Premium)', 'badminton', 'open', 70000, 120000),
('2ef097c4-af35-b8c1-8e37-0782977d3568', 'a60ddd35-562f-3ee8-100c-92c18abb8d2d', 'Sân số 2', 'badminton', 'open', 70000, 120000),
('415c09e1-60ad-6c13-55eb-061464255439', 'a60ddd35-562f-3ee8-100c-92c18abb8d2d', 'Sân số 3', 'badminton', 'open', 70000, 110000),
('8b6408f4-4434-f50b-3521-014506433510', 'e9ef097e-a81e-7b93-2404-b3c4f0a40611', 'Sân Trung tâm (Khán đài)', 'tennis', 'open', 150000, 260000),
('dc9b4e89-3df5-d7d1-ae36-854326168ff4', 'e9ef097e-a81e-7b93-2404-b3c4f0a40611', 'Sân số 2 Bán nguyệt', 'tennis', 'open', 150000, 240000),
('3ec2ad96-e92c-ebc8-053a-4c22a2a898d8', '34c7fc50-6ac7-b971-4f04-cfcb323dd5b3', 'Sân Gỗ Trực Diện (Trong Nhà)', 'basketball', 'open', 180000, 320000),
('0290ad2b-0a40-f2cd-f387-50347f4c5c08', '34c7fc50-6ac7-b971-4f04-cfcb323dd5b3', 'Sân Nhựa Tổng Hợp (Ngoài Trời)', 'basketball', 'open', 150000, 280000);


-- ============================================================
-- SAMPLE BOOKINGS
-- ============================================================

INSERT INTO time_slots (id, court_id, date, start_time, end_time, price, is_peak, is_booked, booked_by) VALUES
('931bbafa-e143-1901-5ee9-6c701340755e', 'e3c64542-ad42-d125-1a3c-37c37d88cb69', CURRENT_DATE, '17:00', '18:00', 500000, TRUE, TRUE, 'a1000001-0000-0000-0000-000000000001'),
('d3805f06-dd9e-c9eb-2eff-d4a3b3874426', 'df247f0b-210a-8686-67f7-e1e58f0a8865', CURRENT_DATE + 1, '08:00', '09:00', 80000, FALSE, TRUE, 'a1000001-0000-0000-0000-000000000002'),
('842cb55b-f502-4ba5-10cc-ef5190bb61c2', '8b6408f4-4434-f50b-3521-014506433510', CURRENT_DATE - 2, '15:00', '16:00', 200000, FALSE, TRUE, 'a1000001-0000-0000-0000-000000000001');

INSERT INTO bookings (id, user_id, court_id, venue_id, time_slot_id, date, time_range, total_price, status, payment_status, booking_code, transfer_content, qr_code) VALUES
('691d63ed-be4c-846b-af8c-d7598bc50c03', 'a1000001-0000-0000-0000-000000000001', 'e3c64542-ad42-d125-1a3c-37c37d88cb69', '8e081570-85c6-c24a-82c1-e2e7603f393f', '931bbafa-e143-1901-5ee9-6c701340755e', CURRENT_DATE, '17:00 - 18:00', 500000, 'confirmed', 'paid', 'SPORTRES_691D63', 'SPORTRES_691D63', 'SPORTRES-BK-001'),
('9e48d0bd-72ad-9863-c7fc-75a21d2a38b8', 'a1000001-0000-0000-0000-000000000002', 'df247f0b-210a-8686-67f7-e1e58f0a8865', 'a60ddd35-562f-3ee8-100c-92c18abb8d2d', 'd3805f06-dd9e-c9eb-2eff-d4a3b3874426', CURRENT_DATE + 1, '08:00 - 09:00', 80000, 'confirmed', 'paid', 'SPORTRES_9E48D0', 'SPORTRES_9E48D0', 'SPORTRES-BK-002'),
('ac4525dd-005f-32cc-fa3b-75f41b539993', 'a1000001-0000-0000-0000-000000000001', '8b6408f4-4434-f50b-3521-014506433510', 'e9ef097e-a81e-7b93-2404-b3c4f0a40611', '842cb55b-f502-4ba5-10cc-ef5190bb61c2', CURRENT_DATE - 2, '15:00 - 16:00', 200000, 'completed', 'paid', 'SPORTRES_AC4525', 'SPORTRES_AC4525', 'SPORTRES-BK-003');


-- ============================================================
-- SAMPLE MATCHES
-- ============================================================

INSERT INTO matches (id, creator_id, court_id, venue_id, title, sport, address, match_date, match_time, skill_level, max_players, price_per_player, status, description) VALUES
('c84321d6-1a0c-6335-5fdb-ba599a68e18f', 'a1000001-0000-0000-0000-000000000003', 'e3c64542-ad42-d125-1a3c-37c37d88cb69', '8e081570-85c6-c24a-82c1-e2e7603f393f',
 'Sân Bóng Đại Nam', 'soccer', 'Thạch Thất, HN', CURRENT_DATE, '19:00', 'Intermediate', 10, 50000, 'open',
 'Kèo giao hữu phủi 5v5 chia nước sân vui vẻ, cần thêm anh em chạy cánh nhiệt tình!'),

('c88091eb-01fe-4490-f781-08d0b4d1639e', 'a1000001-0000-0000-0000-000000000004', 'df247f0b-210a-8686-67f7-e1e58f0a8865', 'a60ddd35-562f-3ee8-100c-92c18abb8d2d',
 'CLB Cầu Lông Kỳ Hòa', 'badminton', 'Thạch Thất, HN', CURRENT_DATE + 1, '08:00', 'Pro', 3, 35000, 'open',
 'Tuyển thêm một tay vợt cứng đánh đôi giao lưu nâng cao trình độ.'),

('d2485d4c-47d2-c9f9-066f-cd9257f83e2c', 'a1000001-0000-0000-0000-000000000005', NULL, NULL,
 'Sân Pickleball Thủ Thiêm', 'pickleball', 'Thạch Thất, HN', CURRENT_DATE + 3, '17:30', 'Beginner', 4, 60000, 'open',
 'Sân chơi giao hữu vui vẻ cho các bạn mới làm quen với Pickleball.');

-- Match participants
INSERT INTO match_participants (match_id, user_id) VALUES
('c84321d6-1a0c-6335-5fdb-ba599a68e18f', 'a1000001-0000-0000-0000-000000000003'),
('c84321d6-1a0c-6335-5fdb-ba599a68e18f', 'a1000001-0000-0000-0000-000000000001'),
('c84321d6-1a0c-6335-5fdb-ba599a68e18f', 'a1000001-0000-0000-0000-000000000002'),
('c88091eb-01fe-4490-f781-08d0b4d1639e', 'a1000001-0000-0000-0000-000000000004'),
('d2485d4c-47d2-c9f9-066f-cd9257f83e2c', 'a1000001-0000-0000-0000-000000000005');


-- ============================================================
-- SAMPLE TOURNAMENTS
-- ============================================================

INSERT INTO tournaments (id, organizer_id, title, sport, status, start_date, end_date, venue_name, participants_limit, registered_count, prize_pool, image_url, bracket_data) VALUES
('e7129695-4a07-7deb-f2a5-4bd62acd6c07', 'd4000001-0000-0000-0000-000000000001',
 'SportRes Copa Saigon 2026', 'soccer', 'ongoing',
 '2026-05-15', '2026-06-15',
 'Sân bóng Sư Vạn Hạnh', 8, 8, '15.000.000 VND',
 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=800',
 '{"quarterFinals": [{"team1": "FC Kỳ Hòa", "team2": "Saigon Warriors", "score1": 3, "score2": 1, "winner": "FC Kỳ Hòa"}, {"team1": "Cướp Biển FC", "team2": "Quận 10 United", "score1": 2, "score2": 4, "winner": "Quận 10 United"}, {"team1": "BadBoys FC", "team2": "Lão Tướng FC", "score1": 0, "score2": 2, "winner": "Lão Tướng FC"}, {"team1": "Golden Stars", "team2": "Trẻ Đa Kao", "score1": 1, "score2": 1, "winner": "Golden Stars"}], "semiFinals": [{"team1": "FC Kỳ Hòa", "team2": "Quận 10 United", "score1": 2, "score2": 2, "winner": "FC Kỳ Hòa"}, {"team1": "Lão Tướng FC", "team2": "Golden Stars", "score1": 1, "score2": 3, "winner": "Golden Stars"}], "finals": [{"team1": "FC Kỳ Hòa", "team2": "Golden Stars"}]}'::jsonb),

('88ab487a-8361-8d5e-a364-ceebbcc9e9ac', 'd4000001-0000-0000-0000-000000000001',
 'Vô địch cầu lông nghiệp dư Cúp SportRes', 'badminton', 'upcoming',
 '2026-06-10', '2026-06-12',
 'CLB Cầu lông Hùng Vương Plaza', 16, 11, '8.000.000 VND',
 'https://images.pexels.com/photos/8007171/pexels-photo-8007171.jpeg?auto=compress&cs=tinysrgb&w=800',
 NULL);


-- Additional venue owners for Hòa Lạc sample data
INSERT INTO users (id, username, full_name, phone, password_hash, role, status) VALUES
('b2000001-0000-0000-0000-000000000003', 'owner3', 'Trần Văn Hòa', '0987654003', '$2b$10$v.8lcyl1UMKqpYTpN7bLQ.SatbkvYvHYS8cI9WF6oW58BFf6big6e', 'venue_owner', 'active'),
('b2000001-0000-0000-0000-000000000004', 'owner4', 'Nguyễn Thị Lan', '0987654004', '$2b$10$v.8lcyl1UMKqpYTpN7bLQ.SatbkvYvHYS8cI9WF6oW58BFf6big6e', 'venue_owner', 'active'),
('b2000001-0000-0000-0000-000000000005', 'owner5', 'Lê Minh Hòa', '0987654005', '$2b$10$v.8lcyl1UMKqpYTpN7bLQ.SatbkvYvHYS8cI9WF6oW58BFf6big6e', 'venue_owner', 'active'),
('b2000001-0000-0000-0000-000000000006', 'owner6', 'Phạm Thu Hà', '0987654006', '$2b$10$v.8lcyl1UMKqpYTpN7bLQ.SatbkvYvHYS8cI9WF6oW58BFf6big6e', 'venue_owner', 'active');

INSERT INTO user_profiles (user_id, display_name, avatar_url, gender, active_area, wallet_balance, points, tier) VALUES
('b2000001-0000-0000-0000-000000000003', 'Trần Văn Hòa', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200', 'Nam', 'Khu Công Nghệ Cao Hòa Lạc', 1500000, 0, 'Đồng'),
('b2000001-0000-0000-0000-000000000004', 'Nguyễn Thị Lan', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200', 'Nữ', 'Đại học FPT Hà Nội', 2100000, 0, 'Đồng'),
('b2000001-0000-0000-0000-000000000005', 'Lê Minh Hòa', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'Nam', 'Đại học Quốc gia Hà Nội Hòa Lạc', 1300000, 0, 'Đồng'),
('b2000001-0000-0000-0000-000000000006', 'Phạm Thu Hà', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'Nữ', 'Hòa Lạc, Hà Nội', 980000, 0, 'Đồng');

-- Hòa Lạc venue collection
INSERT INTO venues (id, owner_id, name, address, district, city, description, image_url, rating, reviews_count, status, amenities) VALUES
('615c7e39-3450-7219-534c-595ee3f681fc', 'b2000001-0000-0000-0000-000000000003',
 'Hòa Lạc Sports Complex',
 'Khu Công Nghệ Cao Hòa Lạc, Thạch Thất, Hà Nội',
 'Thạch Thất', 'Hà Nội',
 'Khu thể thao đa năng Hòa Lạc với sân bóng đá, tennis, pickleball và bóng rổ phục vụ luyện tập đội nhóm.',
 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800',
 4.7, 138, 'active', ARRAY['Bãi xe rộng', 'Đèn chiếu sáng', 'Phòng thay đồ', 'Cửa hàng nước uống']),
('33c95650-6d00-a9a3-00ac-897c8ed63ae2', 'b2000001-0000-0000-0000-000000000004',
 'FPT University Sports Arena',
 'Đại học FPT Hà Nội, Khu Công Nghệ Cao Hòa Lạc, Hà Nội',
 'Thạch Thất', 'Hà Nội',
 'Sân thể thao sinh viên đa chức năng, phục vụ cầu lông, tennis, bóng chuyền và bóng rổ.',
 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&q=80&w=800',
 4.6, 96, 'active', ARRAY['Khu cafe', 'Wifi miễn phí', 'Phòng họp đội', 'Trọng tài chuyên nghiệp']),
('e6db5ce3-2dae-d7cb-cf54-e3c611c997b3', 'b2000001-0000-0000-0000-000000000005',
 'Đại học Quốc gia Hà Nội Hòa Lạc Sports Center',
 'Đại học Quốc gia Hà Nội Hòa Lạc, Hòa Lạc, Hà Nội',
 'Hòa Lạc', 'Hà Nội',
 'Trung tâm thể thao trường đại học với sân soccer mini, tennis và khu tập gym hiện đại.',
 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800',
 4.8, 120, 'active', ARRAY['Sân bóng cỏ', 'Tư vấn VĐV', 'Cho thuê dụng cụ', 'Khu nghỉ ngơi']),
('369d1219-c7be-a0da-44d2-a640aa2c72f0', 'b2000001-0000-0000-0000-000000000003',
 'Sân Bóng Đá Xuân Mai',
 'Khu Đô Thị Mới Xuân Mai, Xuân Mai, Hà Nội',
 'Xuân Mai', 'Hà Nội',
 'Sân bóng đá mini 5 người và 7 người nằm ở khu vực đông dân cư, dễ truy cập từ đường quốc lộ.',
 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800',
 4.5, 58, 'active', ARRAY['Đèn sân ban đêm', 'Bảo vệ 24/7', 'Phòng thay đồ', 'Vòi nước lạnh']),
('9e4140d0-a996-1757-0e4e-8deca91492f3', 'b2000001-0000-0000-0000-000000000004',
 'Khu Thể Thao Quốc Oai',
 'Quốc Oai, Hà Nội',
 'Quốc Oai', 'Hà Nội',
 'Khu thể thao công cộng phục vụ cầu lông, pickleball, tennis và bóng chuyền cho các đội địa phương.',
 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800',
 4.4, 72, 'active', ARRAY['Sân mái che', 'Bãi xe miễn phí', 'Nhà vệ sinh sạch', 'Thuê dụng cụ']),
('34bc8062-c7f6-fcc5-4df0-654d20182a0d', 'b2000001-0000-0000-0000-000000000005',
 'Sân Cầu Lông Thạch Thất',
 'Thạch Thất, Hà Nội',
 'Thạch Thất', 'Hà Nội',
 'Sân cầu lông trong nhà chuyên phục vụ đánh đôi, giải giao hữu và huấn luyện năng khiếu.',
 'https://images.pexels.com/photos/8007171/pexels-photo-8007171.jpeg?auto=compress&cs=tinysrgb&w=800',
 4.6, 84, 'active', ARRAY['Chiếu sáng LED', 'Adidas shuttlecock', 'Huấn luyện viên', 'Phòng thay đồ']),
('f12bc8e5-dc49-8254-c31f-a04e8f139e7c', 'b2000001-0000-0000-0000-000000000006',
 'Pickleball Hòa Lạc Club',
 'Khu Công Nghệ Cao Hòa Lạc, Hòa Lạc, Hà Nội',
 'Hòa Lạc', 'Hà Nội',
 'Câu lạc bộ pickleball chuyên nghiệp đầu tiên ở Hòa Lạc với nhiều sân đá đối kháng.',
 'https://images.pexels.com/photos/15390858/pexels-photo-15390858.jpeg?auto=compress&cs=tinysrgb&w=800',
 4.7, 60, 'active', ARRAY['Sân nhựa chuyên dụng', 'Đèn chiếu sáng', 'Nước uống thể thao', 'Thuê vợt']),
('9dc146b0-2807-d00e-3292-2b27e82ccf9a', 'b2000001-0000-0000-0000-000000000006',
 'Hòa Lạc Volleyball Hub',
 'Đại học Quốc gia Hà Nội Hòa Lạc, Hà Nội',
 'Hòa Lạc', 'Hà Nội',
 'Địa chỉ cho các đội bóng chuyền trong nhà và ngoài trời với trang thiết bị hiện đại.',
 'https://images.unsplash.com/photo-1509223197845-458d87318791?auto=format&fit=crop&q=80&w=800',
 4.6, 52, 'active', ARRAY['Sân ngoài trời', 'Lưới cao cấp', 'Ghế khán giả', 'Âm thanh sự kiện']),
('3cf4fa7b-ecd9-cf9b-4af6-3afd82e4b379', 'b2000001-0000-0000-0000-000000000001',
 'Cơ sở TDTT Thạch Thất',
 '123 Đường Hùng Vương, Xã Bình Yên, Thạch Thất, Hà Nội',
 'Thạch Thất', 'Hà Nội',
 'Trung tâm thể thao đa chức năng phục vụ bóng đá, cầu lông, tennis, pickleball và bóng rổ cho cộng đồng địa phương.',
 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
4.7, 156, 'active', ARRAY['Sân bóng cỏ nhân tạo', 'Chiếu sáng LED đêm', 'Phòng thay đồ hiện đại', 'Bãi xe rộng', 'Khu ăn uống', 'Phòng y tế', 'Huấn luyện viên chuyên nghiệp', 'Cho thuê dụng cụ']);

UPDATE venues SET latitude = 21.0142, longitude = 105.5258 WHERE id = '615c7e39-3450-7219-534c-595ee3f681fc';
UPDATE venues SET latitude = 21.0138, longitude = 105.5250 WHERE id = '33c95650-6d00-a9a3-00ac-897c8ed63ae2';
UPDATE venues SET latitude = 21.0033, longitude = 105.5424 WHERE id = 'e6db5ce3-2dae-d7cb-cf54-e3c611c997b3';
UPDATE venues SET latitude = 20.8992, longitude = 105.5811 WHERE id = '369d1219-c7be-a0da-44d2-a640aa2c72f0';
UPDATE venues SET latitude = 20.9918, longitude = 105.6402 WHERE id = '9e4140d0-a996-1757-0e4e-8deca91492f3';
UPDATE venues SET latitude = 21.0115, longitude = 105.5260 WHERE id = '34bc8062-c7f6-fcc5-4df0-654d20182a0d';
UPDATE venues SET latitude = 21.0155, longitude = 105.5245 WHERE id = 'f12bc8e5-dc49-8254-c31f-a04e8f139e7c';
UPDATE venues SET latitude = 21.0041, longitude = 105.5418 WHERE id = '9dc146b0-2807-d00e-3292-2b27e82ccf9a';
UPDATE venues SET latitude = 21.0095, longitude = 105.5285 WHERE id = '3cf4fa7b-ecd9-cf9b-4af6-3afd82e4b379';

-- Courts for new Hòa Lạc venues and Thạch Thất TDTT
INSERT INTO courts (id, venue_id, name, sport, status, price_min, price_peak, capacity, description) VALUES
('fd0e372c-410d-875a-e105-a8865f03b8d7', '615c7e39-3450-7219-534c-595ee3f681fc', 'Hòa Lạc 5 người', 'soccer', 'open', 220000, 380000, 10, 'Sân bóng mini 5 người mặt cỏ nhân tạo hiện đại.'),
('b9bb6c74-9261-573a-bb9e-f15c751ff0a4', '615c7e39-3450-7219-534c-595ee3f681fc', 'Hòa Lạc 7 người', 'soccer', 'open', 280000, 520000, 14, 'Sân 7 người có hệ thống chiếu sáng ban đêm.'),
('74e65d68-9866-5c45-8472-597e49a50d85', '615c7e39-3450-7219-534c-595ee3f681fc', 'Sân bóng rổ indoor', 'basketball', 'open', 170000, 300000, 10, 'Sân bóng rổ trong nhà với sàn cao su tiêu chuẩn.'),
('0c9f8eee-b220-2a19-221e-240c2d7b2479', '615c7e39-3450-7219-534c-595ee3f681fc', 'Sân tennis trung tâm', 'tennis', 'open', 180000, 330000, 4, 'Sân tennis đất nện chuẩn thi đấu.'),
('0374b760-7d29-65cb-7842-5adea6cbc886', '615c7e39-3450-7219-534c-595ee3f681fc', 'Sân pickleball Hòa Lạc', 'pickleball', 'open', 120000, 180000, 4, 'Sân pickleball chuyên dụng với lưới chuẩn quốc tế.'),
('6b833575-7467-1d30-e045-9aa9ce486614', '615c7e39-3450-7219-534c-595ee3f681fc', 'Sân bóng chuyền đa năng', 'volleyball', 'open', 140000, 220000, 10, 'Sân bóng chuyền trong nhà phù hợp đội 6 người.'),
('c25b1e1c-0efd-dde4-b2ca-6ffe4e793914', '33c95650-6d00-a9a3-00ac-897c8ed63ae2', 'Cầu lông A', 'badminton', 'open', 80000, 140000, 2, 'Sân cầu lông phủi đôi chất lượng cao.'),
('d3367d67-659a-e251-a84f-425dcce4fa93', '33c95650-6d00-a9a3-00ac-897c8ed63ae2', 'Cầu lông B', 'badminton', 'open', 76000, 130000, 2, 'Sân cầu lông sáng sủa khu vực sinh viên.'),
('2946018a-5c21-effa-ad2c-b95ccc239013', '33c95650-6d00-a9a3-00ac-897c8ed63ae2', 'Sân tennis FPT', 'tennis', 'open', 160000, 290000, 4, 'Sân tennis ngoài trời dành cho học viên.'),
('b4e907cb-1f6d-d4d3-0089-bcf238da7a39', '33c95650-6d00-a9a3-00ac-897c8ed63ae2', 'Sân bóng chuyền FPT', 'volleyball', 'open', 130000, 210000, 10, 'Sân bóng chuyền trong nhà phục vụ đội sinh viên.'),
('caef728d-85c4-b4d6-d829-15b03401ee15', '33c95650-6d00-a9a3-00ac-897c8ed63ae2', 'Sân bóng rổ FPT', 'basketball', 'open', 155000, 270000, 10, 'Sân bóng rổ tiêu chuẩn dành cho tập luyện.'),
('398bd6df-4cf3-ffd1-5e10-3f81deecc547', 'e6db5ce3-2dae-d7cb-cf54-e3c611c997b3', 'Soccer ĐHQG 5 người', 'soccer', 'open', 210000, 360000, 10, 'Sân soccer mini dành cho sinh viên và đội tập.'),
('f7839a19-64e0-6cf9-04d6-deed80b5ca7c', 'e6db5ce3-2dae-d7cb-cf54-e3c611c997b3', 'Sân tennis trường', 'tennis', 'open', 170000, 310000, 4, 'Sân tennis sân trường với mặt sân chịu lực tốt.'),
('5a173ac8-7e4a-caee-f3a3-59d4197a550a', 'e6db5ce3-2dae-d7cb-cf54-e3c611c997b3', 'Sân cầu lông ĐHQG', 'badminton', 'open', 78000, 135000, 2, 'Sân cầu lông hiện đại phục vụ đội tuyển trường.'),
('f553dd2c-3008-2335-2c68-ded007f2dce1', 'e6db5ce3-2dae-d7cb-cf54-e3c611c997b3', 'Sân bóng rổ ĐHQG', 'basketball', 'open', 165000, 290000, 10, 'Sân bóng rổ trong nhà với bảng rổ tiêu chuẩn.'),
('bf865e63-acd6-8c83-6d40-9b87671dbc50', '369d1219-c7be-a0da-44d2-a640aa2c72f0', 'Sân Xuân Mai 5 người', 'soccer', 'open', 200000, 340000, 10, 'Sân bóng cỏ nhân tạo 5 người tại Xuân Mai.'),
('d1ce4880-3895-cee2-31bd-c5a535d6b1fc', '369d1219-c7be-a0da-44d2-a640aa2c72f0', 'Sân Xuân Mai 7 người', 'soccer', 'open', 260000, 470000, 14, 'Sân 7 người có hệ thống chiếu sáng LED.'),
('f89a3d6a-4ade-3ba0-ce08-e98480319b52', '369d1219-c7be-a0da-44d2-a640aa2c72f0', 'Sân bóng chuyền Xuân Mai', 'volleyball', 'open', 135000, 205000, 10, 'Sân bóng chuyền ngoài trời có lưới cao cấp.'),
('156794ed-3a97-185b-4b04-8d01831e293b', '369d1219-c7be-a0da-44d2-a640aa2c72f0', 'Sân cầu lông Xuân Mai', 'badminton', 'open', 72000, 118000, 2, 'Sân cầu lông mái che cho đánh đôi.'),
('521a6329-ab13-abba-744b-fb2addc06c9e', '369d1219-c7be-a0da-44d2-a640aa2c72f0', 'Sân pickleball Xuân Mai', 'pickleball', 'open', 115000, 170000, 4, 'Sân pickleball nhỏ gọn cho nhóm bạn.'),
('ba51d47e-0c60-d373-c00e-0c983aafd6d4', '9e4140d0-a996-1757-0e4e-8deca91492f3', 'Cầu lông Quốc Oai 1', 'badminton', 'open', 74000, 125000, 2, 'Sân cầu lông Quốc Oai phù hợp đánh đôi.'),
('42414947-4ddd-21c3-2eb2-b9ee2d468dba', '9e4140d0-a996-1757-0e4e-8deca91492f3', 'Pickleball Quốc Oai', 'pickleball', 'open', 118000, 178000, 4, 'Sân pickleball chuyên dụng cho giải nhỏ.'),
('91e78b9a-d9c7-51fa-89bc-6b37dae05d27', '9e4140d0-a996-1757-0e4e-8deca91492f3', 'Bóng chuyền Quốc Oai', 'volleyball', 'open', 132000, 210000, 10, 'Sân bóng chuyền trong nhà cho đội mạnh.'),
('abfe6feb-8598-ec2f-e0da-011c2cb25c21', '9e4140d0-a996-1757-0e4e-8deca91492f3', 'Sân tennis Quốc Oai', 'tennis', 'open', 158000, 285000, 4, 'Sân tennis bạt chịu lực cho tập luyện.'),
('d468bc43-41ca-c9bc-cc7b-9bce25140b0f', '34bc8062-c7f6-fcc5-4df0-654d20182a0d', 'Cầu lông 1 Thạch Thất', 'badminton', 'open', 72000, 118000, 2, 'Sân cầu lông Thạch Thất chất lượng cao.'),
('a86c7622-b174-0ac1-6fe6-67aa7853c3a8', '34bc8062-c7f6-fcc5-4df0-654d20182a0d', 'Cầu lông 2 Thạch Thất', 'badminton', 'open', 72000, 118000, 2, 'Sân cầu lông cho đánh đôi giao lưu.'),
('b1bbe5ef-9be8-c178-8385-364252e45a68', '34bc8062-c7f6-fcc5-4df0-654d20182a0d', 'Cầu lông 3 Thạch Thất', 'badminton', 'open', 76000, 124000, 2, 'Sân cầu lông trong nhà rộng rãi.'),
('cf55796e-3587-69c7-d105-b3dd04ecdeb0', '34bc8062-c7f6-fcc5-4df0-654d20182a0d', 'Cầu lông 4 Thạch Thất', 'badminton', 'open', 76000, 124000, 2, 'Sân cầu lông có hệ thống thông gió tốt.'),
('0ab1a20e-4704-d755-01ae-9c17deff7441', '34bc8062-c7f6-fcc5-4df0-654d20182a0d', 'Cầu lông 5 Thạch Thất', 'badminton', 'open', 78000, 130000, 2, 'Sân cầu lông chuẩn thi đấu nội bộ.'),
('238d9f26-51a9-0cf9-6df8-111778de54d4', '34bc8062-c7f6-fcc5-4df0-654d20182a0d', 'Sân tennis Thạch Thất', 'tennis', 'open', 165000, 300000, 4, 'Sân tennis ngoài trời sử dụng lớp phủ chất lượng.'),
-- TDTT Thạch Thất Courts
('12af70c6-c3b5-7189-a225-935c8487ded1', '3cf4fa7b-ecd9-cf9b-4af6-3afd82e4b379', 'Sân bóng 5 người - TDTT Thạch Thất', 'soccer', 'open', 200000, 350000, 10, 'Sân bóng đá mini cỏ nhân tạo chất lượng cao tại TDTT.'),
('b083c2a9-40b9-1a26-b5fe-feb4bfe47a30', '3cf4fa7b-ecd9-cf9b-4af6-3afd82e4b379', 'Sân bóng 7 người - TDTT Thạch Thất', 'soccer', 'open', 280000, 450000, 14, 'Sân bóng đá 7 người cỏ nhân tạo với đèn chiếu sáng ban đêm.'),
('62d60cab-2d39-59ec-72ea-a9ccf4f4cccb', '3cf4fa7b-ecd9-cf9b-4af6-3afd82e4b379', 'Sân cầu lông 1 - TDTT Thạch Thất', 'badminton', 'open', 70000, 120000, 2, 'Sân cầu lông trong nhà với sàn gỗ chuyên dụng.'),
('364789ed-b9ee-d5dd-3541-dd399958bf5b', '3cf4fa7b-ecd9-cf9b-4af6-3afd82e4b379', 'Sân cầu lông 2 - TDTT Thạch Thất', 'badminton', 'open', 70000, 120000, 2, 'Sân cầu lông cao cấp tiêu chuẩn quốc tế.'),
('431ab691-1969-1284-6632-409ace046f5a', '3cf4fa7b-ecd9-cf9b-4af6-3afd82e4b379', 'Sân tennis - TDTT Thạch Thất', 'tennis', 'open', 120000, 200000, 4, 'Sân tennis sáo cứng với đèn LED sáng rõ.'),
('05b953d4-8ad2-922b-63f8-da4cac678ab9', '3cf4fa7b-ecd9-cf9b-4af6-3afd82e4b379', 'Sân bóng rổ - TDTT Thạch Thất', 'basketball', 'open', 180000, 320000, 10, 'Sân bóng rổ trong nhà với sàn gỗ tiêu chuẩn.'),
('73faf955-d524-5c5b-8916-44dbb900fdb2', '3cf4fa7b-ecd9-cf9b-4af6-3afd82e4b379', 'Sân pickleball - TDTT Thạch Thất', 'pickleball', 'open', 100000, 180000, 4, 'Sân pickleball ngoài trời mặt nhựa chuyên dụng.'),
('14ad425e-43f1-9ae1-91e9-415326ab6820', '3cf4fa7b-ecd9-cf9b-4af6-3afd82e4b379', 'Sân bóng chuyền - TDTT Thạch Thất', 'volleyball', 'open', 150000, 260000, 12, 'Sân bóng chuyền ngoài trời với lưới cao cấp.');

-- Additional matchmaking records near Hòa Lạc
INSERT INTO matches (id, creator_id, court_id, venue_id, title, sport, address, match_date, match_time, skill_level, max_players, price_per_player, status, description) VALUES
('fd95b351-4388-d69d-d4da-0d6b2820a4a2', 'a1000001-0000-0000-0000-000000000001', 'fd0e372c-410d-875a-e105-a8865f03b8d7', '615c7e39-3450-7219-534c-595ee3f681fc', 'Giao hữu bóng đá Hòa Lạc 5v5', 'soccer', 'Khu Công Nghệ Cao Hòa Lạc, Thạch Thất, Hà Nội', '2026-06-05', '18:30', 'Intermediate', 10, 50000, 'open', 'Kèo giao hữu 5v5 chiều thứ Bảy, cần thêm 2 tiền đạo và 1 thủ môn.'),
('a3848f6b-a7fe-df3c-559d-d3289fedc632', 'a1000001-0000-0000-0000-000000000002', 'b9bb6c74-9261-573a-bb9e-f15c751ff0a4', '615c7e39-3450-7219-534c-595ee3f681fc', 'Bóng đá 7 người Hòa Lạc', 'soccer', 'Khu Công Nghệ Cao Hòa Lạc, Thạch Thất, Hà Nội', '2026-06-06', '20:00', 'Advanced', 14, 45000, 'full', 'Đã đủ cầu thủ, mở cho người chơi dự bị theo dõi lịch thay người.'),
('2266fb2b-8688-14b9-067a-7049f4bcad5b', 'a1000001-0000-0000-0000-000000000003', '74e65d68-9866-5c45-8472-597e49a50d85', '615c7e39-3450-7219-534c-595ee3f681fc', 'Rổ chiều tối Hòa Lạc', 'basketball', 'Khu Công Nghệ Cao Hòa Lạc, Thạch Thất, Hà Nội', '2026-06-07', '19:15', 'Beginner', 10, 30000, 'open', 'Mời anh em đánh bóng rổ nhẹ, ưu tiên người mới làm quen.'),
('1126bed3-ec51-e5dc-5184-b2e9c936c943', 'a1000001-0000-0000-0000-000000000004', '0c9f8eee-b220-2a19-221e-240c2d7b2479', '615c7e39-3450-7219-534c-595ee3f681fc', 'Tennis đôi Hòa Lạc', 'tennis', 'Khu Công Nghệ Cao Hòa Lạc, Thạch Thất, Hà Nội', '2026-06-08', '16:00', 'Intermediate', 4, 60000, 'open', 'Cần 1 đôi điền kinh đánh đôi giao lưu sân đất nện.'),
('ca90738a-2fcb-2e01-9b83-e1335e83fa48', 'a1000001-0000-0000-0000-000000000005', '0374b760-7d29-65cb-7842-5adea6cbc886', '615c7e39-3450-7219-534c-595ee3f681fc', 'Pickleball Hòa Lạc mở cửa', 'pickleball', 'Khu Công Nghệ Cao Hòa Lạc, Thạch Thất, Hà Nội', '2026-06-09', '17:00', 'Beginner', 4, 65000, 'open', 'Kèo pickleball cho nhóm mới tập, không cần kinh nghiệm.'),
('6947e91e-cb5f-2975-b98b-872e55f7b81a', 'a1000001-0000-0000-0000-000000000001', '6b833575-7467-1d30-e045-9aa9ce486614', '615c7e39-3450-7219-534c-595ee3f681fc', 'Bóng chuyền Thứ Bảy', 'volleyball', 'Khu Công Nghệ Cao Hòa Lạc, Thạch Thất, Hà Nội', '2026-06-10', '15:30', 'Intermediate', 10, 30000, 'open', 'Hoạt động bóng chuyền cuối tuần, cần thêm 4 người.'),
('0276ae68-2eb6-2c72-a774-d14837e5fec9', 'a1000001-0000-0000-0000-000000000002', 'c25b1e1c-0efd-dde4-b2ca-6ffe4e793914', '33c95650-6d00-a9a3-00ac-897c8ed63ae2', 'Cầu lông FPT sáng sớm', 'badminton', 'Đại học FPT Hà Nội, Thạch Thất, Hà Nội', '2026-06-06', '07:30', 'Beginner', 2, 25000, 'open', 'Match cầu lông đơn dành cho thành viên mới, vui vẻ.'),
('186f7e1b-f61a-d418-6c6d-cb8aeb67972c', 'a1000001-0000-0000-0000-000000000003', 'd3367d67-659a-e251-a84f-425dcce4fa93', '33c95650-6d00-a9a3-00ac-897c8ed63ae2', 'Cầu lông đôi FPT', 'badminton', 'Đại học FPT Hà Nội, Thạch Thất, Hà Nội', '2026-06-10', '18:00', 'Intermediate', 4, 32000, 'full', 'Đã đủ người cho kèo đôi, mở chờ người dự bị.'),
('cadff5c5-d5a6-4e7e-6f5e-fd4cb0ddca74', 'a1000001-0000-0000-0000-000000000001', '2946018a-5c21-effa-ad2c-b95ccc239013', '33c95650-6d00-a9a3-00ac-897c8ed63ae2', 'Tennis FPT buổi chiều', 'tennis', 'Đại học FPT Hà Nội, Thạch Thất, Hà Nội', '2026-06-11', '14:00', 'Advanced', 4, 70000, 'open', 'Cần 1 đối tác chơi đánh đôi theo phong cách trao đổi bóng nhanh.'),
('e71192c6-af06-e02c-c42d-1203053b67db', 'a1000001-0000-0000-0000-000000000005', 'b4e907cb-1f6d-d4d3-0089-bcf238da7a39', '33c95650-6d00-a9a3-00ac-897c8ed63ae2', 'Bóng chuyền FPT', 'volleyball', 'Đại học FPT Hà Nội, Thạch Thất, Hà Nội', '2026-06-11', '19:00', 'Intermediate', 10, 35000, 'open', 'Mời các đội FPT giao lưu bóng chuyền vào buổi tối.'),
('0bdf7dfc-06c7-df5a-a714-dca1613e3b77', 'a1000001-0000-0000-0000-000000000001', '398bd6df-4cf3-ffd1-5e10-3f81deecc547', 'e6db5ce3-2dae-d7cb-cf54-e3c611c997b3', 'Soccer ĐHQG 5v5', 'soccer', 'Đại học Quốc gia Hà Nội Hòa Lạc, Hòa Lạc, Hà Nội', '2026-06-12', '17:00', 'Intermediate', 10, 48000, 'open', 'Kèo 5 người dành cho bạn học sinh và cựu sinh viên.'),
('14e6a6cd-3665-2546-66b6-76abcf61a66b', 'a1000001-0000-0000-0000-000000000004', 'f7839a19-64e0-6cf9-04d6-deed80b5ca7c', 'e6db5ce3-2dae-d7cb-cf54-e3c611c997b3', 'Tennis ĐHQG chiều', 'tennis', 'Đại học Quốc gia Hà Nội Hòa Lạc, Hòa Lạc, Hà Nội', '2026-06-12', '16:30', 'Beginner', 4, 55000, 'open', 'Đôi tennis cho người mới thích chơi giải trí.'),
('0576006c-ad9e-5bec-aabc-8d542e40b0a5', 'a1000001-0000-0000-0000-000000000005', '5a173ac8-7e4a-caee-f3a3-59d4197a550a', 'e6db5ce3-2dae-d7cb-cf54-e3c611c997b3', 'Cầu lông ĐHQG tối', 'badminton', 'Đại học Quốc gia Hà Nội Hòa Lạc, Hòa Lạc, Hà Nội', '2026-06-13', '19:00', 'Advanced', 4, 36000, 'in_progress', 'Đang diễn ra kèo cầu lông 2 vs 2 cho các tay vợt trung cấp.'),
('b90a4ddc-9914-e91b-da19-6f3f26a69e9b', 'a1000001-0000-0000-0000-000000000001', 'f553dd2c-3008-2335-2c68-ded007f2dce1', 'e6db5ce3-2dae-d7cb-cf54-e3c611c997b3', 'Bóng rổ ĐHQG cuối tuần', 'basketball', 'Đại học Quốc gia Hà Nội Hòa Lạc, Hòa Lạc, Hà Nội', '2026-06-14', '18:30', 'Intermediate', 10, 33000, 'open', 'Mời đội bóng rổ sinh viên đánh giao lưu cuối tuần.'),
('99a7ccda-0cc4-4f79-6fd5-5c3f1bca97bf', 'a1000001-0000-0000-0000-000000000002', 'bf865e63-acd6-8c83-6d40-9b87671dbc50', '369d1219-c7be-a0da-44d2-a640aa2c72f0', 'Xuân Mai 5 người', 'soccer', 'Khu Đô Thị Mới Xuân Mai, Xuân Mai, Hà Nội', '2026-06-13', '18:00', 'Beginner', 10, 42000, 'open', 'Sân 5 người giao hữu dành cho người mới chơi.'),
('43dbb01f-87ac-9ba0-0beb-20bb51bb3f1d', 'a1000001-0000-0000-0000-000000000003', 'd1ce4880-3895-cee2-31bd-c5a535d6b1fc', '369d1219-c7be-a0da-44d2-a640aa2c72f0', 'Xuân Mai 7 người', 'soccer', 'Khu Đô Thị Mới Xuân Mai, Xuân Mai, Hà Nội', '2026-06-14', '20:00', 'Advanced', 14, 47000, 'finished', 'Kèo 7 người đã kết thúc; chờ công bố kết quả cuối cùng.'),
('b5b2c673-1afd-b8d9-532c-1eefd1999141', 'a1000001-0000-0000-0000-000000000001', 'f89a3d6a-4ade-3ba0-ce08-e98480319b52', '369d1219-c7be-a0da-44d2-a640aa2c72f0', 'Bóng chuyền Xuân Mai', 'volleyball', 'Khu Đô Thị Mới Xuân Mai, Xuân Mai, Hà Nội', '2026-06-15', '17:00', 'Intermediate', 10, 31000, 'open', 'Mời đội bóng chuyền giao hữu 6 người.'),
('c50963ab-8502-e6e0-7b23-72588d74a769', 'a1000001-0000-0000-0000-000000000002', '156794ed-3a97-185b-4b04-8d01831e293b', '369d1219-c7be-a0da-44d2-a640aa2c72f0', 'Cầu lông Xuân Mai', 'badminton', 'Khu Đô Thị Mới Xuân Mai, Xuân Mai, Hà Nội', '2026-06-16', '15:30', 'Intermediate', 4, 30000, 'full', 'Đã đủ người cho kèo đôi, mở chờ người dự bị.'),
('2f76acc2-96e6-bc8f-aa9a-167b441b3f44', 'a1000001-0000-0000-0000-000000000003', '521a6329-ab13-abba-744b-fb2addc06c9e', '369d1219-c7be-a0da-44d2-a640aa2c72f0', 'Pickleball Xuân Mai', 'pickleball', 'Khu Đô Thị Mới Xuân Mai, Xuân Mai, Hà Nội', '2026-06-16', '18:00', 'Beginner', 4, 62000, 'open', 'Lịch pickleball dành cho người mới làm quen. Mang dép mềm.'),
('1a95ac57-5c34-3f0d-f232-be7bbd9a6a4a', 'a1000001-0000-0000-0000-000000000001', 'ba51d47e-0c60-d373-c00e-0c983aafd6d4', '9e4140d0-a996-1757-0e4e-8deca91492f3', 'Cầu lông Quốc Oai sáng', 'badminton', 'Quốc Oai, Hà Nội', '2026-06-17', '08:00', 'Beginner', 2, 24000, 'open', 'Kèo đánh đơn buổi sáng cuối tuần cho người mới.'),
('e267678e-859e-c39d-253d-36f88486514f', 'a1000001-0000-0000-0000-000000000002', '42414947-4ddd-21c3-2eb2-b9ee2d468dba', '9e4140d0-a996-1757-0e4e-8deca91492f3', 'Pickleball Quốc Oai', 'pickleball', 'Quốc Oai, Hà Nội', '2026-06-17', '16:30', 'Intermediate', 4, 65000, 'open', 'Bữa chiều pickleball giao lưu cho nhóm bạn.'),
('0a4b1afb-7e85-039a-b505-12293c56f61a', 'a1000001-0000-0000-0000-000000000003', '91e78b9a-d9c7-51fa-89bc-6b37dae05d27', '9e4140d0-a996-1757-0e4e-8deca91492f3', 'Bóng chuyền Quốc Oai', 'volleyball', 'Quốc Oai, Hà Nội', '2026-06-18', '19:00', 'Advanced', 10, 34000, 'in_progress', 'Đang diễn ra kèo bóng chuyền nội bộ Quốc Oai.'),
('f4811cf2-3efb-9a41-8f8d-d1946ecf574d', 'a1000001-0000-0000-0000-000000000003', 'abfe6feb-8598-ec2f-e0da-011c2cb25c21', '9e4140d0-a996-1757-0e4e-8deca91492f3', 'Tennis Quốc Oai dạ quang', 'tennis', 'Quốc Oai, Hà Nội', '2026-06-19', '20:00', 'Advanced', 4, 69000, 'open', 'Đôi tennis trước giờ thi đấu, đánh với đèn đêm.'),
('c1746cf7-1ec8-37b3-2649-f6275a18c81e', 'a1000001-0000-0000-0000-000000000001', 'd468bc43-41ca-c9bc-cc7b-9bce25140b0f', '34bc8062-c7f6-fcc5-4df0-654d20182a0d', 'Cầu lông Thạch Thất sáng', 'badminton', 'Thạch Thất, Hà Nội', '2026-06-20', '07:00', 'Beginner', 2, 26000, 'open', 'Kèo sáng sớm cho người mới tập đôi.'),
('c16180a3-115a-0f42-6726-909099c848df', 'a1000001-0000-0000-0000-000000000002', 'a86c7622-b174-0ac1-6fe6-67aa7853c3a8', '34bc8062-c7f6-fcc5-4df0-654d20182a0d', 'Cầu lông Thạch Thất trưa', 'badminton', 'Thạch Thất, Hà Nội', '2026-06-20', '12:00', 'Intermediate', 2, 28000, 'finished', 'Kèo cầu lông đã kết thúc, chờ review.'),
('fd683e03-d527-70c1-6f92-7771b65b1430', 'a1000001-0000-0000-0000-000000000001', 'b1bbe5ef-9be8-c178-8385-364252e45a68', '34bc8062-c7f6-fcc5-4df0-654d20182a0d', 'Cầu lông Thạch Thất chiều', 'badminton', 'Thạch Thất, Hà Nội', '2026-06-21', '17:00', 'Advanced', 4, 33000, 'open', 'Kèo đôi hay dành cho các tay vợt trung cấp.'),
('d935162b-27f5-7657-4306-d0190d74047d', 'a1000001-0000-0000-0000-000000000003', 'cf55796e-3587-69c7-d105-b3dd04ecdeb0', '34bc8062-c7f6-fcc5-4df0-654d20182a0d', 'Cầu lông Thạch Thất tối', 'badminton', 'Thạch Thất, Hà Nội', '2026-06-21', '19:30', 'Intermediate', 4, 32000, 'open', 'Kèo cuối ngày cho nhóm cầu lông thành thạo.'),
('cd555033-9ff5-12ef-3da1-885d8e1c4523', 'a1000001-0000-0000-0000-000000000001', '0ab1a20e-4704-d755-01ae-9c17deff7441', '34bc8062-c7f6-fcc5-4df0-654d20182a0d', 'Cầu lông Thạch Thất tối 2', 'badminton', 'Thạch Thất, Hà Nội', '2026-06-22', '20:00', 'Advanced', 4, 33000, 'open', 'Kèo đánh đôi muộn cho nhóm cầu lông kinh nghiệm.'),
('2bfaca1e-89db-fe2c-3440-8ae10779beee', 'a1000001-0000-0000-0000-000000000002', '238d9f26-51a9-0cf9-6df8-111778de54d4', '34bc8062-c7f6-fcc5-4df0-654d20182a0d', 'Tennis Thạch Thất đêm', 'tennis', 'Thạch Thất, Hà Nội', '2026-06-22', '20:30', 'Intermediate', 4, 71000, 'open', 'Sân tennis đêm với đèn LED, phù hợp đôi tập luyện.'),
-- TDTT Thạch Thất Matches
('b4997034-fa45-9714-d88b-1bfcb76b5051', 'a1000001-0000-0000-0000-000000000001', '12af70c6-c3b5-7189-a225-935c8487ded1', '3cf4fa7b-ecd9-cf9b-4af6-3afd82e4b379', 'Bóng đá TDTT Thạch Thất 5v5', 'soccer', 'Thạch Thất, Hà Nội', '2026-06-22', '19:00', 'Intermediate', 10, 50000, 'open', 'Kèo giao hữu 5v5 tại TDTT Thạch Thất, đèn chiếu sáng đêm, cần thêm 2 tiền đạo.'),
('ca59c745-ad3f-8ef5-9a44-c35de6e57a3b', 'a1000001-0000-0000-0000-000000000002', 'b083c2a9-40b9-1a26-b5fe-feb4bfe47a30', '3cf4fa7b-ecd9-cf9b-4af6-3afd82e4b379', 'Bóng đá TDTT Thạch Thất 7v7', 'soccer', 'Thạch Thất, Hà Nội', '2026-06-23', '20:00', 'Advanced', 14, 55000, 'open', 'Kèo bóng đá 7v7 cạnh tranh tại TDTT, cho các tuyển thủ mạnh.'),
('42fcf986-bc57-99e5-1670-181381d19d72', 'a1000001-0000-0000-0000-000000000003', '62d60cab-2d39-59ec-72ea-a9ccf4f4cccb', '3cf4fa7b-ecd9-cf9b-4af6-3afd82e4b379', 'Cầu lông TDTT Thạch Thất sáng', 'badminton', 'Thạch Thất, Hà Nội', '2026-06-21', '07:30', 'Beginner', 2, 28000, 'open', 'Kèo cầu lông sáng sớm tại TDTT cho người mới tập đôi.'),
('e184f885-9d9e-eafe-0418-a7a9f84eda59', 'a1000001-0000-0000-0000-000000000004', '431ab691-1969-1284-6632-409ace046f5a', '3cf4fa7b-ecd9-cf9b-4af6-3afd82e4b379', 'Tennis TDTT Thạch Thất chiều', 'tennis', 'Thạch Thất, Hà Nội', '2026-06-21', '16:00', 'Intermediate', 4, 65000, 'open', 'Đôi tennis luyện tập tại sân tennis TDTT, phù hợp trung cấp.'),
('493b456f-dc1a-e9d4-ebdd-df8e0a64c612', 'a1000001-0000-0000-0000-000000000005', '05b953d4-8ad2-922b-63f8-da4cac678ab9', '3cf4fa7b-ecd9-cf9b-4af6-3afd82e4b379', 'Bóng rổ TDTT Thạch Thất giao hữu', 'basketball', 'Thạch Thất, Hà Nội', '2026-06-24', '18:30', 'Intermediate', 10, 50000, 'open', 'Bóng rổ giao hữu vui vẻ tại sân trong nhà TDTT.'),
('51f86b1b-3223-c890-086c-12981d372471', 'a1000001-0000-0000-0000-000000000001', '364789ed-b9ee-d5dd-3541-dd399958bf5b', '3cf4fa7b-ecd9-cf9b-4af6-3afd82e4b379', 'Cầu lông TDTT Thạch Thất tối', 'badminton', 'Thạch Thất, Hà Nội', '2026-06-25', '19:30', 'Intermediate', 4, 32000, 'open', 'Kèo cầu lông chiều tối tại TDTT cho nhóm cầu lông thành thạo.'),
('094a63ad-a108-b1b4-60c8-b275176fdb40', 'a1000001-0000-0000-0000-000000000002', '73faf955-d524-5c5b-8916-44dbb900fdb2', '3cf4fa7b-ecd9-cf9b-4af6-3afd82e4b379', 'Pickleball TDTT Thạch Thất', 'pickleball', 'Thạch Thất, Hà Nội', '2026-06-25', '17:00', 'Beginner', 4, 62000, 'open', 'Pickleball giải trí cho nhóm mới bắt đầu tại sân TDTT.'),
('cd67d38b-1cdf-2bf1-77a4-ef7eb8ef7a95', 'a1000001-0000-0000-0000-000000000003', '14ad425e-43f1-9ae1-91e9-415326ab6820', '3cf4fa7b-ecd9-cf9b-4af6-3afd82e4b379', 'Bóng chuyền TDTT Thạch Thất', 'volleyball', 'Thạch Thất, Hà Nội', '2026-06-26', '19:00', 'Intermediate', 12, 35000, 'open', 'Bóng chuyền ngoài trời tại TDTT, cần thêm 4 cầu thủ.');

-- Additional tournaments in Hòa Lạc
INSERT INTO tournaments (id, organizer_id, title, sport, status, start_date, end_date, venue_name, venue_address, participants_limit, registered_count, prize_pool, entry_fee, image_url, description, rules) VALUES
('f22e9285-2533-7980-1bea-6c2bd17edc80', 'd4000001-0000-0000-0000-000000000001', 'FPT University Football Cup 2026', 'soccer', 'upcoming', '2026-06-25', '2026-06-27', 'FPT University Sports Arena', 'Đại học FPT Hà Nội, Khu CNC Hòa Lạc, Hà Nội', 12, 10, '25.000.000 VND', 60000, 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800', 'Giải đấu bóng đá mini 5 người dành cho sinh viên và nhân viên FPT.', 'Đội 5+1, luật FIFA mini, thay người tối đa 5 lần.'),
('0246cdab-51fb-46f1-4835-61d575b103e1', 'd4000001-0000-0000-0000-000000000001', 'Hòa Lạc Badminton Open', 'badminton', 'upcoming', '2026-07-02', '2026-07-04', 'Hòa Lạc Sports Complex', 'Khu CNC Hòa Lạc, Thạch Thất, Hà Nội', 24, 18, '12.000.000 VND', 40000, 'https://images.unsplash.com/photo-1597466765990-64ad1c35dafc?auto=format&fit=crop&q=80&w=800', 'Giải đấu cầu lông đôi và đơn dành cho người chơi từ Beginner đến Advanced.', 'Đánh đôi và đánh đơn theo quy định quốc tế.'),
('bddd4cd4-9415-b732-77eb-64ae6e5733bb', 'd4000001-0000-0000-0000-000000000001', 'ĐHQG Hà Nội Tennis Classic', 'tennis', 'upcoming', '2026-07-08', '2026-07-09', 'Đại học Quốc gia Hà Nội Hòa Lạc Sports Center', 'ĐHQG Hà Nội Hòa Lạc, Hà Nội', 16, 12, '18.000.000 VND', 50000, 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800', 'Giải tennis đôi và đơn phong trào dành cho sinh viên và tuyển thủ địa phương.', 'Luật ITF, tự chuẩn bị vợt và bóng.'),
('d4dcc5f1-c08f-b665-d64c-0d005773c992', 'd4000001-0000-0000-0000-000000000001', 'Hòa Lạc Pickleball Championship', 'pickleball', 'upcoming', '2026-07-15', '2026-07-16', 'Pickleball Hòa Lạc Club', 'Khu CNC Hòa Lạc, Hà Nội', 16, 13, '10.000.000 VND', 45000, 'https://images.pexels.com/photos/15390858/pexels-photo-15390858.jpeg?auto=compress&cs=tinysrgb&w=800', 'Giải pickleball mở cho các đội đôi nam, nữ và hỗn hợp.', 'Luật USAPA, bóng và vợt chuẩn thi đấu.'),
('d170791b-67d6-1bf2-b06f-4e2f5d84e283', 'd4000001-0000-0000-0000-000000000001', 'Quốc Oai Volleyball Festival', 'volleyball', 'upcoming', '2026-07-18', '2026-07-19', 'Khu Thể Thao Quốc Oai', 'Quốc Oai, Hà Nội', 12, 8, '9.000.000 VND', 30000, 'https://images.unsplash.com/photo-1509223197845-458d87318791?auto=format&fit=crop&q=80&w=800', 'Giải giao hữu bóng chuyền 6 người giữa các câu lạc bộ địa phương.', 'Luật 6 vs 6 theo chuẩn VBF.'),
('8fec44e2-cff0-f1fc-d020-23dffff2eb16', 'd4000001-0000-0000-0000-000000000001', 'Xuân Mai Mini Football Tournament', 'soccer', 'ongoing', '2026-06-20', '2026-06-22', 'Sân Bóng Đá Xuân Mai', 'Khu Đô Thị Mới Xuân Mai, Hà Nội', 10, 10, '8.000.000 VND', 50000, 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800', 'Giải bóng đá mini 5 người đã vào vòng bảng.', 'Luật mini 5 người, thay người không giới hạn.'),
('5bc64cc5-bd9a-29fc-4dcc-4d77cc1d6323', 'd4000001-0000-0000-0000-000000000001', 'Thạch Thất Badminton Doubles Cup', 'badminton', 'ongoing', '2026-06-12', '2026-06-13', 'Sân Cầu Lông Thạch Thất', 'Thạch Thất, Hà Nội', 20, 18, '7.500.000 VND', 35000, 'https://images.pexels.com/photos/8007171/pexels-photo-8007171.jpeg?auto=compress&cs=tinysrgb&w=800', 'Giải cầu lông đôi mở rộng cho các CLB và đội học sinh.', 'Đánh đôi theo quy định VBF.'),
('93006963-0e8d-69d4-7f16-95c0244d8664', 'd4000001-0000-0000-0000-000000000001', 'Hòa Lạc Basketball League', 'basketball', 'upcoming', '2026-07-23', '2026-07-25', 'Hòa Lạc Sports Complex', 'Khu CNC Hòa Lạc, Hà Nội', 10, 7, '11.000.000 VND', 60000, 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800', 'Giải bóng rổ 3x3 giao hữu giữa các đội trẻ và bán chuyên.', 'Luật 3x3 FIBA, hiệp 10 phút.');



-- ============================================================
-- SAMPLE REVIEWS
-- ============================================================

INSERT INTO reviews (reviewer_id, venue_id, rating, comment) VALUES
('a1000001-0000-0000-0000-000000000001', '8e081570-85c6-c24a-82c1-e2e7603f393f', 5, 'Sân cỏ rất đẹp, đèn sáng, nhân viên nhiệt tình. Sẽ quay lại!'),
('a1000001-0000-0000-0000-000000000002', '8e081570-85c6-c24a-82c1-e2e7603f393f', 4, 'Sân tốt nhưng bãi xe hơi chật vào giờ cao điểm.'),
('a1000001-0000-0000-0000-000000000003', 'a60ddd35-562f-3ee8-100c-92c18abb8d2d', 5, 'Thảm Yonex cực chất, không bị trơn. Giá hợp lý.'),
('a1000001-0000-0000-0000-000000000005', 'a60ddd35-562f-3ee8-100c-92c18abb8d2d', 5, 'Sân rộng, thoáng, thuê vợt cũng xịn lắm!'),
('a1000001-0000-0000-0000-000000000001', 'e9ef097e-a81e-7b93-2404-b3c4f0a40611', 5, 'Sân quần vợt đẳng cấp nhất mình từng chơi.');


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
('a1000001-0000-0000-0000-000000000001', '8e081570-85c6-c24a-82c1-e2e7603f393f'),
('a1000001-0000-0000-0000-000000000001', 'a60ddd35-562f-3ee8-100c-92c18abb8d2d'),
('a1000001-0000-0000-0000-000000000003', 'a60ddd35-562f-3ee8-100c-92c18abb8d2d'),
('a1000001-0000-0000-0000-000000000005', 'a60ddd35-562f-3ee8-100c-92c18abb8d2d');


-- ============================================================
-- END OF SEED DATA
-- ============================================================
