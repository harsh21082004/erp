import React, { useContext, useState } from 'react'
import styles from './Navbar.module.css'
import { Link, useLocation } from 'react-router-dom'
import { MenuContext } from '../Context/OpenMenu'
import Hamburger from './Hamburger'

const Navbar = ({ session }) => {

  const location = useLocation()

  const path = location.pathname.startsWith('/student') || location.pathname.startsWith('/teacher') || location.pathname.startsWith('/admin') ? true : false

  const [open, setOpen] = useState(false)

  const { openSide, toggleMenu } = useContext(MenuContext)

  const firstLetter = session?.name ? session.name.charAt(0).toUpperCase() : '';

  const openHam = () => {
    setOpen(!open)
  }
  return (
    <nav className={`navbar navbar-expand-lg navbar-light ${styles.navbar}`}>
      <div className="container-fluid">
        <div className={`d-flex`}>
        {path && (<div className={`${styles.hamList}`} onClick={toggleMenu}><Hamburger openHam={openHam} open={open} /></div>)}
        <Link className="navbar-brand text-white" to="/">Attendance System</Link>
        </div>
        <div className={`${styles.right}`}>
          <div className={`d-flex ${styles.accountContainer}`}>
            <p className={`d-flex mx-1`}>
              {session.name}
            </p>
            <div className={`d-flex mx-1 ${styles.account}`}>
              {firstLetter}
            </div>
            <i class="fa-solid fa-chevron-down mx-1"></i>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar