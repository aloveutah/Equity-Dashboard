
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

const taskCounts = {
    "Not Started": 0,
    "In Progress": 0,
    "Complete": 0
};

// Function to add a new task row
const addTaskRow = () => {
    const taskInput = document.getElementById("task-input");
    const taskValue = taskInput.value.trim();

    if (!taskValue) {
        alert("Please enter a task.");
        return; // Do not add an empty task
    }

    const taskRows = document.getElementById("task-rows");
    const newRow = document.createElement("div");
    newRow.classList.add("task-row");

    // Construct the HTML structure for the task row
    newRow.innerHTML = `
        <div class="task-text">${taskValue}</div>  <!-- Use div for task text -->
        <select class="assigned-select">${assignedOptions.map(option => `<option value="${option}">${option}</option>`).join('')}</select>
        <select class="priority-select">${priorityOptions.map(option => `<option value="${option.value}" style="color: ${option.color};">${option.value}</option>`).join('')}</select>
        <select class="status-select">${statusOptions.map(option => `<option value="${option}">${option}</option>`).join('')}</select>
        <input type="text" class="notes-input" placeholder="Notes" />
        <button class="remove-task-button">Remove</button>
    `;

    taskRows.appendChild(newRow);
    taskInput.value = ""; // Clear the input field after adding the task

    // Add event listener for removing the task
    newRow.querySelector('.remove-task-button').addEventListener('click', () => {
        const statusSelect = newRow.querySelector('.status-select');
        const completedRows = document.getElementById("completed-rows");

        // Check if it's in completed rows or active rows to handle accordingly
        if (completedRows.contains(newRow)) {
            // Move the task back to active tasks
            taskRows.appendChild(newRow); 
            statusSelect.disabled = false; // Enable the status dropdown again
        } else {
            // Remove the task completely if it's in active tasks
            taskRows.removeChild(newRow);
        }

        updateTaskCounts(); // Update the task counts for the chart
        updateChart(); // Update the chart
    });

    // Add event listener for status change
    const statusSelect = newRow.querySelector('.status-select');
    statusSelect.addEventListener('change', () => {
        const status = statusSelect.value;
        if (status === "Complete") {
            const completedRows = document.getElementById("completed-rows");
            completedRows.appendChild(newRow); // Move task row to completed rows
            statusSelect.disabled = true; // Disable dropdown to prevent changing back
        }

        updateTaskCounts(); // Update counts as status changes
        updateChart(); // Update the chart
    });

    updateTaskCounts(); // Update counts for the chart
    updateChart(); // Update the chart
};

// Function to update task counts
const updateTaskCounts = () => {
    Object.keys(taskCounts).forEach(key => taskCounts[key] = 0); // Reset counts
    const rows = document.querySelectorAll('.task-row');
    rows.forEach(row => {
        const status = row.querySelector('.status-select').value;
        taskCounts[status]++;
    });
};

// Set up the chart for displaying task counts
const ctx = document.getElementById('taskChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Not Started', 'In Progress', 'Complete'],
        datasets: [{
            label: 'Tasks',
            data: [0, 0, 0], // Initial empty data
            backgroundColor: ['green', 'yellow', 'red']
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
    }
});

// Function to update chart data
const updateChart = () => {
    const chartData = [taskCounts["Not Started"], taskCounts["In Progress"], taskCounts["Complete"]];
    myChart.data.datasets[0].data = chartData; // Update chart data
    myChart.update(); // Refresh the chart
};

// Add event listener to the "Add Task" button
document.getElementById("add-task-button").addEventListener("click", addTaskRow);
