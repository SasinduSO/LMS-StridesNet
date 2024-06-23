import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom"; // Import Link from react-router-dom
import { getAuthUser } from "../../helper/Storage";
import Alert from "react-bootstrap/Alert";
import DynamicTable2 from "../../shared/DynamicTable2";

const MaterialDisplay = () => {
  const { code } = useParams(); // Get course code from URL parameters
  const auth = getAuthUser(); // Get authenticated user info

  const [materials, setMaterials] = useState({
    loading: true,
    data: [],
    err: null,
  });

  const fetchMaterials = useCallback(async () => {
    setMaterials({ loading: true, data: [], err: null });

    try {
      const response = await axios.get(`http://localhost:4000/materials/${encodeURIComponent(code)}`, {
        headers: { token: auth.token },
      });
      console.log("Fetched materials data:", response.data);
      setMaterials({ loading: false, data: response.data, err: null });
    } catch (err) {
      console.error(err);
      setMaterials({
        loading: false,
        data: [],
        err: "Failed to fetch materials. Please check the course code.",
      });
    }
  }, [code, auth.token]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const handleDelete = async (materialId) => {
    try {
      await axios.delete(`http://localhost:4000/course/${encodeURIComponent(code)}/materials/${materialId}`, {
        headers: { token: auth.token },
      });
      fetchMaterials(); // Refresh materials after delete
    } catch (err) {
      console.error(err);
      setMaterials({ ...materials, err: "Failed to delete material." });
    }
  };

  const handleUpdate = (materialId) => {
    // Placeholder for update logic
    console.log(`Update clicked for material ID ${materialId}`);
  };

  const TableData = Array.isArray(materials.data)
    ? materials.data.map((material) => ({
        ...material,
        Action: (
          <>
            <button
              className="btn btn-danger btn-sm me-2"
              onClick={() => handleDelete(material.id)}
            >
              Delete
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => handleUpdate(material.id)}
            >
              Update
            </button>
          </>
        ),
      }))
    : [];

  console.log("TableData:", TableData);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px", marginTop: "30px", marginRight: "30px" }}>
        {/* Link to the page where you can add a file */}
        <Link to={`/Instructor/MaterialDisplay/add-file/${code}`} className="btn btn-primary btn-sm me-2">
          Add File
        </Link>
      </div>
      {materials.loading && <p>Loading...</p>}
      {!materials.loading && materials.err && (
        <Alert variant="danger">{materials.err}</Alert>
      )}
      {!materials.loading && !materials.err && (
        <DynamicTable2 TableData={TableData} />
      )}
    </>
  );
};

export default MaterialDisplay;
