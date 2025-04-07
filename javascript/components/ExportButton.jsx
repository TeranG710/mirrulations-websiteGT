// javascript/components/ExportButton.jsx
import React, { useState } from 'react';

const ExportButton = ({ results, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Convert docket data to CSV format
  const convertToCSV = (dockets) => {
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

  // Download data as CSV file
  const downloadCSV = () => {
    setIsExporting(true);
    
    try {
      const csvContent = convertToCSV(results.dockets);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.setAttribute('href', url);
      link.setAttribute('download', `mirrulations-results-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsOpen(false);
    } catch (err) {
      console.error('Error exporting CSV:', err);
      alert('There was an error exporting your data.');
    } finally {
      setIsExporting(false);
    }
  };

  // Download data as JSON file
  const downloadJSON = () => {
    setIsExporting(true);
    
    try {
      // Create a formatted JSON with just the essential data
      const jsonData = {
        exportDate: new Date().toISOString(),
        totalResults: results.dockets.length,
        dockets: results.dockets.map(docket => ({
          id: docket.id,
          title: docket.title,
          agencyName: docket.agencyName,
          dateModified: docket.dateModified,
          commentStats: {
            matching: docket.comments?.match || 0,
            total: docket.comments?.total || 0
          },
          docketType: docket.docketType || 'Unknown'
        }))
      };
      
      const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.setAttribute('href', url);
      link.setAttribute('download', `mirrulations-results-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsOpen(false);
    } catch (err) {
      console.error('Error exporting JSON:', err);
      alert('There was an error exporting your data.');
    } finally {
      setIsExporting(false);
    }
  };

  // Render dropdown with export options
  return (
    <div className={`dropdown ${className || ''}`}>
      <button 
        className="btn btn-success dropdown-toggle" 
        type="button" 
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting || !results?.dockets?.length}
      >
        {isExporting ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Exporting...
          </>
        ) : (
          <>
            <i className="bi bi-download me-2"></i>
            Export Results
          </>
        )}
      </button>
      
      {isOpen && (
        <div className="dropdown-menu show">
          <button className="dropdown-item" onClick={downloadCSV}>
            <i className="bi bi-filetype-csv me-2"></i>
            Download as CSV
          </button>
          <button className="dropdown-item" onClick={downloadJSON}>
            <i className="bi bi-filetype-json me-2"></i>
            Download as JSON
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportButton;