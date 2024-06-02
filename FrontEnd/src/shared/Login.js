import React, { useState } from "react";
import axios from "axios";
import Alert from "react-bootstrap/Alert";
import "../styleShared/login.css";
import { Link, useNavigate } from "react-router-dom";
import { setAuthUser } from "../helper/Storage";

function Login() {
  const navigate = useNavigate();
  const [login, setLogin] = useState({
    email: "",
    password: "",
    loading: false,
    err: null,
  });

  const LoginFun = (e) => {
    e.preventDefault();
    setLogin({ ...login, loading: true, err: null });

    axios
      .post("http://localhost:4000/login", {
        email: login.email,
        password: login.password,
      })
      .then((resp) => {
        setLogin({ ...login, loading: false, err: null });

        // Debug log to check the response
        console.log("Login response:", resp.data);

        // Save the token and user information
        setAuthUser(resp.data.token, resp.data.user);

        // Ensure user type is present
        if (resp.data.user.type) {
          // Redirect to the user-specific page
          navigate(`/${resp.data.user.type}`);
        } else {
          console.error("User type is undefined!");
        }
      })
      .catch((err) => {
        if (err.response && (err.response.status === 400 || err.response.status === 422)) {
          setLogin({
            ...login,
            loading: false,
            err: err.response.data.errors[0].msg,
          });
        } else {
          setLogin({
            ...login,
            loading: false,
            err: "Something went wrong",
          });
        }
      });
  };

  return (
    <>
      <div className="st-login-page">
        <div className="wrapper">
          <div className="st-login-form-box login">
            {login.loading === false && login.err && (
              <Alert variant="danger" className="alert-login">
                {login.err}
              </Alert>
            )}

            <h2>Login</h2>
            <form onSubmit={LoginFun}>
              <div className="st-login-input-box">
                <span className="st-icons">
                  <ion-icon name="mail"></ion-icon>
                </span>
                <input
                  className="input1"
                  type="text"
                  required
                  value={login.email}
                  onChange={(e) =>
                    setLogin({ ...login, email: e.target.value })
                  }
                />
                <label className="label1">Email</label>
              </div>
              <div className="st-login-input-box">
                <input
                  className="input1"
                  type="password"
                  required
                  value={login.password}
                  onChange={(e) =>
                    setLogin({ ...login, password: e.target.value })
                  }
                />
                <label className="label1">Password</label>
              </div>

              <button
                type="submit"
                className="st-login-btn"
                disabled={login.loading === true}
              >
                {login.loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <button className="st-login-btn">
              <Link to="/SignUp">Sign Up</Link>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
