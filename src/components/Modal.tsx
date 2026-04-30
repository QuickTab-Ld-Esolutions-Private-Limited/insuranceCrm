import { useState } from "react";

/** styles */
import "./Modal.scss";

/** icons */
import { IoClose } from "react-icons/io5";

/** interfaces */
import type { IInsuranceRecord } from "../interface/crmInterface";

interface ModalProps {
  record: IInsuranceRecord;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ record, onClose }) => {
  const [renewed, setRenewed] = useState(false);

  const handleClose = () => {
    if (renewed) {
      setRenewed(false);
    } else {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose}>
          <IoClose />
        </button>

        <div className="head_wrapper">
          <h3>Policy Details</h3>
          {new Date(record.expiryDate) > new Date() && (
            <span onClick={() => setRenewed(true)}>Renewed Policy</span>
          )}
        </div>

        {renewed ? (
          <h2>Renewed Policy Active</h2>
        ) : (
          <div className="detail-grid">
            <div className="detail-row">
              <span className="label">Customer Name</span>
              <span className="value">{record.customerName}</span>
            </div>
            <div className="detail-row">
              <span className="label">Policy Number</span>
              <span className="value">{record.policyNo}</span>
            </div>
            <div className="detail-row">
              <span className="label">Registration No.</span>
              <span className="value">{record.regNo}</span>
            </div>
            <div className="detail-row">
              <span className="label">Mobile Number</span>
              <span className="value">{record.mobileNo}</span>
            </div>
            <div className="detail-row">
              <span className="label">Email Address</span>
              <span className="value">{record.email}</span>
            </div>
            <div className="detail-row">
              <span className="label">Status</span>
              <span className="value">{record.status}</span>
            </div>
            <div className="detail-row">
              <span className="label">Policy Date</span>
              <span className="value">
                {record.policyDate.toLocaleDateString()}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Expiry Date</span>
              <span className="value">
                {record.expiryDate.toLocaleDateString()}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Record Created On</span>
              <span className="value">{record.createdAt.toLocaleString()}</span>
            </div>
            <div className="del_btn_txt">Delete Entry</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
