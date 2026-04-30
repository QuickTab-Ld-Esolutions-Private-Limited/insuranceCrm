import { useState } from "react";

/** components */
import Sidebar from "../Sidebar";
import InsuranceForm from "../InsuranceForm";
import InsuranceTable from "../InsuranceTable";

/** styles */
import "./CrmLayout.scss";

/** interfaces */
import type { IInsuranceRecord } from "../../interface/crmInterface";

const CRMLayout = () => {
  const [activeTab, setActiveTab] = useState<"form" | "table">("form");
  const [records, setRecords] = useState<IInsuranceRecord[]>([]);

  const handleAddRecord = (
    record: Omit<IInsuranceRecord, "id" | "createdAt">,
  ) => {
    const newRecord: IInsuranceRecord = {
      ...record,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setRecords([newRecord, ...records]);
    setActiveTab("table"); // Auto-switch to table to see the new data
  };

  // const handleUpdateRecord = (updatedRecord: IInsuranceRecord) => {
  //   const updatedRecords = records.map((rec) =>
  //     rec.id === updatedRecord.id
  //       ? {
  //           ...updatedRecord,
  //           id: rec.id,
  //           createdAt: rec.createdAt,
  //         }
  //       : rec,
  //   );

  //   setRecords(updatedRecords);
  // };

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
          <InsuranceForm onSubmit={handleAddRecord} />
        ) : (
          <InsuranceTable records={records} />
        )}
      </main>
    </div>
  );
};

export default CRMLayout;
