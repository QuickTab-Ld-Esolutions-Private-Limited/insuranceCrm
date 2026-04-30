import React, { useState } from "react";

/** styles */
import "./Sidebar.scss";

/** icons */
import {
  FaShieldAlt,
  FaFileAlt,
  FaTable,
  FaBars,
  FaTimes,
} from "react-icons/fa";

/** interfaces */
interface SidebarProps {
  activeTab: "form" | "table";
  setActiveTab: (tab: "form" | "table") => void;
}

interface SidebarProps {
  activeTab: "form" | "table";
  setActiveTab: (tab: "form" | "table") => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Helper to change tab and automatically close the sidebar on mobile
  const handleTabClick = (tab: "form" | "table") => {
    setActiveTab(tab);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button className="mobile-toggle" onClick={toggleSidebar}>
        {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
      </button>

      {/* Dark overlay background for mobile when sidebar is open */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>
      )}

      {/* Sidebar Container */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="logo">
          <FaShieldAlt size={28} className="icon-blue" />
          <span>Insurance Entry</span>
        </div>

        <nav className="nav-items">
          <button
            className={activeTab === "form" ? "active" : ""}
            onClick={() => handleTabClick("form")}
          >
            <FaFileAlt size={20} />
            <span>New Policy Entries</span>
          </button>

          <button
            className={activeTab === "table" ? "active" : ""}
            onClick={() => handleTabClick("table")}
          >
            <FaTable size={20} />
            <span>Records</span>
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
