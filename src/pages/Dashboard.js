import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import InviteProjectMembersDialog from '../components/dialogs/InviteProjectMembersDialog';
import ProjectsTable from '../components/tables/ProjectsTable';
import { listProjects, PROJECT_OWNER, DRAFT, getUrlForStep, deleteProject, PUBLISHED } from '../services/projects';
import { getCountryLevelLinks } from '../services/countries';
import { UserContext, ToastContext } from '../store';
import { handleError } from '../utilities/errors';

const Dashboard = () => {
  const { t } = useTranslation();
  const [myProjects, setMyProjects] = useState([]);
  const [sharedProjects, setSharedProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState({});
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const { setUser } = useContext(UserContext);
  const { setError, setSuccess } = useContext(ToastContext);
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
    if (!project.country_iso_code_3) {
      setUser({ currentProject: project, countryLevelLinks: null });
      return;
    }
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
    setCurrentProject(project).then(() => {
      if (project.status === DRAFT || project.status === PUBLISHED) {
        history.push(getUrlForStep(project.id, project.step));
      }
    });
  };

  const removeProject = async (projectId) => {
    try {
      await deleteProject(projectId);
      setMyProjects((omp) => (omp.filter((p) => p.id !== projectId)));
      setSuccess('Done!', 'Project has been deleted');
    } catch (e) {
      setError(handleError(e));
    }
  };

  return (
    <div className="layout-dashboard">
      <ProjectsTable
        projects={myProjects}
        title={t('MY_PROJECTS')}
        goToProject={goToProject}
        inviteToProject={inviteToProject}
        loadProject={loadProject}
        deleteProject={(id) => removeProject(id)}
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
