import { awr } from "awr";
const PERSIST_KEY = "awr-todos";
const todoStore = awr(JSON.parse(localStorage.getItem(PERSIST_KEY) || "[]"));

todoStore.subscribe(todos =>
  localStorage.setItem(PERSIST_KEY, JSON.stringify(todos))
);

const completedTodos = awr(todoStore, todos =>
  todos.filter(item => item.status === "completed")
);

const activeTodos = awr(todoStore, todos =>
  todos.filter(item => item.status !== "completed")
);

export { todoStore, completedTodos, activeTodos };
