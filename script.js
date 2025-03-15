import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, set, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Firebase config (replace with your actual keys)
const firebaseConfig = {
    apiKey: "AIzaSyDltUwIwNYmL59A4cy61dCz2UBJeG-Fc5w",
    authDomain: "sakuratodo-1f338.firebaseapp.com",
    databaseURL: "https://sakuratodo-1f338-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "sakuratodo-1f338",
    storageBucket: "sakuratodo-1f338.firebasestorage.app",
    messagingSenderId: "408069747406",
    appId: "1:408069747406:web:0cfe3a2ec19839c753169f"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// DOM Elements
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const loginSection = document.getElementById("login-section");
const appSection = document.getElementById("app-section");

// Current user ID
let uid = null;

// Auth State Listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    uid = user.uid;
    loginSection.style.display = "none";
    appSection.style.display = "block";
    loadTasks();
  } else {
    uid = null;
    loginSection.style.display = "block";
    appSection.style.display = "none";
  }
});

// Auth Functions
window.signUp = () => {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  createUserWithEmailAndPassword(auth, email, pass)
    .catch(err => alert(err.message));
};

window.signIn = () => {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, pass)
    .catch(err => alert(err.message));
};

window.logOut = () => signOut(auth);

// Task Functions
window.addTask = () => {
  const task = inputBox.value.trim();
  if (!task) return alert("Please type a task!");

  const taskRef = ref(db, `tasks/${uid}`);
  const newTaskRef = push(taskRef);
  set(newTaskRef, {
    text: task,
    checked: false
  });
  inputBox.value = "";
};

function loadTasks() {
  const taskRef = ref(db, `tasks/${uid}`);
  onValue(taskRef, (snapshot) => {
    listContainer.innerHTML = "";
    snapshot.forEach(child => {
      const { text, checked } = child.val();
      const li = document.createElement("li");
      li.textContent = text;
      if (checked) li.classList.add("checked");

      // Toggle check
      li.addEventListener("click", () => {
        set(ref(db, `tasks/${uid}/${child.key}`), {
          text,
          checked: !checked
        });
      });

      // Delete (X)
      const span = document.createElement("span");
      span.innerHTML = "\u00d7";
      span.onclick = () => remove(ref(db, `tasks/${uid}/${child.key}`));
      li.appendChild(span);

      listContainer.appendChild(li);
    });
  });
}
