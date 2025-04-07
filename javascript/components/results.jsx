// javascript/components/results.jsx
import PageSwitcher from "./pageSwitcher";
import ExportButton from "./ExportButton"; // Import the new component
import React, { useEffect, useState, useRef } from "react";
import "/styles/results.css";
import "bootstrap/dist/css/bootstrap.min.css";

const ResultsSection = ({ results }) => {
  const [isVisible, setIsVisible] = useState(false);
  const resultsRef = useRef(null);

  // Function to determine icon based on docket type
  const getDocketIcon = (docket) => {
    // Simply check if the docket is rulemaking or non-rulemaking
    const isRulemaking = docket.docketType === "Rulemaking";
    
    // Return hammer for rulemaking, pencil for non-rulemaking
    return isRulemaking ? "/assets/icons/hammer.png" : "/assets/icons/pencil.png";
  };

  useEffect(() => {
    if (results.dockets.length > 0) {
      setIsVisible(true);
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [results]);

  return (
    <div ref={resultsRef} className={`results-container mt-4 ${isVisible ? "fade-in" : ""}`}>
      {/* Add results header with title and export button */}
      <div className="results-header">
        <h2 className="results-title">Search Results</h2>
        <ExportButton results={results} className="export-dropdown" />
      </div>
      
      {results.dockets.map((docket, index) => (
        <div key={index} className="result-item border p-3 mb-2 rounded position-relative">
          <strong>{docket.title}</strong>
          <p><strong>Agency Name:</strong> {docket.agencyName}</p>
          <p>
            <strong>Docket ID: </strong> 
            <a href={`https://www.regulations.gov/docket/${docket.id}`} target="_blank" rel="noopener noreferrer">
              {docket.id}
            </a>
          </p>
          <p><strong>Matching Comments:</strong> {docket.comments.match}/{docket.comments.total}</p>
          
          {/* Timeline dates section - from the other branch */}
          <p>
            <strong>Date Modified:</strong> {docket.timelineDates ? new Date(docket.timelineDates.dateModified).toLocaleDateString() : new Date(docket.dateModified).toLocaleDateString()}
            <strong>&emsp;Date Created:</strong> {docket.timelineDates && docket.timelineDates.dateCreated ? new Date(docket.timelineDates.dateCreated).toLocaleDateString() : "Unknown"}
            <strong>&emsp;Date Effective:</strong> {docket.timelineDates && docket.timelineDates.dateEffective ? new Date(docket.timelineDates.dateEffective).toLocaleDateString() : "Unknown"}
            <strong>&emsp;Date Closed:</strong> {docket.timelineDates && docket.timelineDates.dateClosed ? new Date(docket.timelineDates.dateClosed).toLocaleDateString() : "Unknown"}
            <strong>&emsp;Date Comments Opened:</strong> {docket.timelineDates && docket.timelineDates.dateCommentsOpened ? new Date(docket.timelineDates.dateCommentsOpened).toLocaleDateString() : "Unknown"}
          </p>
          
          {/* Icon in bottom right corner */}
          <img 
            src={getDocketIcon(docket)} 
            alt={docket.docketType === "Rulemaking" ? "Rulemaking icon" : "Non-rulemaking icon"} 
            className="docket-icon"
            title={docket.docketType === "Rulemaking" ? "Rulemaking" : "Non-rulemaking"}
          />
        </div>
      ))}
      <PageSwitcher current_page={results.currentPage} total_pages={results.totalPages}/>
    </div>
  );
};

export default ResultsSection;
