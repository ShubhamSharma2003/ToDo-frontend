import React, { useState } from "react";
import { Button, Card, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ToDoApp.css';
import { useNavigate } from 'react-router-dom';
import {useEffect} from 'react';
import axios from 'axios';
import { fetchTodosByDate } from './services/api';


const storedUserId = localStorage.getItem('userId');


function formatDayMonth(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month} ${year} `;
};

//--------------------------------------------------------------------------------------------------------------

function Todo({ todo, index, markTodo, removeTodo }) {
  const handleMarkTodo = () => {
    markTodo(index);
  };

  return (
    <div className="todo">
      <span style={{ textDecoration: todo.isDone ? "line-through" : "" }}>{todo.text}</span>
      <p className="added-time">Added: {todo.addedTime}</p>
      {todo.isDone && todo.completedTime && (
        <p className="completed-time">Completed: {todo.completedTime}</p>
      )}
      <div>
        <Button variant="outline-success" onClick={handleMarkTodo}>Completed</Button>{' '}
        <Button variant="outline-danger" onClick={() => removeTodo(index)}>Delete</Button>
      </div>
    </div>
  );
};
//----------------------------------------------------------------------------------------------------------------

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
};

//--------------------------------------------------------------------------------------------------------------

function ToDoApp() {

  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [completedTodos, setCompletedTodos] = useState([]);


  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  useEffect(() => {

    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      axios.get(`http://localhost:8081/todos?id=${storedUserId}`)
        .then((res) => {
          console.log(res)
          if (res.data.Status === 'Success') {
            setAuth(true);
            setName(res.data.name);
            setUserId(storedUserId);
            setTodosByDate(res.data.data);
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
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, [])
  

//handling todo by date
const [todosByDate, setTodosByDate] = useState([]);
console.log("todo data", todosByDate)

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
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
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
  

  axios.post('http://localhost:8081/todo',{ text: text }, { withCredentials: true })
      .then(response => {
        console.log('Todo added successfully:', response.data);
      })
      .catch(error => {
        console.error('Error adding todo to the database:', error);
        if (error.response) {
          console.log('Status:', error.response.status);
        }
      });
  };

//mark todo for the COMPLETED BUTTON
  const markTodo = index => {
    const newTodos = [...todos];
    newTodos[index].isDone = true;
    newTodos[index].completedTime = new Date().toLocaleString(); 
    setTodos(newTodos);
  };



  
//mark todo as completed using the done button
const markTodoAsCompleted = (e, todos, id) => {
  const data= {
    id,
  };

axios.put('http://localhost:8081/mark/todo/completed', data)
    .then(response => {
      console.log('Todo status marked as completed:', response.data);
    })
    .catch(error => {
      console.error('Error marking todo as completed:', error);
    });


    //fetching the user data so that on clicling the Done button, it
    axios.get(`http://localhost:8081/todos?id=${storedUserId}`)
    .then((res) => {
      console.log(res);
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


};

//To STRIKE-OUT the todo by the DELETE BUTTON
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
          <Button variant="danger" onClick={handleDelete}>
            Logout
          </Button>
        </div>

        <FormTodo addTodo={addTodo} />
        <div>
          {todos.map((todo, index) => (
            <Card key={index}>
              <Card.Body>
                <Todo
                  index={index}
                  todo={todo}
                  markTodo={markTodo}
                  removeTodo={removeTodo}
                />
              </Card.Body>
            </Card>
          ))}
        </div>

        <div>
          {Object.keys(todosByDate).map((date) => (
            <div className="date_todo" key={date}>
              <h4>{formatDayMonth(date)}</h4>
              {todosByDate[date].map((todo, index) => (
                <Card key={index}>
                  {console.log("todo", todo)}
                  <Card.Body>
                    <p>{todo.todo}</p>
                    {todo.status !== null ? (
                      <p className="status">Status: {todo.status}</p>
                    ) : (
                      <p className="status_incomplete">Status: Incomplete</p>
                    )}
                    <div>
                      {todo.status !== "completed" && (
                        <Button
                          variant="outline-success"
                          onClick={(e) => markTodoAsCompleted(e, todo, todo.id)}>
                          Done
                        </Button>
                      )}
                    </div>
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
