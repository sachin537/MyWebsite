const firebaseConfig = {
    apiKey: "AIzaSyCbTERawu2MU642VPb1kz7fPApOX8SOH6s",
    authDomain: "sachinvideocall.firebaseapp.com",
    projectId: "sachinvideocall",
    storageBucket: "sachinvideocall.firebasestorage.app",
    messagingSenderId: "737579626443",
    appId: "1:737579626443:web:5c1f9ae2e306074ca7104e",
    measurementId: "G-M12NK4XEBW"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

console.log("Firebase Messaging initialized");

async function setupNotifications() {
    try {
        const permission = await Notification.requestPermission();
        console.log("Notification permission:", permission);

        if (permission !== "granted") {
            console.log("Notification permission not granted.");
            return;
        }

        const registration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js"
        );

        console.log("Service Worker Registered:", registration);

        const token = await messaging.getToken({
            vapidKey: "BLJQ-XSNJs2lDg-DblHGbClleDHQVU5f0FE97uVzwKzktg9jO3oqi_G-bGWYhST3F2XzTUO2XW82cOOrH_l0sCY",
            serviceWorkerRegistration: registration
        });

        console.log("FCM Token:", token);

    } catch (error) {
        console.error("Firebase Setup Error:", error);
    }
}

setupNotifications(); // Sachin AI Chatbot Controls
const chatToggle = document.getElementById("chatbot-toggle");
const chatPanel = document.getElementById("chatbot-panel");
const chatClose = document.getElementById("chatbot-close");
const chatForm = document.getElementById("chatbot-form");
const chatInput = document.getElementById("chatbot-input");
const chatMessages = document.getElementById("chatbot-messages");
const chatStatus = document.getElementById("chatbot-status");
const chatSend = document.getElementById("chatbot-send");

let chatHistory = [];

function openSachinAI() {
    if (!chatPanel) return;

    chatPanel.hidden = false;
    chatPanel.classList.add("chatbot-fullscreen");

    if (chatToggle) {
        chatToggle.setAttribute("aria-expanded", "true");
    }

    chatInput?.focus();
}

function closeSachinAI() {
    if (!chatPanel) return;

    chatPanel.hidden = true;
    chatPanel.classList.remove("chatbot-fullscreen");

    if (chatToggle) {
        chatToggle.setAttribute("aria-expanded", "false");
    }
}

if (chatToggle) {
    chatToggle.addEventListener("click", openSachinAI);
}

if (chatClose) {
    chatClose.addEventListener("click", closeSachinAI);
}

function addChatMessage(text, className) {
    if (!chatMessages) return;

    const messageElement = document.createElement("div");
    messageElement.className = className;
    messageElement.textContent = text;

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

if (chatForm) {
    chatForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const message = chatInput?.value.trim();
        if (!message || !chatSend) return;

        addChatMessage(message, "user-message");
        chatInput.value = "";
        chatInput.disabled = true;
        chatSend.disabled = true;

        if (chatStatus) {
            chatStatus.textContent = "Sachin AI is thinking...";
        }

        try {
            const response = await fetch("/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message,
                    history: chatHistory
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.reply || `Request failed (${response.status})`
                );
            }

            if (typeof data.reply !== "string" || !data.reply.trim()) {
                throw new Error("AI returned an empty response.");
            }

            addChatMessage(data.reply, "bot-message");

            chatHistory.push(
                { role: "user", content: message },
                { role: "assistant", content: data.reply }
            );

            // Keep recent context bounded.
            if (chatHistory.length > 20) {
                chatHistory = chatHistory.slice(-20);
            }

            if (chatStatus) chatStatus.textContent = "";

        } catch (error) {
            addChatMessage(
                `AI error: ${error.message}`,
                "bot-message"
            );

            if (chatStatus) chatStatus.textContent = "";
            console.error("Sachin AI error:", error);

        } finally {
            chatInput.disabled = false;
            chatSend.disabled = false;
            chatInput.focus();
        }
    });
}

// Enter sends; Shift+Enter creates a new line.
if (chatInput) {
    chatInput.addEventListener("keydown", (event) => {
        if (
            event.key === "Enter" &&
            !event.shiftKey &&
            !event.isComposing
        ) {
            event.preventDefault();
            chatForm?.requestSubmit();
        }
    });
}

function addChatMessage(text, className) {
    if (!chatMessages) return;

    const messageElement = document.createElement("div");
    messageElement.className = className;
    messageElement.textContent = text;

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}