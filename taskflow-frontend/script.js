const statusEl = document.getElementById('status');
const tasksEl = document.getElementById('tasks');

function baseUrl() {
  return document.getElementById('baseUrl').value.replace(/\/$/, '');
}

function showStatus(msg, isError) {
  statusEl.textContent = msg;
  statusEl.style.color = isError ? '#dc2626' : '#16a34a';
}

async function fetchTasks() {
  try {
    const res = await fetch(baseUrl());
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const tasks = await res.json();
    renderTasks(tasks);
    showStatus(`Loaded ${tasks.length} task(s).`, false);
  } catch (err) {
    showStatus('Failed to load tasks: ' + err.message, true);
    tasksEl.innerHTML = '';
  }
}

function renderTasks(tasks) {
  if (!tasks.length) {
    tasksEl.innerHTML = '<p style="color:#999;">No tasks yet.</p>';
    return;
  }
  tasksEl.innerHTML = tasks.map(t => `
    <div class="task">
      <div>
        <div><strong>${escapeHtml(t.title)}</strong> <span class="label-tag">${escapeHtml(t.label || '')}</span></div>
        <div class="task-meta">
          Due: ${t.dueDate || '—'} · Est: ${t.estimatedMinutes || 0} min · Status: ${t.status || '—'} · ID: ${t.id}
        </div>
      </div>
      <button class="delete-btn" onclick="deleteTask(${t.id})">Delete</button>
    </div>
  `).join('');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

document.getElementById('taskForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    title: document.getElementById('title').value,
    dueDate: document.getElementById('dueDate').value || null,
    estimatedMinutes: parseInt(document.getElementById('estimatedMinutes').value, 10) || 0,
    label: document.getElementById('label').value
  };

  try {
    const res = await fetch(baseUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    showStatus('Task created successfully.', false);
    e.target.reset();
    document.getElementById('estimatedMinutes').value = 30;
    fetchTasks();
  } catch (err) {
    showStatus('Failed to create task: ' + err.message, true);
  }
});

async function deleteTask(id) {
  try {
    const res = await fetch(`${baseUrl()}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    showStatus('Task deleted.', false);
    fetchTasks();
  } catch (err) {
    showStatus('Failed to delete task: ' + err.message, true);
  }
}

document.getElementById('refreshBtn').addEventListener('click', fetchTasks);

// Load tasks on page open
fetchTasks();