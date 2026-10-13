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

if (chatToggle && chatPanel) {
    chatToggle.addEventListener("click", () => {
        chatPanel.hidden = false;
        chatToggle.setAttribute("aria-expanded", "true");
        chatInput?.focus();
    });
}

if (chatClose && chatPanel && chatToggle) {
    chatClose.addEventListener("click", () => {
        chatPanel.hidden = true;
        chatToggle.setAttribute("aria-expanded", "false");
    });
}

if (chatForm) {
    chatForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const message = chatInput.value.trim();

        if (!message) return;

        addChatMessage(message, "user-message");
        chatInput.value = "";
        chatStatus.textContent = "Sachin AI is thinking...";
        chatSend.disabled = true;

        try {
            const response = await fetch("/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.reply || "Request failed.");
            }

            addChatMessage(data.reply, "bot-message");
            chatStatus.textContent = "";

        } catch (error) {
            addChatMessage(
                "AI se connection nahi ho pa raha. Check karo ki Flask aur Ollama chal rahe hain.",
                "bot-message"
            );

            chatStatus.textContent = "";
            console.error("Chatbot error:", error);

        } finally {
            chatSend.disabled = false;
            chatInput.focus();
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