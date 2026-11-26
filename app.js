// ===== app.js: shared tools used by every page =====

// The "store" holds our data. For now it is saved in the browser (localStorage).
// In Phase 3 we will replace this with real API calls to the backend.
const store = {
  students: JSON.parse(localStorage.getItem("students") || "[]"),
  activities: JSON.parse(localStorage.getItem("activities") || "[]"),
  save() {
    localStorage.setItem("students", JSON.stringify(this.students));
    localStorage.setItem("activities", JSON.stringify(this.activities));
  },
};

// Show one page and hide the others
function showPage(name) {
  document.querySelectorAll(".page").forEach((p) => p.classList.add("hidden"));
  document.getElementById("page-" + name).classList.remove("hidden");
  document.querySelectorAll(".nav-link").forEach((l) =>
    l.classList.toggle("active", l.dataset.page === name));
  document.getElementById("sidebar").classList.add("-translate-x-full"); // close menu on mobile
  if (name === "dashboard") renderStats();
}

// CLICK event on every sidebar link
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    showPage(link.dataset.page);
  });
});
document.getElementById("menuBtn").addEventListener("click", () =>
  document.getElementById("sidebar").classList.toggle("-translate-x-full"));

// Small message at the bottom of the screen (createElement + appendChild + remove)
function toast(message) {
  const box = document.createElement("div");
  box.className = "toast";
  box.textContent = message; // textContent is safe: it shows plain text only
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 2500);
}

// Dashboard statistic cards
function renderStats() {
  const today = new Date().toISOString().slice(0, 10);
  const done = store.activities.filter((a) => a.status === "Completed").length;
  const overdue = store.activities.filter((a) => a.status !== "Completed" && a.date < today).length;
  const pending = store.activities.length - done - overdue;
  const cards = [["Students", store.students.length], ["Activities", store.activities.length],
                 ["Completed", done], ["Pending", pending], ["Overdue", overdue]];
  const grid = document.getElementById("statCards");
  grid.innerHTML = ""; // clear old cards
  cards.forEach(([label, value]) => {
    grid.innerHTML += `<div class="card"><p class="text-sm text-slate-500">${label}</p>
      <p class="text-3xl font-bold text-blue-700">${value}</p></div>`;
  });
}

showPage("dashboard");
