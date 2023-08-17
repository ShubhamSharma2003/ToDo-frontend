import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { header } from 'express-validator';

function Login() {
  // eslint-disable-next-line no-undef
  const [values,setValues] = useState({
    email:'',
    passsword:''
})

const navigate = useNavigate();

axios.defaults.withCredentials = true;

const handleSubmit = (event) => {
  event.preventDefault();
  axios.post('http://localhost:8081/login', values, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      if (res.data.Status === 'Success') {
        const token = res.data.token;
        const userId  = res.data.id;

        localStorage.setItem('token', token); // storing token in local storage
        localStorage.setItem('userId', userId) //storing user_id in the local storage

        axios.defaults.headers.common['Authorization'] = `${token}`;  
        navigate('/');
      } else {
        alert(res.data.Error);
      }
    })
    .catch((err) => console.log(err));
};


    return (
      <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
        <div className='text-center'>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className='mb-3'>
              <label htmlFor='email'>Email</label>
              <input
                type='email'
                placeholder='Enter email'
                name='email'
                onChange={e => setValues({...values,email:e.target.value})}
                className='form-control rounded-0'
              />
            </div>
            <div className='mb-3'>
              <label htmlFor='password'>Password</label>
              <input
                type='password'
                placeholder='Enter Password'
                name='password'
                autoComplete="on"
                onChange={e => setValues({...values,password:e.target.value})}
                className='form-control rounded-0'
              />
            </div>
            <button type='submit' className='btn btn-success w-100 rounded-0'>Login </button>
            <Link to="/register" className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>
              Sign Up
            </Link>
          </form>
        </div>
      </div>
    );
  }
  
  export default Login;
  