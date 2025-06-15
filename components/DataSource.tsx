import React from 'react';

export const DataSource: React.FC = () => {
  return (
    <div className="data-source">
      Data source:{" "}
      <a
        href="https://data.police.uk"
        target="_blank"
        rel="noopener noreferrer"
      >
        UK Police Data
      </a>{" "}
      (Met/City of London only)
    </div>
  );
};