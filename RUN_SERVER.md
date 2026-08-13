# 🚀 Hướng Dẫn Chạy Website Qua HTTP Server

## ⚠️ Vấn Đề

Website không thể load Supabase library khi mở bằng `file://` protocol (khi double-click file HTML).
Trình duyệt chặn việc load external scripts từ CDN vì lý do bảo mật.

## ✅ Giải Pháp: Chạy Qua HTTP Server

### Cách 1: Dùng Python (Khuyên Dùng - Đơn Giản Nhất)

**Windows:**
1. Mở PowerShell hoặc Command Prompt
2. Điều hướng đến thư mục project:
   ```
   cd "f:\AI CLAUDE SOLO\BuddhistTantricSite\Mat Tong Viet"
   ```
3. Chạy lệnh:
   ```
   python run-server.py
   ```
   hoặc:
   ```
   python3 run-server.py
   ```

4. Chờ xuất hiện dòng:
   ```
   ✅ Server running at: http://localhost:8000
   ```

5. **Mở trình duyệt** và truy cập: **http://localhost:8000**

---

### Cách 2: Dùng Node.js (Nếu có cài đặt)

**Windows:**
```
cd "f:\AI CLAUDE SOLO\BuddhistTantricSite\Mat Tong Viet"
npx http-server
```

Sau đó mở: **http://localhost:8080**

---

### Cách 3: Dùng Python 1 dòng (Nếu Python không cùng PATH)

**Windows - PowerShell:**
```powershell
Set-Location "f:\AI CLAUDE SOLO\BuddhistTantricSite\Mat Tong Viet"
python -m http.server 8000
```

Rồi mở: **http://localhost:8000**

---

## 🧪 Test Form Sau Khi Chạy Server

1. ✅ Server chạy
2. ✅ Website mở qua http://localhost:8000
3. ✅ Console không có lỗi về Supabase (F12 → Console)
4. ✅ Nhấn "Đăng ký thành viên"
5. ✅ Điền form:
   - Tên: `Test User`
   - Email: `test@example.com`
   - Số điện thoại: `0123456789`
6. ✅ Nhấn "Gửi đăng ký"
7. ✅ Đợi thông báo "Cảm ơn!"
8. ✅ Kiểm tra Supabase Dashboard → signups table

---

## 🆘 Nếu Vẫn Không Hoạt động

Kiểm tra Developer Console (F12):

1. **Tab "Console"** - xem có error gì không
2. **Tab "Network"** - xem request được gửi tới Supabase không
3. **Nếu lỗi RLS**: Kiểm tra lại SQL setup trong Supabase

---

## 💡 Ghi Chú

- Server chạy ở port 8000 (có thể thay đổi nếu cần)
- Để dừng server: Nhấn **Ctrl+C** trong terminal
- Khi deploy lên production (Netlify, Vercel, etc), vấn đề này tự động giải quyết
