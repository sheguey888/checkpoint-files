<template>
  <div class="app">
    <h1>Vue Todo Benchmark</h1>

    <div class="controls">
      <div class="input-group">
        <input
          v-model="taskName"
          type="text"
          placeholder="Enter task name"
          @keypress.enter="addTask"
        />
        <select v-model="taskPriority">
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <button class="btn-add" @click="addTask">Add Task</button>
      </div>

      <div class="benchmark-buttons">
        <button class="btn-benchmark" @click="benchmarkRender(100)">
          Generate 100 Tasks
        </button>
        <button class="btn-benchmark" @click="benchmarkRender(500)">
          Generate 500 Tasks
        </button>
        <button class="btn-benchmark" @click="benchmarkRender(1000)">
          Generate 1000 Tasks
        </button>
      </div>

      <div class="benchmark-buttons">
        <button class="btn-benchmark" @click="benchmarkUpdate">
          Update 50 Tasks
        </button>
        <button class="btn-benchmark" @click="benchmarkDelete">
          Delete 50 Tasks
        </button>
        <button class="btn-clear" @click="clearAllTasks">Clear All</button>
      </div>

      <div v-if="hasMetrics" class="metrics">
        <h3>Performance Metrics</h3>
        <p v-if="metrics.renderTime > 0">
          Last Render Time: {{ metrics.renderTime }}ms
        </p>
        <p v-if="metrics.updateTime > 0">
          Last Update Time: {{ metrics.updateTime }}ms
        </p>
        <p v-if="metrics.deleteTime > 0">
          Last Delete Time: {{ metrics.deleteTime }}ms
        </p>
      </div>
    </div>

    <div class="task-list">
      <h2>Tasks ({{ tasks.length }})</h2>
      <div v-if="tasks.length === 0" class="empty-state">
        No tasks yet. Add one to get started!
      </div>
      <div
        v-for="task in tasks"
        :key="task.id"
        :class="[
          'task-item',
          `priority-${task.priority}`,
          { editing: editingId === task.id },
        ]"
      >
        <template v-if="editingId === task.id">
          <div class="edit-inputs">
            <input v-model="editName" type="text" />
            <select v-model="editPriority">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div class="task-actions">
            <button class="btn-save" @click="saveEdit">Save</button>
            <button class="btn-cancel" @click="cancelEdit">Cancel</button>
          </div>
        </template>
        <template v-else>
          <div class="task-info">
            <div class="task-name">{{ task.name }}</div>
            <div class="task-priority">
              Priority:
              <span :class="['badge', `badge-${task.priority}`]">{{
                task.priority
              }}</span>
            </div>
          </div>
          <div class="task-actions">
            <button class="btn-edit" @click="startEdit(task)">Edit</button>
            <button class="btn-delete" @click="deleteTask(task.id)">
              Delete
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";

export default {
  name: "App",
  setup() {
    const tasks = ref([]);
    const taskName = ref("");
    const taskPriority = ref("medium");
    const editingId = ref(null);
    const editName = ref("");
    const editPriority = ref("medium");
    const metrics = ref({
      renderTime: 0,
      updateTime: 0,
      deleteTime: 0,
    });

    const hasMetrics = computed(() => {
      return (
        metrics.value.renderTime > 0 ||
        metrics.value.updateTime > 0 ||
        metrics.value.deleteTime > 0
      );
    });

    const addTask = () => {
      if (taskName.value.trim()) {
        tasks.value.push({
          id: Date.now(),
          name: taskName.value,
          priority: taskPriority.value,
        });
        taskName.value = "";
      }
    };

    const deleteTask = (id) => {
      tasks.value = tasks.value.filter((task) => task.id !== id);
    };

    const startEdit = (task) => {
      editingId.value = task.id;
      editName.value = task.name;
      editPriority.value = task.priority;
    };

    const saveEdit = () => {
      const task = tasks.value.find((t) => t.id === editingId.value);
      if (task) {
        task.name = editName.value;
        task.priority = editPriority.value;
      }
      editingId.value = null;
    };

    const cancelEdit = () => {
      editingId.value = null;
    };

    const generateTasks = (count) => {
      const priorities = ["low", "medium", "high"];
      const newTasks = [];
      for (let i = 0; i < count; i++) {
        newTasks.push({
          id: Date.now() + i,
          name: `Task ${i + 1}`,
          priority: priorities[Math.floor(Math.random() * priorities.length)],
        });
      }
      return newTasks;
    };

    const benchmarkRender = (count) => {
      const startTime = performance.now();
      tasks.value = generateTasks(count);
      requestAnimationFrame(() => {
        const endTime = performance.now();
        const renderTime = (endTime - startTime).toFixed(2);
        metrics.value.renderTime = renderTime;
        console.log(`Vue - Rendered ${count} tasks in ${renderTime}ms`);
      });
    };

    const benchmarkUpdate = () => {
      if (tasks.value.length < 50) {
        alert("Please generate at least 100 tasks first");
        return;
      }

      const startTime = performance.now();
      for (let i = 0; i < 50; i++) {
        tasks.value[i].name = `Updated ${tasks.value[i].name}`;
      }
      requestAnimationFrame(() => {
        const endTime = performance.now();
        const updateTime = (endTime - startTime).toFixed(2);
        metrics.value.updateTime = updateTime;
        console.log(`Vue - Updated 50 tasks in ${updateTime}ms`);
      });
    };

    const benchmarkDelete = () => {
      if (tasks.value.length < 50) {
        alert("Please generate at least 100 tasks first");
        return;
      }

      const startTime = performance.now();
      tasks.value = tasks.value.slice(50);
      requestAnimationFrame(() => {
        const endTime = performance.now();
        const deleteTime = (endTime - startTime).toFixed(2);
        metrics.value.deleteTime = deleteTime;
        console.log(`Vue - Deleted 50 tasks in ${deleteTime}ms`);
      });
    };

    const clearAllTasks = () => {
      tasks.value = [];
      metrics.value = { renderTime: 0, updateTime: 0, deleteTime: 0 };
    };

    return {
      tasks,
      taskName,
      taskPriority,
      editingId,
      editName,
      editPriority,
      metrics,
      hasMetrics,
      addTask,
      deleteTask,
      startEdit,
      saveEdit,
      cancelEdit,
      benchmarkRender,
      benchmarkUpdate,
      benchmarkDelete,
      clearAllTasks,
    };
  },
};
</script>
