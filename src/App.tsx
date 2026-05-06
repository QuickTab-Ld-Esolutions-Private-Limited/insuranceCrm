import { BrowserRouter, Routes, Route } from "react-router-dom";

/** components */
import LoginPage from "./components/layout/LoginAuthLayout";
import CRMLayout from "./components/layout/CrmLayout";

/** styles */
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<CRMLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
