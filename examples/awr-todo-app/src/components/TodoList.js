import React from "react";
import { TodoHeader } from "./TodoHeader";
import { todoStore } from "../store";

const pluralize = count =>
  count > 1 ? `There are ${count} todos.` : `There is ${count} todo.`;

export default function TodoList() {
  const [todos, setTodos] = useAwr(todoStore);

  const header =
    todos.length === 0 ? (
      <h4>Yay! All todos are done! Take a rest!</h4>
    ) : (
      <TodoHeader>
        <span className="float-right">{pluralize(todos.length)}</span>
      </TodoHeader>
    );
  return (
    <div className="row">
      <div className="col-md-12">
        <div className="row">
          <div className="col-md-12">
            <br />
            {header}
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <ul className="list-group">
              {todos.map(t => (
                <li key={t} className="list-group-item">
                  {t}
                  <button
                    className="float-right btn btn-danger btn-sm"
                    style={{ marginLeft: 10 }}
                    onClick={() =>
                      setTodos(prev =>
                        prev.map(todo => ({
                          ...todo,
                          status: todo.id === t.id ? "complete" : todo.status
                        }))
                      )
                    }
                  >
                    Complete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
