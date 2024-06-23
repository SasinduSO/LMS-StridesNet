import "../style/Form.css";
import React, { useState } from "react";
import axios from "axios";
import Alert from "react-bootstrap/Alert";
import { getAuthUser } from "../../helper/Storage";
import { useNavigate, useParams } from "react-router-dom";

const AddMaterial = () => {
  const auth = getAuthUser();
  const navigate = useNavigate();
  const { code } = useParams(); // Extract code from the URL parameters

  const [material, setMaterial] = useState({
    title: "",
    description: "",
    file: null,
    loading: false,
    success: "",
    error: "",
    status: "1",
  });

  // Handler for adding the material
  const addMaterial = (e) => {
    e.preventDefault();
    setMaterial({ ...material, loading: true, error: "", success: "" });
    const link = `http://localhost:4000/${encodeURIComponent(code)}/materials`;

    const formData = new FormData();
    formData.append("title", material.title);
    formData.append("description", material.description);
    formData.append("file", material.file);
    formData.append("status", material.status);

    axios
      .post(link, formData, {
        headers: {
          token: auth.token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setMaterial({
          ...material,
          loading: false,
          error: "",
          success: res.data,
        });
        setTimeout(() => {
          navigate(`/Admin/Materials`);
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 404) {
          setMaterial({
            title: "",
            description: "",
            file: null,
            error: "Adding material was not successful",
            success: "",
            loading: false,
          });
          setTimeout(() => {
            navigate(`/Admin/Materials`);
          }, 2000);
        } else if (err.response.status === 422) {
          setMaterial({
            ...material,
            error: err.response.data.errors[0].msg,
            loading: false,
            success: "",
          });
        } else {
          setMaterial({
            ...material,
            loading: false,
            error: err.response.data,
            success: "",
          });
        }
      });
  };

  return (
    <>
      <div className="admin-container">
        <div id="shared-table-p">Add Material</div>
        {/* Display error message */}
        {material.loading === false && material.error && (
          <Alert variant="danger" className="p-2">
            {material.error}
          </Alert>
        )}
        {/* Display success message */}
        {material.loading === false && material.success && (
          <Alert variant="success" className="p-2">
            {material.success}
          </Alert>
        )}
        {/* Add Material form */}
        <form name="myForm" className="admin-form" onSubmit={addMaterial}>
          <div className="admin-row">
            <div className="admin-col-25">
              <label key="title" className="admin-label">
                Title
              </label>
            </div>
            <div className="admin-col-75">
              <input
                type="text"
                placeholder="Material Title"
                id="title"
                className="admin-input-select"
                required
                value={material.title}
                onChange={(e) =>
                  setMaterial({ ...material, title: e.target.value })
                }
              />
            </div>
          </div>

          <div className="admin-row">
            <div className="admin-col-25">
              <label key="description" className="admin-label">
                Description
              </label>
            </div>
            <div className="admin-col-75">
              <textarea
                placeholder="Material Description"
                id="description"
                className="admin-input-select"
                required
                value={material.description}
                onChange={(e) =>
                  setMaterial({ ...material, description: e.target.value })
                }
              />
            </div>
          </div>

          <div className="admin-row">
            <div className="admin-col-25">
              <label key="file" className="admin-label">
                File
              </label>
            </div>
            <div className="admin-col-75">
              <input
                type="file"
                id="file"
                className="admin-input-select"
                required
                onChange={(e) =>
                  setMaterial({ ...material, file: e.target.files[0] })
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
                value={material.status}
                onChange={(e) =>
                  setMaterial({ ...material, status: e.target.value })
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
              disabled={material.loading === true}
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default AddMaterial;
