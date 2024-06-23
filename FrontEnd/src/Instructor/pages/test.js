import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { getAuthUser } from "../../helper/Storage";
import Alert from "react-bootstrap/Alert";
import DynamicTable2 from "../../shared/DynamicTable2";


/*


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
 
*/
const MaterialDisplay = () => {
  let { code } = useParams();
  const auth = getAuthUser();

  const [materials, setMaterials] = useState({
    loading: true,
    data: [],
    err: null,
  });

  useEffect(() => {

    //console.log('Course code:', code);

    fetchMaterials();
  }, []);

  const fetchMaterials = () => {
    setMaterials({ loading: true, data: [], err: null });
    axios
      .get(`http://localhost:4000/materials/${code}`, {
        headers: { token: auth.token },
      })
      .then((resp) => {
        setMaterials({ loading: false, data: resp.data, err: null });
      })
      .catch((err) => {
        console.error(err);
        setMaterials({ loading: false, data: [], err: "Failed to fetch materials." });
      });
  };

  const handleDelete = (materialId) => {
    axios
      .delete(`http://localhost:4000/materials/${code}/${materialId}`, {
        headers: { token: auth.token },
      })
      .then((resp) => {
        fetchMaterials(); // Refresh materials after delete
      })
      .catch((err) => {
        console.error(err);
        // Handle error
      });
  };

  let TableData = [];
  if (Array.isArray(materials.data)) {
    TableData = materials.data.map((material) => ({
      ...material,
      Action: (
        <>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(material.id)}
          >
            Delete
          </button>
        </>
      ),
    }));
  }

  return (
    <>
      {materials.loading && <p>Loading...</p>}
      {!materials.loading && materials.err && (
        <Alert variant="danger">{materials.err}</Alert>
      )}
      {!materials.loading && !materials.err && (
        <DynamicTable2 TableData={TableData} type={`Materials for Course ${code}`} />
      )}
    </>
  );
};

export default MaterialDisplay;
