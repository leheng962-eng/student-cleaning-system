// ===== activities.js: cleaning schedule =====
const activityForm = document.getElementById("activityForm");

// Fill the student dropdown from saved students
function fillStudentSelect() {
  const select = document.getElementById("studentSelect");
  select.innerHTML = '<option value="">Choose student...</option>';
  store.students.forEach((s) => {
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = s.name;
    select.appendChild(opt);
  });
}

activityForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const f = activityForm.elements;
  setError(f.student, f.student.value ? "" : "Choose a student");
  setError(f.date, f.date.value ? "" : "Choose a date");
  if (!f.student.value || !f.date.value) return;

  store.activities.push({
    id: "A" + Date.now(), name: f.name.value, studentId: f.student.value,
    date: f.date.value, start: f.start.value, end: f.end.value, status: "Pending",
  });
  store.save();
  renderActivities();
  toast("Activity added");
});

// Draw the schedule table, sorted by date
function renderActivities() {
  const body = document.getElementById("activityBody");
  body.innerHTML = "";
  [...store.activities].sort((a, b) => a.date.localeCompare(b.date)).forEach((a) => {
    const student = store.students.find((s) => s.id === a.studentId);
    const row = document.createElement("tr");
    row.className = "border-t border-blue-100";
    const cells = [a.date, a.name, student ? student.name : "(deleted)",
                   (a.start || "-") + " to " + (a.end || "-"), a.status];
    cells.forEach((text, i) => {
      const td = document.createElement("td");
      td.className = "p-2";
      td.textContent = text;
      row.appendChild(td);
    });
    const last = document.createElement("td");
    const btn = document.createElement("button");
    btn.textContent = "Remove";
    btn.className = "text-red-600";
    btn.addEventListener("click", () => {
      store.activities = store.activities.filter((x) => x.id !== a.id);
      store.save(); row.remove(); toast("Activity removed");
    });
    last.appendChild(btn);
    row.appendChild(last);
    body.appendChild(row);
  });
}

// Refresh the dropdown every time the Schedule page opens
document.querySelector('[data-page="schedule"]').addEventListener("click", fillStudentSelect);
fillStudentSelect();
renderActivities();
