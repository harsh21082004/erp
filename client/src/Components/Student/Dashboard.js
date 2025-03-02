import React, { useState } from 'react'
import styles from './AdminDashboard.module.css'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
// import ReactWeather, { useOpenWeather } from 'react-open-weather';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Link } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';
import StudentAttendanceTable from '../StudentAttendanceTable';
import Navbar from '../Navbar';

const Dashboard = ({token}) => {

  const [open, setOpen] = useState(false)
  const [value, onChange] = useState(new Date());

  const openSideBar = () => {
    setOpen(!open)
  }
  return (
    <>
    <Navbar/>
      <div className={`${styles.main} pt-5`}>
        <div className={`${styles.side}`}>
          <LeftSidebar open={open} openSideBar={openSideBar} />
        </div>

        {/* Dashboard Page */}
        <div className={`${styles.container}`}>
          <div className={`${styles.header}`}>
            <h3 className='text-center'>Dashboard</h3>
          </div>
          <div className={`${styles.topContent}`}>
            <div className={`${styles.card1}`}>
              <Calendar onChange={onChange} value={value} className={`${styles.calender}`} />
            </div>
            <div className={`${styles.card2}`}>
              <h4 className={`text-center m-2`}>Notices And Announcements</h4>
              <ul className={`my-3 px-5`}>
                <li className={`text-left`} style={{ listStyle: 'none', fontSize: '20px', margin: '8px 0' }}> <p>1. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vel, nulla.</p><Link to={'/'} className={`${styles.button}`}>View
                </Link></li>
                <li className={`text-left`} style={{ listStyle: 'none', fontSize: '20px', margin: '8px 0' }}> <p>1. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vel, nulla.</p><Link to={'/'} className={`${styles.button}`}>View
                </Link></li>
                <li className={`text-left`} style={{ listStyle: 'none', fontSize: '20px', margin: '8px 0' }}> <p>1. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vel, nulla.</p><Link to={'/'} className={`${styles.button}`}>View
                </Link></li>
                <li className={`text-left`} style={{ listStyle: 'none', fontSize: '20px', margin: '8px 0' }}> <p>1. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vel, nulla.</p><Link to={'/'} className={`${styles.button}`}>View
                </Link></li>
                <li className={`text-left`} style={{ listStyle: 'none', fontSize: '20px', margin: '8px 0' }}> <p>1. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vel, nulla.</p><Link to={'/'} className={`${styles.button}`}>View
                </Link></li>
              </ul>
            </div>
          </div>
          <div className={`${styles.bottomContent}`}>
            <div className={`${styles.card3}`}>
              <StudentAttendanceTable />
            </div>
            <div className={`${styles.card}`}>
              <div className={`${styles.card4}`}>
                <p>Percentage Attendance</p>
                <div style={{ width: 100, height: 100 }}>
                  <CircularProgressbar
                    value={65}
                    text={`${65}%`}
                    styles={buildStyles({
                      textColor: "#6f42c1",
                      pathColor: "#6f42c1",
                      trailColor: "lightgrey",
                      textSize: '25px'
                    })}
                    className={`${styles.circularProgress}`}
                  />
                </div>
              </div>
              <div className={`${styles.card5}`}>
                <div>
                  <h1>65</h1>
                  <li><i className="fa-solid fa-hourglass-half"></i></li>
                </div>
                <p>No. Of Days Present</p>
              </div>
              <div className={`${styles.card5}`}>
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
    </>
  )
}

export default Dashboard