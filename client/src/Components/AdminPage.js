import React, { useEffect, useState } from 'react'
import styles from './StudentsPage.module.css'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
// import ReactWeather, { useOpenWeather } from 'react-open-weather';
import StudentAttendanceTable from './StudentAttendanceTable';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Link } from 'react-router-dom';
import LeftSidebar from './Admin/LeftSidebar';
import Dashboard from './Admin/Dashboard';
// import AnalysisGraph from './AnalysisGraph';

const AdminPage = () => {

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
        {page === 'analysis' && <div className={`${styles.container}`}>
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
        </div>}


        {/* Users Page */}
        {page === 'profile' && <div className={`${styles.container}`}>
          <div className={`${styles.header}`}>
            <h3 className='text-center'>Profile</h3>
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
                      textColor: "black",
                      pathColor: "#ff547f",
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
        </div>}
      </div>
    </>
  )
}

export default AdminPage