import "../style/Form.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Alert from "react-bootstrap/Alert";
import { getAuthUser } from "../../helper/Storage";
import { useParams, useNavigate } from "react-router-dom";

const UpdateCourse = () => {
  const auth = getAuthUser();
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState({
    name: "",
    code: "",
    price: "",
    loading: false,
    success: "",
    error: "",
    oldStatus: "1",
    status: "1",
  });

  // Handler for updating the course
  const Update = (e) => {
    e.preventDefault();
    setCourse({ ...course, loading: true, error: "", success: "" });
    const link = "http://localhost:4000/update-course";

    axios
      .put(
        link,
        {
          name: course.name,
          code: course.code,
          price: course.price,
          status: course.status,
          oldCode: id,
          oldStatus: course.oldStatus,
        },
        {
          headers: {
            token: auth.token,
          },
        }
      )
      .then((res) => {
        setCourse({
          ...course,
          loading: false,
          error: "",
          success: res.data,
        });
        setTimeout(() => {
          navigate(`/Admin/Course`);
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 404) {
          setCourse({
            name: "",
            code: "",
            price: "",
            error: "Update was not successful",
            success: "",
            loading: false,
          });
          setTimeout(() => {
            navigate(`/Admin/Course`);
          }, 2000);
        } else if (err.response.status === 422) {
          setCourse({
            ...course,
            error: err.response.data.errors[0].msg,
            loading: false,
            success: "",
          });
        } else {
          setCourse({
            ...course,
            loading: false,
            error: err.response.data,
            success: "",
          });
        }
      });
  };

  useEffect(() => {
    const link = `http://localhost:4000/get-course/${id}`;
    axios
      .get(link, {
        headers: {
          token: auth.token,
        },
      })
      .then((res) => {
        // Only update the course state if the response data is different
        setCourse((prevCourse) => ({
          ...prevCourse,
          name: res.data[0].name,
          code: res.data[0].code,
          price: res.data[0].price,
          status: res.data[0].status,
          oldStatus: res.data[0].status,
          loading: false,
        }));
      })
      .catch((err) => {
        setCourse((prevCourse) => ({
          ...prevCourse,
          name: "",
          code: "",
          price: "",
          success: "",
          loading: false,
          error: "Session Timed out",
        }));
        setTimeout(() => {
          navigate(`/Admin/Course`);
        }, 2000);
      });
  }, [auth.token, id, navigate]); // Dependencies for useEffect

  return (
    <>
      <div className="admin-container">
        <div id="shared-table-p">Update Course</div>
        {/* Display error message */}
        {course.loading === false && course.error && (
          <Alert variant="danger" className="p-2">
            {course.error}
          </Alert>
        )}
        {/* Display success message */}
        {course.loading === false && course.success && (
          <Alert variant="success" className="p-2">
            {course.success}
          </Alert>
        )}
        {/* Update Course form */}
        <form name="myForm" className="admin-form" onSubmit={Update}>
          <div className="admin-row">
            <div className="admin-col-25">
              <label key="name" className="admin-label">
                Name
              </label>
            </div>
            <div className="admin-col-75">
              <input
                type="text"
                placeholder="Course Name"
                id="name"
                className="admin-input-select"
                required
                value={course.name}
                onChange={(e) =>
                  setCourse({ ...course, name: e.target.value })
                }
              />
            </div>
          </div>

          <div className="admin-row">
            <div className="admin-col-25">
              <label key="price" className="admin-label">
                Price (LKR)
              </label>
            </div>
            <div className="admin-col-75">
              <input
                type="number"
                placeholder="Course Price"
                id="price"
                className="admin-input-select"
                required
                value={course.price}
                onChange={(e) =>
                  setCourse({ ...course, price: parseFloat(e.target.value) })
                }
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="admin-row">
            <div className="admin-col-25">
              <label key="code" className="admin-label">
                Code
              </label>
            </div>
            <div className="admin-col-75">
              <input
                type="number"
                placeholder="Course Code"
                id="code"
                className="admin-input-select"
                required
                value={course.code}
                onChange={(e) =>
                  setCourse({ ...course, code: e.target.value })
                }
              />
            </div>
          </div>

          <div className="admin-row">
            <div className="admin-col-25">
              <label htmlFor="status" className="admin-label">
                Status
              </label>
            </div>
            <div className="admin-col-75">
              <select
                id="status"
                name="status"
                className="admin-input-select"
                value={course.status}
                onChange={(e) =>
                  setCourse({ ...course, status: e.target.value })
                }
              >
                <option value="1">Active</option>
                <option value="0">In-Active</option>
              </select>
            </div>
          </div>

          <div className="admin-row">
            <input
              type="submit"
              value="Submit"
              className="admin-submit"
              disabled={course.loading === true}
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateCourse;
