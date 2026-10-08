const addHabitBtn = document.getElementById("add-habit-btn");
const habitTitle = document.getElementById("habit-title");
const saveHabitBtn = document.getElementById("save-habit-btn");
const habitsList = document.getElementById("habits-list");

const API = "https://habit-tracker-wa86.onrender.com/habits";

saveHabitBtn.addEventListener("click", saveHabit);

addHabitBtn.addEventListener("click", () => {
  document.getElementById("add-habit-container").classList.toggle("active");
});

let habits = [];

// ---- Load habits from the server on page load ----
async function loadHabits() {
  try {
    const res = await fetch(API);
    habits = await res.json();
    render();
  } catch (err) {
    console.error("Failed to load habits:", err);
  }
}
loadHabits();

// ---- Save a new habit to the server ----
async function saveHabit() {
  const habitTitleValue = habitTitle.value.trim();
  if (!habitTitleValue) return;

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habit: habitTitleValue }),
    });

    const newHabit = await res.json();
    habits.unshift(newHabit); // newest first
    habitTitle.value = "";
    render();
  } catch (err) {
    console.error("Failed to save habit:", err);
  }
}

// ---- Render ----
function render() {
  habitsList.innerHTML = habits
    .map(
      (h) => `
    <div class="habit" data-id="${h._id}">
        <p>${h.streak}🔥</p>
        <h2>${h.habit} <span></span></h2>
        <button class="check-btn"><i class="fa-solid fa-check"></i></button>
        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
    </div>
    `
    )
    .join("");
}

// ---- Event delegation ----
habitsList.addEventListener("click", async (event) => {
  const habitDiv = event.target.closest(".habit");
  if (!habitDiv) return;
  const id = habitDiv.dataset.id;

  if (event.target.closest(".check-btn")) {
    await checkHabit(id);
  }

  if (event.target.closest(".delete-btn")) {
    await deleteHabit(id);
  }
});

// ---- Check a habit (streak logic lives on the server now) ----
async function checkHabit(id) {
  try {
    const res = await fetch(`${API}/${id}/`, { method: "PUT" });
    const data = await res.json();

    if (data.alreadyDone) {
      alert("You have completed this habit today!");
      return;
    }

   
    habits = habits.map((h) => (h._id === id ? data.habit : h));
    render();
  } catch (err) {
    console.error("Failed to check habit:", err);
  }
}

// ---- Delete a habit ----
async function deleteHabit(id) {
  const confirmed = confirm("Are you sure you want to delete this habit?");
  if (!confirmed) return;

  try {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    habits = habits.filter((h) => h._id !== id);
    render();
  } catch (err) {
    console.error("Failed to delete habit:", err);
  }
}