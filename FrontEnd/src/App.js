import { Outlet } from "react-router-dom";
import Footer from "./shared/Footer";
import React from 'react';

import "./styleShared/App.css";

function App() {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
