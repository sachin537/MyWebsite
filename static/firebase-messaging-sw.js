importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyCbTERawu2MU642VPb1kz7fPApOX8SOH6s",
    authDomain: "sachinvideocall.firebaseapp.com",
    projectId: "sachinvideocall",
    storageBucket: "sachinvideocall.firebasestorage.app",
    messagingSenderId: "737579626443",
    appId: "1:737579626443:web:5c1f9ae2e306074ca7104e",
    measurementId: "G-M12NK4XEBW"
});

const messaging = firebase.messaging();