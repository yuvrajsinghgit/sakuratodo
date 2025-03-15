import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

import {
  getDatabase,
  ref,
  set,
  get,
  child,
  onValue
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDltUwIwNYmL59A4cy61dCz2UBJeG-Fc5w",
  authDomain: "sakuratodo-1f338.firebaseapp.com",
  databaseURL: "https://sakuratodo-1f338-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sakuratodo-1f338",
  storageBucket: "sakuratodo-1f338.firebasestorage.app",
  messagingSenderId: "408069747406",
  appId: "1:408069747406:web:0cfe3a2ec19839c753169f"
};

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// DOM
const authScreen = document.getElementById("auth-screen");
const mainApp = document.getElementById("app");
const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const switchToLogin = document.getElementById("switchToLogin");
const logoutBtn = document.getElementById("logoutBtn");

const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

let currentUserUID = null;

// 🔐 Auth UI Events
switchToLogin.addEventListener("click", () => {
  signupBtn.style.display = "none";
  loginBtn.style.display = "inline-block";
});

signupBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  try {
    await createUserWithEmailAndPassword(auth, email, pass);
  } catch (err) {
    alert(err.message);
  }
});

loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  try {
    await signInWithEmailAndPassword(auth, email, pass);
  } catch (err) {
    alert(err.message);
  }
});

logoutBtn.addEventListener("click", () => {
  signOut(auth);
});

// 👤 Auth State
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUserUID = user.uid;
    authScreen.style.display = "none";
    mainApp.style.display = "block";
    loadTasksFromFirebase();
  } else {
    currentUserUID = null;
    mainApp.style.display = "none";
    authScreen.style.display = "flex";
  }
});

// ✅ Task Functions
window.addTask = function () {
  if (inputBox.value === '') {
    alert("Please type something to add a task.");
    return;
  }

  let li = document.createElement("li");
  li.innerHTML = inputBox.value;
  listContainer.appendChild(li);

  let span = document.createElement("span");
  span.innerHTML = "\u00d7";
  li.appendChild(span);

  inputBox.value = "";
  saveTasksToFirebase();
};

listContainer.addEventListener("click", function (e) {
  if (e.target.tagName === "LI") {
    e.target.classList.toggle("checked");
  } else if (e.target.tagName === "SPAN") {
    e.target.parentElement.remove();
  }
  saveTasksToFirebase();
});

// 🔃 Save to Firebase
function saveTasksToFirebase() {
  if (!currentUserUID) return;

  const tasksHTML = listContainer.innerHTML;
  set(ref(db, 'tasks/' + currentUserUID), {
    html: tasksHTML
  });
}

// 🔄 Load from Firebase
function loadTasksFromFirebase() {
  if (!currentUserUID) return;

  const tasksRef = ref(db, 'tasks/' + currentUserUID);
  onValue(tasksRef, (snapshot) => {
    const data = snapshot.val();
    if (data && data.html) {
      listContainer.innerHTML = data.html;
    }
  });
}
