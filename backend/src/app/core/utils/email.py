from pathlib import Path
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr
from typing import Optional
import logging

from jinja2 import Template

from ..config import settings
from .queue import redis_queue

logger = logging.getLogger(__name__)


async def render_template(template_name: str, **kwargs) -> str:
    """Render template HTML với các biến được truyền vào."""
    try:
        template_path = Path(__file__).parent.parent.parent / "email-templates" / "build" / template_name
        
        with open(template_path, "r", encoding="utf-8") as file:
            template = Template(file.read())
            return template.render(**kwargs)
    except Exception as e:
        logger.error(f"Error rendering template {template_name}: {str(e)}")
        raise


async def send_email(
    email_to: str,
    subject: str,
    template_name: Optional[str] = None,
    template_vars: Optional[dict] = None,
    text_content: Optional[str] = None,
) -> bool:
    """
    Gửi email sử dụng SMTP.
    
    Args:
        email_to: Email người nhận
        subject: Tiêu đề email
        template_name: Tên file template (nếu sử dụng HTML template)
        template_vars: Các biến để render template
        text_content: Nội dung text (nếu không sử dụng template)
    """
    if not settings.emails_enabled:
        logger.warning("Email service is not configured")
        return False

    try:
        message = MIMEMultipart("alternative")
        message["From"] = formataddr((settings.EMAILS_FROM_NAME, settings.EMAILS_FROM_EMAIL))
        message["To"] = email_to
        message["Subject"] = subject

        # Add text content
        if text_content:
            message.attach(MIMEText(text_content, "plain"))

        # Add HTML content from template
        if template_name and template_vars:
            html_content = await render_template(template_name, **template_vars)
            message.attach(MIMEText(html_content, "html"))

        # Connect to SMTP server
        server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
        if settings.SMTP_SSL:
            server.starttls()
        
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.sendmail(settings.EMAILS_FROM_EMAIL, email_to, message.as_string())
        server.quit()

        logger.info(f"Email sent successfully to {email_to}")
        return True

    except Exception as e:
        logger.error(f"Failed to send email to {email_to}: {str(e)}")
        return False


async def send_verification_email(email: str, name: str, verification_code: str) -> bool:
    """
    Gửi email xác thực tài khoản.
    
    Args:
        email: Email người nhận
        name: Tên người nhận
        verification_code: Mã xác thực
    """
    template_vars = {
        "name": name,
        "app_name": settings.APP_NAME,
        "activate_url": f"{settings.FRONTEND_LINK_ACCOUNT_ACTIVATION}?token={verification_code}&email={email}"
    }

    # Thêm task vào queue
    return await redis_queue.enqueue(
        "send_email",
        email_to=email,
        subject=f"Xác thực tài khoản {settings.APP_NAME}",
        template_name="verify_email.html",
        template_vars=template_vars
    ) 