# ⚠️ Lỗi API Key Supabase - Cách Sửa

## Vấn Đề
API key trong file `supabase-config.js` không hợp lệ (trả về lỗi `401 Invalid API key`).

Điều này có thể do:
1. ❌ Key bị xóa hoặc hết hạn từ Supabase
2. ❌ Project ID không đúng
3. ❌ RLS policy chặn toàn bộ request

---

## Giải Pháp: Lấy API Key Mới từ Supabase

### Bước 1: Truy cập Supabase Dashboard

1. Mở: https://app.supabase.com
2. Đăng nhập với tài khoản của bạn
3. Chọn project **"MAT TONG VIET"**

### Bước 2: Lấy API Key

1. Click vào **Project Settings** (⚙️) ở menu bên trái
2. Vào tab **API**
3. Tìm phần **"Project API keys"**
4. Copy **`anon public`** key (dòng đầu tiên)

### Bước 3: Cập Nhật supabase-config.js

1. Mở file `supabase-config.js` trong VS Code
2. Thay thế dòng:
   ```javascript
   const SUPABASE_ANON_KEY = 'xxx'
   ```
   Bằng key mới mà bạn vừa copy

3. Save file (Ctrl+S)

### Bước 4: Reload Website

1. Mở file `index.html` trong trình duyệt
2. Nhấn **F5** để refresh
3. Test form đăng ký lại

---

## Kiểm Tra Nhanh

Mở file `test-supabase.html` để kiểm tra:
1. Nếu thấy "✅ Kết nối Supabase thành công!" → Key mới có hiệu lực
2. Nếu vẫn thấy "❌ Invalid API key" → Kiểm tra lại key

---

## Ghi Chú

- 🔑 **Anon Key** = Dùng để client-side insert dữ liệu (có giới hạn bởi RLS)
- 🔐 **Service Role Key** = Chỉ dùng server-side, không dùng trong website

---

## Nếu Vẫn Không Hoạt Động

Nếu sau khi update key vẫn lỗi 401, có thể RLS policy chặn anonymous insert.

**Check RLS policy:**
1. Vào Supabase Dashboard
2. Click **Table Editor** → Chọn bảng **signups**
3. Click tab **RLS**
4. Kiểm tra có policy cho phép insert từ role `anon` không

**Nếu không có, tạo policy:**
1. Click **+ Add new policy**
2. Chọn **FOR INSERT**
3. Chọn role **anon** 
4. SET check condition thành `true`
5. Save

---

Sau khi update key, hãy test lại form! 🎉
