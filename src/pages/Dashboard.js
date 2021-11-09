import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { listProjects } from '../services/projects';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await listProjects();
      setProjects(data);
    };
    fetchProjects();
  }, []);

  return (
    <div className="layout-dashboard">
      <div className="p-grid">
        {projects.length && projects.map((p) => (
          <div key={p.id} className="p-col-4">
            <Card title={p.title} subTitle={p.acronym}>
              {p.description}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
