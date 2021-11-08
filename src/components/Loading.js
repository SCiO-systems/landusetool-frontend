import React from 'react';

const Loading = () => (
  <div className="layout-dashboard">
    <div className="p-grid p-jc-center p-ai-center">
      <div className="p-text-center">
        <h4>Loading</h4>
        <i className="pi pi-spin pi-spinner" style={{ fontSize: '2em' }} />
      </div>
    </div>
  </div>
);

export default Loading;
