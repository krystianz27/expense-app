import { setDoc, doc } from "firebase/firestore";
import { db, messaging } from "./config"; // Ścieżka do pliku z konfiguracją Firebase
import { getToken, onMessage } from "firebase/messaging";

// Funkcja zapytająca o uprawnienia użytkownika do powiadomień
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Permission granted for notifications");
    } else {
      console.log("Permission denied for notifications");
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
  }
};

export const saveUserToken = async (userId: string, token: string) => {
  try {
    const userRef = doc(db, "user_tokens", userId);
    await setDoc(userRef, { token }, { merge: true }); // Dodaj { merge: true }, aby zaktualizować istniejący dokument
    console.log("Token saved/updated for user:", userId);
  } catch (error) {
    console.error("Error saving token:", error);
  }
};

// Funkcja uzyskująca token FCM
export const getUserToken = async (userId: string) => {
  try {
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY, // Twój VAPID Key
    });
    if (token) {
      console.log("FCM Token:", token);
      // Zapisz token w Firestore
      await saveUserToken(userId, token);
    } else {
      console.log("No registration token available");
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
  }
};

// Funkcja nasłuchująca na powiadomienia w aplikacji
export const listenForMessages = () => {
  onMessage(messaging, (payload) => {
    console.log("Message received. ", payload);

    const { notification } = payload;
    if (notification) {
      // Sprawdzenie, czy title istnieje, i przypisanie wartości domyślnej, jeśli jest undefined
      const title = notification.title || "Default Title"; // Default value if title is undefined
      const body = notification.body || "No message body available"; // Default value if body is undefined

      new Notification(title, {
        body: body,
      });
    }
  });
};
