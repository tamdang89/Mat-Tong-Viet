# Cấu Hình Supabase cho MAT TONG VIET Website

## Bảng 1: "signups" - Form Đăng Ký Thành Viên

### Tạo Bảng "signups"

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

---

## Bảng 2: "orders" - Đơn Hàng

### Tạo Bảng "orders"

Vào **Supabase Dashboard** → **SQL Editor** → chạy SQL này:

```sql
-- Tạo bảng orders
CREATE TABLE IF NOT EXISTS orders (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  order_id TEXT UNIQUE NOT NULL,
  fullname TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  district TEXT,
  note TEXT,
  payment_method TEXT NOT NULL DEFAULT 'cod',
  items_json TEXT NOT NULL,
  total_amount BIGINT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tạo chỉ mục để tìm kiếm nhanh
CREATE INDEX idx_orders_order_id ON orders(order_id);
CREATE INDEX idx_orders_email ON orders(email);
CREATE INDEX idx_orders_phone ON orders(phone);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_status ON orders(status);

-- Kích hoạt Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy cho phép INSERT từ người dùng anon
CREATE POLICY "Allow anonymous inserts to orders"
ON orders
FOR INSERT
WITH CHECK (true);

-- Policy cho phép SELECT (nếu cần cho admin)
CREATE POLICY "Allow public read orders"
ON orders
FOR SELECT
USING (true);
```

---

## Xác Minh Cấu Hình

1. Vào **Supabase Dashboard** → **Table Editor**
2. Chọn các bảng `signups` và `orders`
3. Vào tab **RLS** để kiểm tra:
   - ✅ RLS phải ở trạng thái **ON**
   - ✅ Phải có policies cho phép INSERT từ anon role

---

## Cấu Hình Supabase Hiện Tại

```
Project: MAT TONG VIET
URL: https://lnhrzszaxwihjccskjkx.supabase.co
Anon Key: (được dùng trong supabase-config.js)
```

## Kiểm Tra Kết Quả

### Cho Form Đăng Ký (signups)
1. Mở website của bạn
2. Nhấn "Đăng ký thành viên"
3. Điền form và submit
4. Kiểm tra Supabase Dashboard → Table Editor → `signups` tab
5. Dữ liệu mới phải hiển thị ngay lập tức

### Cho Form Đặt Hàng (orders)
1. Mở website, thêm sản phẩm vào giỏ hàng
2. Vào giỏ hàng → Thanh toán
3. Điền form thông tin giao hàng và submit
4. Kiểm tra Supabase Dashboard → Table Editor → `orders` tab
5. Dữ liệu đơn hàng mới phải hiển thị ngay lập tức
