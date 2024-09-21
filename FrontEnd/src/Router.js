import { createBrowserRouter } from "react-router-dom";
import React from 'react';
import App from "./App";
import Login from "./shared/Login";
import SideBar from "./Admin/components/SideBar";
import Assign from "./Admin/pages/Assign";
import Main from "./Instructor/pages/Main";
import Home from "./shared/Home";
import AllCourses from "./Student/pages/AllCourses";
import MyCourses from "./Student/pages/MyCourses";
import Show from "./Admin/pages/Show";
import AdminAdd from "./Admin/pages/AdminAdd";
import AdminUpdate from "./Admin/pages/AdminUpdate";
import Header from "./shared/Header";
import Courses from "./Instructor/pages/Courses";
import StudentCourse from "./Instructor/pages/StudentCourse";
import Guest from "./middleware/Guest";
import Admin from "./middleware/Admin";
import Student from "./middleware/Student";
import Instructor from "./middleware/Instructor";
import AddUser from "./Admin/components/AddUser";
import InstructorAdd from "./Instructor/pages/InstructorAdd";
import MaterialDisplay from "./Instructor/pages/MaterialDisplay";
import AddMaterial from "./Instructor/pages/AddMaterial";
import Payment from "./Payment/pages/payment"

export const router = createBrowserRouter([
  {
    element: <Guest />,
    children: [
      {
        path: "/Login",
        element: <Login />,
      },
      {
        path: "/",
        element: (
          <>
            <Header />
            <App />
          </>
        ),
        children: [
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "*",
            element: <div>Notfound</div>,
          },
        ],
      },
      {
        path: "/SignUp",
        element: <AddUser />, // Adding the sign-up route
      },
    ],
  },
  {
    element: <Admin />,
    children: [
      {
        path: "/Admin",
        element: (
          <>
            <Header />
            <App />
            <SideBar />
          </>
        ),
        children: [
          {
            path: "/Admin:type",
            element: <Show />,
          },
          {
            path: "/Admin",
            element: <Show />,
          },
          {
            path: "/Admin/Add",
            element: <AdminAdd />,
          },
          {
            path: "/Admin/Add/:type",
            element: <AdminAdd />,
          },
        ],
      },
      {
        path: "/Admin/Update",
        element: (
          <>
            <Header />
            <AdminUpdate />
            <App />
          </>
        ),
      },
      {
        path: "/Admin/Update/:type/:id",
        element: (
          <>
            <Header />
            <AdminUpdate />
            <App />
          </>
        ),
      },

      {
        path: "/Admin/Assign",
        element: (
          <>
            <Header />
            <Assign />
            <App />
          </>
        ),
      },

      
    ],
  },

  {
    element: <Instructor />,
    children: [
      {
        path: "/Instructor",
        element: (
          <>
            <Header />
            <App />
          </>
        ),
        children: [
          {
            path: "/Instructor",
            element: <Main />,
          },
          {
            path: "/Instructor/Add",
            element: <InstructorAdd />,
          },
          {
            path: "/Instructor/Add/:type",
            element: <InstructorAdd />,
          },
          {
            path: "/Instructor/Main",
            element: <Main />,
          },
          {
            path: "/Instructor/courses",
            element: <Courses />,
          },
          {
            path: "/Instructor/StudentCourse",
            element: <StudentCourse />,
          },
          {
            path: "/Instructor/StudentCourse/:code",
            element: <StudentCourse />,
          },
          {
            path: "/Instructor/MaterialDisplay",
            element: <MaterialDisplay />,
          },
          {
            path: "/Instructor/MaterialDisplay/add-file/:code",
            element: <AddMaterial />,//course
          },
          {
            path: "/Instructor/MaterialDisplay/:code",
            element: <MaterialDisplay />,
          }
        ],
      },
    ],
  },
  {
    element: <Student />,
    children: [
      {
        path: "/Student",
        element: (
          <>
            <Header />
            <App />
          </>
        ),
        children: [
          {
            path: "/Student",
            element: <AllCourses />,
          },
          {
            path: "/Student/AllCourses",
            element: <AllCourses />,
          },
          {
            path: "/Student/MyCourses",
            element: <MyCourses />,
          },
          {
            path: "/Student/Payment/:courseCode/:price",
            element: <Payment />,
          },
        ],
      },
    ],
  },
]);