import React, { useState } from 'react';
import styles from './Login.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ColorRing } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();
  const [selectRole, setSelectRole] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState('login');
  const [email, setEmail] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email1, setEmail1] = useState('');
  const [collName, setCollName] = useState('');
  const [password1, setPassword1] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') setName(value);
    if (name === 'email1') setEmail1(value);
    if (name === 'collegeName') setCollName(value);
    if (name === 'password1') setPassword1(value);
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setSelectRole(selectedRole);
    setRole(selectedRole);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (name === 'rollNo') setRollNo(value);
  };

  const submitLoginForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const data = { role, email, rollNo, password };

    if (role === 'admin') {
      try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URI}/AdminLogin`, data, {
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.data.error) {
          setIsLoading(false);
          toast.error(response.data.message || 'Login failed. Please try again.');
        } else {
          const { admin, token } = response.data;
          localStorage.setItem('token', token);
          toast.success('Logged in successfully!');
          setTimeout(() => navigate('/admin'), 2000);
        }
      } catch (error) {
        setIsLoading(false);
        toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
      }
    } else {
      setIsLoading(false);
      toast.error('Please select a role.');
    }
  };

  const submitRegisterForm = async (e) => {
    e.preventDefault();
    const data = { name, email: email1, collName, password: password1 };
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URI}/AdminRegister`, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.data.error) {
        toast.error(response.data.message || 'Registration failed. Please try again.');
      } else {
        toast.success('Registered successfully!');
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className={styles.main}>
      <ToastContainer />
      <div className={`${styles.wrapper}`}>
        {page === 'login' ? (
          <div className={styles.left}>
            <form onSubmit={submitLoginForm}>
              <h3 className='text-center text-white'>Login</h3>
              <div className={`form-check d-flex radio ${styles.role}`}>
                <div>
                  <select name='role' value={selectRole} onChange={handleRoleChange}>
                    <option value='Select'>--Select Role--</option>
                    <option value='admin'>Admin</option>
                    <option value='teacher'>Teacher</option>
                    <option value='student'>Student</option>
                  </select>
                </div>
              </div>
              {(role === 'admin' || role === 'teacher') && (
                <div className={styles.input}>
                  <div>
                    <input type='text' name='email' value={email} required onChange={handleChange} />
                    <span><label htmlFor='email'>Email</label></span>
                  </div>
                  <div>
                    <input type='password' name='password' value={password} required onChange={handleChange} />
                    <span><label htmlFor='password'>Password</label></span>
                  </div>
                </div>
              )}
              {role === 'student' && (
                <div className={styles.input}>
                  <div>
                    <input type='text' name='rollNo' value={rollNo} required onChange={handleChange} />
                    <span><label htmlFor='rollNo'>Roll Number</label></span>
                  </div>
                  <div>
                    <input type='text' name='email' value={email} required onChange={handleChange} />
                    <span><label htmlFor='email'>Email</label></span>
                  </div>
                  <div>
                    <input type='password' name='password' value={password} required onChange={handleChange} />
                    <span><label htmlFor='password'>Password</label></span>
                  </div>
                </div>
              )}
              <div className={`form-check d-flex ${styles.checkbox}`}>
                <div>
                  <input className={styles.checkboxinput} type='checkbox' id='flexCheckDefault' />
                  <label className={`form-check-label text-white ${styles.checklabel}`} htmlFor='flexCheckDefault'>
                    Keep Me Signed In
                  </label>
                </div>
                <div>
                  <Link to='/forgotpassword' className={`text-white ${styles.forgot}`}>Forgot Password?</Link>
                </div>
              </div>
              <button type='submit' className={styles.button}>
                {isLoading ? <ColorRing visible={true} height='40' width='40' colors={['white', 'white', 'white', 'white', 'white']} /> : 'Login'}
              </button>
              <div className={styles.noAccount}>
                <p className='text-white'>Don't have an Account <button onClick={() => setPage('register')} className={styles.button1}>Register</button></p>
              </div>
            </form>
          </div>
        ) : (
          <div className={styles.right}>
            <form onSubmit={submitRegisterForm}>
              <h3 className='text-center text-white'>Admin Registration</h3>
              <div className={styles.input}>
                <div>
                  <input type='text' name='name' value={name} required onChange={handleInputChange} />
                  <span><label htmlFor='name'>Name</label></span>
                </div>
                <div>
                  <input type='text' name='email1' value={email1} required onChange={handleInputChange} />
                  <span><label htmlFor='email'>Email</label></span>
                </div>
                <div>
                  <input type='text' name='collegeName' value={collName} required onChange={handleInputChange} />
                  <span><label htmlFor='collegeName'>College Name</label></span>
                </div>
                <div>
                  <input type='password' name='password1' value={password1} required onChange={handleInputChange} />
                  <span><label htmlFor='password'>Create Password</label></span>
                </div>
              </div>
              <button type='submit' className={styles.button}>Register</button>
              <div className={styles.noAccount}>
                <p className='text-white'>Already have an Account <button onClick={() => setPage('login')} className={styles.button1}>Login</button></p>
              </div>
            </form>
          </div>
        )}
        <div className={`${page === 'login' ? styles.rightContainer : styles.leftContainer}`}>
          <h1>Sign In to Student Attendance Management System</h1>
          <img src='/animated.png' alt='animated' width={400} height={400} />
        </div>
      </div>
    </div>
  );
};

export default Login;
