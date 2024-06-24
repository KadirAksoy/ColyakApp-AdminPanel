import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppHeader from "./AppHeader";
import LoginPage from "./page/LoginPage";
import React from "react";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/*" element={<AppHeader />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
