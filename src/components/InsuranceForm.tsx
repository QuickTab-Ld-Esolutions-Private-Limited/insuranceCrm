import React, { useState } from "react";
import { toast } from "react-toastify";

/** styles */
import "./InsuranceForm.scss";

interface IInsuranceForm {
  setActiveTab: (tab: "form" | "table") => void;
}

const InsuranceForm: React.FC<IInsuranceForm> = ({ setActiveTab }) => {
  const [formData, setFormData] = useState({
    id: "",
    customerName: "",
    regNo: "",
    policyNo: "",
    mobileNo: "",
    email: "",
    status: "",
    policyDate: "",
    expiryDate: "",
  });
  const [formLoading, setFormLoading] = useState(false);

  // Format Date
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submissionData = {
      ...formData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: "active",
      policyDate: formatDate(new Date()),
      expiryDate: formatDate(
        new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      ),
    };

    console.log(submissionData);

    try {
      setFormLoading(true);
      const response = await fetch(
        "https://insurancecrm.quicktabhub.com/submit/insurance-form",
        {
          method: "POST",
          body: JSON.stringify(submissionData),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      console.log("Response Data:", data);

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);

      // Reset form
      setFormData({
        id: "",
        customerName: "",
        regNo: "",
        policyNo: "",
        mobileNo: "",
        email: "",
        status: "",
        policyDate: "",
        expiryDate: "",
      });

      setFormLoading(false);

      setTimeout(() => {
        setActiveTab("table");
      }, 2000);

      return data;
    } catch (error) {
      console.error("Real Error:", error);
      throw new Error("Request failed", { cause: error });
    } finally {
      setFormLoading(false);
    }
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
            placeholder="JH02AB1234"
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
            {formLoading ? "Saving..." : "Save Insurance Record"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InsuranceForm;
