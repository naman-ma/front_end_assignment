import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function Signup() {

  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    cpassword: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    cpassword: '',
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    cpassword: false,
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    if (name === 'name') {
      if (value === '') {
        setErrors({
          ...errors,
          [name]: 'This field is required',
        });
      } else if (value.length < 3) {
        setErrors({
          ...errors,
          [name]: 'contains at least 3 characters',
        });
      } else {
        setErrors({ ...errors, [name]: '' });
        setData({ ...data, [name]: value });
      }
    } else if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (value === '') {
        setErrors({
          ...errors,
          [name]: 'This field is required',
        });
      } else if (!emailRegex.test(value)) {
        setErrors({
          ...errors,
          [name]: 'Fill valid email',
        });
      } else {
        setErrors({ ...errors, [name]: '' });
      }
    } else if (name === 'password') {
      if (value === '') {
        setErrors({
          ...errors,
          [name]: 'This field is required',
        });
      } else if (value.length < 8) {
        setErrors({
          ...errors,
          [name]: 'Password must contain at least 8 characters',
        });
      } else {
        setErrors({ ...errors, [name]: '' });
      }
    } else if (name === 'cpassword') {
      if (value === '') {
        setErrors({
          ...errors,
          [name]: 'This field is required',
        });
      } else if (value !== data.password) {
        setErrors({
          ...errors,
          [name]: 'Password and confirm password do not match',
        });
      } else {
        setErrors({ ...errors, [name]: '' });
      }
    }

    setData({ ...data, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const formHasErrors = Object.values(errors).some((error) => error !== '');
    console.log('formHasErrors: ', formHasErrors);
    if (formHasErrors) {
      return;
    }
    try {
      console.log('Form submitted:', data);
      const response = await axios.post(`http://192.168.1.108:3002/signup`, data);
      console.log('Response:', response);
      if (response.status === 201) {
        toast.success(response.data)
      }
    } catch (error) {
      if (error.response.status === 422) {
        toast.error(error.response.data.errors[0])
      } else {
        toast.error("Something went Wrong")
      }
    }
  }
  return (
    <div>
      <div className='bg-light p-3 mt-5 container' style={{ width: "30%" }}>
        <h3 className='bg-secondary text-white text-center p-3'>SIGNUP</h3>
        <form className='text-dark'>

        <div className='form-group'>
              <label htmlFor='name'>Full Name:</label>
              <input
                type='text'
                className={`form-control ${touched.name && errors.name.trim() ? 'is-invalid' : ''
                  }`}
                id='name'
                placeholder='Enter name'
                name='name'
                value={data.name}
                onChange={handleChange}
                onBlur={handleChange}
                required
              />
              {touched.name && (
                <span className='text-danger'>{errors.name}</span>
              )}
            </div>

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
              onBlur={handleChange}
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
              onBlur={handleChange}
              required
            />
            {touched.password && <span className='text-danger'>{errors.password}</span>}
          </div>

          <div className='form-group'>
            <label htmlFor='cpassword'>Confirm password:</label>
            <input
              type='password'
              className={`form-control ${touched.cpassword && errors.cpassword ? 'is-invalid' : ''}`}
              id='cpassword'
              placeholder='Confirm password'
              name='cpassword'
              value={data.cpassword}
              onChange={handleChange}
              onBlur={handleChange}
              required
            />
            {touched.cpassword && <span className='text-danger'>{errors.cpassword}</span>}
          </div>

          <button type='submit' className='btn btn-primary' onClick={handleSubmit}>
            Sign Up
          </button>
        </form>
<div>
  <Link to='/'>Go to the login...</Link>
</div>

      </div>
    </div>
  );
}

export default Signup;
