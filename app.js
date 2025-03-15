import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

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

let currentUser;

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    loadTasks();
  } else {
    window.location.href = "index.html";
  }
});

addTaskBtn.addEventListener("click", () => {
  if (inputBox.value === '') {
    alert("Please type a task.");
    return;
  }
  const task = inputBox.value;
  const li = document.createElement("li");
  li.textContent = task;

  const span = document.createElement("span");
  span.textContent = "×";
  li.appendChild(span);
  listContainer.appendChild(li);

  inputBox.value = "";
  saveTasks();
});

listContainer.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    e.target.classList.toggle("checked");
    saveTasks();
  } else if (e.target.tagName === "SPAN") {
    e.target.parentElement.remove();
    saveTasks();
  }
});

function saveTasks() {
  const tasks = [];
  listContainer.querySelectorAll("li").forEach((li) => {
    tasks.push({
      text: li.firstChild.textContent,
      checked: li.classList.contains("checked")
    });
  });

  set(ref(db, "users/" + currentUser.uid + "/tasks"), tasks);
}

function loadTasks() {
  const dbRef = ref(db);
  get(child(dbRef, `users/${currentUser.uid}/tasks`)).then((snapshot) => {
    if (snapshot.exists()) {
      const tasks = snapshot.val();
      tasks.forEach(task => {
        const li = document.createElement("li");
        li.textContent = task.text;
        if (task.checked) li.classList.add("checked");

        const span = document.createElement("span");
        span.textContent = "×";
        li.appendChild(span);

        listContainer.appendChild(li);
      });
    }
  });
}

logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
});
