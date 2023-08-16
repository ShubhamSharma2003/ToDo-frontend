import React, { useState } from "react";
import { Button, Card, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ToDoApp.css';
import { useNavigate } from 'react-router-dom';
import {useEffect} from 'react';
import axios from 'axios';



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
      <Button variant="primary mb-3" type="submit">
        Submit
      </Button>
    </Form>
  );
}

function ToDoApp() {

  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:8081').then((res) => {
      if (res.data.Status === 'Success') {
        setAuth(true);
        setName(res.data.name);
      } else {
        setAuth(false);
        setMessage(res.data.Error);
      }
    });
  }, []);

  const handleDelete = () => {
    axios.get('http://localhost:8081/logout').then((res) => {
      
      navigate('/login');
    }).catch(err => console.log(err));
  };

  const [todos, setTodos] = useState([]);
  

  // const addTodo = text => {
  //   const newTodo = {
  //     text: text,
  //     isDone: false,
  //     addedTime: new Date().toLocaleString()
  //   };
  //   const newTodos = [...todos, newTodo];
  //   setTodos(newTodos);
  // };

  const addTodo = text => {
    const newTodo = {
      text: text,
      isDone: false,
      addedTime: new Date().toLocaleString()
    };
    const newTodos = [...todos, newTodo];
    setTodos(newTodos);
  

    axios.post(
      'http://localhost:8081/todo',
      { text: text }, 
      { withCredentials: true }
    )
      .then(response => {
        console.log('Todo added successfully:', response.data);
        console.log('Status:', response.status); // Loging the response status
      })
      .catch(error => {
        console.error('Error adding todo to the database:', error);
        if (error.response) {
          console.log('Status:', error.response.status); // Logging the error response status
        }
      });
  };
  
  
  

  const markTodo = index => {
    const newTodos = [...todos];
    newTodos[index].isDone = true;
    newTodos[index].completedTime = new Date().toLocaleString(); 
    setTodos(newTodos);
  };

  const removeTodo = index => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };


  return (
    <div className="app">
      <div className="container">
        <h1 className="text-center mb-4">Todo List</h1>
        <Button variant="danger" onClick={handleDelete} >Logout</Button>
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
      </div>
    </div>
  );
}

export default ToDoApp;
