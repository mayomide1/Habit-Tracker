const addHabitBtn = document.getElementById("add-habit-btn")
const habitTitle = document.getElementById("habit-title")
const saveHabitBtn = document.getElementById("save-habit-btn")
const habitsList = document.getElementById("habits-list")

saveHabitBtn.addEventListener("click", saveHabit)

addHabitBtn.addEventListener("click", () => {
    document.getElementById("add-habit-container").classList.toggle("active")
})

const habits = JSON.parse(localStorage.getItem("habit"))||[]

function saveHabit(){
    const habitTitleValue = habitTitle.value
    const today = new Date().toLocaleDateString("en-CA")

    const habit = {
        habit : habitTitleValue,
        streak: 1,
        lastCompleted: today,
    }
    habits.push(habit)

    localStorage.setItem("habit", JSON.stringify(habits))


    habitTitle.value = ""
   render()
}

function render(){
    habitsList.innerHTML = habits.map((h, index) => `

    <div class="habit" data-index=${index}>
        <p>${h.streak}🔥</p>
        <h2>${h.habit} <span></span></h2>
        <button class="check-btn">✓</button>
        <button class="delete-btn">🗑️</button>
        
    </div>    
        `).join("")
}

habitsList.addEventListener("click", (event) => {
    const habitDiv = event.target.closest(".habit");
    if (!habitDiv) return;
    const index = parseInt(habitDiv.dataset.index);

    // 🔥 FIX: Run the correct function based on which button was clicked
    if (event.target.classList.contains("check-btn")) {
        checkHabit(index);
    } 
    
    if (event.target.classList.contains("delete-btn")) {
        deleteHabit(index);
    }
});

function checkHabit(index){
    const today = new Date().toLocaleDateString("en-CA")
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toLocaleDateString("en-CA");
    const habit = habits[index]

    if (habit.lastCompleted === today){
        alert("You have completed this habit today!");
        return;
    }else if (habit.lastCompleted === yesterday){
        habit.streak += 1;
    } 
    else {
        habit.streak = 0;
    }
    habit.lastCompleted = today;
    
    render();
}

function deleteHabit(index) {
    const confirmed = confirm("Are you sure you want to delete this habit?");
    if (!confirmed) return;

    habits.splice(index, 1);
    localStorage.setItem("habit", JSON.stringify(habits));
    render();
}

render()