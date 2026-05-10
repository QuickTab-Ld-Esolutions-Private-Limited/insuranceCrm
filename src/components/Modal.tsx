import { useState } from "react";

/** styles */
import "./Modal.scss";

/** icons */
import { IoClose } from "react-icons/io5";

/** utils */
import { formatDateUTC } from "../utils/common";

/** interfaces */
import type {
  IInsuranceRecord,
  IUpdateInsuranceRecord,
} from "../interface/crmInterface";

interface ModalProps {
  record: IInsuranceRecord;
  onClose: () => void;
  onDelete: (record: IInsuranceRecord) => Promise<IInsuranceRecord>;
  onUpdate: (record: IUpdateInsuranceRecord) => Promise<IUpdateInsuranceRecord>;
}

const Modal: React.FC<ModalProps> = ({
  record,
  onClose,
  onDelete,
  onUpdate,
}) => {
  const [renewed, setRenewed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [policyDate, setPolicyDate] = useState(record.policyDate);

  const handleClose = () => {
    if (renewed) {
      setRenewed(false);
    } else {
      onClose();
    }
  };

  // min date
  const today = new Date();

  // 1 month before today
  const oneMonthAgo = new Date(today.setMonth(today.getMonth() - 1))
    .toISOString()
    .split("T")[0];

  const handleDeleteEntry = async () => {
    try {
      setLoading(true);
      await onDelete(record);
    } catch (error) {
      console.error("Real Error:", error);
      throw new Error("Request failed", { cause: error });
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const handleUpdateRecord = async () => {
    const updatedRecord: IUpdateInsuranceRecord = {
      id: record.id,
      policyDate: policyDate,
      expiryDate: new Date(
        new Date(policyDate).setFullYear(
          new Date(policyDate).getFullYear() + 1,
        ),
      )
        .toISOString()
        .split("T")[0],
      status: "active",
    };

    console.log(updatedRecord);

    try {
      setLoading(true);
      await onUpdate(updatedRecord);
    } catch (error) {
      console.error("Real Error:", error);
      throw new Error("Request failed", { cause: error });
    } finally {
      setLoading(false);
      setRenewed(false);
    }
  };

  // // Date Time Options
  // const options: Intl.DateTimeFormatOptions = {
  //   day: "numeric",
  //   month: "numeric",
  //   year: "numeric",
  //   timeZone: "Asia/Kolkata",
  //   hour12: true,
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   second: "2-digit",
  // };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose}>
          <IoClose />
        </button>

        <div className="head_wrapper">
          <h3>{renewed ? "Update Policy Date" : "Policy Details"}</h3>
          {!renewed && (
            <span onClick={() => setRenewed(true)}>Renewed Policy</span>
          )}
        </div>

        {renewed ? (
          <div className="renewed-form">
            <input
              type="date"
              min={oneMonthAgo}
              value={policyDate}
              onChange={(e) => setPolicyDate(e.target.value)}
            />
            <button
              type="submit"
              className="btn-submit"
              onClick={handleUpdateRecord}
            >
              {loading ? "Updating Records..." : "Update Insurance Record"}
            </button>
          </div>
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
              <span
                className={`value ${record.status === "active" ? "activeStatus" : "expiredStatus"}`}
              >
                {record.status}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Policy Date</span>
              <span className="value">
                {formatDateUTC(record.policyDate, "date")}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Expiry Date</span>
              <span className="value">
                {formatDateUTC(record.expiryDate, "date")}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Record Created On</span>
              <span className="value">{formatDateUTC(record.createdAt)}</span>
            </div>
            <div className="del_btn_txt" onClick={handleDeleteEntry}>
              {loading ? "Deleting Entry..." : "Delete Entry"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
