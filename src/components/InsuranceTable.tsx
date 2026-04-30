import { useState, useMemo } from "react";

/** components */
import Modal from "./Modal";

/** styles */
import "./InsuranceTable.scss";

/** interfaces */
import type { IInsuranceRecord } from "../interface/crmInterface";

interface InsuranceTableProps {
  records: IInsuranceRecord[];
}

const InsuranceTable: React.FC<InsuranceTableProps> = ({ records }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState<IInsuranceRecord | null>(
    null,
  );
  const itemsPerPage = 6;

  // Filter logic
  const filteredRecords = useMemo(() => {
    return records.filter(
      (record) =>
        record.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.policyNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.regNo.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [records, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, currentPage]);

  return (
    <div className="card">
      <div className="table-controls">
        {/* Search */}
        <div className="search-box">
          {/* <Search size={18} /> */}
          <input
            type="text"
            placeholder="Search by name, policy, or reg no..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to page 1 on search
            }}
          />
        </div>

        {/* Status Filter */}
        <div className="filter-box">
          <select
          // value={statusFilter}
          // onChange={(e) => {
          //   setStatusFilter(e.target.value);
          //   setCurrentPage(1);
          // }}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div className="date-filter">
          <input
            type="date"
            // value={startDate}
            // onChange={(e) => {
            //   setStartDate(e.target.value);
            //   setCurrentPage(1);
            // }}
          />
          <span>to</span>
          <input
            type="date"
            // value={endDate}
            // onChange={(e) => {
            //   setEndDate(e.target.value);
            //   setCurrentPage(1);
            // }}
          />
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Policy No.</th>
              <th>Reg No.</th>
              <th>Mobile</th>
              <th>Policy Date</th>
              <th>Expiry Date</th>
              <th>Status</th>
              <th>Date Added</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map((record) => (
                <tr key={record.id} onClick={() => setSelectedRecord(record)}>
                  <td>{record.customerName}</td>
                  <td>{record.policyNo}</td>
                  <td>{record.regNo}</td>
                  <td>{record.mobileNo}</td>
                  <td>
                    {record.policyDate.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })}
                  </td>
                  <td>
                    {record.expiryDate.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })}
                  </td>
                  <td>{record.status}</td>
                  <td>
                    {record.createdAt.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}

      {selectedRecord && (
        <Modal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </div>
  );
};

export default InsuranceTable;
