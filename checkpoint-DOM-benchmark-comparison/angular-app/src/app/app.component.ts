import { Component } from "@angular/core";

interface Task {
  id: number;
  name: string;
  priority: "low" | "medium" | "high";
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  tasks: Task[] = [];
  taskName = "";
  taskPriority: "low" | "medium" | "high" = "medium";
  editingId: number | null = null;
  editName = "";
  editPriority: "low" | "medium" | "high" = "medium";
  metrics = {
    renderTime: 0,
    updateTime: 0,
    deleteTime: 0,
  };

  get hasMetrics(): boolean {
    return (
      this.metrics.renderTime > 0 ||
      this.metrics.updateTime > 0 ||
      this.metrics.deleteTime > 0
    );
  }

  addTask(): void {
    if (this.taskName.trim()) {
      this.tasks.push({
        id: Date.now(),
        name: this.taskName,
        priority: this.taskPriority,
      });
      this.taskName = "";
    }
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  startEdit(task: Task): void {
    this.editingId = task.id;
    this.editName = task.name;
    this.editPriority = task.priority;
  }

  saveEdit(): void {
    const task = this.tasks.find((t) => t.id === this.editingId);
    if (task) {
      task.name = this.editName;
      task.priority = this.editPriority;
    }
    this.editingId = null;
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  private generateTasks(count: number): Task[] {
    const priorities: ("low" | "medium" | "high")[] = ["low", "medium", "high"];
    const newTasks: Task[] = [];
    for (let i = 0; i < count; i++) {
      newTasks.push({
        id: Date.now() + i,
        name: `Task ${i + 1}`,
        priority: priorities[Math.floor(Math.random() * priorities.length)],
      });
    }
    return newTasks;
  }

  benchmarkRender(count: number): void {
    const startTime = performance.now();
    this.tasks = this.generateTasks(count);
    requestAnimationFrame(() => {
      const endTime = performance.now();
      this.metrics.renderTime = parseFloat((endTime - startTime).toFixed(2));
      console.log(
        `Angular - Rendered ${count} tasks in ${this.metrics.renderTime}ms`
      );
    });
  }

  benchmarkUpdate(): void {
    if (this.tasks.length < 50) {
      alert("Please generate at least 100 tasks first");
      return;
    }

    const startTime = performance.now();
    for (let i = 0; i < 50; i++) {
      this.tasks[i].name = `Updated ${this.tasks[i].name}`;
    }
    requestAnimationFrame(() => {
      const endTime = performance.now();
      this.metrics.updateTime = parseFloat((endTime - startTime).toFixed(2));
      console.log(`Angular - Updated 50 tasks in ${this.metrics.updateTime}ms`);
    });
  }

  benchmarkDelete(): void {
    if (this.tasks.length < 50) {
      alert("Please generate at least 100 tasks first");
      return;
    }

    const startTime = performance.now();
    this.tasks = this.tasks.slice(50);
    requestAnimationFrame(() => {
      const endTime = performance.now();
      this.metrics.deleteTime = parseFloat((endTime - startTime).toFixed(2));
      console.log(`Angular - Deleted 50 tasks in ${this.metrics.deleteTime}ms`);
    });
  }

  clearAllTasks(): void {
    this.tasks = [];
    this.metrics = { renderTime: 0, updateTime: 0, deleteTime: 0 };
  }

  trackByTaskId(index: number, task: Task): number {
    return task.id;
  }
}
