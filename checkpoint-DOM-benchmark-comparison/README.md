# DOM Benchmark Comparison

This project benchmarks the performance of React, Angular, Vue, and Svelte frameworks in handling DOM manipulations through a to-do list application.

## Project Structure

- `/react-app` - React implementation
- `/vue-app` - Vue implementation
- `/svelte-app` - Svelte implementation
- `/angular-app` - Angular implementation
- `/benchmark-results.md` - Performance comparison results

## Features

Each implementation includes:

- Add tasks with name and priority
- View all tasks with priority levels
- Update tasks (edit name or priority)
- Remove tasks from the list
- Performance measurement utilities

## Running the Applications

### React

```bash
cd react-app
npm install
npm start
```

### Vue

```bash
cd vue-app
npm install
npm run dev
```

### Svelte

```bash
cd svelte-app
npm install
npm run dev
```

### Angular

```bash
cd angular-app
npm install
ng serve
```

## Benchmark Operations

Each application measures:

1. **Initial Rendering**: Time to render 100, 500, and 1000 tasks
2. **DOM Updates**: Time to update 50 tasks
3. **DOM Deletion**: Time to delete 50 tasks
