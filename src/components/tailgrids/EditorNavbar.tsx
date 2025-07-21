import React, { useState } from "react";
import {
  FaCube,
  FaExternalLinkAlt,
  FaChevronDown,
  FaUser,
  FaCalendarDay
} from 'react-icons/fa'

interface EditorNavbarProps {
  currentPage?: string;
  onSave?: () => void;
  autosaveEnabled?: boolean;
}

const EditorNavbar: React.FC<EditorNavbarProps> = ({
  currentPage = "Home",
  onSave,
  autosaveEnabled = true
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'media' | 'playground'>('editor');

  console.log('🎯 EditorNavbar rendering - should be visible at top');

  return (
    <header className="flex w-full items-center bg-white border-b border-gray-200 h-14 shadow-sm z-50 relative">
      <div className="w-full px-6">
        <div className="flex items-center justify-between h-full">
          {/* Left Section - Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <FaCube className="text-blue-600 text-xl" />
              <span className="text-lg font-bold text-gray-900 tracking-wide">REDAKTUS</span>
            </div>
          </div>

          {/* Center Section - Navigation Tabs */}
          <div className="flex items-center space-x-8">
            <NavTab 
              active={activeTab === 'editor'} 
              onClick={() => setActiveTab('editor')}
            >
              EDITOR
            </NavTab>
            <NavTab 
              active={activeTab === 'media'} 
              onClick={() => setActiveTab('media')}
            >
              MEDIA
            </NavTab>
            <NavTab 
              active={activeTab === 'playground'} 
              onClick={() => setActiveTab('playground')}
            >
              PLAYGROUND
            </NavTab>
          </div>

          {/* Right Section - Controls & User */}
          <div className="flex items-center space-x-4">
            {/* View Site Button */}
            <button className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none transition-colors">
              <FaExternalLinkAlt size={12} />
              <span>VIEW SITE</span>
            </button>

            {/* Calendar/Date */}
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors">
              <FaCalendarDay size={16} />
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">RU</span>
                </div>
                <FaChevronDown size={12} />
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <DropdownItem icon={<FaUser size={14} />}>Profile</DropdownItem>
                  <div className="border-t border-gray-100 my-2"></div>
                  <DropdownItem>Sign out</DropdownItem>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Компонент для навигационного таба - простой текст без кнопок
const NavTab: React.FC<{ 
  children: React.ReactNode; 
  active?: boolean;
  onClick?: () => void;
}> = ({ children, active = false, onClick }) => {
  return (
    <span
      onClick={onClick}
      className={`text-sm cursor-pointer transition-colors ${
        active
          ? 'text-gray-900 font-bold'
          : 'text-gray-500 hover:text-gray-700 font-normal'
      }`}
    >
      {children}
    </span>
  );
};

// Компонент для элемента выпадающего меню
const DropdownItem: React.FC<{
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
}> = ({ children, icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
    >
      {icon && <span className="text-gray-400">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export default EditorNavbar; 