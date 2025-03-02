import React, { useState } from 'react';
import styles from './Register.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import 'dotenv/config'

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [collName, setCollName] = useState('');
    const [password, setPassword] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'name') {
            setName(value);
        }
        if (name === 'email') {
            setEmail(value);
        }
        if (name === 'collegeName') {
            setCollName(value);
        }
        if (name === 'password') {
            setPassword(value);
        }
    };

    const submitForm = async (e) => {
        e.preventDefault();
        const data = {
            name,
            email,
            collName,
            password
        };
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URI}/AdminRegister`, data, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.data.error) {
                console.log(response.data.error);
            } else {
                const { admin } = response.data;
                setTimeout(() => {
                    navigate('/login');
                }, 3000);

            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='main pt-5'>
            <div className={styles.container}>
                <div className={styles.left}>
                    <h1>Sign In to Student Attendance Management System</h1>
                    <img src="/animated.png" alt="animated" width={400} height={400} />
                </div>
                <div className={styles.right}>
                    <form onSubmit={submitForm}>
                        <h3 className='text-center'>Admin Registration</h3>
                        <div className={styles.input}>
                            <div>
                                <input type="text" name='name' value={name} onChange={handleInputChange} required />
                                <span><label htmlFor="name">Name</label></span>
                            </div>
                            <div>
                                <input type="text" name='email' value={email} onChange={handleInputChange} required />
                                <span><label htmlFor="email">Email</label></span>
                            </div>
                            <div>
                                <input type="text" name='collegeName' value={collName} onChange={handleInputChange} required />
                                <span><label htmlFor="collegeName">College Name</label></span>
                            </div>
                            <div>
                                <input type="password" name='password' value={password} onChange={handleInputChange} required />
                                <span><label htmlFor="password">Create Password</label></span>
                            </div>
                        </div>
                        <button type="submit" className={styles.button}>Register</button>
                        <div className={styles.noAccount}>
                            <p>Already have an Account<Link to='/login' className={styles.button1}>Login</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
