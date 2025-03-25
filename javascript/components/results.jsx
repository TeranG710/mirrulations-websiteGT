import React from "react";
import PageSwitcher from "./pageSwitcher";

const ResultsSection = ({ results }) => {
  return (
    <section id="results_section" className="container mt-4">
      <div id="results_container" className="container">
        {results && results.length > 0 && (
          <div id="results_list">
            <ul className="list-group">
              {results.map((item, index) => (
                <li key={index} className="list-group-item">
                  <strong>{item.docketTitle}</strong>  
                  <p>ID: {item.docketID} - Matching Comments: {item.matching_comments}/{item.doc_count}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        <PageSwitcher current_page={4}/>
      </div>
    </section>
  );
};

export default ResultsSection;
