import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!value.trim()) {
        setErrors({ ...errors, [name]: 'This field is required' });
      } else if (!emailRegex.test(value)) {
        setErrors({ ...errors, [name]: 'Enter a valid email address' });
      } else {
        setErrors({ ...errors, [name]: '' });
      }
    } else if (name === 'password') {
      if (!value.trim()) {
        setErrors({ ...errors, [name]: 'This field is required' });
      } else if (value.length < 8) {
        setErrors({ ...errors, [name]: 'Password must be at least 8 characters long' });
      } else {
        setErrors({ ...errors, [name]: '' });
      }
    }
    setData({ ...data, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(data, 'data');

    try {
      const response = await axios.post('http://192.168.1.108:3000/login', data);
      console.log('response: ', response);
      if (response.status === 201) {
        toast.success("Login Successfully");
        localStorage.setItem('Info', JSON.stringify(response.data));
        navigate('/dashboard');
      }
    } catch (error) {
      // Handle error here
      if (error.response && error.response.status === 401) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Something went wrong");
      }
    }
  }

  return (
    <div className='container mt-5 bg-light p-4' style={{ width: '500px' }}>
      <h3 className='bg-secondary p-3'>LOGIN</h3>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='email'>Email:</label>
          <input
            type='email'
            className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`}
            id='email'
            placeholder='Enter email'
            name='email'
            value={data.email}
            onChange={handleChange}
            required
          />
          {touched.email && <span className='text-danger'>{errors.email}</span>}
        </div>

        <div className='form-group'>
          <label htmlFor='password'>Password:</label>
          <input
            type='password'
            className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`}
            id='password'
            placeholder='Enter password'
            name='password'
            value={data.password}
            onChange={handleChange}
            required
          />
          {touched.password && <span className='text-danger'>{errors.password}</span>}
        </div>

        <button type='submit' className='btn btn-primary'>
          Login
        </button>
      </form>
      <div className='mt-2'>
        <Link to='/register'>Register Yourself.......</Link>
      </div>
    </div>
  )
}

export default Login;
