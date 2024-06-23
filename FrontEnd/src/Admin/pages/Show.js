import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DynamicTable from "../../shared/DynamicTable";
import { useParams } from "react-router-dom";
import axios from "axios";
import Alert from "react-bootstrap/Alert";
import { getAuthUser } from "../../helper/Storage";

const Show = () => {
  const auth = getAuthUser();
  let { type } = useParams();
  if (type === undefined) {
    type = "instructor";
  }

  type = type.toLowerCase();

  const [data, setData] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0,
  });

  useEffect(() => {
    setData((prevData) => ({ ...prevData, loading: true }));
    const link = `http://localhost:4000/view-${type}s`;

    console.log('Auth Token:', auth.token);
    console.log('Request URL:', link);

    axios
      .get(link, {
        headers: {
          token: auth.token,
        },
      })
      .then((res) => {
        setData((prevData) => ({
          ...prevData,
          results: res.data,
          loading: false,
          err: null,
        }));
      })
      .catch((error) => {
        console.log(error);
        setData((prevData) => ({
          ...prevData,
          loading: false,
          err: "Session Timed out please login again",
        }));
      });
  }, [type, auth.token, data.reload]);

  const deleteData = (item) => {
    const link = `http://localhost:4000/delete-${type}`;
    setData((prevData) => ({ ...prevData, loading: true }));

    const deleteRequest = type === "course" 
      ? axios.delete(link, {
          data: { code: item },
          headers: { token: auth.token },
        })
      : axios.delete(link, {
          data: { email: item },
          headers: { token: auth.token },
        });

    deleteRequest
      .then((res) => {
        setData((prevData) => ({
          ...prevData,
          loading: false,
          reload: prevData.reload + 1,
        }));
      })
      .catch((error) => {
        console.log(error);
        const errorMessage = error.response.status === 404
          ? "Something Went Wrong"
          : error.response.data;
        setData((prevData) => ({
          ...prevData,
          loading: false,
          err: errorMessage,
        }));
      });
  };

  if (Array.isArray(data.results)) {
    data.results.forEach((result) => {
      if (type === "course" && result["Instructor Email"] === null) {
        result["Instructor Email"] = "none";
      }

      result.Status =
        typeof result.Status === "number"
          ? result.Status === 1
            ? "Active"
            : "In-Active"
          : result.Status;
      Object.assign(result, {
        Update: (
          <Link to={`/Admin/Update/${type}/${result.Code || result.Email}`}>
            <i className="fa-solid fa-pen-to-square"></i>
          </Link>
        ),
        Delete: (
          <Link>
            <i
              className="fa-solid fa-trash"
              onClick={() => deleteData(result.Code || result.Email)}
            ></i>
          </Link>
        ),
      });
    });
  }

  return (
    <>
      {data.loading === false &&
        data.err === null &&
        Array.isArray(data.results) &&
        data.results.length > 0 &&
        DynamicTable(data.results, type)}

      {data.loading === false &&
        data.err === null &&
        !Array.isArray(data.results) &&
        data.results && (
          <Alert
            variant="info"
            style={{
              width: "50%",
              margin: "5% auto",
              textAlign: "center",
              zIndex: "-1",
            }}
          >
            {data.results}
          </Alert>
        )}

      {data.loading === false && data.err != null && (
        <>
          <Alert
            key="danger"
            variant="danger"
            style={{
              width: "50%",
              margin: "5% auto",
              textAlign: "center",
            }}
          >
            {data.err}
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

export default Show;
