# Security Hardening Checklist

## Mục tiêu
Dự án này là website tĩnh HTML/CSS/JS, nên mức bảo mật phù hợp cần tập trung vào:
- frontend hardening
- headers bảo mật
- form validation
- hosting và deploy hygiene
- backup và monitoring

## 1. Production hosting hardening
- Dùng HTTPS bắt buộc, không cho phép HTTP.
- Bật HSTS cho production domain.
- Chỉ deploy qua môi trường được kiểm soát, không upload bằng tay khỏi GitHub/CI/CD.
- Tắt directory listing, không để thư mục nhạy cảm public.
- Không để file `.env`, `.git`, backup, logs, SQL dump, key files nằm trong thư mục web public.
- Dùng WAF/CDN hoặc hosting có layer bảo vệ như Cloudflare, Netlify, Azure Static Web Apps.

## 2. Security headers bắt buộc
Ưu tiên các header sau trên mọi response:
- Content-Security-Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: geolocation=(), camera=(), microphone=()
- Strict-Transport-Security: max-age=31536000; includeSubDomains

## 3. Form and input hardening
- Không dùng `innerHTML` với dữ liệu người dùng.
- Luôn sanitize text trước khi lưu hoặc render.
- Validate `name`, `email`, `phone`, `message` ở frontend và backend nếu có.
- Chặn payload quá dài, ký tự đặc biệt không cần thiết và định dạng không hợp lệ.
- Giới hạn rate limit cho form submit nếu có API/backend.

## 4. Secrets and source hygiene
- Không commit secret, API key, password, token.
- Không lưu dữ liệu nhạy cảm trong localStorage nếu không thật sự cần.
- Thêm `.gitignore` để loại file nhạy cảm trước khi push.
- Cần rotate key nếu đã từng rơi vào repo hoặc logs.

## 5. Deployment and audit
- Mỗi release phải có changelog và review security checklist.
- Backup định kỳ source và dữ liệu generated.
- Đặt alert cho lỗi 4xx/5xx, downtime, thay đổi config.
- Có rollback plan nếu release lỗi hoặc bị tấn công.

## 6. Minimum security gate trước khi production
- HTTPS active
- Security headers active
- CSP không chặn ứng dụng chính
- Form validation test pass
- Không có file nhạy cảm trong public directory
- Có backup và monitoring
- Có incident response sơ bộ

## 7. Recommended next steps
1. Host trên nền tảng hỗ trợ HTTPS và WAF.
2. Thêm header bảo mật ở hosting layer nếu dùng Netlify/Vercel/Azure.
3. Tích hợp monitoring và email alert cho downtime.
4. Chuyển form submit sang backend có rate limit nếu cần xử lý thực tế.
5. Mở rộng RBAC và auth nếu có admin area trong tương lai.

## 8. OWASP mapping
- A01 Access control: giữ domain/public files đúng phạm vi.
- A03 Injection: sanitize + textContent.
- A05 Misconfiguration: headers, secret hygiene, hosting hardening.
- A09 Logging and monitoring: alert/log và backup.

## 9. Final production deployment audit checklist
Sử dụng checklist này trước khi đưa site lên production hoặc nâng cấp hosting:

### Deployment readiness
- [ ] Domain đã bật HTTPS và redirect HTTP -> HTTPS.
- [ ] HSTS đang active cho production domain.
- [ ] Netlify/Azure/hosting config đã áp dụng security headers đúng.
- [ ] CSP không chặn script, style, hình ảnh hoặc form action chính của site.
- [ ] Không còn file nhạy cảm như `.env`, `.pem`, `.key`, log, dump, secret trong public folder.
- [ ] Robots.txt không cho phép crawl nhạy cảm hoặc nội dung không cần public.

### Application checks
- [ ] Mỗi trang static đều có `meta` headers bảo mật cần thiết.
- [ ] Form validation hoạt động với tên, email, số điện thoại và lời nhắn hợp lệ.
- [ ] Không có `innerHTML` với dữ liệu người dùng.
- [ ] Các link nội bộ không đi sai path khi deploy trên hosting real domain.
- [ ] Page title và nội dung bilingual hiển thị đúng mode đang chọn.

### Monitoring and rollback
- [ ] Có alert cho downtime hoặc lỗi 4xx/5xx nếu hosting cho phép.
- [ ] Có snapshot / backup source khi release mới.
- [ ] Có rollback plan nếu deploy lỗi hoặc CSP chặn chức năng chính.
- [ ] Có incident response nguyên tắc: xác minh, khôi phục, kiểm tra logs, notify owner.

### Pre-launch signoff
- [ ] HTTPS test pass trên production URL.
- [ ] Header check pass (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy).
- [ ] Form test pass trên trang Contact/Download/Signup.
- [ ] No secret leaked in git history, artifacts, or hosting logs.
- [ ] Production release reviewed by owner before publishing.

## 10. Recommended next operational step
Nếu muốn tiếp tục trong thực tế, bước tiếp theo nên là:
1. publish lên hosting thật (Netlify / Azure Static Web Apps / Cloudflare Pages)
2. test HTTPS và response headers trên production URL
3. bật monitoring + uptime alert
4. chuẩn bị incident response template cho site static
5. nếu sau này có admin area, chuyển form submit sang backend có rate limiting và validation server-side
