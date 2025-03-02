import React, { useEffect, useState } from 'react'
import styles from './AdminDashboard.module.css'
import './AdminDashboard.css'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
// import ReactWeather, { useOpenWeather } from 'react-open-weather';
import { CircularProgressbar, CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Link } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';
import AnalysisChart from './AnalysisChart';
import Header from './Header';
import axios from 'axios';

const AdminDashboard = ({ token, session }) => {

  const adminId = session?._id;
  const collName = session?.collName;
  const [open, setOpen] = useState(false)
  const [value, onChange] = useState(new Date());
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getCourses', {
          headers: {
            'Content-Type': 'application/json',
          },
          params: { collName },
        });

        if (response.status === 200) {
          if (response.data.length !== 0) {
            const uniqueCourses = response.data.filter(
              (course, index, self) => index === self.findIndex((c) => c._id === course._id)
            );
            setCourses(uniqueCourses);
          } else{
            setCourses([]);
          }
        } else {
          console.error('Failed to fetch courses');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    const fetchClasses = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getClassListByAdmin/${adminId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          params: { collName },
        });

        if (response.status === 200) {
          if(response.data.length !== 0){
          setClasses(response.data);
          } else{
            setClasses([]);
          }
        } else {
          console.error('Failed to fetch classes');
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    }

    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getSubjectsByAdmin/${adminId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          params: { collName },
        });

        console.log(response)

        if (response.status === 200) {
          if(response.data.length !== 0){
          setSubjects(response.data);
          } else{
            setSubjects([]);
          }
        } else {
          console.error('Failed to fetch subjects');
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    }

    const fetchTeachers = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getTeachersByAdmin/${adminId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          params: { collName },
        });

        if (response.status === 200) {
          if(response.data.length !== 0){
          setTeachers(response.data);
          } else{
            setTeachers([]);
          }
        } else {
          console.error('Failed to fetch teachers');
        }
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    }

    const fetchStudents = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getStudentsByAdmin/${adminId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          params: { collName },
        });

        if (response.status === 200) {
          if(response.data.length !== 0){
          setStudents(response.data);
          } else{
            setStudents([]);
          }
        } else {
          console.error('Failed to fetch students');
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    }

    if (collName) {
      fetchCourses();
    }

    if (adminId) {
      fetchClasses();
      fetchSubjects();
      fetchTeachers();
      fetchStudents();
    }
  }, [collName, adminId]);

  console.log("Subjects", subjects);


  const countTotalSubjects = (subjects) => {
    let totalSubjects = 0;

    subjects.forEach((subject) => {
      totalSubjects += subject.subjects.length
    })

    return totalSubjects;
  }

  const countTotalClasses = (classes) => {
    let totalClasses = 0;

    classes.forEach((item) => {
      item.classes.forEach((classItem) => {
        totalClasses += classItem.class.length
      })
    })

    return totalClasses;
  }

  const countTotalBoys = (students) => {
    let totalBoys = 0;

    students.forEach((student) => {
      if (student.gender === 'male') {
        totalBoys += 1;
      }
    })

    return totalBoys;
  }

  const countTotalGirls = (students) => {
    let totalGirls = 0;

    students.forEach((student) => {
      if (student.gender === 'female') {
        totalGirls += 1;
      }
    })

    return totalGirls;
  }

  const openSideBar = () => {
    setOpen(!open)
  }
  return (
    <>
      {/* <Navbar session={session} /> */}
      <div className={`${styles.page}`}>
        <div className={`${styles.side}`}>
          <LeftSidebar open={open} openSideBar={openSideBar} />
        </div>
        <div className={`${styles.main}`}>
          {/* Admin Page */}
          <div className={`${styles.container}`}>
            <Header session={session} />
            <div className={`${styles.header}`}>
              <h3 className='text-center'>Dashboard</h3>
            </div>
            <div className={`${styles.topContent}`}>
              <div className={`${styles.card1}`}>
                <Calendar onChange={onChange} value={value} className={`${styles.calender} react-calender`} />
              </div>
              <div className={`${styles.cards2}`}>
                <Link to={'/admin/students'} className={`${styles.card2}`}>
                  <div>
                    <h1>{students?.length}</h1>
                    <p>{students.length > 1 ? "Students" : "Student"}</p>
                  </div>
                  <li style={{ listStyle: 'none' }}><i class="fa-solid fa-user"></i></li>
                </Link>
                <Link to={'/admin/teachers'} className={`${styles.card2}`}>
                  <div>
                    <h1>{teachers.length}</h1>
                    <p>{teachers.length > 1 ? "Teachers" : "Teacher"}</p>
                  </div>
                  <li style={{ listStyle: 'none' }}><i class="fa-solid fa-user-tie"></i></li>
                </Link>
                <Link to={'/admin/courses'} className={`${styles.card2}`}>
                  <div>
                    <h1>{courses.length}</h1>
                    <p>Courses</p>
                  </div>
                  <li style={{ listStyle: 'none' }}><i class="fa-solid fa-graduation-cap"></i></li>
                </Link>
                <Link to={'/admin/classes'} className={`${styles.card2}`}>
                  <div>
                    <h1>{countTotalClasses(classes)}</h1>
                    <p>{countTotalClasses(classes) > 1 ? "Classes" : "Class"}</p>
                  </div>
                  <li style={{ listStyle: 'none' }}><i class="fa-solid fa-desktop"></i></li>
                </Link>
              </div>
            </div>
            <div className={`${styles.bottomContent}`}>
              <div className={`${styles.cards4}`}>
                <Link to={'/admin/subjects'} className={`${styles.card4}`}>
                  <div>
                    <h1>{countTotalSubjects(subjects)}</h1>
                    <p>{countTotalSubjects(subjects) > 1 ? "Subjects" : "Subject"}</p>
                  </div>
                  <li style={{ listStyle: 'none' }}><i class="fa-solid fa-book"></i></li>
                </Link>
                <div className={`${styles.card5}`}>
                  <div className={`${styles.progress}`}>
                    <CircularProgressbarWithChildren
                      value={100}
                      strokeWidth={15}
                      styles={buildStyles({
                        pathColor: "#fd7e14",
                        trailColor: "#eee",
                        strokeLinecap: "butt"
                      })}
                    >
                      {/* Foreground path */}
                      <CircularProgressbar
                        value={(countTotalGirls(students) / students.length) * 100}
                        strokeWidth={15}
                        text={students.length}
                        styles={buildStyles({
                          pathColor: "#dc3545",
                          trailColor: "transparent",
                          strokeLinecap: "butt",
                          textSize: '20px',
                          textColor: '#dc3545'
                        })}
                      />
                    </CircularProgressbarWithChildren>
                  </div>
                  <div className={`${styles.progressText}`}>
                    <li><p></p>Girls : {countTotalGirls(students)}</li>
                    <li><p></p>Boys : {countTotalBoys(students)}</li>
                  </div>
                </div>
              </div>
              <div className={`${styles.card3}`}>
                <AnalysisChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminDashboard