import smtplib
from email.message import EmailMessage
from typing import Dict
from app.core.config import settings
from dotenv import load_dotenv

load_dotenv()  # Load variables from .env

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
FRONTEND_VERIFY_URL = f"{settings.FRONTEND_URL}/isverified?token="  # Your React frontend route
PASSWORD_RESET_URL = f"{settings.FRONTEND_URL}/reset-password?token="

def _generate_email_html(
    subject: str,
    preheader_text: str,
    intro_text: str,
    button_text: str,
    action_link: str,
    closing_text: str,
    footer_links: Dict[str, str] = None
) -> str:
    """
    Generates a generic HTML email template with a banner and a styled button.
    """
    if footer_links is None:
        footer_links = {
            "Privacy Policy": f"{settings.FRONTEND_URL}/privacy",
            "Terms of Service": f"{settings.FRONTEND_URL}/terms"
        }

    footer_html = " | ".join([
        f'<a href="{url}" style="color: #6c757d; text-decoration: none;">{text}</a>'
        for text, url in footer_links.items()
    ])

    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{subject}</title>
        <style>
            body {{
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f7f6; /* Light gray background */
                color: #333333;
                -webkit-font-smoothing: antialiased;
            }}
            .container {{
                max-width: 600px;
                margin: 30px auto;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                overflow: hidden;
            }}
            .header {{
                background-color: #4f46e5; /* MeetingROI primary blue */
                padding: 25px 0;
                text-align: center;
                color: #ffffff;
            }}
            .header h1 {{
                margin: 0;
                font-size: 32px;
                font-weight: 700;
                letter-spacing: 1.5px;
            }}
            .content {{
                padding: 40px;
                text-align: center;
                line-height: 1.6;
            }}
            .content h2 {{
                color: #2c3e50;
                font-size: 24px;
                margin-bottom: 20px;
            }}
            .content p {{
                margin-bottom: 15px;
                font-size: 16px;
            }}
            .button-container {{
                margin: 30px 0;
            }}
            .button {{
                display: inline-block;
                padding: 15px 30px;
                background-color: #28a745; /* Green button color */
                color: #ffffff;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
                font-size: 18px;
                border: 2px solid #218838; /* Darker green border */
                transition: background-color 0.3s ease, border-color 0.3s ease;
            }}
            .button:hover {{
                background-color: #218838; /* Darker green on hover */
                border-color: #1e7e34;
            }}
            .footer {{
                background-color: #e9ecef; /* Lighter gray footer */
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #6c757d;
            }}
            .footer a {{
                color: #6c757d;
                text-decoration: none;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>MeetingROI</h1>
            </div>
            <div class="content">
                <h2>{subject}</h2>
                <p>Hello,</p>
                <p>{intro_text}</p>
                <div class="button-container">
                    <a href="{action_link}" class="button">{button_text}</a>
                </div>
                <p style="font-size:11px;">If the button above doesn't work, you can also copy and paste the following link into your web browser:</p>
                <p><a href="{action_link}" style="color: #4f46e5;font-size:11px; word-break: break-all;">{action_link}</a></p>
                <p>{closing_text}</p>
                <p>Best regards,<br>The MeetingROI Team</p>
            </div>
            <div class="footer">
                <p>&copy; {2025} MeetingROI. All rights reserved.</p>
                <p>{footer_html}</p>
            </div>
        </div>
    </body>
    </html>
    """
    return html_content
