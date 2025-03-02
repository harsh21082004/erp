import React from 'react';
import styles from './Home.module.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className='main pt-5'>
      <h2 className='text-center my-5'>Welcome To Student Attendance Management System</h2>
      <div className={`${styles.container}`}>
        <section>
          <img src="/img1.png" alt="img1" width={450} height={300} />
          <div>
            <p>The Student Attendance System is a web application designed to streamline the process of tracking student attendance in educational institutions. This project offers an user-friendly interface for both students and teachers. Students can view their attendance records, check-in to classes, and receive notifications about their attendance status. <br />To Check Or Edit Attendance Please Login : </p>
            <Link to={'/login'} className={`${styles.button}`}>Login</Link>
          </div>
        </section>
        <section>
        <div>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae est ducimus excepturi provident in? Accusantium ad ex sunt quam sit nam consequuntur tempora qui dicta natus quibusdam, similique a temporibus! Non eius iusto obcaecati?</p>
            <Link to={'/'} className={`${styles.button}`} >Link</Link>
          </div>
          <img src="/img2.png" alt="img2" width={450} height={300} />
        </section>
        <section>
          <img src="/img3.png" alt="img3" width={450} height={300} />
          <div>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae est ducimus excepturi provident in? Accusantium ad ex sunt quam sit nam consequuntur tempora qui dicta natus quibusdam, similique a temporibus! Non eius iusto obcaecati?</p>
            <Link to={'/'} className={`${styles.button}`} >Link</Link>
          </div>
        </section>
        <section>
        <div>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae est ducimus excepturi provident in? Accusantium ad ex sunt quam sit nam consequuntur tempora qui dicta natus quibusdam, similique a temporibus! Non eius iusto obcaecati?</p>
            <Link to={'/'} className={`${styles.button}`} >Link</Link>
          </div>
          <img src="/img4.png" alt="img4" width={450} height={300} />
        </section>
      </div>
    </div>
  )
}

export default Home