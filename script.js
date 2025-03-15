import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDltUwIwNYmL59A4cy61dCz2UBJeG-Fc5w",
  authDomain: "sakuratodo-1f338.firebaseapp.com",
  databaseURL: "https://sakuratodo-1f338-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sakuratodo-1f338",
  storageBucket: "sakuratodo-1f338.appspot.com",
  messagingSenderId: "408069747406",
  appId: "1:408069747406:web:0cfe3a2ec19839c753169f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById("signupBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    window.location.href = "app.html";
  } catch (error) {
    document.getElementById("message").innerText = error.message;
  }
});

document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "app.html";
  } catch (error) {
    document.getElementById("message").innerText = error.message;
  }
});

onAuthStateChanged(auth, user => {
  if (user) {
    window.location.href = "app.html";
  }
});
