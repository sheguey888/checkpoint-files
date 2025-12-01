import React, { useState } from "react";
import "./index.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [taskPriority, setTaskPriority] = useState("medium");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPriority, setEditPriority] = useState("medium");
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    updateTime: 0,
    deleteTime: 0,
  });

  const addTask = () => {
    if (taskName.trim()) {
      const newTask = {
        id: Date.now(),
        name: taskName,
        priority: taskPriority,
      };
      setTasks([...tasks, newTask]);
      setTaskName("");
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditName(task.name);
    setEditPriority(task.priority);
  };

  const saveEdit = () => {
    setTasks(
      tasks.map((task) =>
        task.id === editingId
          ? { ...task, name: editName, priority: editPriority }
          : task
      )
    );
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
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
    const newTasks = generateTasks(count);
    setTasks(newTasks);
    requestAnimationFrame(() => {
      const endTime = performance.now();
      const renderTime = (endTime - startTime).toFixed(2);
      setMetrics((prev) => ({ ...prev, renderTime }));
      console.log(`React - Rendered ${count} tasks in ${renderTime}ms`);
    });
  };

  const benchmarkUpdate = () => {
    if (tasks.length < 50) {
      alert("Please generate at least 100 tasks first");
      return;
    }

    const startTime = performance.now();
    const updatedTasks = tasks.map((task, index) => {
      if (index < 50) {
        return { ...task, name: `Updated ${task.name}` };
      }
      return task;
    });
    setTasks(updatedTasks);
    requestAnimationFrame(() => {
      const endTime = performance.now();
      const updateTime = (endTime - startTime).toFixed(2);
      setMetrics((prev) => ({ ...prev, updateTime }));
      console.log(`React - Updated 50 tasks in ${updateTime}ms`);
    });
  };

  const benchmarkDelete = () => {
    if (tasks.length < 50) {
      alert("Please generate at least 100 tasks first");
      return;
    }

    const startTime = performance.now();
    const remainingTasks = tasks.slice(50);
    setTasks(remainingTasks);
    requestAnimationFrame(() => {
      const endTime = performance.now();
      const deleteTime = (endTime - startTime).toFixed(2);
      setMetrics((prev) => ({ ...prev, deleteTime }));
      console.log(`React - Deleted 50 tasks in ${deleteTime}ms`);
    });
  };

  const clearAllTasks = () => {
    setTasks([]);
    setMetrics({ renderTime: 0, updateTime: 0, deleteTime: 0 });
  };

  return (
    <div className="app">
      <h1>React Todo Benchmark</h1>

      <div className="controls">
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter task name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTask()}
          />
          <select
            value={taskPriority}
            onChange={(e) => setTaskPriority(e.target.value)}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <button className="btn-add" onClick={addTask}>
            Add Task
          </button>
        </div>

        <div className="benchmark-buttons">
          <button
            className="btn-benchmark"
            onClick={() => benchmarkRender(100)}
          >
            Generate 100 Tasks
          </button>
          <button
            className="btn-benchmark"
            onClick={() => benchmarkRender(500)}
          >
            Generate 500 Tasks
          </button>
          <button
            className="btn-benchmark"
            onClick={() => benchmarkRender(1000)}
          >
            Generate 1000 Tasks
          </button>
        </div>

        <div className="benchmark-buttons">
          <button className="btn-benchmark" onClick={benchmarkUpdate}>
            Update 50 Tasks
          </button>
          <button className="btn-benchmark" onClick={benchmarkDelete}>
            Delete 50 Tasks
          </button>
          <button className="btn-clear" onClick={clearAllTasks}>
            Clear All
          </button>
        </div>

        {(metrics.renderTime > 0 ||
          metrics.updateTime > 0 ||
          metrics.deleteTime > 0) && (
          <div className="metrics">
            <h3>Performance Metrics</h3>
            {metrics.renderTime > 0 && (
              <p>Last Render Time: {metrics.renderTime}ms</p>
            )}
            {metrics.updateTime > 0 && (
              <p>Last Update Time: {metrics.updateTime}ms</p>
            )}
            {metrics.deleteTime > 0 && (
              <p>Last Delete Time: {metrics.deleteTime}ms</p>
            )}
          </div>
        )}
      </div>

      <div className="task-list">
        <h2>Tasks ({tasks.length})</h2>
        {tasks.length === 0 ? (
          <div className="empty-state">
            No tasks yet. Add one to get started!
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`task-item priority-${task.priority} ${
                editingId === task.id ? "editing" : ""
              }`}
            >
              {editingId === task.id ? (
                <>
                  <div className="edit-inputs">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value)}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="task-actions">
                    <button className="btn-save" onClick={saveEdit}>
                      Save
                    </button>
                    <button className="btn-cancel" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="task-info">
                    <div className="task-name">{task.name}</div>
                    <div className="task-priority">
                      Priority:{" "}
                      <span className={`badge badge-${task.priority}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  <div className="task-actions">
                    <button
                      className="btn-edit"
                      onClick={() => startEdit(task)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
