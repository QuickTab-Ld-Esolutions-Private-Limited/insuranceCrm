import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

/** components */
import Sidebar from "../Sidebar";
import InsuranceForm from "../InsuranceForm";
import InsuranceTable from "../InsuranceTable";

/** custom hooks */
import useAuth from "../../hook/useAuth";

/** styles */
import "./CrmLayout.scss";

const CRMLayout = () => {
  const { accessToken, refreshToken, checkAuth } = useAuth();

  const [activeTab, setActiveTab] = useState<"form" | "table">("form");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const handelLogout = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch(
        "https://insurancecrm.quicktabhub.com/auth/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ refreshToken }),
        },
      );

      const data = await res.json();

      console.log("Response Data:", data);

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1000);
    } catch (error) {
      console.error("Real Error:", error);
      throw new Error("Request failed", { cause: error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crm-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="main-content">
        <div className="main_head_wrapper">
          <div className="page-header">
            <h2>
              {activeTab === "form" ? "Add New Policy" : "Insurance Directory"}
            </h2>
            <p>
              {activeTab === "form"
                ? "Enter customer and vehicle details below."
                : "Manage and filter your insurance records."}
            </p>
          </div>
          <button onClick={handelLogout} className="btn-submit">
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>

        {activeTab === "form" ? (
          <InsuranceForm setActiveTab={setActiveTab} />
        ) : (
          <InsuranceTable />
        )}
      </main>
    </div>
  );
};

export default CRMLayout;
