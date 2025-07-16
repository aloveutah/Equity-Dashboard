
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
        return;  // Do not add an empty task
    }

    const taskRows = document.getElementById("task-rows");
    const newRow = document.createElement("div");
    newRow.classList.add("task-row");

    // Construct the HTML structure for the task row
    newRow.innerHTML = `
        <input type="text" class="task-input" value="${taskValue}" readonly />
        <select class="assigned-select">${assignedOptions.map(option => `<option value="${option}">${option}</option>`).join('')}</select>
        <select class="priority-select">${priorityOptions.map(option => `<option value="${option.value}" style="color: ${option.color};">${option.value}</option>`).join('')}</select>
        <select class="status-select">${statusOptions.map(option => `<option value="${option}">${option}</option>`).join('')}</select>
        <input type="text" class="notes-input" placeholder="Notes" />
        <button class="remove-task-button">Remove</button>
    `;

    taskRows.appendChild(newRow);
    taskInput.value = "";  // Clear the input field after adding the task

    // Allow the task name to be editable if needed
    const taskNameInput = newRow.querySelector('.task-input');
    taskNameInput.addEventListener('input', () => {
        taskNameInput.value = taskNameInput.value;  // Keeps the edited value
    });

    // Add event listener for removing the task row
    newRow.querySelector('.remove-task-button').addEventListener('click', () => {
        taskRows.removeChild(newRow);
        updateTaskCounts();  // Update the task counts for the chart
        updateChart();  // Update the chart
    });

    // Add event listener for status change
    const statusSelect = newRow.querySelector('.status-select');
    statusSelect.addEventListener('change', () => {
        const status = statusSelect.value;
        if (status === "Complete") {
            const completedRows = document.getElementById("completed-rows");
            completedRows.appendChild(newRow);  // Move to completed section
            statusSelect.disabled = true;  // Disable dropdown to prevent changing back
            addRemoveCompletedButton(newRow); // Add remove functionality for the completed row
        }
        updateTaskCounts();  // Update counts as status changes
        updateChart();  // Update the chart
    });

    updateTaskCounts();  // Update counts for the chart
    updateChart();  // Update the chart
};

// Function to add remove functionality to completed tasks
const addRemoveCompletedButton = (completedRow) => {
    if (!completedRow.querySelector('.remove-completed-task-button')) {
        const removeButton = document.createElement('button');
        removeButton.innerText = 'Remove';
        removeButton.classList.add('remove-completed-task-button');

        // Add event listener for removing from completed tasks
        removeButton.addEventListener('click', () => {
            const completedRows = document.getElementById("completed-rows");
            completedRows.removeChild(completedRow);  // Remove the completed row
            updateTaskCounts();  // Update the task counts for the chart
            updateChart();  // Update the chart
        });

        // Append the remove button to the completed row if it doesn't already exist
        completedRow.appendChild(removeButton);
    }
};

const updateTaskCounts = () => {
    Object.keys(taskCounts).forEach(key => taskCounts[key] = 0);  // Reset counts
    const rows = document.querySelectorAll('.task-row');
    rows.forEach(row => {
        const status = row.querySelector('.status-select').value;
        taskCounts[status]++;
    });
};

const ctx = document.getElementById('taskChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Not Started', 'In Progress', 'Complete'],
        datasets: [{
            label: 'Tasks',
            data: [0, 0, 0],  // Initial empty data
            backgroundColor: ['green', 'yellow', 'red']
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
    }
});

const updateChart = () => {
    const chartData = [taskCounts["Not Started"], taskCounts["In Progress"], taskCounts["Complete"]];
    myChart.data.datasets[0].data = chartData;  // Update chart data
    myChart.update();  // Refresh the chart
};

// Add event listener to the "Add Task" button
document.getElementById("add-task-button").addEventListener("click", addTaskRow);
