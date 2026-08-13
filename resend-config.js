// Resend Email Service Configuration
// API Key: re_ctAiKKk8_ENVmMkRQFrzwPWb8SHJL26Dy

const RESEND_API_KEY = 're_ctAiKKk8_ENVmMkRQFrzwPWb8SHJL26Dy';
const RESEND_API_URL = 'https://api.resend.com/emails';
const FROM_EMAIL = 'noreply@resend.dev'; // Using Resend's default domain for testing
const FROM_NAME = 'Mật Tông Việt';

/**
 * Escape HTML characters
 */
function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Resend Email Service
 * Gửi email confirmation thông qua Resend API
 */
class ResendEmailService {
  /**
   * Gửi email
   * @param {string} to - Email người nhận
   * @param {string} subject - Tiêu đề email
   * @param {string} html - Nội dung HTML email
   * @returns {Promise} {data, error}
   */
  static async sendEmail(to, subject, html) {
    try {
      console.log(`📧 Sending email to: ${to}`);
      const response = await fetch(RESEND_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to: to,
          subject: subject,
          html: html
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Resend error:', data);
        return { data: null, error: data };
      }

      console.log('✅ Email sent successfully:', data);
      return { data: data, error: null };
    } catch (err) {
      console.error('❌ Email send error:', err);
      return { data: null, error: err };
    }
  }

  /**
   * Email template - Order Confirmation
   */
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
          .btn { display: inline-block; background: #c36b18; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
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
              <p><strong>Thành phố:</strong> ${escapeHtml(order.city)}</p>
              ${order.district ? `<p><strong>Quận/Huyện:</strong> ${escapeHtml(order.district)}</p>` : ''}
              ${order.note ? `<p><strong>Ghi chú:</strong> ${escapeHtml(order.note)}</p>` : ''}
              <p><strong>Phương thức thanh toán:</strong> ${escapeHtml(order.payment_method)}</p>
            </div>
            
            <p>Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ để xác nhận chi tiết đơn hàng và thời gian giao hàng.</p>
            
            <p><strong>Hotline hỗ trợ:</strong> 0888 633 133 (8h - 21h hàng ngày)</p>
            
            <p>Cảm ơn và chúc bạn một ngày tốt lành! 🙏</p>
          </div>
          <div class="footer">
            <p>© 2026 Mật Tông Việt - CH Văn Hoá Phẩm Phật Giáo TTH</p>
            <p>210 Hà Huy Tập, Tp. Đà Nẵng | Email: TTHGroup@gmail.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Email template - Download Confirmation
   */
  static getDownloadConfirmationTemplate(download) {
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
          .download-info { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>📥 Tải tài liệu của bạn</h2>
          </div>
          <div class="content">
            <p>Kính gửi <strong>${escapeHtml(download.name)}</strong>,</p>
            
            <p>Cảm ơn bạn đã quan tâm đến tài liệu của Mật Tông Việt!</p>
            
            <div class="download-info">
              <h3>Tài liệu:</h3>
              <p><strong>${escapeHtml(download.document_name)}</strong></p>
              <p>Liên kết tải xuống sẽ được gửi đến bạn sớm nhất có thể.</p>
            </div>
            
            <p>Nếu bạn không nhận được tài liệu trong vòng 1 giờ, vui lòng liên hệ:</p>
            <p><strong>Email:</strong> TTHGroup@gmail.com<br><strong>Hotline:</strong> 0888 633 133</p>
            
            <p>Cảm ơn sự tin tưởng của bạn! 🙏</p>
          </div>
          <div class="footer">
            <p>© 2026 Mật Tông Việt - CH Văn Hoá Phẩm Phật Giáo TTH</p>
            <p>210 Hà Huy Tập, Tp. Đà Nẵng | Email: TTHGroup@gmail.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Email template - Contact Confirmation
   */
  static getContactConfirmationTemplate(contact) {
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
          .contact-info { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>✉️ Xác nhận liên hệ</h2>
          </div>
          <div class="content">
            <p>Kính gửi <strong>${escapeHtml(contact.name)}</strong>,</p>
            
            <p>Cảm ơn bạn đã liên hệ với Mật Tông Việt!</p>
            
            <div class="contact-info">
              <h3>Thông tin của bạn:</h3>
              <p><strong>Họ và tên:</strong> ${escapeHtml(contact.name)}</p>
              <p><strong>Email:</strong> ${escapeHtml(contact.email)}</p>
              <p><strong>Số điện thoại:</strong> ${escapeHtml(contact.phone)}</p>
              <p><strong>Chủ đề:</strong> ${escapeHtml(contact.subject || 'Chưa chỉ định')}</p>
            </div>
            
            <p>Chúng tôi đã nhận được lời nhắn của bạn và sẽ phản hồi trong vòng 24 giờ.</p>
            
            <p><strong>Hotline hỗ trợ:</strong> 0888 633 133 (8h - 21h hàng ngày)</p>
            
            <p>Trân trọng cảm ơn! 🙏</p>
          </div>
          <div class="footer">
            <p>© 2026 Mật Tông Việt - CH Văn Hoá Phẩm Phật Giáo TTH</p>
            <p>210 Hà Huy Tập, Tp. Đà Nẵng | Email: TTHGroup@gmail.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Email template - Newsletter Confirmation
   */
  static getNewsletterWelcomeTemplate(email) {
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
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🙏 Chào mừng bạn</h2>
          </div>
          <div class="content">
            <p>Cảm ơn bạn đã đăng ký nhận thông tin từ Mật Tông Việt!</p>
            
            <p>Từ giờ trở đi, bạn sẽ nhận được:</p>
            <ul>
              <li>📚 Bài viết về tu học Phật giáo</li>
              <li>🎁 Khuyến mãi độc quyền cho thành viên</li>
              <li>📰 Tin tức hoạt động của chúng tôi</li>
              <li>💝 Tặng kèm hướng dẫn tu học miễn phí</li>
            </ul>
            
            <p>Nếu bạn muốn hủy đăng ký, bạn có thể làm điều đó bất cứ lúc nào qua email này.</p>
            
            <p>Chúc bạn có một hành trình tu học tốt lành! 🙏</p>
          </div>
          <div class="footer">
            <p>© 2026 Mật Tông Việt - CH Văn Hoá Phẩm Phật Giáo TTH</p>
            <p>210 Hà Huy Tập, Tp. Đà Nẵng | Email: TTHGroup@gmail.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

// Make available globally
window.ResendEmailService = ResendEmailService;
