<script>
  let tasks = [];
  let taskName = '';
  let taskPriority = 'medium';
  let editingId = null;
  let editName = '';
  let editPriority = 'medium';
  let metrics = {
    renderTime: 0,
    updateTime: 0,
    deleteTime: 0
  };

  $: hasMetrics = metrics.renderTime > 0 || metrics.updateTime > 0 || metrics.deleteTime > 0;

  function addTask() {
    if (taskName.trim()) {
      tasks = [...tasks, {
        id: Date.now(),
        name: taskName,
        priority: taskPriority
      }];
      taskName = '';
    }
  }

  function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
  }

  function startEdit(task) {
    editingId = task.id;
    editName = task.name;
    editPriority = task.priority;
  }

  function saveEdit() {
    tasks = tasks.map(task =>
      task.id === editingId
        ? { ...task, name: editName, priority: editPriority }
        : task
    );
    editingId = null;
  }

  function cancelEdit() {
    editingId = null;
  }

  function generateTasks(count) {
    const priorities = ['low', 'medium', 'high'];
    const newTasks = [];
    for (let i = 0; i < count; i++) {
      newTasks.push({
        id: Date.now() + i,
        name: `Task ${i + 1}`,
        priority: priorities[Math.floor(Math.random() * priorities.length)]
      });
    }
    return newTasks;
  }

  function benchmarkRender(count) {
    const startTime = performance.now();
    tasks = generateTasks(count);
    requestAnimationFrame(() => {
      const endTime = performance.now();
      metrics.renderTime = (endTime - startTime).toFixed(2);
      console.log(`Svelte - Rendered ${count} tasks in ${metrics.renderTime}ms`);
    });
  }

  function benchmarkUpdate() {
    if (tasks.length < 50) {
      alert('Please generate at least 100 tasks first');
      return;
    }

    const startTime = performance.now();
    tasks = tasks.map((task, index) => {
      if (index < 50) {
        return { ...task, name: `Updated ${task.name}` };
      }
      return task;
    });
    requestAnimationFrame(() => {
      const endTime = performance.now();
      metrics.updateTime = (endTime - startTime).toFixed(2);
      console.log(`Svelte - Updated 50 tasks in ${metrics.updateTime}ms`);
    });
  }

  function benchmarkDelete() {
    if (tasks.length < 50) {
      alert('Please generate at least 100 tasks first');
      return;
    }

    const startTime = performance.now();
    tasks = tasks.slice(50);
    requestAnimationFrame(() => {
      const endTime = performance.now();
      metrics.deleteTime = (endTime - startTime).toFixed(2);
      console.log(`Svelte - Deleted 50 tasks in ${metrics.deleteTime}ms`);
    });
  }

  function clearAllTasks() {
    tasks = [];
    metrics = { renderTime: 0, updateTime: 0, deleteTime: 0 };
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      addTask();
    }
  }
</script>

<div class="app">
  <h1>Svelte Todo Benchmark</h1>
  
  <div class="controls">
    <div class="input-group">
      <input
        bind:value={taskName}
        type="text"
        placeholder="Enter task name"
        on:keypress={handleKeyPress}
      />
      <select bind:value={taskPriority}>
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
      </select>
      <button class="btn-add" on:click={addTask}>Add Task</button>
    </div>

    <div class="benchmark-buttons">
      <button class="btn-benchmark" on:click={() => benchmarkRender(100)}>
        Generate 100 Tasks
      </button>
      <button class="btn-benchmark" on:click={() => benchmarkRender(500)}>
        Generate 500 Tasks
      </button>
      <button class="btn-benchmark" on:click={() => benchmarkRender(1000)}>
        Generate 1000 Tasks
      </button>
    </div>

    <div class="benchmark-buttons">
      <button class="btn-benchmark" on:click={benchmarkUpdate}>
        Update 50 Tasks
      </button>
      <button class="btn-benchmark" on:click={benchmarkDelete}>
        Delete 50 Tasks
      </button>
      <button class="btn-clear" on:click={clearAllTasks}>
        Clear All
      </button>
    </div>

    {#if hasMetrics}
      <div class="metrics">
        <h3>Performance Metrics</h3>
        {#if metrics.renderTime > 0}
          <p>Last Render Time: {metrics.renderTime}ms</p>
        {/if}
        {#if metrics.updateTime > 0}
          <p>Last Update Time: {metrics.updateTime}ms</p>
        {/if}
        {#if metrics.deleteTime > 0}
          <p>Last Delete Time: {metrics.deleteTime}ms</p>
        {/if}
      </div>
    {/if}
  </div>

  <div class="task-list">
    <h2>Tasks ({tasks.length})</h2>
    {#if tasks.length === 0}
      <div class="empty-state">
        No tasks yet. Add one to get started!
      </div>
    {:else}
      {#each tasks as task (task.id)}
        <div class="task-item priority-{task.priority} {editingId === task.id ? 'editing' : ''}">
          {#if editingId === task.id}
            <div class="edit-inputs">
              <input bind:value={editName} type="text" />
              <select bind:value={editPriority}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div class="task-actions">
              <button class="btn-save" on:click={saveEdit}>Save</button>
              <button class="btn-cancel" on:click={cancelEdit}>Cancel</button>
            </div>
          {:else}
            <div class="task-info">
              <div class="task-name">{task.name}</div>
              <div class="task-priority">
                Priority: <span class="badge badge-{task.priority}">{task.priority}</span>
              </div>
            </div>
            <div class="task-actions">
              <button class="btn-edit" on:click={() => startEdit(task)}>Edit</button>
              <button class="btn-delete" on:click={() => deleteTask(task.id)}>Delete</button>
            </div>
          {/if}
        </div>
      {/each}
    {/if}
  </div>
</div>
