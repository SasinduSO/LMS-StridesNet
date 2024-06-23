import "../style/StudentCourses.css";
import DynamicTable2 from "../../shared/DynamicTable2";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuthUser } from "../../helper/Storage";
import Alert from "react-bootstrap/Alert";
import { useParams } from "react-router-dom";

const StudentCourse = () => {
  let { code } = useParams();
  const auth = getAuthUser();
  const [courses, setCourses] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0,
  });

  useEffect(() => {
    setCourses((prevCourses) => ({ ...prevCourses, loading: true }));
    axios
      .get("http://localhost:4000/view-enrolled-students", {
        headers: { token: auth.token, code: code },
      })
      .then((resp) => {
        setCourses((prevCourses) => ({ ...prevCourses, results: resp.data, loading: false }));
      })
      .catch((err) => {
        console.log(err);
        setCourses((prevCourses) => ({
          ...prevCourses,
          loading: false,
          err: "Something Went Wrong",
        }));
      });
  }, [courses.reload, code, auth.token]);

  const setGrade = (email, grade) => {
    if (grade === "") {
      grade = null;
    }
    axios
      .post(
        "http://localhost:4000/set-grades",
        { student_email: email, course_code: code, grade: grade },
        {
          headers: {
            token: auth.token,
          },
        }
      )
      .then((res) => {
        setCourses((prevCourses) => ({ ...prevCourses, reload: prevCourses.reload + 1 }));
      })
      .catch((error) => {
        if (error.response.status === 422) {
          const errorMsg = error.response.data.errors[0].msg;
          setCourses((prevCourses) => ({ ...prevCourses, loading: false, err: errorMsg }));
        } else {
          setCourses((prevCourses) => ({
            ...prevCourses,
            loading: false,
            err: "Something Went Wrong",
          }));
        }
      });
  };

  let TableData = [];
  if (Array.isArray(courses.results)) {
    TableData = courses.results.map((result) => ({
      ...result,
      Grade: (
        <input
          type="number"
          max="100"
          min="0"
          onChange={(e) => {
            result.StudentGrade = e.target.value;
          }}
        />
      ),
      Update: (
        <input
          type="submit"
          className="student-submit"
          onClick={() => {
            setGrade(result.StudentEmail, result.StudentGrade);
          }}
        />
      ),
    }));
  }

  return (
    <>
      {courses.loading === false &&
        courses.err === null &&
        Array.isArray(courses.results) && (
          <DynamicTable2 TableData={TableData} type={courses.results[0].CourseName} />
        )}

      {courses.loading === false &&
        courses.err === null &&
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
        <>
          <Alert
            key="danger"
            variant="danger"
            style={{
              width: "50%",
              margin: "5% auto",
              zIndex: "-1",
              textAlign: "center",
            }}
          >
            {courses.err}
          </Alert>
          <br />
          <button className="showbtn" onClick={() => window.location.reload()}>
            Back
          </button>
          <br />
          <br />
        </>
      )}
    </>
  );
};

export default StudentCourse;
