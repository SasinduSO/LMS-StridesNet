import React, { useState, useEffect } from "react";
import axios from "axios";
import CourseItem from "../components/CourseItem";
import "../assets/style/allCourses.css";
import { getAuthUser } from "../../helper/Storage";
import Alert from "react-bootstrap/Alert";

function AllCourses() {
  const auth = getAuthUser();

  const [courses, setCourses] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0,
  });

  useEffect(() => {
    const fetchCourses = async () => {
      setCourses((prevState) => ({ ...prevState, loading: true }));
      try {
        const resp = await axios.get("http://localhost:4000/get-all-courses", {
          headers: { token: auth.token, email: auth.email },
        });
        setCourses((prevState) => ({ ...prevState, results: resp.data, loading: false }));
      } catch (err) {
        console.log(err);
        setCourses((prevState) => ({ ...prevState, loading: false, err: "Session Timed Out" }));
      }
    };

    fetchCourses();
  }, [courses.reload, auth.email, auth.token]);

  return (
    <>
      {courses.loading && (
        <div className="loading">Loading...</div>
      )}

      {courses.loading === false && courses.err === null && (
        <section className="st-courses" id="courses">
          <div className="st-products" id="Products">
            <h1>COURSES</h1>
            <section className="container-fluid">
              <div className="row">
                {Array.isArray(courses.results) && courses.results.length > 0 ? (
                  courses.results.map((course) => (
                    <CourseItem
                      key={course.code}
                      code={course.code}
                      name={course.CourseName}
                      instructorName={course.InstructorName}
                    />
                  ))
                ) : (
                  <Alert
                    variant="info"
                    style={{
                      width: "50%",
                      margin: "5% auto",
                      textAlign: "center",
                    }}
                  >
                    No courses available
                  </Alert>
                )}
              </div>
            </section>
          </div>
        </section>
      )}

      {courses.loading === false && courses.err != null && (
        <Alert
          key="danger"
          variant="danger"
          style={{
            width: "50%",
            margin: "5% auto",
            textAlign: "center",
          }}
        >
          {courses.err}
        </Alert>
      )}
    </>
  );
}

export default AllCourses;
