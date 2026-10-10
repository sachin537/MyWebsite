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

setupNotifications();