# Cấu Hình Supabase cho Form Đăng Ký

## Bước 1: Tạo Bảng "signups"

Vào **Supabase Dashboard** → **SQL Editor** → chạy SQL này:

```sql
-- Tạo bảng signups
CREATE TABLE signups (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Thêm chỉ mục trên email để tìm kiếm nhanh
CREATE INDEX idx_signups_email ON signups(email);

-- Thêm chỉ mục trên created_at để sắp xếp
CREATE INDEX idx_signups_created_at ON signups(created_at DESC);

-- Kích hoạt Row Level Security
ALTER TABLE signups ENABLE ROW LEVEL SECURITY;
```

## Bước 2: Tạo RLS Policy cho Phép Insert Anônimo

Sau khi tạo bảng, chạy SQL này để cho phép người dùng ẩn danh (anon) insert dữ liệu:

```sql
-- Policy cho phép INSERT từ người dùng anon
CREATE POLICY "Allow anonymous inserts to signups"
ON signups
FOR INSERT
WITH CHECK (true);

-- Policy cho phép SELECT (nếu cần cho admin)
CREATE POLICY "Allow public read signups"
ON signups
FOR SELECT
USING (true);
```

## Bước 3: Xác Minh Cấu Hình

1. Vào **Supabase Dashboard** → **Table Editor**
2. Chọn bảng `signups`
3. Vào tab **RLS** để kiểm tra:
   - ✅ RLS phải ở trạng thái **ON**
   - ✅ Phải có policy `Allow anonymous inserts to signups` với role **anon**

## Cách Chạy SQL Script

### Cách 1: Qua Dashboard
1. Đăng nhập vào https://app.supabase.com
2. Chọn project "MAT TONG VIET"
3. Vào **SQL Editor** ở menu bên trái
4. Tạo query mới
5. Copy & paste SQL từ trên
6. Nhấn **Run**

### Cách 2: Qua Query Tool
Nếu bảng đã tồn tại, chỉ cần chạy phần RLS Policy:
```sql
ALTER TABLE signups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous inserts to signups" ON signups;
CREATE POLICY "Allow anonymous inserts to signups"
ON signups
FOR INSERT
WITH CHECK (true);
```

## Kiểm Tra Kết Quả

Sau khi cấu hình xong:
1. Mở website của bạn
2. Nhấn "Đăng ký thành viên"
3. Điền form và submit
4. Kiểm tra Supabase Dashboard → Table Editor → `signups` tab
5. Dữ liệu mới phải hiển thị trong bảng ngay lập tức

## Ghi Chú Bảo Mật

- ✅ Form sử dụng validation client-side (name ≥ 2 ký tự, email hợp lệ, phone hợp lệ)
- ✅ Dữ liệu được sanitize trước khi gửi
- ✅ RLS Policy chỉ cho phép INSERT, không cho phép UPDATE/DELETE
- ⚠️ Nếu muốn ngăn spam, cân nhắc thêm rate limiting sau này

## Cấu Hình Supabase Hiện Tại

```
Project: MAT TONG VIET
URL: https://lnhrzszaxwihjccskjkx.supabase.co
Anon Key: (được dùng trong supabase-config.js)
```
