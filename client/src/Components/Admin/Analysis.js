import React, { useEffect, useState } from 'react'
import styles from './Analysis.module.css'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Link } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';
import StudentAttendanceTable from '../StudentAttendanceTable';

const Analysis = () => {

  const [open, setOpen] = useState(false)
  const [page, setPage] = useState('dashboard')

  const [value, onChange] = useState(new Date());

  useEffect(() => {
    console.log(value);
  }, [value])

  const navigatePage = (e) => {
    document.querySelectorAll('.list').forEach(item => {
      item.classList.remove('active');
    });

    // Add 'active' class to the clicked li element
    e.currentTarget.classList.add('active');
    if (e.target.className === 'fa-solid fa-chart-simple') {
      setPage('analysis')
    }
    if (e.target.className === 'fa-solid fa-user') {
      setPage('profile')
    }
    if (e.target.className === 'dashboard') {
      setPage('dashboard')
    }
  }

  const openSideBar = () => {
    setOpen(!open)
  }
  return (
    <>
      <div className={`${styles.main} pt-5`}>
        <LeftSidebar navigatePage={navigatePage} open={open} openSideBar={openSideBar} />
        {/* Analysis Page */}
        <div className={`${styles.container}`}>
          <div className={`${styles.header}`}>
            <h3 className='text-center'>Analysis</h3>
          </div>
          <div className={`${styles.analysisContent}`}>
            <div className={`${styles.leftContent}`}>
              <div className={`${styles.card30}`}>
                <h2>Content</h2>
              </div>
              <div className={`${styles.card31}`}>
                <StudentAttendanceTable />
              </div>
            </div>
            <div className={`${styles.rightContent}`}>
              <div className={`${styles.card6}`}>
                <Calendar onChange={onChange} value={value} className={`${styles.calender}`} />
              </div>
              <div className={`${styles.cards}`}>
                <div className={`${styles.card7}`}>
                  <p>Percentage Attendance</p>
                  <div style={{ width: 100, height: 100 }}>
                    <CircularProgressbar
                      value={65}
                      text={`${65}%`}
                      styles={buildStyles({
                        textColor: "black",
                        pathColor: "#ff547f",
                        trailColor: "lightgrey",
                        textSize: '25px'
                      })}
                      className={`${styles.circularProgress}`}
                    />
                  </div>
                </div>
                <div className={`${styles.card8}`}>
                  <div>
                    <h1>65</h1>
                    <li><i className="fa-solid fa-hourglass-half"></i></li>
                  </div>
                  <p>No. Of Days Present</p>
                </div>
                <div className={`${styles.card8}`}>
                  <div>
                    <h1>35</h1>
                    <li><i className="fa-solid fa-hourglass-half"></i></li>
                  </div>
                  <p>No. Of Days Absent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Analysis