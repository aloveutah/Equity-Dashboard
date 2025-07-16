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

const addTaskRow = () => {
  const taskRows = document.getElementById("task-rows");
  const newRow = document.createElement("div");
  newRow.classList.add("task-row");

  newRow.innerHTML = `
    <input type="text" class="task-input" placeholder="Task" />
    <select class="assigned-select">${assignedOptions.map(option => `<option value="${option}">${option}</option>`).join('')}</select>
    <select class="priority-select">${priorityOptions.map(option => `<option value="${option.value}" style="color: ${option.color};">${option.value}</option>`).join('')}</select>
    <select class="status-select">${statusOptions.map(option => `<option value="${option}">${option}</option>`).join('')}</select>
    <input type="text" class="notes-input" placeholder="Notes" />
    <button class="remove-task-button">Remove</button>
  `;

  taskRows.appendChild(newRow);

  newRow.querySelector('.remove-task-button').addEventListener('click', () => {
    taskRows.removeChild(newRow);
    updateTaskCounts();
    updateChart();
  });

  const statusSelect = newRow.querySelector('.status-select');
  statusSelect.addEventListener('change', () => {
    updateTaskCounts();
    updateChart();
  });

  updateTaskCounts();
  updateChart();
};

const updateTaskCounts = () => {
  Object.keys(taskCounts).forEach(key => taskCounts[key] = 0);
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
      data: [0, 0, 0],
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
  myChart.data.datasets[0].data = chartData;
  myChart.update();
};

document.getElementById("add-task-button").addEventListener("click", addTaskRow);
