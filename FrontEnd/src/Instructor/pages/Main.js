import "../style/main.css";
import "../style/CourseCard.css";
import CoursesCard from "../components/CoursesCard";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Alert from "react-bootstrap/Alert";
import { getAuthUser } from "../../helper/Storage";

const Main = () => {
  const auth = getAuthUser();
  const type = "course";
  const [courses, setCourses] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0,
  });

  useEffect(() => {
    setCourses((prevCourses) => ({ ...prevCourses, loading: true }));
    axios
      .get("http://localhost:4000/view-instructor-courses", {
        headers: {
          token: auth.token,
          email: auth.email,
        },
      })
      .then((resp) => {
        setCourses((prevCourses) => ({
          ...prevCourses,
          results: resp.data,
          loading: false,
        }));
      })
      .catch((err) => {
        console.log(err);
        setCourses((prevCourses) => ({
          ...prevCourses,
          loading: false,
          err: "Session timed out",
        }));
      });
  }, [courses.reload, auth.email, auth.token]);

  return (
    <>
      <div className="InstructorContainer">
        <div className="text">
          <i>
            In Strides-Net you can manage
            <br />
            your courses easily
            <br />
            Tap below to start teaching a new course!
          </i>
        </div>
        <Link to={`/Instructor/add/${type}`} className="Ins-Link">
          Add Courses
        </Link>
      </div>
      <br />
      <br />
      <div>
        <div className="text">These are the Courses you are Teaching!</div>
        <div className="Instructor-course-list">
          {courses.loading === false &&
            courses.err == null &&
            Array.isArray(courses.results) &&
            courses.results.map((item) => (
              <CoursesCard
                key={item.code}
                name={item.name}
                code={item.code}
                EnrolledStudents={item.EnrolledStudents}
              />
            ))}
          {courses.loading === false &&
            courses.err == null &&
            !Array.isArray(courses.results) &&
            courses.results && (
              <Alert
                variant="info"
                style={{
                  width: "50%",
                  margin: "5% auto",
                  textAlign: "center",
                }}
              >
                {courses.results}
              </Alert>
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
        </div>
      </div>
    </>
  );
};

export default Main;
