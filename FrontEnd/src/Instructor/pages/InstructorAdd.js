import React from "react";
import AddCourse from "../components/AddCourseINS";
import AddUser from "../components/AddUserINS";

import { useParams } from "react-router-dom";

const InstructorAdd = () => {
  let { type } = useParams();
  type = type.toLowerCase();
  //console.log(type);
  if (type === "course") {
    return <AddCourse />;
  } else {
    return <AddUser type= "student" />;
  } 
};

export default InstructorAdd;

