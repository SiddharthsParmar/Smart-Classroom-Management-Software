import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <nav style={{ width: "200px", background: "#333", color: "#fff", padding: "20px" }}>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li><Link to="/" style={{ color: "#fff", textDecoration: "none" }}>Home</Link></li>
        <li><Link to="/about" style={{ color: "#fff", textDecoration: "none" }}>About</Link></li>
        <li><Link to="/contact" style={{ color: "#fff", textDecoration: "none" }}>Contact</Link></li>
      </ul>
    </nav>
  );
};

export default Sidebar;
