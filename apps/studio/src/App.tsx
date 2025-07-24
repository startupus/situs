import React from 'react';
import './App.css';
import './i18n';
import { SiteProvider } from './contexts/SiteContext';
import { StudioInterface } from './components/StudioInterface';

function App() {
  return (
    <SiteProvider>
      <div className="App">
        <StudioInterface />
      </div>
    </SiteProvider>
  );
}

export default App; 