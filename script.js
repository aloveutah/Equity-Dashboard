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
        <input type="text" class="task-input" value="${taskValue}" readonly />
        <select class="assigned-select">${assignedOptions.map(option => `<option value="${option}">${option}</option>`).join('')}</select>
        <select class="priority-select">${priorityOptions.map(option => `<option value="${option.value}" style="color: ${option.color};">${option.value}</option>`).join('')}</select>
        <select class="status-select">${statusOptions.map(option => `<option value="${option}">${option}</option>`).join('')}</select>
        <input type="text" class="notes-input" placeholder="Notes" />
        <button class="remove-task-button">Remove</button>
    `;

    taskRows.appendChild(newRow);
    taskInput.value = ""; // Clear the input field after adding the task

    // Add event listener for removing the active task row
    newRow.querySelector('.remove-task-button').addEventListener('click', () => {
        taskRows.removeChild(newRow);
        updateTaskCounts(); // Update the task counts for the chart
        updateChart(); // Update the chart
    });

    // Add event listener for status change
    const statusSelect = newRow.querySelector('.status-select');
    statusSelect.addEventListener('change', () => {
        const status = statusSelect.value;
        if (status === "Complete") {
            const completedRows = document.getElementById("completed-rows");

            // Move to the completed section
            completedRows.appendChild(newRow); // Move task row to completed rows
            statusSelect.disabled = true; // Disable dropdown to prevent changing back
            
            // Check if the button already exists to prevent duplicates
            if (!newRow.querySelector('.remove-completed-task-button')) {
                // Create and append the remove button for the completed task
                const moveBackButton = document.createElement('button');
                moveBackButton.innerText = 'Remove';
                moveBackButton.classList.add('remove-completed-task-button');

                // Add event listener for moving back to the active tasks section
                moveBackButton.addEventListener('click', () => {
                    taskRows.appendChild(newRow); // Move back to active tasks section
                    statusSelect.disabled = false; // Enable dropdown again
                    moveBackButton.remove(); // Remove the Move Back button
                    updateTaskCounts(); // Update the task counts for the chart
                    updateChart(); // Update the chart
                });

                newRow.appendChild(moveBackButton); // Append the button to the completed row
            }
        }
        updateTaskCounts(); // Update counts as status changes
        updateChart(); // Update the chart
    });

    updateTaskCounts(); // Update counts for the chart
    updateChart(); // Update the chart
};

const updateTaskCounts = () => {
    Object.keys(taskCounts).forEach(key => taskCounts[key] = 0); // Reset counts
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
            data: [0, 0, 0], // Initial empty data
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
    myChart.data.datasets[0].data = chartData; // Update chart data
    myChart.update(); // Refresh the chart
};

// Add event listener to the "Add Task" button
document.getElementById("add-task-button").addEventListener("click", addTaskRow);
