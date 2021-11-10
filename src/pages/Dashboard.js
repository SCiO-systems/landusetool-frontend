import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { listProjects } from '../services/projects';
import InviteProjectMembersDialog from '../components/dialogs/InviteProjectMembersDialog';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState({});
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await listProjects();
      setProjects(data);
    };
    fetchProjects();
  }, []);

  const goToProject = (id) => {
    history.push(`/projects/${id}`);
  };

  const inviteToProject = (project) => {
    setSelectedProject(project);
    setInviteDialogOpen(true);
  };

  return (
    <div className="layout-dashboard">
      <div className="p-grid">
        {projects.length > 0 && projects.map((p) => (
          <div key={p.id} className="p-col-4">
            <Card
              title={p.title}
              subTitle={p.acronym}
              footer={(
                <>
                  <Button
                    onClick={() => goToProject(p.id)}
                    label="Edit"
                    icon="pi pi-cog"
                    style={{ marginRight: '.25em' }}
                  />
                  <Button
                    onClick={() => inviteToProject(p)}
                    label="Invite Members"
                    icon="pi pi-user-plus"
                    className="p-button-secondary"
                  />
                </>
              )}
            >
              {p.description}
            </Card>
          </div>
        ))}
      </div>
      <InviteProjectMembersDialog
        project={selectedProject}
        dialogOpen={inviteDialogOpen}
        setDialogOpen={setInviteDialogOpen}
      />
    </div>
  );
};

export default Dashboard;
