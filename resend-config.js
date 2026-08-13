// Frontend-only wrapper for email flows.
// The actual Resend API key is kept server-side in Vercel environment variables.
const RESEND_FROM_EMAIL = 'onboarding@resend.dev';
const RESEND_TO_EMAIL = 'tamdang.digital@gmail.com';

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

class ResendEmailService {
  static async sendEmail(to, subject, html) {
    const response = await fetch('/api/send-order-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to,
        subject,
        html,
        recipient_email: RESEND_TO_EMAIL,
        from: RESEND_FROM_EMAIL,
        is_generic_email: true
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error('❌ Email service error:', data);
      return { data: null, error: data };
    }

    return { data, error: null };
  }

  static getOrderConfirmationTemplate(order) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #c36b18, #a0520a); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; }
          .order-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🙏 Xác nhận đơn hàng</h2>
          </div>
          <div class="content">
            <p>Kính gửi <strong>${escapeHtml(order.fullname)}</strong>,</p>
            <p>Cảm ơn bạn đã đặt hàng tại Mật Tông Việt! Chúng tôi đã nhận được đơn hàng của bạn.</p>
            <div class="order-details">
              <h3>Chi tiết đơn hàng:</h3>
              <p><strong>Mã đơn:</strong> ${escapeHtml(order.order_code)}</p>
              <p><strong>Tên:</strong> ${escapeHtml(order.fullname)}</p>
              <p><strong>Email:</strong> ${escapeHtml(order.email)}</p>
              <p><strong>Số điện thoại:</strong> ${escapeHtml(order.phone)}</p>
              <p><strong>Địa chỉ:</strong> ${escapeHtml(order.address)}, ${escapeHtml(order.city)}</p>
              ${order.district ? `<p><strong>Quận/Huyện:</strong> ${escapeHtml(order.district)}</p>` : ''}
              ${order.note ? `<p><strong>Ghi chú:</strong> ${escapeHtml(order.note)}</p>` : ''}
              <p><strong>Phương thức thanh toán:</strong> ${escapeHtml(order.payment_method)}</p>
            </div>
            <p>Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ.</p>
            <p>Hotline: 0888 633 133</p>
          </div>
          <div class="footer">
            <p>© 2026 Mật Tông Việt</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  static getDownloadConfirmationTemplate(download) {
    return `
      <div>
        <h2>📥 Tải tài liệu của bạn</h2>
        <p>Kính gửi <strong>${escapeHtml(download.name)}</strong>,</p>
        <p>Tài liệu: <strong>${escapeHtml(download.document_name)}</strong></p>
      </div>
    `;
  }

  static getContactConfirmationTemplate(contact) {
    return `
      <div>
        <h2>✉️ Xác nhận liên hệ</h2>
        <p>Kính gửi <strong>${escapeHtml(contact.name)}</strong>,</p>
        <p>Chúng tôi đã nhận được tin nhắn của bạn.</p>
      </div>
    `;
  }

  static getNewsletterWelcomeTemplate(email) {
    return `
      <div>
        <h2>🙏 Chào mừng bạn</h2>
        <p>Cảm ơn bạn đã đăng ký nhận thông tin.</p>
      </div>
    `;
  }
}

window.ResendEmailService = ResendEmailService;
