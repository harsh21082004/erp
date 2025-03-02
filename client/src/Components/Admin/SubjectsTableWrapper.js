import React from 'react'
import styles from './CoursesTableWrapper.module.css'
import { Link } from 'react-router-dom'

const SubjectsTableWrapper = ({ handleSort, sortConfig, sortedCourses, countTotalClasses, countTotalStudents, countTotalSubjects, countTotalTeachers, toggleAddItem, toggleDeleteCourse, teachers, students, subjects, classes, actionMenuRefs, visibleActionCardId, handleActionVisible }) => {

  const table = document.querySelector(`.${styles.tableWrapper}`);
  return (
    <div className={styles.tableWrapper}>
      <table className={`${styles.courseTable}`}>
        <thead>
          <tr>
            <th onClick={() => handleSort('subjectName')}>
              <span>
                Subject Name
                {sortConfig.key === 'subjectName' ? (
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
            <th onClick={() => handleSort('totalClasses')}>
              <span>
                Total Classes
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedCourses.map((course) => (
            <tr key={course._id}>
              <td>{course.courseName}</td>
              <td>{countTotalStudents(students, course._id)}</td>
              <td>{countTotalSubjects(subjects, course._id)}</td>
              <td>{countTotalClasses(classes, course._id)}</td>
              <td>{countTotalTeachers(teachers, course._id)}</td>
              <td>
                <div
                  ref={(el) => (actionMenuRefs.current[course._id] = el)}
                  className={`${styles.actions} ${visibleActionCardId === course._id ? styles.actionVisible : styles.actionHidden
                    }`}
                >
                  <div className={`${styles.action}`}>
                    <div className={styles.addView}>
                      <li>
                        <Link onClick={(e) => toggleAddItem({ type: 'Student', courseId: course._id, coursename: course.courseName })}>Add Students</Link>
                        <Link onClick={(e) => toggleAddItem({ type: 'Teacher', courseId: course._id, coursename: course.courseName })}>Add Teachers</Link>
                        <Link onClick={(e) => toggleAddItem({ type: 'Class', courseId: course._id, coursename: course.courseName })}>Add Classes</Link>
                        <Link onClick={(e) => toggleAddItem({ type: 'Subject', courseId: course._id, coursename: course.courseName })}>Add Subjects</Link>
                        <Link onClick={(e) => toggleAddItem({ type: 'Student', coursename: course.courseName })}>View Details</Link>
                        <Link style={{ color: 'red' }} onClick={() => toggleDeleteCourse(course)}>Delete Course</Link>
                      </li>
                    </div>
                  </div>
                </div>
                <div className={`${styles.actionIcon}`} onClick={() => handleActionVisible(course._id, table)}>
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

export default SubjectsTableWrapper