import React, { useEffect, useState } from "react";
import ToDoList from "./components/todolist";
import { fetchTasks, updateTask, deleteTask } from "./Api";
import "./App.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    const getTasks = async () => {
      const fetchedTasks = await fetchTasks();
      setTasks(fetchedTasks);
    };

    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    if (storedTasks.length === 0) {
      getTasks();
    } else {
      setTasks(storedTasks);
    }
  }, []);

  const storeTasksToLocalStorage = (tasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const handleAddTask = async () => {
    if (!newTaskTitle) return;

    const newTask = {
      id: tasks.length + 1,
      title: newTaskTitle,
      completed: false,
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]);
    setNewTaskTitle("");
    console.log(newTask);
    const allTasks = [newTask, ...tasks];
    storeTasksToLocalStorage(allTasks);
  };

  const handleTaskComplete = async (id) => {
    const taskToUpdate = tasks.find((task) => task.id === id);

    if (taskToUpdate) {
      const updatedTasks = tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      setTasks(updatedTasks);
      await updateTask(id, !taskToUpdate.completed);
      storeTasksToLocalStorage(updatedTasks);
    }
  };

  const handleDeleteTask = async (id) => {
    const isDeleted = await deleteTask(id);
    if (isDeleted) {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      storeTasksToLocalStorage(tasks.filter((task) => task.id !== id));
    }
  };

  return (
    <div className="container">
      <h1 className="title">To-Do List</h1>
      <div className="input-container">
        <input
          className="new-task-input"
          type="text"
          placeholder="New Task"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button className="add-button" onClick={handleAddTask}>
          Add
        </button>
      </div>
      <ToDoList
        tasks={tasks}
        onToggleComplete={handleTaskComplete}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
};
export default App;
