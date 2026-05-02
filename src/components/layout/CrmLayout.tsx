import { useState } from "react";

/** components */
import Sidebar from "../Sidebar";
import InsuranceForm from "../InsuranceForm";
import InsuranceTable from "../InsuranceTable";

/** styles */
import "./CrmLayout.scss";

const CRMLayout = () => {
  const [activeTab, setActiveTab] = useState<"form" | "table">("form");

  return (
    <div className="crm-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="main-content">
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
