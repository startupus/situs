import React, { useState } from 'react';
import ProjectsFilters from './ProjectsFilters';
import ProjectsList from './ProjectsList';
import CreateProjectModal from './CreateProjectModal';

const ProjectsMain: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateProject = () => {
    setShowCreateModal(true);
  };

  const handleProjectCreated = () => {
    setShowCreateModal(false);
    // Здесь можно добавить обновление списка проектов
    window.location.reload();
  };

  return (
    <div className="p-6">
      <ProjectsFilters />
      
      <ProjectsList onCreateProject={handleCreateProject} />

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
