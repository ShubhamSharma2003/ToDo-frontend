import React, { useState } from "react";
import { Button, Card, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ToDoApp.css';
import { useNavigate } from 'react-router-dom';
import {useEffect} from 'react';
import axios from 'axios';
import { fetchTodosByDate } from './services/api';

function formatDayMonth(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month} ${year} `;
}

function Todo({ todo, index, markTodo, removeTodo }) {
  return (
    <div className="todo">
      <span style={{ textDecoration: todo.isDone ? "line-through" : "" }}>{todo.text}</span>
      <p className="added-time">Added: {todo.addedTime}</p>
      {todo.isDone && todo.completedTime && (
        <p className="completed-time">Completed: {todo.completedTime}</p>
      )}
      <div>
        <Button variant="outline-success" onClick={() => markTodo(index)}>Completed</Button>{' '}
        <Button variant="outline-danger" onClick={() => removeTodo(index)}>Delete</Button>
      </div>
    </div>
  );
}

function FormTodo({ addTodo }) {
  const [value, setValue] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    addTodo(value);
    setValue("");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label><b>Add Todo</b></Form.Label>
        <Form.Control type="text" className="input" value={value} onChange={e => setValue(e.target.value)} placeholder="Add new todo" />
      </Form.Group>
      <div className="button-container">
      <Button variant="primary mb-3" type="submit">Submit</Button>
      </div>
    </Form>
  );
}

function ToDoApp() {

  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;


  useEffect(() => {

    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      axios.get(`http://localhost:8081/todos?id=${storedUserId}`)
        .then((res) => {
          if (res.data.Status === 'Success') {
            setAuth(true);
            setName(res.data.name);
            setUserId(storedUserId);
            setTodosByDate(res.data.todosByDate);
          } else {
            setAuth(false);
            setMessage(res.data.Error);
          }
        })
        .catch((err) => console.log(err));
    } else {
      setAuth(false);
      setMessage('User ID not found');
    }
  ;;;;;;;;
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, [])
  


//handling todo by date
const [todosByDate, setTodosByDate] = useState([]);

  const handleFetchTodosByDate = () => {
    fetchTodosByDate()
      .then(response => {
        if (response.data.Status === 'Success') {
          setTodosByDate(response.data.todosByDate);
        }
      })
      .catch(error => {
        console.error('Error fetching todos:', error);
      });
  };


//logout functionality
  const handleDelete = () => {
    axios.get('http://localhost:8081/logout').then((res) => {
      
      navigate('/login');
    }).catch(err => console.log(err));
  };


//adding the todos
  const [todos, setTodos] = useState([]);
  
  const addTodo = text => {
    const newTodo = {
      text: text,
      isDone: false,
      addedTime: new Date().toLocaleString()
    };
    const newTodos = [...todos, newTodo];
    setTodos(newTodos);
    //localStorage with the todos to prevent loss during reload
    localStorage.setItem('todos', JSON.stringify(newTodos));
  

    axios.post(
      'http://localhost:8081/todo',
      { text: text }, 
      { withCredentials: true }
    )
      .then(response => {
        console.log('Todo added successfully:', response.data);
        console.log('Status:', response.status);
      })
      .catch(error => {
        console.error('Error adding todo to the database:', error);
        if (error.response) {
          console.log('Status:', error.response.status);
        }
      });
  };
  
  
  //mark if the todo is completed or not
  const markTodo = index => {
    const newTodos = [...todos];
    newTodos[index].isDone = true;
    newTodos[index].completedTime = new Date().toLocaleString(); 
    setTodos(newTodos);
  };

  //To remove the todo 
  const removeTodo = index => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

//UI form 
  return (
    <div className="app">
      <div className="container">
        <h1 className="text-center mb-4">Todo List</h1>
        <div className="button-container">
        <Button variant="primary" onClick={handleFetchTodosByDate}>Get Todos</Button>
        <Button variant="danger" onClick={handleDelete}>Logout</Button>
        </div>

        <FormTodo addTodo={addTodo} />
        <div>
          {todos.map((todo, index) => (
            <Card key={index}>
              <Card.Body>
                <Todo index={index} todo={todo} markTodo={markTodo} removeTodo={removeTodo} />
              </Card.Body>
            </Card>
          ))}
        </div>
        <div>
          {todosByDate.map(dateGroup => (
            <div className="date_todo" key={dateGroup.date}>
              <h4>{formatDayMonth(dateGroup.date)}</h4>
              {dateGroup.todos.map((todo, index) => (
                <Card key={index}>
                  <Card.Body>
                    <p>{todo}</p>
                  </Card.Body>
                </Card>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ToDoApp;
