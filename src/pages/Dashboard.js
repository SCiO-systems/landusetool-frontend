import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import InviteProjectMembersDialog from '../components/dialogs/InviteProjectMembersDialog';
import { listProjects, PROJECT_OWNER } from '../services/projects';

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

  const inviteToProject = (id) => {
    setSelectedProject(projects.filter((p) => p?.id === id)?.pop());
    setInviteDialogOpen(true);
  };

  return (
    <div className="layout-dashboard">
      <div className="p-grid">
        {projects.map(({ id, title, acronym, description, role }) => (
          <div key={id} className="p-col-4">
            <Card
              title={title}
              subTitle={acronym}
              footer={() => (
                <>
                  <Button
                    onClick={() => goToProject(id)}
                    label="Edit"
                    icon="pi pi-cog"
                    className="p-mr-2"
                  />
                  {role === PROJECT_OWNER && (
                    <Button
                      onClick={() => inviteToProject(id)}
                      label="Invite Members"
                      icon="pi pi-user-plus"
                      className="p-mr-2 p-button-secondary"
                    />
                  )}
                </>
              )}
            >
              {description || <div>&nbsp;</div>}
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
