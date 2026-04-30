import React, { useState } from "react";

/** styles */
import "./InsuranceForm.scss";

/** interfaces */
import type { IInsuranceRecord } from "../interface/crmInterface";

interface InsuranceFormProps {
  onSubmit: (record: Omit<IInsuranceRecord, "id" | "createdAt">) => void;
}

const InsuranceForm: React.FC<InsuranceFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    customerName: "",
    regNo: "",
    policyNo: "",
    mobileNo: "",
    email: "",
    status: "",
    policyDate: "",
    expiryDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submissionData = {
      ...formData,
      status: "Active",
      expiryDate: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1), // 1 year Expiry
      ),
      policyDate: new Date(),
    };

    console.log(submissionData);

    onSubmit(submissionData);

    // Reset form
    // setFormData({
    //   customerName: "",
    //   regNo: "",
    //   policyNo: "",
    //   mobileNo: "",
    //   email: "",
    //   status: "",
    //   policyDate: "",
    // });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group full-width">
          <label>Customer Name</label>
          <input
            required
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            placeholder="Customer Name"
          />
        </div>
        <div className="form-group">
          <label>Registration Number</label>
          <input
            required
            type="text"
            name="regNo"
            value={formData.regNo}
            onChange={handleChange}
            placeholder="AB-12-CD-3456"
          />
        </div>
        <div className="form-group">
          <label>Policy Number</label>
          <input
            required
            type="text"
            name="policyNo"
            value={formData.policyNo}
            onChange={handleChange}
            placeholder="POL-98765432"
          />
        </div>
        <div className="form-group">
          <label>Mobile Number</label>
          <input
            required
            type="tel"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleChange}
            placeholder="+91 99999 99999"
          />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input
            required
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="customer@mail.com"
          />
        </div>
        <div className="full-width">
          <button type="submit" className="btn-submit">
            Save Insurance Record
          </button>
        </div>
      </form>
    </div>
  );
};

export default InsuranceForm;
