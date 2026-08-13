# 🔍 Diagnostic Checklist - Lỗi 401 Supabase

## Vấn Đề Hiện Tại
- Test kết nối Supabase trả về lỗi `401 Unauthorized`
- Điều này xảy ra cho dù đã update API key

---

## Hãy Check Những Điều Sau (Trên Supabase Dashboard)

### 1️⃣ **Kiểm Tra Project Settings**
- [ ] Vào https://app.supabase.com
- [ ] Chọn project **"MAT TONG VIET"**
- [ ] Click **Project Settings** (⚙️ góc trái)
- [ ] Vào tab **API**
- [ ] **Xác nhận:**
  - ✅ Project URL: `https://lnhrzszaxwihjccskjkx.supabase.co` (khớp không?)
  - ✅ Anon public key: Copy lại key này

**Ghi chú:** Key nên được copy từ dòng **"anon public"** (dòng đầu), không phải "service_role"

---

### 2️⃣ **Kiểm Tra Bảng Signups Có Tồn Tại?**
- [ ] Vào **Table Editor** (menu bên trái)
- [ ] **Xác nhận:** Có bảng **"signups"** trong danh sách không?
  - ✅ Nếu có → Good ✓
  - ❌ Nếu không → **Cần tạo bảng** (xem hướng dẫn bên dưới)

---

### 3️⃣ **Kiểm Tra RLS Policy**
- [ ] Click vào bảng **"signups"**
- [ ] Vào tab **RLS** (Row Level Security)
- [ ] **Xác nhận:**
  - ✅ RLS ON/OFF? (Nên **ON** để bảo mật)
  - ✅ Có policy cho phép INSERT từ role **"anon"** không?
  - ✅ Policy đó nên có dạng:
    ```
    Policy: "Allow anonymous inserts to signups"
    For: INSERT
    Role: anon
    Check: true
    ```

**Nếu không có policy này:** Cần tạo (xem hướng dẫn SQL bên dưới)

---

## 🛠️ Nếu Bảng Chưa Tồn Tại - Tạo Ngay

Chạy SQL này trong **SQL Editor**:

```sql
-- Tạo bảng signups
CREATE TABLE IF NOT EXISTS signups (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Kích hoạt RLS
ALTER TABLE signups ENABLE ROW LEVEL SECURITY;

-- Tạo policy cho phép anon insert
CREATE POLICY "Allow anonymous inserts to signups"
ON signups
FOR INSERT
WITH CHECK (true);

-- Tạo policy cho phép SELECT
CREATE POLICY "Allow public read signups"
ON signups
FOR SELECT
USING (true);
```

---

## 🔐 Nếu RLS Policy Chưa Có - Tạo Ngay

```sql
-- Xóa policy cũ nếu có
DROP POLICY IF EXISTS "Allow anonymous inserts to signups" ON signups;
DROP POLICY IF EXISTS "Allow public read signups" ON signups;

-- Tạo policy mới
CREATE POLICY "Allow anonymous inserts to signups"
ON signups
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public read signups"
ON signups
FOR SELECT
USING (true);
```

---

## ✅ Sau Khi Fix Xong

1. Copy lại **anon public key** từ **Project Settings > API**
2. Update `supabase-config.js` với key mới
3. Mở `test-supabase.html` 
4. Click "✓ Kiểm tra kết nối"
5. **Nếu thấy ✅ Kết nối thành công** → Bạn đã fix được! 🎉

---

## 📞 Nếu Vẫn Lỗi 401

Hãy cho biết:
1. Key bạn copy từ Supabase Dashboard có giống như cái mà tôi đã dán vào không?
2. Bảng "signups" có tồn tại không?
3. RLS policy có được tạo thành công không?
4. Có error message nào khác khi chạy SQL không?

Tôi sẽ giúp diagnose thêm!
