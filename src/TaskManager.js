import React, { useState, useEffect } from 'react';

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  useEffect(() => {
    // Fetch tasks from the backend and update the tasks state
    fetch('http://localhost:5000/api/tasks')
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error('Error fetching tasks', error));
  }, []);

  const handleCreateTask = () => {
    console.log(JSON.stringify(newTask));
    // Send a POST request to create a new task
    fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    })
      .then((response) => response.json())
      .then(() => {
        // After creating the task, fetch the updated list of tasks
        fetch('http://localhost:5000/api/tasks')
          .then((response) => response.json())
          .then((data) => setTasks(data));
      })
      .catch((error) => console.error('Error creating task', error));
  };

  const handleDeleteTask = (id) => {
    // remember when I wrote a URL that looked more like
    // /api/tasks/delete/${id} ?
    // there are lots of ways of doing this
    // as long as you get the ID of the thing to your Express server,
    // you're on the right path
    fetch('http://localhost:5000/api/tasks', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      // above when we were creating a task, it reads:
      // body: JSON.stringify(newTask)
      // this looks different because we're not  using a state object to
      // get data from a form -  the ID we need is part of what we're clicking on
      body: JSON.stringify({'id': id}),
    })
      .then((response) => response.json())
      .then(() => {
        // After creating the task, fetch the updated list of tasks
        fetch('http://localhost:5000/api/tasks')
          .then((response) => response.json())
          .then((data) => setTasks(data));
      })
      .catch((error) => console.error('Error fetching tasks', error));
  }

  return (
    <div>
      <h1>Task Manager</h1>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
        />
        <button onClick={handleCreateTask}>Add Task</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title} - {task.description} <span onClick={() => handleDeleteTask(task.id)}>x</span>
            {/* this onClick is what calls the code to delete this task
            it could be prettier, but it works for now
            in a real-world scenario it actually may be better to have a TaskInfo
            component, defined in a seperate file, that we create an instance of here */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskManager;
