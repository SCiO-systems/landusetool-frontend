import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import InviteProjectMembersDialog from '../components/dialogs/InviteProjectMembersDialog';
import ProjectsTable from '../components/tables/ProjectsTable';
import { listProjects, PROJECT_OWNER } from '../services/projects';
import { getCountryLevelLinks } from '../services/countries';
import { UserContext } from '../store';

const Dashboard = () => {
  const { t } = useTranslation();
  const [myProjects, setMyProjects] = useState([]);
  const [sharedProjects, setSharedProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState({});
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const { setUser } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await listProjects();
      setMyProjects(data.filter((p) => p.role === PROJECT_OWNER));
      setSharedProjects(data.filter((p) => p.role !== PROJECT_OWNER));
      setUser({ availableProjects: data });
    };
    fetchProjects();
  }, []); // eslint-disable-line

  const goToProject = (id) => {
    history.push(`/projects/${id}`);
  };

  const inviteToProject = (id) => {
    setSelectedProject(myProjects.filter((p) => p?.id === id)?.pop());
    setInviteDialogOpen(true);
  };

  const setCurrentProject = async (project) => {
    try {
      const countryLevelLinksResponse = await getCountryLevelLinks(
        project.country_iso_code_3
      );
      setUser({ currentProject: project, countryLevelLinks: countryLevelLinksResponse });
    } catch (_e) {
      setUser({ currentProject: project, countryLevelLinks: null });
      // eslint-disable-next-line
      console.error(`Couldn't fetch country level links.`);
    }
  };

  const loadProject = (project) => {
    setSelectedProject(project);
    setCurrentProject(project);
  };

  return (
    <div className="layout-dashboard">
      <ProjectsTable
        projects={myProjects}
        title={t('MY_PROJECTS')}
        goToProject={goToProject}
        inviteToProject={inviteToProject}
        loadProject={loadProject}
        className="p-mb-4"
      />
      <ProjectsTable
        projects={sharedProjects}
        title={t('SHARED_PROJECTS')}
        goToProject={goToProject}
        inviteToProject={inviteToProject}
        loadProject={loadProject}
      />
      <InviteProjectMembersDialog
        project={selectedProject}
        dialogOpen={inviteDialogOpen}
        setDialogOpen={setInviteDialogOpen}
      />
    </div>
  );
};

export default Dashboard;
