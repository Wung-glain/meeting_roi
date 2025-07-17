import smtplib
from email.message import EmailMessage
from typing import Dict
from app.core.config import settings
from dotenv import load_dotenv
from app.lib.generate_email_html import _generate_email_html

load_dotenv()  # Load variables from .env

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
FRONTEND_VERIFY_URL = f"{settings.FRONTEND_URL}/isverified?token="  # Your React frontend route
PASSWORD_RESET_URL = f"{settings.FRONTEND_URL}/reset-password?token="


def send_verification_email(to_email: str, token: str):
    """
    Sends an email verification link to the user.
    """
    msg = EmailMessage()
    msg["Subject"] = "Verify Your MeetingROI Account"
    msg["From"] = "norrepl@mycompany.com"
    msg["To"] = to_email

    verify_link = FRONTEND_VERIFY_URL + token

    html_body = _generate_email_html(
        subject="Email Verification Required",
        preheader_text="Verify your email to activate your MeetingROI account.",
        intro_text="Thank you for registering with MeetingROI! To activate your account and start optimizing your meetings, please verify your email address by clicking the button below:",
        button_text="Verify My Email",
        action_link=verify_link,
        closing_text="This link will expire in 24 hours for security reasons. If you did not create an account with MeetingROI, please ignore this email."
    )
    msg.add_alternative(html_body, subtype="html")

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()  # Secure the connection
            server.login(settings.SMTP_USER, settings.SMTP_PASS)
            server.send_message(msg)
            print(f"Verification email sent to {to_email}!")
    except Exception as e:
        print(f"Error sending verification email to {to_email}:", e)
        raise # Re-raise the exception for upstream error handling

def send_reset_pass(to_email: str, token: str):
    """
    Sends a password reset link to the user.
    """
    msg = EmailMessage()
    msg["Subject"] = "Reset Your MeetingROI Password"
    msg["From"] = "norrepl@mycompany.com"
    msg["To"] = to_email

    reset_link = PASSWORD_RESET_URL + token

    html_body = _generate_email_html(
        subject="Password Reset Request",
        preheader_text="Reset your MeetingROI password.",
        intro_text="We received a request to reset your password. Please click the button below to set a new password:",
        button_text="Reset My Password",
        action_link=reset_link,
        closing_text="This link will expire in 1 hour for security reasons. If you did not request a password reset, please ignore this email."
    )
    msg.add_alternative(html_body, subtype="html")

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()  # Secure the connection
            server.login(settings.SMTP_USER, settings.SMTP_PASS)
            server.send_message(msg)
            print(f"Password reset email sent to {to_email}!")
    except Exception as e:
        print(f"Error sending password reset email to {to_email}:", e)
        raise # Re-raise the exception for upstream error handling