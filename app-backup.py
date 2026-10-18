from flask import Flask, render_template, redirect, request, jsonify
import requests
import os

app = Flask(__name__)

TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID")

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "openai/gpt-oss-20b"


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/firebase-messaging-sw.js")
def firebase_messaging_sw():
    return app.send_static_file("firebase-messaging-sw.js")


@app.route("/video-call")
def video_call():
    if TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID:
        try:
            url = (
                f"https://api.telegram.org/"
                f"bot{TELEGRAM_BOT_TOKEN}/sendMessage"
            )
            requests.post(
                url,
                data={
                    "chat_id": TELEGRAM_CHAT_ID,
                    "text": "Someone wants to start a video call with you!"
                },
                timeout=5
            )
        except requests.RequestException:
            app.logger.exception("Telegram notification failed")

    return redirect("https://meet.jit.si/SachinVideoCall")


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    user_message = data.get("message", "")

    if not isinstance(user_message, str) or not user_message.strip():
        return jsonify({"reply": "Please type a message first."}), 400

    if len(user_message) > 2000:
        return jsonify({
            "reply": "Please keep your message under 2000 characters."
        }), 400

    if not GROQ_API_KEY:
        return jsonify({
            "reply": "AI setup incomplete. Please contact the website owner."
        }), 503

    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are Sachin AI, a friendly assistant on Sachin's "
                    "personal portfolio website. Answer clearly and helpfully. "
                    "Be honest that you are an AI assistant."
                )
            },
            {
                "role": "user",
                "content": user_message.strip()
            }
        ],
        "temperature": 0.7,
        "max_tokens": 700,
        "stream": False
    }

    try:
        response = requests.post(
            GROQ_API_URL,
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json=payload,
            timeout=60
        )

        if not response.ok:
            app.logger.error(
                "Groq API error: status=%s body=%s",
                response.status_code,
                response.text[:1000]
            )
            return jsonify({
                "reply": "AI service is temporarily unavailable. Please try again."
            }), 502

        result = response.json()
        reply = result["choices"][0]["message"]["content"].strip()

        return jsonify({"reply": reply})

    except (requests.RequestException, ValueError, KeyError, IndexError):
        app.logger.exception("Groq chatbot request failed")
        return jsonify({
            "reply": "AI se connection nahi ho pa raha. Please try again."
        }), 502


if __name__ == "__main__":
    app.run(debug=True)