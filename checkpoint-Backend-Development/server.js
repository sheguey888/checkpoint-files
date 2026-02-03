const http = require("http");
const url = require("url");

// In-memory data store
let todos = [];
let nextId = 1;

// Helper functions
const parseRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(new Error("Invalid JSON"));
      }
    });
  });
};

const sendResponse = (res, statusCode, data) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};

const findTodoById = (id) => {
  return todos.find((todo) => todo.id === id);
};

const validateTodo = (data) => {
  if (
    !data.title ||
    typeof data.title !== "string" ||
    data.title.trim() === ""
  ) {
    return {
      valid: false,
      error: "Title is required and must be a non-empty string",
    };
  }
  return { valid: true };
};

// Request handler
const server = http.createServer(async (req, res) => {
  // Enable CORS for testing purposes
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // GET /todos - List all todos
  if (path === "/todos" && method === "GET") {
    sendResponse(res, 200, {
      success: true,
      data: todos,
      count: todos.length,
    });
    return;
  }

  // GET /todos/:id - Get single todo
  const singleTodoMatch = path.match(/^\/todos\/(\d+)$/);

  if (singleTodoMatch && method === "GET") {
    const id = parseInt(singleTodoMatch[1]);
    const todo = findTodoById(id);

    if (!todo) {
      sendResponse(res, 404, {
        success: false,
        error: `Todo with id ${id} not found`,
      });
      return;
    }

    sendResponse(res, 200, {
      success: true,
      data: todo,
    });
    return;
  }

  // POST /todos - Create new todo
  if (path === "/todos" && method === "POST") {
    try {
      const body = await parseRequestBody(req);
      const validation = validateTodo(body);

      if (!validation.valid) {
        sendResponse(res, 400, {
          success: false,
          error: validation.error,
        });
        return;
      }

      const newTodo = {
        id: nextId++,
        title: body.title.trim(),
        completed: body.completed === true ? true : false,
      };

      todos.push(newTodo);

      sendResponse(res, 201, {
        success: true,
        message: "Todo created successfully",
        data: newTodo,
      });
      return;
    } catch (error) {
      sendResponse(res, 400, {
        success: false,
        error: "Invalid JSON in request body",
      });
      return;
    }
  }

  // PUT /todos/:id - Update todo
  if (singleTodoMatch && method === "PUT") {
    const id = parseInt(singleTodoMatch[1]);
    const todo = findTodoById(id);

    if (!todo) {
      sendResponse(res, 404, {
        success: false,
        error: `Todo with id ${id} not found`,
      });
      return;
    }

    try {
      const body = await parseRequestBody(req);

      // Validate title if provided
      if (body.title !== undefined) {
        if (typeof body.title !== "string" || body.title.trim() === "") {
          sendResponse(res, 400, {
            success: false,
            error: "Title must be a non-empty string",
          });
          return;
        }
        todo.title = body.title.trim();
      }

      // Update completed status if provided
      if (body.completed !== undefined) {
        todo.completed = body.completed === true;
      }

      sendResponse(res, 200, {
        success: true,
        message: "Todo updated successfully",
        data: todo,
      });
      return;
    } catch (error) {
      sendResponse(res, 400, {
        success: false,
        error: "Invalid JSON in request body",
      });
      return;
    }
  }

  // DELETE /todos/:id - Delete todo
  if (singleTodoMatch && method === "DELETE") {
    const id = parseInt(singleTodoMatch[1]);
    const index = todos.findIndex((todo) => todo.id === id);

    if (index === -1) {
      sendResponse(res, 404, {
        success: false,
        error: `Todo with id ${id} not found`,
      });
      return;
    }

    const deletedTodo = todos.splice(index, 1)[0];

    sendResponse(res, 200, {
      success: true,
      message: "Todo deleted successfully",
      data: deletedTodo,
    });
    return;
  }

  // Handle 404 for undefined routes
  sendResponse(res, 404, {
    success: false,
    error: "Route not found",
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 To-Do API Server running on http://localhost:${PORT}`);
});
