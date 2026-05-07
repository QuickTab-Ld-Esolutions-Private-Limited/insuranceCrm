import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

/** components */
import LoginPage from "./components/layout/LoginAuthLayout";
import CRMLayout from "./components/layout/CrmLayout";

/** styles */
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        style={{ zIndex: 999999 }}
      />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<CRMLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
