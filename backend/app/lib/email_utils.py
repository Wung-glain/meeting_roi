import smtplib
from email.message import EmailMessage
from app.core.config import settings
from dotenv import load_dotenv

load_dotenv()  # Load variables from .env

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
FRONTEND_VERIFY_URL = f"{settings.BACKEND_URL}/auth/verify?token="  # Your React frontend route
PASSWORD_RESET_URL = f"{settings.FRONTEND_URL}/reset-password?token="

def send_verification_email(to_email: str, token: str):
    msg = EmailMessage()
    msg["Subject"] = "Verify your email"
    msg["From"] = "no-reply@yourapp.com"
    msg["To"] = to_email

    verify_link = FRONTEND_VERIFY_URL + token
    msg.set_content(f"Hello,\n\nClick the link below to verify your email:\n\n{verify_link}\n\nThank you.")

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()  # Secure the connection
            server.login(settings.SMTP_USER, settings.SMTP_PASS)
            server.send_message(msg)
            print("Verification email sent!")
    except Exception as e:
        print(" Error sending email:", e)
        raise

def send_reset_pass(to_email: str, token: str):
    msg = EmailMessage()
    msg["Subject"] = "Reset Your Password"
    msg["From"] = "no-reply@yourapp.com"
    msg["To"] = to_email

    verify_link = PASSWORD_RESET_URL + token
    msg.set_content(f"Hello,\n\nClick the link below to reset your password:\n\n{verify_link}\n\nThank you.")

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()  # Secure the connection
            server.login(settings.SMTP_USER, settings.SMTP_PASS)
            server.send_message(msg)
            print("Verification email sent!")
    except Exception as e:
        print(" Error sending email:", e)
        raise
