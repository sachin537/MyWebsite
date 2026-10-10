from flask import Flask, render_template, redirect
import requests
import os

app = Flask(__name__)

TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID")


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/firebase-messaging-sw.js")
def firebase_messaging_sw():
    return app.send_static_file("firebase-messaging-sw.js")


@app.route("/video-call")
def video_call():
    message = "📹 Someone wants to start a video call with you!"

    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"

    requests.post(
        url,
        data={
            "chat_id": TELEGRAM_CHAT_ID,
            "text": message
        }
    )

    return redirect("https://meet.jit.si/SachinVideoCall")


if __name__ == "__main__":
    app.run(debug=True)