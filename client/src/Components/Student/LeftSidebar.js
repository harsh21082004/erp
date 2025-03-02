import React, { useContext } from 'react'
import styles from './LeftSidebar.module.css'
import {Link,useLocation } from 'react-router-dom'
import { MenuContext } from '../../Context/OpenMenu'

const LeftSidebar = ({open,openSideBar}) => {

  const { openSide, toggleMenu } = useContext(MenuContext)
  
  const location = useLocation()

  const path = location.pathname
  
  return (
    <div className={`${styles.leftSideBar} ${open ? styles.openSideBar : styles.closeSideBar} ${!openSide ? styles.expandSidebar : styles.collapseSidebar}`} >
          <ul>
            <Link to={'/admin'} className={`list ${path === '/admin' && styles.active}`}><i class="fa-solid fa-table-columns"></i>{(<p className={`${!openSide || open ? styles.pOpen : styles.pClose}`}>Dashboard</p>)}</Link>
            <Link to={'/admin/analysis'} className={`list ${path === '/admin/analysis' && styles.active}`}><i class="fa-solid fa-book"></i>{(<p className={`${!openSide || open ? styles.pOpen : styles.pClose}`}>Dashboard</p>)}</Link>
            <Link className={`list ${path === '/admin/account' && styles.active}`} to={'/admin/account'}><i class="fa-solid fa-users"></i>{(<p className={`${!openSide || open ? styles.pOpen : styles.pClose}`}>Dashboard</p>)}</Link>
          </ul>
          <li className={`${styles.arrowli} ${open ? styles.arrowleft : styles.arrowright}`} onClick={openSideBar}><i className="fa-solid fa-arrow-right"></i></li>
        </div>
  )
}

export default LeftSidebar