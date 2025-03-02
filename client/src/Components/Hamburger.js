import React, { useContext, useState } from 'react'
import { MenuContext } from '../Context/OpenMenu'
import styles from './Hamburger.module.css'

const Hamburger = ({open,openHam}) => {
    const { openSide, toggleMenu } = useContext(MenuContext)

    // const [open, setOpen] = useState(false)

    // const openHam = () => {
    //     setOpen(!open)
    // }

    console.log(open)

    return (
        <div className={`${!open ? styles.open : styles.close}`} onClick={openHam}>
            <li className="list"></li>
            <li className="list"></li>
            <li className="list"></li>
        </div>
    )
}

export default Hamburger