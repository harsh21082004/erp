import React, { useEffect, useState } from 'react';
import styles from './AddItemView.module.css';
import { ColorRing } from "react-loader-spinner";
import axios from 'axios';

const AddItemView = ({ toggleAddItem, setAddItemModal, session, addNewItem, item, coursename, courseId, class_Id, class_section, sessionValue, clsSemester, clsBranch }) => {
    const adminId = session?._id;
    const [classId, setClassId] = useState('');
    const collName = session?.collName;
    const [isLoading, setIsLoading] = useState(false);
    const [studentName, setStudentName] = useState('');
    const [studentRollNo, setStudentRollNo] = useState('');
    const [studentEmail, setStudentEmail] = useState('');
    const [studentPass, setStudentPass] = useState('');
    const [gender, setGender] = useState('');
    const [fatherName, setFatherName] = useState('');
    const [motherName, setMotherName] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [teacherName, setTeacherName] = useState('');
    const [teacherEmail, setTeacherEmail] = useState('');
    const [teachSubject, setTeachSubject] = useState('');
    const [teacherPass, setTeacherPass] = useState('');
    const [classSemester, setClassSemester] = useState('');
    const [section, setSection] = useState('');
    const [branch, setBranch] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [showSubjectInputs, setShowSubjectInputs] = useState(false);
    const [sessionVal, setSessionVal] = useState('');
    const [totalClasses, setTotalClasses] = useState([]);
    const [totalSubjects, setTotalSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [existingTeacher, setExistingTeacher] = useState(false);
    const [paidFees, setPaidFees] = useState('');
    const [inputType, setInputType] = useState("text");

    useEffect(() => {
        if (adminId) {
            fetch(`http://localhost:5000/ClassList/${courseId}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setTotalClasses(data);
                    } else {
                        console.error("Unexpected data format:", data);
                        setTotalClasses([]);
                    }
                })
                .catch(err => {
                    console.error("Error fetching classes:", err);
                });

            fetch(`http://localhost:5000/AllSubjects/${classId}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setTotalSubjects(data);
                    } else {
                        console.error("Unexpected data format:", data);
                        setTotalSubjects([]);
                    }
                });

            if (item === 'Teacher') {
                fetch(`http://localhost:5000/Teachers/${adminId}`)
                    .then(res => res.json())
                    .then(data => {
                        if (Array.isArray(data)) {
                            console.log(data)
                            setTeachers(data);
                        } else {
                            console.error("Unexpected data format:", data);
                            setTeachers([]);
                        }
                    });
            }
        }
    }, [classId, adminId, item, courseId, classSemester, branch, section, sessionVal, teachSubject, teacherEmail]);

    useEffect(()=>{
        if(class_Id){
            setClassId(class_Id);
        }
        if(class_section){
            setSection(class_section);
        }
        if(sessionValue){
            setSessionVal(sessionValue);
        }
        if(clsSemester){
            setClassSemester(clsSemester);
        }
        if(clsBranch){
            setBranch(clsBranch);
        }
    },[class_Id, class_section, sessionValue, clsSemester, clsBranch]);


    const handleChange = (e, index = null) => {
        const { name, value } = e.target;

        switch (name) {
            case 'studentName':
                setStudentName(value);
                break;
            case 'studentEmail':
                setStudentEmail(value);
                break;
            case 'studentRollNo':
                setStudentRollNo(value);
                break;
            case 'studentPass':
                setStudentPass(value);
                break;
            case 'paidFees':
                setPaidFees(value);
                break;
            case 'gender':
                setGender(value);
                break;
            case 'fatherName':
                setFatherName(value);
                break;
            case 'motherName':
                setMotherName(value);
                break;
            case 'phone':
                setPhone(value);
                break;
            case 'dob':
                setDob(value);
                break;
            case 'teacherName':
                setTeacherName(value);
                break;
            case 'teacherEmail':
                setTeacherEmail(value);
                if (teachers?.find(teacher => teacher.email === value)) {
                    setExistingTeacher(true);
                } else {
                    setExistingTeacher(false);
                }
                break;
            case 'teachSubject':
                setTeachSubject(value);
                break;
            case 'teacherPass':
                setTeacherPass(value);
                break;
            case 'classSemester':
                setClassSemester(value);
                setBranch('');  // Reset branch when semester changes
                break;
            case 'section':
                setSection(value);
                const selectedClass = filteredClasses?.find(cls => cls.section === value);
                if (selectedClass) {
                    setClassId(selectedClass._id);
                }
                break;
            case 'branch':
                setBranch(value);
                setSection('');  // Reset section when branch changes
                break;

            // Handling multiple subjects dynamically
            case 'subName':
            case 'subCode':
                setSubjects(prevSubjects => {
                    const updatedSubjects = [...prevSubjects];

                    // Retrieve the session based on the selected section
                    const session = filteredClasses?.find(cls => cls.section === section)?.session || '';

                    // Update the subject at the given index with subjectName, subjectCode, and session
                    updatedSubjects[index] = {
                        ...updatedSubjects[index],
                        [name]: value,  // Update the respective subjectName or subjectCode field
                        session: `${!class_Id ? session : sessionVal}` // Ensure session is updated based on the section
                    };

                    return updatedSubjects;
                });
                break;
            case 'sessionVal':
                setSessionVal(value);
                break;

            default:
                break;
        }
    };

    const addSubject = () => {
        setShowSubjectInputs(true); // Display the input fields
        setSubjects(prevSubjects => [
            ...prevSubjects,
            {
                subName: '',
                subCode: '',
                session: `${!class_Id ? (filteredClasses?.find(cls => cls.section === section)?.session || ''): sessionVal}`
            }
        ]);
    };

    console.log('Subjects:', subjects);

    const removeSubject = (index) => {
        const updatedSubjects = subjects.filter((_, i) => i !== index);
        setSubjects(updatedSubjects); // Remove subject input set
    };


    //Total Fees

    const totalFees = totalClasses?.find((cls) => cls.course?._id === courseId)?.course?.fees || 0;

    // Filter branches by semester
    const filteredBranches = totalClasses.length > 0 ? totalClasses
        ?.filter(cls => cls.semester === parseInt(classSemester) && cls.course._id === courseId)
        ?.flatMap(cls => cls.classes) : [];

    // Sort and filter classes by semester, course and branch

    const filteredClasses = filteredBranches.length > 0 ? filteredBranches
        ?.filter(cls => cls.branch === branch)
        ?.flatMap(cls => cls.class) : [];

    // Filter subjects by class    

    const filteredSubjects = totalSubjects.length > 0
        ? totalSubjects.filter(cls => cls.class === classId).flatMap(cls => cls.subjects)
        : [];

    // Filter selected subject    

    console.log(!class_Id ? (filteredClasses?.find(cls => cls.section === section)?.session || '') : sessionVal)

    const selectedSubject = totalSubjects.length > 0
        ? totalSubjects.map(cls => cls.subjects.find(sub => sub.subName === teachSubject)) : [];

    const year = Math.ceil(classSemester / 2);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let requestBody;

            if (item === 'Student') {
                requestBody = {
                    name: studentName,
                    rollNum: studentRollNo,
                    email: studentEmail,
                    fatherName: fatherName,
                    motherName: motherName,
                    phone: phone,
                    dob: dob,
                    gender: gender,
                    password: studentPass,
                    course: courseId,
                    collName: adminId,
                    classId: classId,
                    fees: {
                        paidFees: [
                            {
                                year: (year === 1 && 'First Year') ||
                                    (year === 2 && 'Second Year') ||
                                    (year === 3 && 'Third Year') ||
                                    (year === 4 && 'Fourth Year') ||
                                    'Unknown Year', // Fallback in case year is not between 1-4
                                amountPaid: paidFees
                            }
                        ],
                        totalFees: totalFees
                    }
                };

            } else if (item === 'Teacher') {
                requestBody = {
                    name: teacherName,
                    email: teacherEmail,
                    password: teacherPass,
                    role: 'Teacher',
                    collName: adminId,
                    course: courseId,
                    teachSubjects: [{
                        subjects: [{
                            subName: teachSubject,
                            subCode: selectedSubject[0]?.subCode,
                            session: selectedSubject[0]?.session,
                            subjectId: selectedSubject[0]?._id,
                        }],
                        class: {
                            classId: classId,
                            branch: branch,
                            section: section,
                            semester: classSemester
                        }
                    }]
                };
            } else if (item === 'Subject') {
                requestBody = {
                    subjects: subjects,
                    class: classId,
                    collName: adminId,
                    course: courseId
                };
            } else if (item === 'Class') {
                requestBody = {
                    semester: classSemester,
                    section: section,
                    collName: adminId,
                    courseId: courseId,
                    branch: branch,
                    session: sessionVal
                };
            }

            const response = await axios.post(`http://localhost:5000/${item}Reg`, requestBody);

            if (response.status === 201) {
                console.log(`Successfully created ${item}:`, response.data);
                addNewItem(response.data.result);
                toggleAddItem();
            } else {
                console.error(`Failed to create ${item}`);
            }
        } catch (error) {
            console.error(`Error creating ${item}:`, error);
        } finally {
            setIsLoading(false);
        }

        setAddItemModal(false);
    };

    const handleFocus = () => {
        setInputType("date"); // Switch to date picker when focused
    };

    const handleBlur = () => {
        if (!dob) {
            setInputType("text"); // Switch back to text if no date is selected
        }
    };

    console.log(class_Id, class_section, sessionValue, clsSemester, clsBranch);

    return (
        <div className={styles.addItemModal}>
            <div className={styles.addItemModalContent}>
                <div className={styles.addItemModalHeader}>
                    <h3>Add {item}</h3>
                    <i className="fa-solid fa-x" onClick={toggleAddItem} style={{ cursor: 'pointer' }}></i>
                </div>
                <div className={styles.addItemModalBody}>
                    <form className={styles.input} onSubmit={handleSubmit}>
                        <div className={`${styles.collName}`}>
                            <input type="text" id="coll" name="coll" readOnly />
                            <span>{collName}</span>
                        </div>
                        <div className={`${styles.courseName}`}>
                            <input type="text" id="courseName" name="courseName" readOnly />
                            <span>{coursename}</span>
                        </div>
                        {item === 'Student' && (
                            <>
                                <div>
                                    <input type="text" id="studentName" name="studentName" value={studentName} required onChange={handleChange} />
                                    <span><label htmlFor="studentName">NAME</label></span>
                                </div>
                                <div>
                                    <input type="email" id="studentEmail" name="studentEmail" value={studentEmail} required onChange={handleChange} />
                                    <span><label htmlFor="studentEmail">EMAIL</label></span>
                                </div>
                                <div>
                                    <input type="text" id="studentRollNo" name="studentRollNo" value={studentRollNo} required onChange={handleChange} />
                                    <span><label htmlFor="studentRollNo">ROLL NO</label></span>
                                </div>
                                <div>
                                    <select
                                        id='gender'
                                        name='gender'
                                        value={gender}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" >SELECT GENDER</option>
                                        <option value="male">MALE</option>
                                        <option value="female">FEMALE</option>
                                    </select>
                                </div>
                                <div>
                                    <input type="text" id="fatherName" name="fatherName" value={fatherName} required onChange={handleChange} />
                                    <span><label htmlFor="fatherName">FATHER'S NAME</label></span>
                                </div>
                                <div>
                                    <input type="text" id="motherName" name="motherName" value={motherName} required onChange={handleChange} />
                                    <span><label htmlFor="motherName">MOTHER'S NAME</label></span>
                                </div>
                                <div>
                                    <input type="text" id="phone" name="phone" value={phone} required onChange={handleChange} />
                                    <span><label htmlFor="phone">STUDENT PHONE</label></span>
                                </div>
                                <div>
                                    <input id="dob" type={'date'} onfocus={handleFocus} onblur={handleBlur} name="dob" value={dob} required onChange={handleChange} />
                                    <span><label htmlFor="dob">DATE OF BIRTH</label></span>
                                </div>
                                {!class_Id && <div>
                                    <select
                                        id="classSemester"
                                        name="classSemester"
                                        value={classSemester}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled>SELECT SEMESTER</option>
                                        {Array.from(new Set(totalClasses.map(cls => cls.semester))) // Extract unique semester
                                            .sort((a, b) => a - b) // Sort in ascending order numerically
                                            .map((semester, index) => (
                                                <option key={index} value={semester}>
                                                    {semester}
                                                </option>
                                            ))}
                                    </select>
                                </div>}
                                <div>
                                    <input type="text" id="paidFees" name="paidFees" value={paidFees} required onChange={handleChange} />
                                    <span><label htmlFor="paidFees">PAID FEES</label></span>
                                </div>
                                {!class_Id && <div>
                                    <select
                                        id="branch"
                                        name="branch"
                                        value={branch}
                                        onChange={handleChange}
                                        required
                                        disabled={!classSemester} // Disable until year is selected
                                    >
                                        <option value="" disabled>SELECT BRANCH</option>
                                        {filteredBranches.map(cls => (
                                            <option key={cls._id} value={cls.branch}>
                                                {cls.branch}
                                            </option>
                                        ))}
                                    </select>
                                </div>}
                                <div>
                                    <select
                                        id="section"
                                        name="section"
                                        value={section}
                                        onChange={handleChange}
                                        required
                                        disabled={!classSemester || class_Id} // Disable until year is selected
                                    >
                                        <option value="" disabled>{class_Id? section : 'SELECT SECTION'}</option>
                                        {filteredClasses.map(cls => (
                                            <option key={cls._id} value={cls.section}>
                                                {cls.section}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <input type="text" id="studentPass" name="studentPass" value={studentPass} required onChange={handleChange} />
                                    <span><label htmlFor="studentPass">SET PASSWORD</label></span>
                                </div>
                            </>
                        )}
                        {item === 'Teacher' && (
                            <>
                                <div>
                                    <input type="text" id="teacherName" name="teacherName" value={teacherName} required onChange={handleChange} />
                                    <span><label htmlFor="teacherName">NAME</label></span>
                                </div>
                                <div>
                                    <input type="email" id="teacherEmail" name="teacherEmail" value={teacherEmail} required onChange={handleChange} />
                                    <span><label htmlFor="teacherEmail">TEACHER EMAIL ID</label></span>
                                </div>
                                {existingTeacher && (
                                    <div className="alert alert-success" style={{ width: '95%', margin: '0 auto' }} role="alert" >Teacher Already Exists, Please Add Subjects</div>
                                )}
                                {!class_Id && (<><div>
                                    <select
                                        id="classSemester"
                                        name="classSemester"
                                        value={classSemester}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled>SELECT SEMESTER</option>
                                        {Array.from(new Set(totalClasses.map(cls => cls.semester))) // Extract unique semester
                                            .sort((a, b) => a - b) // Sort in ascending order numerically
                                            .map((semester, index) => (
                                                <option key={index} value={semester}>
                                                    {semester}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                <div>
                                    <select
                                        id="branch"
                                        name="branch"
                                        value={branch}
                                        onChange={handleChange}
                                        required
                                        disabled={!classSemester} // Disable until year is selected
                                    >
                                        <option value="" disabled>SELECT BRANCH</option>
                                        {filteredBranches.map(cls => (
                                            <option key={cls._id} value={cls.branch}>
                                                {cls.branch}
                                            </option>
                                        ))}
                                    </select>
                                </div></>)}
                                <div>
                                    <select
                                        id="section"
                                        name="section"
                                        value={section}
                                        onChange={handleChange}
                                        required
                                        disabled={!classSemester} // Disable until year is selected
                                    >
                                        <option value="" disabled>{class_Id? section : 'SELECT SECTION'}</option>
                                        {filteredClasses.map(cls => (
                                            <option key={cls._id} value={cls.section}>
                                                {cls.section}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <select
                                        id="teachSubject"
                                        name="teachSubject"
                                        value={teachSubject}
                                        onChange={handleChange}
                                        required
                                        disabled={!classSemester || !classId} // Disable until year is selected
                                    >
                                        <option value="" disabled>SELECT SUBJECT</option>
                                        {filteredSubjects.map(cls => (
                                            <option key={cls._id} value={cls.subName}>
                                                {cls.subName} ({cls.subCode})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {!existingTeacher && (<div>
                                    <input type="password" id="teacherPass" name="teacherPass" value={teacherPass} required onChange={handleChange} />
                                    <span><label htmlFor="teacherPass">SET PASSWORD</label></span>
                                </div>)}
                            </>
                        )}
                        {item === 'Class' && (
                            <>
                                <div>
                                    <input type="text" id="classSemester" name="classSemester" value={classSemester} required onChange={handleChange} />
                                    <span><label htmlFor="classSemester">SEMESTER</label></span>
                                </div>
                                <div>
                                    <input type="text" id="branch" name="branch" value={branch} required onChange={handleChange} />
                                    <span><label htmlFor="branch">BRANCH</label></span>
                                </div>
                                <div>
                                    <input type="text" id="section" name="section" value={section} required onChange={handleChange} />
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
                            </>
                        )}
                        {item === 'Subject' && (
                            <>
                                {!class_Id && <><div>
                                    <select
                                        id="classSemester"
                                        name="classSemester"
                                        value={classSemester}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled>SELECT SEMESTER</option>
                                        {Array.from(new Set(totalClasses.map(cls => cls.semester))) // Extract unique semesters
                                            .sort((a, b) => a - b) // Sort numerically
                                            .map((semester, index) => (
                                                <option key={index} value={semester}>
                                                    {semester}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                <div>
                                    <select
                                        id="branch"
                                        name="branch"
                                        value={branch}
                                        onChange={handleChange}
                                        required
                                        disabled={!classSemester} // Disable until semester is selected
                                    >
                                        <option value="" disabled>SELECT BRANCH</option>
                                        {filteredBranches.map(cls => (
                                            <option key={cls._id} value={cls.branch}>
                                                {cls.branch}
                                            </option>
                                        ))}
                                    </select>
                                </div></>}
                                <div>
                                    <select
                                        id="section"
                                        name="section"
                                        value={section}
                                        onChange={handleChange}
                                        required
                                        disabled={!classSemester} // Disable until semester is selected
                                    >
                                        <option value="" disabled>{class_Id? section : 'SELECT SECTION'}</option>
                                        {filteredClasses.map(cls => (
                                            <option key={cls._id} value={cls.section}>
                                                {cls.section}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {subjects.map((subject, index) => (
                                    <div key={index}>
                                        <div className={`${styles.subjects}`}>
                                            <div>
                                                <input
                                                    type="text"
                                                    id={`subjectName-${index}`}
                                                    name="subName"
                                                    value={subject.subName}
                                                    required
                                                    onChange={(e) => handleChange(e, index)}
                                                    disabled={!section}
                                                />
                                                <span><label htmlFor={`subjectName-${index}`}>SUBJECT NAME</label></span>
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    id={`subjectCode-${index}`}
                                                    name="subCode"
                                                    value={subject.subCode}
                                                    required
                                                    onChange={(e) => handleChange(e, index)}
                                                    disabled={!section}
                                                />
                                                <span><label htmlFor={`subjectCode-${index}`}>SUBJECT CODE</label></span>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            className={`${styles.removeBut} btn btn-danger`}
                                            onClick={() => removeSubject(index)}>
                                            Remove Subject
                                        </button>
                                    </div>
                                ))}
                                {showSubjectInputs ? (
                                    <button
                                        type="button"
                                        className={`${styles.anotherBut} btn btn-success`}
                                        onClick={addSubject}>
                                        Add Another Subject
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className={`${styles.anotherBut} btn btn-success`}
                                        onClick={addSubject}>
                                        Add Subject
                                    </button>
                                )}
                            </>
                        )}
                        <button type="submit" className={styles.button}>
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

export default AddItemView;