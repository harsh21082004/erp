import React from 'react'
import styles from './ConfirmationBox.module.css'

const ConfirmationBox = ({ toggleDeleteItem, deleteItem, dialogue }) => {
    return (
        <div className={`${styles.deleteCourseModal}`}>
            <div className={`${styles.deleteCourseModalContent}`}>
                <div className={`${styles.deleteCourseModalHeader}`}>
                    <i className="fa-solid fa-x" onClick={toggleDeleteItem} style={{ cursor: 'pointer' }}></i>
                </div>
                <div className={`${styles.deleteCourseModalBody}`}>
                    <p>{dialogue}</p>
                </div>
                <div className={`${styles.deleteCourseModalBottom}`}>
                    <button type="submit" className={`${styles.button}`} onClick={deleteItem} >YES</button>
                    <button type="submit" className={`${styles.button}`} onClick={toggleDeleteItem}>NO</button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationBox