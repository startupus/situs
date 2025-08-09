import React, { useEffect, useState } from 'react';
import ProjectsFilters from './ProjectsFilters';
import ProjectsList from './ProjectsList';
import CreateProjectModal from './CreateProjectModal';

const ProjectsMain: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);

  const handleCreateProject = () => {
    setShowCreateModal(true);
  };

  const handleProjectCreated = () => {
    setShowCreateModal(false);
    setRefreshTick((x) => x + 1);
  };

  // Поддержка глобальной кнопки "+" в хедере
  useEffect(() => {
    const onCreate = () => setShowCreateModal(true);
    window.addEventListener('situs:create-project', onCreate as EventListener);
    return () => window.removeEventListener('situs:create-project', onCreate as EventListener);
  }, []);

  return (
    <div>
      <ProjectsFilters />
      
      <ProjectsList onCreateProject={handleCreateProject} refreshKey={refreshTick} />

      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleProjectCreated}
        />
      )}
    </div>
  );
};

export default ProjectsMain;
