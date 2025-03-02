import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './Courses.module.css';
import 'react-calendar/dist/Calendar.css';
import 'react-circular-progressbar/dist/styles.css';
import LeftSidebar from './LeftSidebar';
import { Link } from 'react-router-dom';
import { ColorRing } from 'react-loader-spinner';
import axios from 'axios';
import ConfirmationBox from '../ConfirmationBox';
import Header from './Header';
import AddItemView from './AddItemView';
import { toast, ToastContainer } from 'react-toastify';
import CoursesTableWrapper from './CoursesTableWrapper';

const AddCourseView = ({ toggleAddCourse, session, addNewCourse }) => {
  const adminId = session?._id;
  const collName = session?.collName;
  const [isLoading, setIsLoading] = useState(false);
  const [course, setCourse] = useState('');
  const [fees, setFees] = useState('');
  const [duration, setDuration] = useState('');

  const handleChange = (e) => {
    if (e.target.name === 'course') {
      setCourse(e.target.value);
    } else if (e.target.name === 'fees') {
      setFees(e.target.value);
    } else if (e.target.name === 'duration') {
      setDuration(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true when the request starts
    try {
      const response = await axios.post('http://localhost:5000/createCourse', {
        courseName: course,
        collName: adminId,
        fees: fees,
        duration: duration,
      });

      if (response.status === 201) {
        toast.success(response.data.message || 'Course Created Successfully.');
        addNewCourse(response.data.result); // Add the new course to the courses state
        setIsLoading(false); // Set loading state to false when the request is completed
        setTimeout(() => {
          toggleAddCourse(); // Close the modal after successful submission
        }, 2000);
      } else {
        toast.error(response.data.message || 'Course Creation failed. Please try again.');
        console.error('Failed to create course');
        setIsLoading(false); // Set loading state to false if the request fails
        setTimeout(() => {
          toggleAddCourse(); // Close the modal after failed submission
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating course:', error);
      setIsLoading(false); // Set loading state to false if an error occurs
    }
  };

  return (
    <div className={styles.addCourseModal}>
      <ToastContainer />
      <div className={styles.addCourseModalContent}>
        <div className={styles.addCourseModalHeader}>
          <h3>Add Course</h3>
          <i className="fa-solid fa-x" onClick={toggleAddCourse} style={{ cursor: 'pointer' }}></i>
        </div>
        <div className={styles.addCourseModalBody}>
          <form action="submit" className={`${styles.input}`} onSubmit={handleSubmit}>
            <div>
              <input type="text" id="coll" name="coll" readOnly={true} />
              <span>{collName}</span>
            </div>
            <div>
              <input type="text" id="course" name="course" value={course} required="required" onChange={handleChange} />
              <span>
                <label htmlFor="course">Course</label>
              </span>
            </div>
            <div>
              <input type="text" id="fees" name="fees" value={fees} required="required" onChange={handleChange} />
              <span>
                <label htmlFor="fees">Total Fees</label>
              </span>
            </div>
            <div>
              <input type="text" id="duration" name="duration" value={duration} required="required" onChange={handleChange} />
              <span>
                <label htmlFor="duration">Course Duration in Years</label>
              </span>
            </div>
            <button type="submit" className={`${styles.button}`}>
              {isLoading ? (
                <ColorRing
                  visible={true}
                  height="40"
                  width="40"
                  ariaLabel="color-ring-loading"
                  wrapperStyle={{}}
                  wrapperClass="color-ring-wrapper"
                  colors={['white', 'white', 'white', 'white', 'white']}
                />
              ) : (
                'Add'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const Courses = ({ token, session }) => {
  const adminId = session?._id;
  const [open, setOpen] = useState(false);
  const [addCourseModal, setAddCourseModal] = useState(false);
  const [deleteCourseModal, setDeleteCourseModal] = useState(false);
  const [addItemModal, setAddItemModal] = useState(false);
  const [deleteItemModal, setDeleteItemModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [item, setItem] = useState('');
  const [course, setCourse] = useState('')
  const [courseId, setCourseId] = useState(''); // Add this state
  const [items, setItems] = useState({
    students: [],
    teachers: [],
    classes: [],
    subjects: [],
  });
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [visibleActionCardId, setVisibleActionCardId] = useState(null);
  // const [originalCourses, setOriginalCourses] = useState([...courses]);
  // const [sortedCourses, setSortedCourses] = useState([...courses]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'relevance' });

  const actionMenuRefs = useRef({});

  const dialogue = 'Are you sure you want to delete this course?';
  const collName = session?.collName;

  const toggleAddCourse = () => {
    setAddCourseModal(!addCourseModal);
  };

  const toggleAddItem = ({ courseId, type, coursename }) => {
    setItem(type)
    setCourse(coursename)
    setAddItemModal(!addItemModal);
    setCourseId(courseId);
  }

  const toggleDeleteCourse = (course) => {
    setCourseToDelete(course);
    setDeleteCourseModal(!deleteCourseModal);
  };

  const toggleDeleteItem = (item) => {
    setItemToDelete(item);
    setDeleteItemModal(!deleteItemModal);
  };

  const addNewCourse = (newCourse) => {
    setCourses((prevCourses) => {
      const courseExists = prevCourses.some((course) => course._id === newCourse._id);
      return courseExists ? prevCourses : [...prevCourses, newCourse];
    });
  };

  const deleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      const response = await axios.post('http://localhost:5000/deleteCourse', {
        courseName: courseToDelete._id,
      });
      if (response.status === 201) {
        setCourses((prevCourses) => prevCourses.filter((course) => course.courseName !== courseToDelete.courseName));
        setDeleteCourseModal(false);
        setCourseToDelete(null);
      } else {
        console.error('Failed to delete course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const deleteItem = async ({ type }) => {
    if (!itemToDelete) return;

    try {
      const response = await axios.post('http://localhost:5000/deleteCourse', {
        courseName: courseToDelete.courseName,
      });
      if (response.status === 201) {
        toast.success(response.data.message || 'Course Deleted Successfully.');
        setItems((prevItems) => prevItems.filter((item) => item.itemName !== itemToDelete.itemName));
        setDeleteItemModal(false);
        setItemToDelete(null);
      } else {
        toast.error(response.data.message || 'Course Deletion failed. Please try again.');
        console.error('Failed to delete course');
        setDeleteItemModal(false);
        setItemToDelete(null);
      }
    } catch (error) {
      toast.error('Error deleting course:', error);
      console.error('Error deleting course:', error);
      setDeleteItemModal(false);
      setItemToDelete(null);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/getCourses', {
          headers: {
            'Content-Type': 'application/json',
          },
          params: { collName },
        });

        if (response.status === 200) {
          const uniqueCourses = response.data.filter(
            (course, index, self) => index === self.findIndex((c) => c._id === course._id)
          );
          setCourses(uniqueCourses);
        } else {
          console.error('Failed to fetch courses');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
      setIsLoading(false);
    };

    const fetchClasses = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getClassListByAdmin/${adminId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          params: { collName },
        });

        if (response.status === 200) {
          setClasses(response.data);
        } else {
          console.error('Failed to fetch classes');
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
      setIsLoading(false);
    }

    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getSubjectsByAdmin/${adminId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          params: { collName },
        });

        if (response.status === 200) {
          setSubjects(response.data);
        } else {
          console.error('Failed to fetch subjects');
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    }

    const fetchTeachers = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getTeachersByAdmin/${adminId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          params: { collName },
        });

        if (response.status === 200) {
          setTeachers(response.data);
        } else {
          console.error('Failed to fetch teachers');
        }
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    }

    const fetchStudents = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getStudentsByAdmin/${adminId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          params: { collName },
        });

        if (response.status === 200) {
          setStudents(response.data);
        } else {
          console.error('Failed to fetch students');
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    }

    if (collName) {
      fetchCourses();
    }

    if (adminId) {
      fetchClasses();
      fetchSubjects();
      fetchTeachers();
      fetchStudents();
    }
  }, [collName, adminId, addCourseModal, addItemModal]);


  const countTotalClasses = (data, courseId) => {
    let totalClasses = 0;

    data?.forEach((item) => {
      if (item?.course?._id === courseId) {
        item.classes.forEach((cls) => {
          totalClasses += cls.class.length;
        });
      }
    });

    return totalClasses;
  };


  const countTotalSubjects = (data, courseId) => {
    let totalSubjects = 0;

    data.forEach((item) => {
      if (item?.course?._id === courseId) {
        totalSubjects += item.subjects.length;
      }
    });

    return totalSubjects;
  }

  const countTotalTeachers = (data, courseId) => {
    let totalTeachers = 0;

    data.forEach((item) => {
      if (item?.course?._id === courseId) {
        totalTeachers += 1;
      }
    });

    return totalTeachers
  }

  const countTotalStudents = (data, courseId) => {
    let totalStudents = 0;

    data.forEach((item) => {
      if (item?.course?._id === courseId) {
        totalStudents += 1;
      }
    });

    return totalStudents
  }

  const openSideBar = () => {
    setOpen(!open);
  };

  const handleActionVisible = (courseId) => {
    setVisibleActionCardId((prevVisibleId) => (prevVisibleId === courseId ? null : courseId));
  };

  const handleClickOutside = (event) => {
    const actionMenu = actionMenuRefs.current[visibleActionCardId];
    if (actionMenu && !actionMenu.contains(event.target)) {
      setVisibleActionCardId(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visibleActionCardId]);


  const handleSort = (key) => {
    let newDirection;

    // Determine the next sort direction
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'relevance') {
        newDirection = 'ascending';
      } else if (sortConfig.direction === 'ascending') {
        newDirection = 'descending';
      } else {
        newDirection = 'relevance'; // Default state
      }
    } else {
      newDirection = 'ascending'; // If sorting a new column, start with ascending
    }

    setSortConfig({ key, direction: newDirection });
  };

  const sortedCourses = useMemo(() => {
    let sortableItems = [...courses];

    if (sortConfig.key === 'courseName') {
      if (sortConfig.direction === 'ascending') {
        sortableItems.sort((a, b) => a[sortConfig.key] > b[sortConfig.key] ? 1 : -1);
      } else if (sortConfig.direction === 'descending') {
        sortableItems.sort((a, b) => a[sortConfig.key] < b[sortConfig.key] ? 1 : -1);
      } else if (sortConfig.direction === 'relevance') {
        sortableItems = courses; // Default relevance sorting logic (if any)
      }
    } else if (sortConfig.key === 'totalClasses') {
      if (sortConfig.direction === 'ascending') {
        sortableItems.sort((a, b) => countTotalClasses(classes, a._id) > countTotalClasses(classes, b._id) ? 1 : -1);
      } else if (sortConfig.direction === 'descending') {
        sortableItems.sort((a, b) => countTotalClasses(classes, a._id) < countTotalClasses(classes, b._id) ? 1 : -1);
      } else if (sortConfig.direction === 'relevance') {
        sortableItems = courses; // Default relevance sorting logic (if any)
      }
    } else if (sortConfig.key === 'totalSubjects') {
      if (sortConfig.direction === 'ascending') {
        sortableItems.sort((a, b) => countTotalSubjects(subjects, a._id) > countTotalSubjects(subjects, b._id) ? 1 : -1);
      } else if (sortConfig.direction === 'descending') {
        sortableItems.sort((a, b) => countTotalSubjects(subjects, a._id) < countTotalSubjects(subjects, b._id) ? 1 : -1);
      } else if (sortConfig.direction === 'relevance') {
        sortableItems = courses; // Default relevance sorting logic (if any)
      }
    } else if (sortConfig.key === 'totalTeachers') {
      if (sortConfig.direction === 'ascending') {
        sortableItems.sort((a, b) => countTotalTeachers(teachers, a._id) > countTotalTeachers(teachers, b._id) ? 1 : -1);
      } else if (sortConfig.direction === 'descending') {
        sortableItems.sort((a, b) => countTotalTeachers(teachers, a._id) < countTotalTeachers(teachers, b._id) ? 1 : -1);
      } else if (sortConfig.direction === 'relevance') {
        sortableItems = courses; // Default relevance sorting logic (if any)
      }
    } else if (sortConfig.key === 'totalStudents') {
      if (sortConfig.direction === 'ascending') {
        sortableItems.sort((a, b) => countTotalStudents(students, a._id) > countTotalStudents(students, b._id) ? 1 : -1);
      } else if (sortConfig.direction === 'descending') {
        sortableItems.sort((a, b) => countTotalStudents(students, a._id) < countTotalStudents(students, b._id) ? 1 : -1);
      } else if (sortConfig.direction === 'relevance') {
        sortableItems = courses; // Default relevance sorting logic (if any)
      }
    }
    return sortableItems;
  }, [courses, sortConfig]);

  return (
    <>
      <div className={`${styles.page}`}>
        <ToastContainer />
        <div className={styles.side}>
          <LeftSidebar open={open} openSideBar={openSideBar} />
        </div>
        <div className={`${styles.main} ${(addCourseModal || deleteCourseModal) ? styles.dimmed : ''}`}>
          <div className={styles.container}>
            <Header session={session} />
            <div className={`${styles.header}`}>
              <h3 className='text-center'>Courses</h3>
            </div>
            <div className={styles.topContent}>
              {addItemModal && (
                <AddItemView
                  setAddItemModal={setAddItemModal}
                  coursename={course}
                  courseId={courseId}
                  item={item}
                  toggleAddItem={toggleAddItem}
                  session={session}
                />
              )}
              {deleteItemModal && (
                <ConfirmationBox
                  toggleDeleteItem={toggleDeleteItem}
                  deleteItem={deleteItem}
                  dialogue={dialogue}
                />
              )}

              {isLoading ? (
                <ColorRing
                  visible={true}
                  height="80"
                  width="80"
                  ariaLabel="color-ring-loading"
                  wrapperStyle={{}}
                  wrapperClass="color-ring-wrapper"
                  colors={['#4fa94d', '#4fa94d', '#4fa94d', '#4fa94d', '#4fa94d']}
                />
              ) : (courses.length > 0 ? (
                <CoursesTableWrapper handleSort={handleSort} sortedCourses={sortedCourses} countTotalClasses={countTotalClasses} countTotalSubjects={countTotalSubjects} countTotalTeachers={countTotalTeachers} countTotalStudents={countTotalStudents} toggleDeleteCourse={toggleDeleteCourse} handleActionVisible={handleActionVisible} visibleActionCardId={visibleActionCardId} actionMenuRefs={actionMenuRefs} sortConfig={sortConfig} toggleAddItem={toggleAddItem} teachers={teachers} students={students} classes={classes} subjects={subjects} />
                ) : (
                <div className={`${styles.noData} alert alert-info`}>
                  <h3>No Courses, Please add one</h3>
                </div>
              )
              )}
            </div>
            <div className={styles.bottomContent}>
              <div className={`${styles.addCourse}`}>
                <i className="fa-solid fa-plus" onClick={toggleAddCourse}></i>
                <Link>Add Course</Link>
              </div>
            </div>
          </div>
          {addCourseModal && (
            <AddCourseView toggleAddCourse={toggleAddCourse} addNewCourse={addNewCourse} session={session} />
          )}
          {deleteCourseModal && (
            <ConfirmationBox
              toggleDeleteItem={toggleDeleteCourse}
              deleteItem={deleteCourse}
              dialogue={dialogue}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Courses;