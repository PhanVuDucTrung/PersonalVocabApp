# 📚 Personal Vocab App — Trung Vocab

> Ứng dụng học từ vựng tiếng Anh cá nhân hóa với hệ thống Spaced Repetition thông minh, được xây dựng để hỗ trợ luyện thi IELTS Reading

> Dự án cá nhân của NonTech Student nhằm hỗ trợ sinh viên tự học tiếng anh miễn phí thay vì sử dụng các app trả phí hiện hành

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-teal?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)

---

## 🌐 Live Demo

🔗 [personal-vocab-app.vercel.app](https://personal-vocab-app.vercel.app)

---

## ✨ Tính năng chính

### 🧠 Spaced Repetition System (SRS)
- Hệ thống ôn tập thông minh dựa trên khoa học ghi nhớ
- Từ vựng được chia thành **5 level** với thời gian ôn tập tăng dần
- Timer độc lập cho từng từ - cập nhật level không ảnh hưởng timer của các từ khác
- Đồng hồ đếm ngược hiển thị thời gian đến lần ôn tiếp theo

| Level | Thời gian chờ |
|-------|--------------|
| Level 1 → 2 | 24 giờ |
| Level 2 → 3 | 48 giờ |
| Level 3 → 4 | 1 tuần |
| Level 4 → 5 | 2 tuần |

### 📋 Test Mode
- Ôn tập theo từng bài test cụ thể (Cambridge 16, 20...)
- Từ sai tự động lặp lại đến khi thuộc
- Không ảnh hưởng tiến độ SRS

### ⚡ Siêu Trí Nhớ
- Chế độ điền từ bị ẩn 70% ký tự
- Thử thách cao nhất để kiểm tra độ thuộc từ
- Từ sai lặp lại cho đến khi làm đúng

### 🔄 Free To Ôn
- Ôn toàn bộ từ vựng không giới hạn
- Xáo trộn ngẫu nhiên mỗi phiên

### 🎮 4 Dạng câu hỏi
- **ENG → VN**: Nhìn từ tiếng Anh, chọn nghĩa tiếng Việt
- **VN → ENG**: Nhìn nghĩa tiếng Việt, chọn từ tiếng Anh
- **Gap Fill**: Điền từ vào chỗ trống trong câu ví dụ
- **Missing Chars**: Đoán từ bị ẩn một phần ký tự

### ⌨️ Phím tắt
- `1` `2` `3` `4` — Chọn đáp án
- `Enter` — Chốt đáp án / Qua câu tiếp theo

---

## 📖 Nguồn từ vựng

Toàn bộ từ vựng được chọn lọc từ các bài đọc IELTS Cambridge:
- **Cambridge IELTS 16** — Test 1, 2, 3, 4
- **Cambridge IELTS 20** — Test 1, 2

Mỗi từ bao gồm:
- Từ vựng + loại từ
- Nghĩa tiếng Việt
- Giải thích ngữ nghĩa
- Câu ví dụ thực tế

---

## 🛠️ Công nghệ sử dụng

| Công nghệ | Mục đích |
|-----------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool |
| Tailwind CSS | Styling |
| localStorage | Lưu tiến độ học |
| Vercel | Hosting & Deployment |
| GitHub | Version control |
| StackBlitz | Online IDE |

---

## 🤖 AI Support

Dự án này được phát triển với sự hỗ trợ của:

- **Google Gemini** — Hỗ trợ thiết kế logic SRS, UI/UX, và debug code ban đầu trên Gemini Canvas
- **Anthropic Claude** — Hỗ trợ refactor code, fix lỗi TypeScript, tư vấn deploy lên Vercel

> *Đây là dự án cá nhân phi thương mại phục vụ mục đích học tập.*

---

## 🚀 Cài đặt & Chạy locally

```bash
# Clone repository
git clone https://github.com/PhanVuDucTrung/PersonalVocabApp.git

# Di chuyển vào thư mục
cd PersonalVocabApp

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Mở trình duyệt tại `http://localhost:5173`

---

## 📦 Build & Deploy

```bash
# Build production
npm run build

# Preview bản build
npm run preview
```

Deploy tự động lên Vercel mỗi khi push lên nhánh `main`.

---

## ⚠️ Lưu ý quan trọng

- Tiến độ học tập được lưu trong **localStorage** của trình duyệt
- Xóa cache trình duyệt hoặc đổi thiết bị sẽ **mất tiến độ**
- Nên dùng cố định **1 trình duyệt** trên **1 thiết bị** để tránh mất dữ liệu
- Định kỳ backup dữ liệu qua **F12 → Application → LocalStorage**

---

## 📄 License

MIT License — Dự án cá nhân, phi thương mại.

---

<p align="center">Made with ❤️ by Phan Vũ Đức Trung</p>
