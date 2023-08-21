import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from "react-router-dom";

function Register() {

    // eslint-disable-next-line no-undef
    const [values,setValues] = useState({
        name:'',
        email:'',
        passsword:''
    })

    const navigate = useNavigate();


    const handleSubmit = (event) =>{
        event.preventDefault();
        axios.post('http://localhost:8081/register', values)
        .then(res => {
            if(res.data.Status === " Success "){
              navigate('/login');
            }else{

              alert("Error")
            }
        })
        .then(err => console.log(err));
    }

    return (
      <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
        <div className='text-center'>
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className='mb-3'>
              <label htmlFor='name'>
                <strong>Name</strong>
              </label>
              <input
                type='text'
                placeholder='Enter name'
                name='name'
                onChange={e => setValues({...values,name:e.target.value})}
                className='form-control rounded-0'
              />
            </div>
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
                onChange={e => setValues({...values,password:e.target.value})}
                className='form-control rounded-0'
              />
            </div>
            <button type='submit' className='btn btn-success w-100 rounded-0'>
              Sign Up
            </button>
            <Link to='/login' className='btn btn-default border w-100 bg-light rounded-0 '>
              Login
            </Link>
          </form>
        </div>
      </div>
    );
  }
  
  export default Register;
  