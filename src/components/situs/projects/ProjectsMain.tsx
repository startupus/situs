import React, { useState } from 'react';
import ProjectsFilters from './ProjectsFilters';
import ProjectsList from './ProjectsList';
import CreateProjectModal from './CreateProjectModal';

const ProjectsMain: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
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
      <ProjectsFilters
        selectedType={selectedType}
        searchTerm={searchTerm}
        onTypeChange={setSelectedType}
        onSearchChange={setSearchTerm}
        onCreateProject={handleCreateProject}
      />
      
      <ProjectsList
        selectedType={selectedType}
        searchTerm={searchTerm}
      />

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
