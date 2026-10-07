from flask import Flask, render_template, request
import smtplib
import os
from email.message import EmailMessage

app = Flask(__name__)

app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USERNAME"] = "sachinsurname9@gmail.com"
app.config["MAIL_PASSWORD"] = os.environ.get("MAIL_PASSWORD")


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/contact", methods=["POST"])
def contact():
    name = request.form["name"]
    email = request.form["email"]
    message = request.form["message"]

    msg = EmailMessage()
    msg["Subject"] = "New Contact Form Message"
    msg["From"] = app.config["MAIL_USERNAME"]
    msg["To"] = app.config["MAIL_USERNAME"]

    msg.set_content(f"""
Name: {name}
Email: {email}

Message:
{message}
""")

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(
            app.config["MAIL_USERNAME"],
            app.config["MAIL_PASSWORD"]
        )
        server.send_message(msg)

    return "Thank you! Your message has been received."


if __name__ == "__main__":
    app.run(debug=True)