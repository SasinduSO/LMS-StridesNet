import React from "react";
import { Outlet ,Navigate } from "react-router-dom";
import { getAuthUser } from "../helper/Storage";
const Employee =()=>{
    const auth = getAuthUser();
    return <>
    {
    auth && auth.type==="employee" ? <Outlet/>:<Navigate to={`/`}/>
    }
    </>;
}
export default Employee;
