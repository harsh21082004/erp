import React from 'react'
import { Link } from 'react-router-dom'
import styles from './ClassesTableWrapper.module.css'

const ClassesTableWrapper = ({ handleActionVisible, handleSort, sortConfig, sortedClasses, getCoursesByClassId, getbranchesByClassId, countTotalStudents, countTotalSubjects, countTotalTeachers, subjects, teachers, students, actionMenuRefs, toggleAddItem, visibleActionCardId, toggleDeleteClass}) => {
  return (
    <div className={styles.tableWrapper}>
                                        <table className={`${styles.courseTable}`}>
                                            <thead>
                                                <tr>
                                                    <th onClick={() => handleSort('totalClasses')}>
                                                        <span>
                                                            Class Name
                                                            {sortConfig.key === 'totalClasses' ? (
                                                                sortConfig.direction === 'ascending' ? (
                                                                    <i className="fa-solid fa-arrow-up"></i>
                                                                ) : sortConfig.direction === 'descending' ? (
                                                                    <i className="fa-solid fa-arrow-down"></i>
                                                                ) : (
                                                                    <i className="fa-solid fa-arrow-right-arrow-left" style={{ transform: 'rotate(90deg)' }}></i>
                                                                )
                                                            ) : (
                                                                <i className="fa-solid fa-arrow-right-arrow-left" style={{ transform: 'rotate(90deg)' }}></i>
                                                            )}
                                                        </span>
                                                    </th>
                                                    <th onClick={() => handleSort('branch')}>
                                                        <span>
                                                            Branch
                                                            {sortConfig.key === 'branch' ? (
                                                                sortConfig.direction === 'ascending' ? (
                                                                    <i className="fa-solid fa-arrow-up"></i>
                                                                ) : sortConfig.direction === 'descending' ? (
                                                                    <i className="fa-solid fa-arrow-down"></i>
                                                                ) : (
                                                                    <i className="fa-solid fa-arrow-right-arrow-left" style={{ transform: 'rotate(90deg)' }}></i>
                                                                )
                                                            ) : (
                                                                <i className="fa-solid fa-arrow-right-arrow-left" style={{ transform: 'rotate(90deg)' }}></i>
                                                            )}
                                                        </span>
                                                    </th>
                                                    <th onClick={() => handleSort('course')}>
                                                        <span>
                                                            Course
                                                            {sortConfig.key === 'course' ? (
                                                                sortConfig.direction === 'ascending' ? (
                                                                    <i className="fa-solid fa-arrow-up"></i>
                                                                ) : sortConfig.direction === 'descending' ? (
                                                                    <i className="fa-solid fa-arrow-down"></i>
                                                                ) : (
                                                                    <i className="fa-solid fa-arrow-right-arrow-left" style={{ transform: 'rotate(90deg)' }}></i>
                                                                )
                                                            ) : (
                                                                <i className="fa-solid fa-arrow-right-arrow-left" style={{ transform: 'rotate(90deg)' }}></i>
                                                            )}
                                                        </span>
                                                    </th>
                                                    <th onClick={() => handleSort('totalSubjects')}>
                                                        <span>
                                                            Total Subjects
                                                            {sortConfig.key === 'totalSubjects' ? (
                                                                sortConfig.direction === 'ascending' ? (
                                                                    <i className="fa-solid fa-arrow-up"></i>
                                                                ) : sortConfig.direction === 'descending' ? (
                                                                    <i className="fa-solid fa-arrow-down"></i>
                                                                ) : (
                                                                    <i className="fa-solid fa-arrow-right-arrow-left" style={{ transform: 'rotate(90deg)' }}></i>
                                                                )
                                                            ) : (
                                                                <i className="fa-solid fa-arrow-right-arrow-left" style={{ transform: 'rotate(90deg)' }}></i>
                                                            )}
                                                        </span>
                                                    </th>
                                                    <th onClick={() => handleSort('totalTeachers')}>
                                                        <span>
                                                            Total Teachers
                                                            {sortConfig.key === 'totalTeachers' ? (
                                                                sortConfig.direction === 'ascending' ? (
                                                                    <i className="fa-solid fa-arrow-up"></i>
                                                                ) : sortConfig.direction === 'descending' ? (
                                                                    <i className="fa-solid fa-arrow-down"></i>
                                                                ) : (
                                                                    <i className="fa-solid fa-arrow-right-arrow-left" style={{ transform: 'rotate(90deg)' }}></i>
                                                                )
                                                            ) : (
                                                                <i className="fa-solid fa-arrow-right-arrow-left" style={{ transform: 'rotate(90deg)' }}></i>
                                                            )}
                                                        </span>
                                                    </th>
                                                    <th onClick={() => handleSort('totalStudents')}>
                                                        <span>
                                                            Total Students
                                                            {sortConfig.key === 'totalStudents' ? (
                                                                sortConfig.direction === 'ascending' ? (
                                                                    <i className="fa-solid fa-arrow-up"></i>
                                                                ) : sortConfig.direction === 'descending' ? (
                                                                    <i className="fa-solid fa-arrow-down"></i>
                                                                ) : (
                                                                    <i className="fa-solid fa-arrow-right-arrow-left" style={{ transform: 'rotate(90deg)' }}></i>
                                                                )
                                                            ) : (
                                                                <i className="fa-solid fa-arrow-right-arrow-left" style={{ transform: 'rotate(90deg)' }}></i>
                                                            )}
                                                        </span>
                                                    </th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sortedClasses?.map((clss) => (
    
                                                    <tr key={clss._id}>
                                                        <td>{clss.section}</td>
                                                        <td>{getbranchesByClassId(clss._id)[0].branch}</td>
                                                        <td>{getCoursesByClassId(clss._id)[0].course.courseName}</td>
                                                        <td>{countTotalSubjects(subjects, clss._id)}</td>
                                                        <td>{countTotalTeachers(teachers, clss._id)}</td>
                                                        <td>{countTotalStudents(students, clss._id)}</td>
                                                        <td>
                                                            <div
                                                                ref={(el) => (actionMenuRefs.current[clss._id] = el)}
                                                                className={`${styles.actions} ${visibleActionCardId === clss._id ? styles.actionVisible : styles.actionHidden
                                                                    }`}
                                                            >
                                                                <div className={`${styles.action}`}>
                                                                    <div className={styles.addView}>
                                                                        <li>
                                                                            <Link onClick={(e) => toggleAddItem({ type: 'Student', courseId: getCoursesByClassId(clss._id)[0].course._id, coursename: getCoursesByClassId(clss._id)[0].course.courseName, classId: clss._id, section: clss.section, clsSemester: clss.classSemester })}>Add Students</Link>
    
                                                                            <Link onClick={(e) => toggleAddItem({ type: 'Teacher', courseId: getCoursesByClassId(clss._id)[0].course._id, coursename: getCoursesByClassId(clss._id)[0].course.courseName, classId: clss._id, section: clss.section, sessionValue: clss.session, clsSemester: clss.classSemester, branch: getbranchesByClassId(clss._id)[0].branch })}>Add Teachers</Link>
    
                                                                            <Link onClick={(e) => toggleAddItem({ type: 'Subject', courseId: getCoursesByClassId(clss._id)[0].course._id, coursename: getCoursesByClassId(clss._id)[0].course.courseName, classId: clss._id, section: clss.section, sessionValue: clss.session, clsSemester: clss.classSemester, branch: getbranchesByClassId(clss._id)[0].branch })}>Add Subjects</Link>
    
                                                                            <Link onClick={(e) => toggleAddItem({ type: 'Student', coursename: getCoursesByClassId(clss._id)[0].course.courseName, classId: clss._id, section: clss.section })}>View Details</Link>
    
                                                                            <Link style={{ color: 'red' }} onClick={() => toggleDeleteClass(clss)}>Delete Class</Link>
                                                                        </li>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className={`${styles.actionIcon}`} onClick={() => handleActionVisible(clss._id)}>
                                                                <i className="fa-solid fa-ellipsis-vertical"></i>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
  )
}

export default ClassesTableWrapper