import { useEffect, useState } from "react"
import "./App.css"

interface Todo {
  id: number
  content: string
  completed: boolean
}

function App() {
  const apiUrl = import.meta.env.VITE_API_URL
  const [todos, setTodos] = useState<Todo[]>([])

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch(`${apiUrl}/todos`)
      const data = await response.json()
      setTodos(data)
    }
    fetchTodos()
  }, [apiUrl])

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const newTodo = {
      content: formData.get("content"),
    }

    const response = await fetch(`${apiUrl}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodo),
    })
    const data = await response.json()
    setTodos((prevTodos) => [...prevTodos, data])
  }

  const handleDeleteTodo = async (id: number) => {
    await fetch(`${apiUrl}/todos/${id}`, {
      method: "DELETE",
    })
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id))
  }

  const handleToggleTodo = async (id: number) => {
    const todo = todos.find((todo) => todo.id === id)
    if (!todo) return
    const updatedTodo = {
      ...todo,
      completed: !todo.completed,
    }
    await fetch(`${apiUrl}/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTodo),
    })
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
    )
  }

  return (
    <main>
      <h1>SapKok 😎</h1>
      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          name="content"
          placeholder="Add a new todo"
          required
        />
        <button type="submit">Add Todo</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.content} - {todo.completed ? "Completed" : "Not Completed"}
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleTodo(todo.id)}
            />
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
