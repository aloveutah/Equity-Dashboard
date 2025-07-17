
const assignedOptions = [
    "Amy Love", "Nicole Thomas", "Daniela Torres", "Wanda Heeley",
    "All (A/N/D/W)", "Shareworks", "Legal", "Altshare", "Deloitte", "Payroll", "Other"
];

const priorityOptions = [
    { value: "Low", color: "green" },
    { value: "Medium", color: "yellow" },
    { value: "High", color: "red" }
];

const statusOptions = ["Not Started", "In Progress", "Complete"];

// Function to load tasks from local storage
const loadTasks = () => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(task => {
        addTaskRow(task); // Add each saved task
    });
};

// Function to add a new task row
const addTaskRow = (taskValue = "") => {
    const taskRows = document.getElementById("task-rows");
    const newRow = document.createElement("div");
    newRow.classList.add("task-row");

    newRow.innerHTML = `
        <div class="task-text" contenteditable="true">${taskValue}</div>
        <select class="assigned-select">${assignedOptions.map(option => `<option value="${option}">${option}</option>`).join('')}</select>
        <select class="priority-select">${priorityOptions.map(option => `<option value="${option.value}" style="color: ${option.color};">${option.value}</option>`).join('')}</select>
        <select class="status-select">${statusOptions.map(option => `<option value="${option}">${option}</option>`).join('')}</select>
        <input type="text" class="notes-input" placeholder="Notes" />
        <button class="remove-task-button">Remove</button>
    `;

    taskRows.appendChild(newRow);

    // Add event listener for removing the task row
    newRow.querySelector('.remove-task-button').addEventListener('click', () => {
        taskRows.removeChild(newRow);
        updateLocalStorage(); // Update local storage after removing
    });

    // Add event listener for status change
    const statusSelect = newRow.querySelector('.status-select');
    statusSelect.addEventListener('change', () => {
        updateLocalStorage(); // Update local storage on status change
    });

    updateLocalStorage(); // Update local storage when a new task is added
};

// Function to update local storage
const updateLocalStorage = () => {
    const tasks = [];
    document.querySelectorAll('.task-row').forEach(row => {
        const taskText = row.querySelector('.task-text').innerText;
        const assigned = row.querySelector('.assigned-select').value;
        const priority = row.querySelector('.priority-select').value;
        const status = row.querySelector('.status-select').value;
        const notes = row.querySelector('.notes-input').value;

        tasks.push({ taskText, assigned, priority, status, notes });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks)); // Save tasks to local storage
};

// Load tasks when the page is loaded
window.onload = loadTasks;

// Add event listener to the "Add Task" button
document.getElementById("add-task-button").addEventListener("click", () => {
    const taskInput = document.getElementById("task-input");
    const taskValue = taskInput.value.trim();
    if (taskValue) {
        addTaskRow(taskValue); // Pass the task value to addTaskRow
        taskInput.value = ""; // Clear the input field
    } else {
        alert("Please enter a task.");
    }
});
