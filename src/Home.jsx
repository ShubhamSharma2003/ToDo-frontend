
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; 

function Home() {
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
      location.reload(true);
      localStorage.setItem('token', ""); 
      localStorage.setItem('userId', "")
    }).catch(err => console.log(err));
  };

  return (
    <div className="container mt-4">
      {
        auth ? (
          <div>
            <h3>You Are Authorized, Welome {name}</h3>
            <button className="btn btn-danger" onClick={handleDelete}>Logout</button>
            <Link to="/todo" className="btn btn-primary">Go to Todo App</Link>
          </div>
        ) : (
          <div>
            <h3>{message}</h3>
            <h3> Login Now</h3>
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          </div>
        )
      }
    </div>
  );
}

export default Home;
