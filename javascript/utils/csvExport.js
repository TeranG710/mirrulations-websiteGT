// utils/csvExport.js
export const convertToCSV = (dockets) => {
    if (!dockets || dockets.length === 0) {
      return '';
    }
  
    // Define fields to include in CSV
    const headers = [
      'Docket ID', 
      'Title', 
      'Agency Name', 
      'Date Modified',
      'Matching Comments', 
      'Total Comments',
      'Docket Type'
    ];
  
    // Create CSV header row
    const csvRows = [headers.join(',')];
  
    // Add data rows
    dockets.forEach(docket => {
      const row = [
        `"${docket.id || ''}"`,
        `"${(docket.title || '').replace(/"/g, '""')}"`,
        `"${(docket.agencyName || '').replace(/"/g, '""')}"`,
        `"${docket.dateModified || ''}"`,
        docket.comments?.match || 0,
        docket.comments?.total || 0,
        `"${docket.docketType || 'Unknown'}"`
      ];
      csvRows.push(row.join(','));
    });
  
    return csvRows.join('\n');
  };
  
  export const downloadCSV = (dockets, filename = 'docket-results.csv') => {
    const csvContent = convertToCSV(dockets);
    
    // Create CSV Blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create download link
    const link = document.createElement('a');
    
    // Create object URL
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Modified ResultsSection.jsx with download button
  import React, { useEffect, useState, useRef } from "react";
  import PageSwitcher from "./pageSwitcher";
  import { downloadCSV } from "../utils/csvExport";
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
  
    const handleDownloadCSV = () => {
      downloadCSV(results.dockets, `mirrulations-results-${new Date().toISOString().slice(0, 10)}.csv`);
    };
  
    useEffect(() => {
      if (results.dockets.length > 0) {
        setIsVisible(true);
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, [results]);
  
    return (
      <div ref={resultsRef} className={`results-container mt-4 ${isVisible ? "fade-in" : ""}`}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="results-title">Search Results</h2>
          <button 
            onClick={handleDownloadCSV} 
            className="btn btn-success"
            title="Download search results as CSV"
          >
            <i className="bi bi-download me-2"></i>
            Download CSV
          </button>
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