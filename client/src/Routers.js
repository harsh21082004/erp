import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import TeachersPage from './Components/TeachersPage';
import StudentsPage from './Components/StudentsPage';
import Login from './Components/Login';
import Register from './Components/Register';
import AdminDashboard from './Components/Admin/AdminDashboard';
import Analysis from './Components/Admin/Analysis';
// import { MenuContext, menu } from './Context/OpenMenu';
import { jwtDecode } from "jwt-decode";
import Courses from './Components/Admin/Courses';
import Classes from './Components/Admin/Classes';
import LoadingBar from 'react-top-loading-bar';
import Subjects from './Components/Admin/Subjects';

const Routers = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState('')
  const [session, setSession] = useState('')


  const [progress, setProgress] = useState(0);



  // UseEffect to handle route change loading bar
  useEffect(() => {
    setProgress(20); // Start progress
    const timer = setTimeout(() => {
      setProgress(100); // Complete progress
    }, 500);

    return () => clearTimeout(timer); // Cleanup on component unmount
  }, [location]);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    try {
      if (token) {
        setSession(jwtDecode(token));
        if ((location.pathname === '/' || location.pathname === '/register') && session.role === 'Admin') {
          navigate('/admin')
        }
        if (session.role === 'teacher') {
          navigate('/teacher')
        }
        if (session.role === 'student') {
          navigate('/student')
        }
      }
    } catch (error) {
      console.error(error)
    }
  }, [token, navigate])

  useEffect(() => {
    // Function to fetch user details
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/adminData`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const res = await response.json();
        console.log(res)
        if (res.message === 'Failed to authenticate token') {
          localStorage.removeItem('token');
          navigate('/')
        }
        if (response.ok) {
          const data = await response.json();
        } else {
          console.error('Failed to fetch user details');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    if (token) {
      fetchUserDetails();
    }
  }, [token]);

  useEffect(() => {
    if (token === null && (location.pathname !== '/register')) {
      navigate('/')
    }
  }, [token])

  useEffect(() => {
    if ((location.pathname === '/login') && !token && (location.pathname !== '/register')) {
      navigate('/');
    }
  }, [location, navigate, token]);

  return (
    <>
      <LoadingBar color="#87DB1c" waitingTime={500} progress={progress} height={3} onLoaderFinished={() => setProgress(0)} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/teacher" element={<TeachersPage />} />
        <Route path="/student" element={<StudentsPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard token={token} session={session} />} />
        <Route path="/admin/analysis" element={<Analysis />} />
        <Route path="/admin/courses" element={<Courses token={token} session={session} />} />
        <Route path="/admin/classes" element={<Classes token={token} session={session} />} />
        <Route path="/admin/subjects" element={<Subjects token={token} session={session} />} />
      </Routes>
    </>
  );
};

const AppRouters = ({ token }) => {

  return (
    <Router>
      <Routers token={token} />
    </Router>
  )
};

export default AppRouters;