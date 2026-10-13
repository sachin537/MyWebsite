from flask import Flask, render_template, redirect, request, jsonify
import requests
import os

app = Flask(__name__)

TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID")

OLLAMA_URL = "http://127.0.0.1:11434/api/chat"
OLLAMA_MODEL = "llama3.2:3b"


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/firebase-messaging-sw.js")
def firebase_messaging_sw():
    return app.send_static_file("firebase-messaging-sw.js")


@app.route("/video-call")
def video_call():
    message = "Someone wants to start a video call with you!"

    if TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID:
        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"

        try:
            requests.post(
                url,
                data={
                    "chat_id": TELEGRAM_CHAT_ID,
                    "text": message
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
        return jsonify({"reply": "Please keep your message under 2000 characters."}), 400

    payload = {
        "model": OLLAMA_MODEL,
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
        "stream": False
    }

    try:
        response = requests.post(
            OLLAMA_URL,
            json=payload,
            timeout=120
        )
        response.raise_for_status()
        result = response.json()
        reply = result.get("message", {}).get("content", "").strip()

        if not reply:
            return jsonify({"reply": "I couldn't generate a response. Please try again."}), 502

        return jsonify({"reply": reply})

    except requests.RequestException:
        app.logger.exception("Ollama request failed")
        return jsonify({
            "reply": (
                "I can't connect to the AI right now. "
                "Please make sure Ollama is running on the website host."
            )
        }), 503


if __name__ == "__main__":
    app.run(debug=True)