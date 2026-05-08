import { useState, useMemo, useEffect, useRef } from "react";
import { toast } from "react-toastify";

/** components */
import Modal from "./Modal";

/** styles */
import "./InsuranceTable.scss";

/** icons */
import { FaSearch } from "react-icons/fa";

/** utils */
import { formatDate } from "../utils/common";

/** interfaces */
import type {
  IInsuranceRecord,
  IUpdateInsuranceRecord,
} from "../interface/crmInterface";
import useAuth from "../hook/useAuth";

const InsuranceTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState<IInsuranceRecord | null>(
    null,
  );
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });

  const [formLoading, setFormLoading] = useState(false);
  const [responseData, setResponseData] = useState<IInsuranceRecord[]>([]);

  const { logoutUser, accessToken, refreshAccessToken } = useAuth();

  const handleFetchData = async () => {
    try {
      setFormLoading(true);
      const response = await fetch(
        "https://insurancecrm.quicktabhub.com/api/insurance/form-data",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const data = await response.json();

      // console.log("Response Data:", data);

      if (!data.success && data.status === 401) {
        const newTokenGenerated = await refreshAccessToken(
          "https://insurancecrm.quicktabhub.com/api/insurance/form-data",
          {
            method: "GET",
          },
        );

        if (!newTokenGenerated) {
          // logoutUser();
          return null;
        }

        setResponseData(newTokenGenerated?.data);
        setFormLoading(false);
        return null;
      }

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      setResponseData(data?.data);

      setFormLoading(false);

      return data;
    } catch (error) {
      console.error("Real Error:", error);
      toast.error("Something went wrong, please try again");
      throw new Error("Request failed", { cause: error });
    }
  };

  const handleDeleteEntry = async (record: IInsuranceRecord) => {
    try {
      const response = await fetch(
        "https://insurancecrm.quicktabhub.com/delete/insurance-form",
        {
          method: "DELETE",
          body: JSON.stringify({
            id: record.id,
            customerName: record.customerName,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const data = await response.json();

      if (!data.success && data.status === 401) {
        const newTokenGenerated = await refreshAccessToken(
          "https://insurancecrm.quicktabhub.com/delete/insurance-form",
          {
            method: "DELETE",
            body: JSON.stringify({
              id: record.id,
              customerName: record.customerName,
            }),
          },
        );

        if (!newTokenGenerated) {
          logoutUser();
          return null;
        }

        // Update data
        handleFetchData();

        return newTokenGenerated;
      }

      console.log("Response Data:", data);

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);

      // Update data
      handleFetchData();

      return data;
    } catch (error) {
      console.error("Real Error:", error);
      toast.error("Something went wrong, please try again");
      throw new Error("Request failed", { cause: error });
    }
  };

  const handleUpdateRecord = async (updatedRecord: IUpdateInsuranceRecord) => {
    try {
      const response = await fetch(
        "https://insurancecrm.quicktabhub.com/update/insurance-form",
        {
          method: "PATCH",
          body: JSON.stringify(updatedRecord),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const data = await response.json();

      if (!data.success && data.status === 401) {
        const newTokenGenerated = await refreshAccessToken(
          "https://insurancecrm.quicktabhub.com/update/insurance-form",
          {
            method: "PATCH",
            body: JSON.stringify(updatedRecord),
          },
        );

        if (!newTokenGenerated) {
          logoutUser();
          return null;
        }

        // update modal data
        setSelectedRecord((prev) =>
          prev ? { ...prev, ...updatedRecord } : prev,
        );

        // Update data
        handleFetchData();

        return newTokenGenerated;
      }

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      console.log("Response Data:", data);

      // update modal data
      setSelectedRecord((prev) =>
        prev ? { ...prev, ...updatedRecord } : prev,
      );

      toast.success(data.message);

      handleFetchData();

      return data;
    } catch (error) {
      console.error("Real Error:", error);
      toast.error("Something went wrong, please try again");
      throw new Error("Request failed", { cause: error });
    }
  };

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;

    hasFetched.current = true;

    handleFetchData();
  }, []);

  const itemsPerPage = 6;

  // Filter logic
  const filteredRecords = useMemo(() => {
    return responseData.filter((record) => {
      // 🔍 Search
      const matchesSearch =
        !searchTerm ||
        record.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.policyNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.regNo?.toLowerCase().includes(searchTerm.toLowerCase());

      // 📊 Status
      const matchesStatus =
        !statusFilter ||
        record.status.toLocaleLowerCase() === statusFilter.toLocaleLowerCase();

      // console.log(dateFilter);

      // 📅 Date
      let matchesDate = true;

      const normalizeDate = (d: string) => {
        const date = new Date(d);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      };

      const recordDate = normalizeDate(record.policyDate); // or parseDate()

      if (dateFilter.startDate) {
        matchesDate =
          matchesDate && recordDate >= normalizeDate(dateFilter.startDate);
      }

      if (dateFilter.endDate) {
        matchesDate =
          matchesDate && recordDate <= normalizeDate(dateFilter.endDate);
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [
    responseData,
    searchTerm,
    statusFilter,
    dateFilter.startDate,
    dateFilter.endDate,
  ]);

  // console.log(filteredRecords);

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
          <FaSearch size={18} />
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
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
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
            value={dateFilter.startDate}
            onChange={(e) => {
              setDateFilter({
                ...dateFilter,
                startDate: e.target.value,
              });
              setCurrentPage(1);
            }}
          />
          <span>to</span>
          <input
            type="date"
            value={dateFilter.endDate}
            onChange={(e) => {
              setDateFilter({ ...dateFilter, endDate: e.target.value });
              setCurrentPage(1);
            }}
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
            {formLoading && (
              <tr>
                <td
                  colSpan={5}
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  Fetching data from database ...
                </td>
              </tr>
            )}
            {paginatedRecords.length > 0
              ? paginatedRecords.map((record) => (
                  // console.log(record.createdAt),
                  <tr key={record.id} onClick={() => setSelectedRecord(record)}>
                    <td>{record.customerName}</td>
                    <td>{record.policyNo}</td>
                    <td>{record.regNo}</td>
                    <td>{record.mobileNo}</td>
                    <td>{formatDate(record.policyDate)}</td>
                    <td>{formatDate(record.expiryDate)}</td>
                    <td>
                      <span
                        className={
                          record.status === "active"
                            ? "activeStatus"
                            : "expiredStatus"
                        }
                      >
                        {record.status}
                      </span>
                    </td>
                    <td>
                      {formatDate(
                        new Date(record.createdAt).toLocaleDateString(),
                      )}
                    </td>
                  </tr>
                ))
              : !formLoading && (
                  <tr>
                    <td
                      colSpan={8}
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
          onDelete={handleDeleteEntry}
          onUpdate={handleUpdateRecord}
        />
      )}
    </div>
  );
};

export default InsuranceTable;
