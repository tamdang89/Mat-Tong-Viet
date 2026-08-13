export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Use POST.'
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

    const {
      recipient_email = 'tamdang.digital@gmail.com',
      order_code,
      order_id,
      fullname,
      email,
      phone,
      address,
      city,
      district = '',
      note = '',
      payment_method = 'cod',
      total_amount = 0,
      items_json,
      subject,
      html,
      to,
      from
    } = body;

    const resendApiKey = process.env.RESEND_API_KEY;
    const resendFromEmail = process.env.RESEND_FROM_EMAIL || from || 'onboarding@resend.dev';

    if (!resendApiKey) {
      return res.status(500).json({
        success: false,
        message: 'Missing RESEND_API_KEY in Vercel environment variables.'
      });
    }

    const parsedItems = (() => {
      if (!items_json) return [];
      try {
        const parsed = JSON.parse(items_json);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    })();

    const fileSafe = (value) => (value == null ? '' : String(value));
    const displayCode = fileSafe(order_code || order_id || 'N/A');
    const displayName = fileSafe(fullname || 'Khách hàng');
    const displayPhone = fileSafe(phone || 'Chưa cập nhật');
    const displayAddress = fileSafe(address || 'Chưa cập nhật');
    const displayCity = fileSafe(city || '');
    const displayDistrict = fileSafe(district || '');
    const displayNote = fileSafe(note || '');
    const displayPayment = fileSafe(payment_method || 'cod');
    const displayTotal = Number(total_amount || 0);

    const formattedItems = parsedItems.length > 0
      ? parsedItems.map((item) => {
          const name = item?.name || 'Sản phẩm';
          const quantity = item?.quantity || item?.qty || 1;
          const price = Number(item?.price || item?.finalPrice || 0);
          return `
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${name}</td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #eee; text-align: center;">${quantity}</td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #eee; text-align: right;">${price.toLocaleString('vi-VN')}đ</td>
            </tr>
          `;
        }).join('')
      : `
        <tr>
          <td colspan="3" style="padding: 12px; text-align: center; color: #666;">Không có dữ liệu sản phẩm chi tiết.</td>
        </tr>
      `;

    const emailHtml = html || `
      <!DOCTYPE html>
      <html lang="vi">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Đơn hàng mới</title>
        </head>
        <body style="margin:0; padding:0; background:#f5f5f5; font-family:Arial, sans-serif; color:#1f2937;">
          <div style="max-width:700px; margin:24px auto; background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e5e7eb;">
            <div style="background:linear-gradient(135deg, #c26a18, #a04e0d); color:#fff; padding:24px 28px;">
              <h2 style="margin:0; font-size:28px;">📦 Đơn hàng mới</h2>
            </div>
            <div style="padding:28px;">
              <p style="margin:0 0 18px; font-size:16px;">Xin chào,</p>
              <p style="margin:0 0 18px; line-height:1.6;">
                Có một đơn hàng mới được đặt trên website Mật Tông Việt.
              </p>

              <div style="background:#fff7ed; border:1px solid #fed7aa; border-radius:10px; padding:18px; margin: 0 0 20px;">
                <p style="margin:0 0 8px;"><strong>Mã đơn hàng:</strong> ${displayCode}</p>
                <p style="margin:0 0 8px;"><strong>Khách hàng:</strong> ${displayName}</p>
                <p style="margin:0 0 8px;"><strong>Số điện thoại:</strong> ${displayPhone}</p>
                <p style="margin:0 0 8px;"><strong>Email:</strong> ${email || 'Chưa cập nhật'}</p>
                <p style="margin:0 0 8px;"><strong>Địa chỉ:</strong> ${displayAddress}${displayCity ? ', ' + displayCity : ''}${displayDistrict ? ', ' + displayDistrict : ''}</p>
                <p style="margin:0 0 8px;"><strong>Phương thức:</strong> ${displayPayment}</p>
                <p style="margin:0 0 8px;"><strong>Tổng tiền:</strong> ${displayTotal.toLocaleString('vi-VN')}đ</p>
                ${displayNote ? `<p style="margin:0;"><strong>Ghi chú:</strong> ${displayNote}</p>` : ''}
              </div>

              <h3 style="margin:0 0 12px; font-size:18px;">Sản phẩm đặt mua</h3>
              <table style="width:100%; border-collapse:collapse; background:#fff; border:1px solid #e5e7eb; border-radius:8px; overflow:hidden;">
                <thead>
                  <tr style="background:#f3f4f6;">
                    <th style="padding:10px 12px; text-align:left;">Sản phẩm</th>
                    <th style="padding:10px 12px; text-align:center;">SL</th>
                    <th style="padding:10px 12px; text-align:right;">Giá</th>
                  </tr>
                </thead>
                <tbody>
                  ${formattedItems}
                </tbody>
              </table>

              <p style="margin:20px 0 0; font-size:14px; color:#4b5563;">
                Email này được gửi tự động khi có đơn hàng mới được lưu vào bảng orders trên Supabase.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailTo = to || recipient_email;
    const emailSubject = subject || `📦 Đơn hàng mới #${displayCode} - Mật Tông Việt`;
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `${process.env.RESEND_FROM_NAME || 'Mật Tông Việt'} <${resendFromEmail}>`,
        to: [emailTo],
        subject: emailSubject,
        html: emailHtml
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: 'Failed to send email via Resend.',
        error: data
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Order email sent successfully.',
      data
    });
  } catch (error) {
    console.error('Order email API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while sending order email.',
      error: error.message || error
    });
  }
}
