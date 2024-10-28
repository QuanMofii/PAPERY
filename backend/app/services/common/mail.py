from pathlib import Path
import datetime

import smtplib
from jinja2 import Template

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from email.utils import formataddr

from core.config import settings
from core.celery import celery

async def render_email_template(template_name: str, **kwargs) -> str:
    project_root = Path(__file__).resolve().parent.parent.parent
    template_path = project_root / "email-templates" / "build" / template_name
    
    with open(template_path, "r", encoding="utf-8") as file:
        template_content = file.read()
        template = Template(template_content)
        html_content = template.render(**kwargs,
                                       app_name=settings.APP_NAME,
                                       activate_url=f"{settings.FRONTEND_LINK_LOGIN}/auth/account-verify?token={kwargs['verification_code']}&email={kwargs['email']}")
    
    print("Template content:", html_content)
    print("Kwargs:", kwargs)
    
    return html_content

# @celery.task(bind=True)
async def send_email(
    *,
    email_to: str,
    subject: str = "",
    text_content: str = "",
    html_content: str = None,
    attachments: list[str] = []
) -> str:

    if not settings.emails_enabled:
        return "Email settings not enabled."

    try:
        message = MIMEMultipart("alternative") 
        message['From'] = formataddr((settings.EMAILS_FROM_NAME, settings.EMAILS_FROM_EMAIL))
        message['To'] = email_to
        message['Subject'] = subject
        message['Date'] = datetime.datetime.now().strftime("%a, %d %b %Y %H:%M:%S %z")
        if text_content:
            part1 = MIMEText(text_content, "plain") 
            message.attach(part1 )
        if html_content:
            part2 = MIMEText(html_content, "html") 
            message.attach(part2)

        for attachment in attachments:
            part = MIMEBase('application', "octet-stream")
            try:
                with open(attachment, "rb") as file:
                    part.set_payload(file.read())
                encoders.encode_base64(part)
                part.add_header('Content-Disposition', f'attachment; filename="{Path(attachment).name}"')
                message.attach(part)
            except Exception as e:
                # return f"Failed to attach file {attachment}: {e}"
                return False

        server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
        if settings.SMTP_SSL:
            server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.sendmail(settings.EMAILS_FROM_EMAIL, email_to, message.as_string())
        server.quit()

        # return f"Email sent successfully to {email_to}"
        return True
    except smtplib.SMTPException as e:
        return False
