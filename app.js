import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  remove,
  update
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

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
const db = getDatabase(app);

const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const addTaskBtn = document.getElementById("addTaskBtn");
const logoutBtn = document.getElementById("logoutBtn");

let userUID = null;

onAuthStateChanged(auth, user => {
  if (user) {
    userUID = user.uid;
    loadTasks();
  } else {
    window.location.href = "index.html";
  }
});

addTaskBtn.addEventListener("click", () => {
  if (inputBox.value.trim() === "") {
    alert("Please type something!");
    return;
  }

  const taskRef = ref(db, `users/${userUID}/tasks`);
  const newTask = {
    text: inputBox.value,
    checked: false
  };

  push(taskRef, newTask);
  inputBox.value = "";
});

function loadTasks() {
  const taskRef = ref(db, `users/${userUID}/tasks`);
  onValue(taskRef, snapshot => {
    listContainer.innerHTML = "";
    snapshot.forEach(child => {
      const task = child.val();
      const key = child.key;
      const li = document.createElement("li");
      li.textContent = task.text;
      if (task.checked) li.classList.add("checked");

      li.addEventListener("click", () => {
        update(ref(db, `users/${userUID}/tasks/${key}`), {
          checked: !task.checked
        });
      });

      const span = document.createElement("span");
      span.innerHTML = "\u00d7";
      span.addEventListener("click", e => {
        e.stopPropagation();
        remove(ref(db, `users/${userUID}/tasks/${key}`));
      });

      li.appendChild(span);
      listContainer.appendChild(li);
    });
  });
}

logoutBtn.addEventListener("click", () => {
  signOut(auth);
});
