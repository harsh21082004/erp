import React, { useContext } from 'react'
import styles from './LeftSidebar.module.css'
import { Link, useLocation } from 'react-router-dom'
import { MenuContext } from '../../Context/OpenMenu'
import { BsBoxArrowLeft } from "react-icons/bs";
import { FaArrowRight } from "react-icons/fa";

const LeftSidebar = ({ open, openSideBar }) => {

  const { openSide, toggleMenu } = useContext(MenuContext)

  const location = useLocation()

  const path = location.pathname

  return (
    <>
    <div className={`${styles.leftSideBar} ${open ? styles.openSideBar : styles.closeSideBar} ${!openSide ? styles.expandSidebar : styles.collapseSidebar}`} >
      <div className={`${styles.top}`}>
        <div className={`${styles.left}`}>
          <p style={{ margin: 0 }}>ERP</p>
        </div>
        <div className={`${styles.right}`}>
          <BsBoxArrowLeft className={`${styles.exit}`} />
        </div>
      </div>
      <div className={`${styles.mainMenu}`}>
        <div>
          <span className='mx-3 text-white'>MAIN MENU</span>
          <hr className='text-white my-1' />
          <ul>
            <Link to={'/admin'} className={`list ${path === '/admin' && 'active'}`}><i class="fa-solid fa-table-columns"></i>{(<p className={`${!openSide || open ? styles.pOpen : styles.pClose}`}>Dashboard</p>)}</Link>
            <Link className={`list ${path === '/admin/courses' && 'active'}`} to={'/admin/courses'}><i class="fa-solid fa-book-bookmark"></i>{(<p className={`${!openSide || open ? styles.pOpen : styles.pClose}`}>Courses</p>)}</Link>
            <Link to={'/admin/classes'} className={`list ${path === '/admin/classes' && 'active'}`}><i class="fa-solid fa-book"></i>{(<p className={`${!openSide || open ? styles.pOpen : styles.pClose}`}>Classes</p>)}</Link>
            <Link className={`list ${path === '/admin/subjects' && 'active'}`} to={'/admin/subjects'}><i class="fa-solid fa-clipboard"></i>{(<p className={`${!openSide || open ? styles.pOpen : styles.pClose}`}>Subjects</p>)}</Link>
            <Link className={`list ${path === '/admin/students' && 'active'}`} to={'/admin/students'}><i class="fa-solid fa-graduation-cap"></i>{(<p className={`${!openSide || open ? styles.pOpen : styles.pClose}`}>Teachers</p>)}</Link>
            <Link className={`list ${path === '/admin/teachers' && 'active'}`} to={'/admin/teachers'}><i class="fa-brands fa-google-scholar"></i>{(<p className={`${!openSide || open ? styles.pOpen : styles.pClose}`}>Students</p>)}</Link>
            <Link className={`list ${path === '/admin/account' && 'active'}`} to={'/admin/account'}><i class="fa-solid fa-message"></i>{(<p className={`${!openSide || open ? styles.pOpen : styles.pClose}`}>Notices</p>)}</Link>
            <Link className={`list ${path === '/admin/profile' && 'active'}`} to={'/admin/profile'}><i class="fa-solid fa-user"></i>{(<p className={`${!openSide || open ? styles.pOpen : styles.pClose}`}>Profile</p>)}</Link>
          </ul>
        </div>
        <div className={`${styles.notice}`}>
          <div>
            <div className={`mb-2 ${styles.title}`}>
              <p className='mx-3 text-white' style={{ fontSize: '13px' }}>Upcoming Event</p>
            </div>
            <div className={`mx-3 text-white ${styles.body}`}>
              <p style={{ fontSize: '13px', margin: 0 }}>Text Here</p>
              <p style={{ fontSize: '10px', margin: 0 }}>11:05 AM - 12:00 PM</p>
            </div>
          </div>
          <div className={`${styles.arrowRight}`} >
            <FaArrowRight />
          </div>
        </div>
      </div>
    </div>
      <li className={`${styles.arrowli} ${open ? styles.arrowleft : styles.arrowright}`} onClick={openSideBar}><i className="fa-solid fa-arrow-right"></i></li>
    </>
  )
}

export default LeftSidebar