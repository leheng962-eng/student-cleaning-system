// ===== students.js: register, list, search, delete =====
const studentForm = document.getElementById("studentForm");
const photoInput = document.getElementById("photoInput");
let currentPhoto = ""; // the picture saved as text (base64) for now

// CHANGE event: preview the picture and tell if it is new or old
photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if (!file) return;
  previewImage(file, document.getElementById("photoPreview"));
  const label = document.getElementById("photoAge");
  const age = checkPhotoAge(file);
  label.textContent = age;
  label.className = age === "New photo" ? "text-green-600" : "text-amber-600";
  const reader = new FileReader();
  reader.onload = () => (currentPhoto = reader.result);
  reader.readAsDataURL(file);
});

// Show or clear an error message under a field
function setError(input, message) {
  input.classList.toggle("invalid", !!message);
  input.parentElement.querySelector(".err").textContent = message;
}

// SUBMIT event with form validation
studentForm.addEventListener("submit", (e) => {
  e.preventDefault(); // stop the page from reloading
  const f = studentForm.elements;
  let ok = true;
  const rules = [
    [f.studentId, !f.studentId.value.trim(), "Student ID is required"],
    [f.fullName, f.fullName.value.trim().length < 3, "Enter at least 3 letters"],
    [f.gender, !f.gender.value, "Choose a gender"],
    [f.age, f.age.value < 15 || f.age.value > 60, "Age must be 15 to 60"],
    [f.major, !f.major.value.trim(), "Major is required"],
    [f.phone, !/^[0-9+ ]{8,15}$/.test(f.phone.value), "Enter a valid phone number"],
    [f.email, !/^\S+@\S+\.\S+$/.test(f.email.value), "Enter a valid email"],
  ];
  rules.forEach(([input, bad, msg]) => { setError(input, bad ? msg : ""); if (bad) ok = false; });
  if (!ok) return;

  store.students.push({
    id: f.studentId.value.trim(), name: f.fullName.value.trim(), gender: f.gender.value,
    age: f.age.value, major: f.major.value.trim(), phone: f.phone.value,
    email: f.email.value, picture: currentPhoto, registered: new Date().toISOString().slice(0, 10),
  });
  store.save();
  studentForm.reset();
  document.getElementById("photoPreview").classList.add("hidden");
  document.getElementById("photoAge").textContent = "";
  currentPhoto = "";
  toast("Student saved");
  renderStudents();
  showPage("students");
});

// Build the student cards with createElement
function renderStudents() {
  const term = document.getElementById("searchInput").value.toLowerCase();
  const grid = document.getElementById("studentGrid");
  grid.innerHTML = "";
  const list = store.students.filter((s) =>
    s.name.toLowerCase().includes(term) || s.id.toLowerCase().includes(term));
  if (!list.length) grid.textContent = "No students yet. Register one first.";
  list.forEach((s) => {
    const card = document.createElement("div");
    card.className = "card flex gap-4 items-center";
    const img = document.createElement("img");
    img.className = "w-16 h-16 rounded-full object-cover bg-blue-100";
    img.alt = "";
    if (s.picture) img.src = s.picture;
    const info = document.createElement("div");
    info.className = "flex-1";
    const name = document.createElement("p");
    name.className = "font-semibold";
    name.textContent = s.name; // textContent is safe for user text
    const sub = document.createElement("p");
    sub.className = "text-sm text-slate-500";
    sub.textContent = s.id + " - " + s.major;
    info.append(name, sub);
    const del = document.createElement("button");
    del.textContent = "Delete";
    del.className = "text-red-600 text-sm";
    del.addEventListener("click", () => {
      if (!confirm("Delete " + s.name + "?")) return;
      store.students = store.students.filter((x) => x.id !== s.id);
      store.save(); renderStudents(); fillStudentSelect(); toast("Student deleted");
    });
    card.append(img, info, del);
    grid.appendChild(card);
  });
}

// INPUT event: search while typing
document.getElementById("searchInput").addEventListener("input", renderStudents);
renderStudents();
