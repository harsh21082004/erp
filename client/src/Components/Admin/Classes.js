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
import ClassesTableWrapper from './ClassesTableWrapper';

const AddClassView = ({ toggleAddClass, session, addNewClass }) => {
    const adminId = session?._id;
    const collName = session?.collName;
    const [isLoading, setIsLoading] = useState(false);
    const [course, setCourse] = useState('');
    const [courseId, setCourseId] = useState('');
    const [courses, setCourses] = useState([]);
    const [classSemester, setClassSemester] = useState('');
    const [section, setSection] = useState('');
    const [branch, setBranch] = useState('');
    const [sessionVal, setSessionVal] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/getCourses`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    params: { collName },
                });

                if (response) {
                    const uniqueCourses = response.data.filter(
                        (course, index, self) => index === self.findIndex((c) => c?._id === course?._id)
                    );
                    setCourses(uniqueCourses);
                } else {
                    console.error('Failed to fetch courses');
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        if (collName) {
            fetchCourses();
        }
    }, [collName]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'course':
                setCourse(value);
                break;
            case 'classSemester':
                setClassSemester(value);
                break;
            case 'section':
                setSection(value);
                break;
            case 'branch':
                setBranch(value);
                break;
            case 'sessionVal':
                setSessionVal(value);
                break;
            default:
                break;
        }
    };

    const handleSelectId = (e) => {
        const selectedCourse = courses?.find((course) => course?.courseName === e.target.value);
        if (selectedCourse) {
            setCourseId(selectedCourse?._id); // Set the courseId when a course is selected
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Set loading state to true when the request starts
        try {
            const response = await axios.post('http://localhost:5000/ClassReg', {
                courseId: courseId, // Include the courseId in the request
                collName: adminId,
                semester: classSemester, // Include other relevant data
                section: section,
                branch: branch,
                session: sessionVal,
            });

            if (response) {
                toast.success(response.data.message || 'Class Created Successfully.');
                addNewClass(response.data.result); // Add the new course to the courses state
                setIsLoading(false); // Set loading state to false when the request is completed
                setTimeout(() => {
                    toggleAddClass(); // Close the modal after successful submission
                }, 2000);
            } else {
                toast.error(response.data.message || 'Class Creation failed. Please try again.');
                console.error('Failed to create class');
                setIsLoading(false); // Set loading state to false if the request fails
                setTimeout(() => {
                    toggleAddClass(); // Close the modal after failed submission
                }, 2000);
            }
        } catch (error) {
            toast.error('Class Creation failed. Please try again.');
            console.error('Error creating class:', error);
            setIsLoading(false); // Set loading state to false if an error occurs
            setTimeout(() => {
                toggleAddClass(); // Close the modal after failed submission
            }, 2000);
        }
    };

    return (
        <div className={styles.addCourseModal}>
            <ToastContainer />
            <div className={styles.addCourseModalContent}>
                <div className={styles.addCourseModalHeader}>
                    <h3>Add Class</h3>
                    <i className="fa-solid fa-x" onClick={toggleAddClass} style={{ cursor: 'pointer' }}></i>
                </div>
                <div className={styles.addCourseModalBody}>
                    <form className={`${styles.input}`} onSubmit={handleSubmit}>
                        <div>
                            <input type="text" id="coll" name="coll" readOnly value={collName} />
                        </div>
                        <div>
                            <select name="course" id="course" value={course} onChange={(e) => {
                                handleChange(e);
                                handleSelectId(e); // Call handleSelectId to set the courseId
                            }}>
                                <option value="">Select Course</option>
                                {courses.map((course) => (
                                    <option key={course._id} value={course.courseName}>
                                        {course.courseName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <input type="text" id="classSemester" name="classSemester" value={classSemester} required onChange={handleChange} />
                            <span><label htmlFor="classSemester">SEMESTER</label></span>
                        </div>
                        <div>
                            <input type="text" id="branch" name="branch" value={branch} required onChange={handleChange}
                            />
                            <span><label htmlFor="branch">BRANCH</label></span>
                        </div>
                        <div>
                            <input
                                type="text"
                                id="section"
                                name="section"
                                value={section}
                                required
                                onChange={handleChange}
                            />
                            <span><label htmlFor="section">SECTION</label></span>
                        </div>
                        <div>
                            <input
                                type="text"
                                id="sessionVal"
                                name="sessionVal"
                                value={sessionVal}
                                required
                                onChange={handleChange}
                            />
                            <span><label htmlFor="sessionVal">SESSION</label></span>
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

const Classes = ({ token, session }) => {
    const adminId = session?._id;
    const [open, setOpen] = useState(false);
    const [addClassModal, setAddClassModal] = useState(false);
    const [deleteClassModal, setDeleteClassModal] = useState(false);
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
    const [courseId, setCourseId] = useState('');
    const [classId, setClassId] = useState('');
    const [section, setSection] = useState('');
    const [sessionVal, setSessionVal] = useState('');
    const [branch, setBranch] = useState('');
    const [semester, setSemester] = useState('');
    const [items, setItems] = useState({
        students: [],
        teachers: [],
        classes: [],
        subjects: [],
    });
    const [classToDelete, setClassToDelete] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [visibleActionCardId, setVisibleActionCardId] = useState(null);
    // const [originalCourses, setOriginalCourses] = useState([...courses]);
    // const [sortedCourses, setSortedCourses] = useState([...courses]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'relevance' });

    const actionMenuRefs = useRef({});

    const dialogue = 'Are you sure you want to delete this class?';
    const collName = session?.collName;

    const toggleAddClass = () => {
        setAddClassModal(!addClassModal);
    };

    const toggleAddItem = ({ courseId, type, coursename, classId, section, sessionValue, clsSemester, branch }) => {
        setItem(type)
        setCourse(coursename)
        setAddItemModal(!addItemModal);
        setCourseId(courseId);
        setClassId(classId);
        setSection(section);
        setSessionVal(sessionValue);
        setSemester(clsSemester);
        setBranch(branch);
    }

    const toggleDeleteClass = (classToDelete) => {
        setClassToDelete(classToDelete);
        setDeleteClassModal(!deleteClassModal);
    };

    const toggleDeleteItem = (item) => {
        setItemToDelete(item);
        setDeleteItemModal(!deleteItemModal);
    };

    const addNewClass = (newClass) => {
        setClasses((prevClasses) => {
            const classExists = prevClasses.some((className) => className._id === newClass._id);
            return classExists ? prevClasses : [...prevClasses, newClass];
        });
    };



    const deleteClass = async () => {
        if (!classToDelete) return;

        try {
            const response = await axios.post('http://localhost:5000/deleteClass', {
                classId: classToDelete._id,
            });
            if (response.status === 200) {
                setClasses((prevClasses) => prevClasses.filter((cls) => cls._id !== classToDelete._id));
                toast.success('Class deleted successfully.');
                setDeleteClassModal(false);
                setClassToDelete(null);
            } else {
                toast.error('Failed to delete class. Please try again.');
                console.error('Failed to delete course');
                setDeleteClassModal(false);
                setClassToDelete(null);
            }
        } catch (error) {
            toast.error('Failed to delete class. Please try again.');
            console.error('Error deleting course:', error);
            setDeleteClassModal(false);
            setClassToDelete(null);
        }
    };

    const deleteItem = async ({ type }) => {
        if (!itemToDelete) return;

        try {
            const response = await axios.post('http://localhost:5000/deleteCourse', {
                className: classToDelete.className,
            });
            if (response.status === 201) {
                setItems((prevItems) => prevItems.filter((item) => item.itemName !== itemToDelete.itemName));
                setDeleteItemModal(false);
                setItemToDelete(null);
            } else {
                console.error('Failed to delete course');
            }
        } catch (error) {
            console.error('Error deleting course:', error);
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
                    if (response.data.length > 0) {
                        setSubjects(response.data);
                    } else {
                        setSubjects([]);
                    }
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
    }, [collName, adminId, addClassModal, addItemModal, deleteClassModal, deleteItemModal]);

    const totalClasses = classes.flatMap((cls) => cls.classes.flatMap((c) => c.class));

    const totalBranches = classes.flatMap((cls) => cls.classes);

    const getbranchesByClassId = (classId) => {
        return totalBranches.filter((branch) => branch.class.map((c) => c._id).includes(classId));
    }

    const getCoursesByClassId = (classId) => {
        return classes.filter((college) =>
            college.classes.some((cls) =>
                cls.class.some((c) => c._id === classId)
            )
        );
    }

    const countTotalSubjects = (subjects, classId) => {
        let totalSubjects = 0;
        subjects?.forEach((subject) => {
            if (subject.class === classId) {
                totalSubjects += subject.subjects.length;
            }
        });

        return totalSubjects;
    }

    const countTotalTeachers = (teachers, classId) => {
        let totalTeachers = 0;
        teachers.forEach((teacher) => {
            teacher.teachSubjects.forEach((subject) => {
                if (subject.class.classId === classId) {
                    totalTeachers += 1;
                }
            })
        });

        return totalTeachers;
    }

    const countTotalStudents = (students, classId) => {
        let totalStudents = 0;
        students.forEach((student) => {
            if (student.class === classId) {
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

    const sortedClasses = useMemo(() => {
        let sortableItems = [...totalClasses];

        if (sortConfig.key === 'totalClasses') {

            if (sortConfig.direction === 'ascending') {
                sortableItems.sort((a, b) => a.section > b.section ? 1 : -1);
            } else if (sortConfig.direction === 'descending') {
                sortableItems.sort((a, b) => a.section < b.section ? 1 : -1);
            } else if (sortConfig.direction === 'relevance') {
                sortableItems = totalClasses; // Default relevance sorting logic (if any)
            }
        } else if (sortConfig.key === 'branch') {
            if (sortConfig.direction === 'ascending') {
                sortableItems.sort((a, b) => getbranchesByClassId(a._id)[0].branch > getbranchesByClassId(b._id)[0].branch ? 1 : -1);
            } else if (sortConfig.direction === 'descending') {
                sortableItems.sort((a, b) => getbranchesByClassId(a._id)[0].branch < getbranchesByClassId(b._id)[0].branch ? 1 : -1);
            } else if (sortConfig.direction === 'relevance') {
                sortableItems = totalClasses; // Default relevance sorting logic (if any)
            }
        } else if (sortConfig.key === 'course') {
            if (sortConfig.direction === 'ascending') {
                sortableItems.sort((a, b) => getCoursesByClassId(a._id)[0].course.courseName > getCoursesByClassId(b._id)[0].course.courseName ? 1 : -1);
            } else if (sortConfig.direction === 'descending') {
                sortableItems.sort((a, b) => getCoursesByClassId(a._id)[0].course.courseName < getCoursesByClassId(b._id)[0].course.courseName ? 1 : -1);
            } else if (sortConfig.direction === 'relevance') {
                sortableItems = totalClasses; // Default relevance sorting logic (if any)
            }
        } else if (sortConfig.key === 'totalSubjects') {
            if (sortConfig.direction === 'ascending') {
                sortableItems.sort((a, b) => countTotalSubjects(subjects, a._id) > countTotalSubjects(subjects, b._id) ? 1 : -1);
            } else if (sortConfig.direction === 'descending') {
                sortableItems.sort((a, b) => countTotalSubjects(subjects, a._id) < countTotalSubjects(subjects, b._id) ? 1 : -1);
            } else if (sortConfig.direction === 'relevance') {
                sortableItems = totalClasses; // Default relevance sorting logic (if any)
            }
        } else if (sortConfig.key === 'totalTeachers') {
            if (sortConfig.direction === 'ascending') {
                sortableItems.sort((a, b) => countTotalTeachers(teachers, a._id) > countTotalTeachers(teachers, b._id) ? 1 : -1);
            } else if (sortConfig.direction === 'descending') {
                sortableItems.sort((a, b) => countTotalTeachers(teachers, a._id) < countTotalTeachers(teachers, b._id) ? 1 : -1);
            } else if (sortConfig.direction === 'relevance') {
                sortableItems = totalClasses; // Default relevance sorting logic (if any)
            }
        } else if (sortConfig.key === 'totalStudents') {
            if (sortConfig.direction === 'ascending') {
                sortableItems.sort((a, b) => countTotalStudents(students, a._id) > countTotalStudents(students, b._id) ? 1 : -1);
            } else if (sortConfig.direction === 'descending') {
                sortableItems.sort((a, b) => countTotalStudents(students, a._id) < countTotalStudents(students, b._id) ? 1 : -1);
            } else if (sortConfig.direction === 'relevance') {
                sortableItems = totalClasses; // Default relevance sorting logic (if any)
            }
        }

        return sortableItems;
    }, [classes, sortConfig]);

    return (
        <>
            <div className={`${styles.page}`}>
                <ToastContainer />
                <div className={styles.side}>
                    <LeftSidebar open={open} openSideBar={openSideBar} />
                </div>
                <div className={`${styles.main} ${(addClassModal || deleteClassModal) ? styles.dimmed : ''}`}>
                    <div className={styles.container}>
                        <Header session={session} />
                        <div className={`${styles.header}`}>
                            <h3 className='text-center'>Classes</h3>
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
                                    class_Id={classId}
                                    class_section={section}
                                    sessionValue={sessionVal}
                                    clsSemester={semester}
                                    clsBranch={branch}
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
                            ) : (sortedClasses.length > 0 ? (
                                <ClassesTableWrapper handleActionVisible={handleActionVisible} actionMenuRefs={actionMenuRefs} sortedClasses={sortedClasses} toggleDeleteClass={toggleDeleteClass} toggleAddItem={toggleAddItem} handleSort={handleSort} sortConfig={sortConfig} countTotalStudents={countTotalStudents} countTotalTeachers={countTotalTeachers} countTotalSubjects={countTotalSubjects} teachers={teachers} subjects={subjects} students={students} visibleActionCardId={visibleActionCardId} getbranchesByClassId={getbranchesByClassId} getCoursesByClassId={getCoursesByClassId} />) : (
                                <div className={`${styles.noData} alert alert-info`}>
                                    <h3>No Classes, Please add one</h3>
                                </div>
                            )
                            )}
                        </div>
                        <div className={styles.bottomContent}>
                            <div className={`${styles.addCourse}`}>
                                <i className="fa-solid fa-plus" onClick={toggleAddClass}></i>
                                <Link>Add Class</Link>
                            </div>
                        </div>
                    </div>
                    {addClassModal && (
                        <AddClassView toggleAddClass={toggleAddClass} addNewClass={addNewClass} session={session} />
                    )}
                    {deleteClassModal && (
                        <ConfirmationBox
                            toggleDeleteItem={toggleDeleteClass}
                            deleteItem={deleteClass}
                            dialogue={dialogue}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default Classes;