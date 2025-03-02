import React from 'react'
import styles from './Header.module.css'
import { IoMoonOutline } from 'react-icons/io5'
import { HiOutlineBellAlert } from 'react-icons/hi2'
import { Link } from 'react-router-dom'

const Header = ({session}) => {
    return (
        <div className={`${styles.head} mb-5 px-2`}>
            <div className={`${styles.left}`}>
                <h2><b>Hello {session.name}!</b></h2>
                <span>Hi There! Whatsapp?</span>
            </div>
            <div className={`${styles.right}`}>
                <IoMoonOutline size={30} className={`${styles.moon}`} />
                <HiOutlineBellAlert size={30} className={`${styles.bell}`} />
                <div className={`${styles.profile}`}>
                    <Link className={`${styles.profilePic}`} to={`/${session?.role?.toLowerCase()}/profile`}>
                        <img src="https://www.w3schools.com/howto/img_avatar.png" alt="profile" height={50} width={50} />
                        <p className="alert alert-primary" style={{ margin: '0 auto', padding: '2px' }} role="alert" >View profile</p>
                    </Link>
                    <div className={`${styles.profileDetails}`}>
                        <p>{session.name}</p>
                        <p>{session.email}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header