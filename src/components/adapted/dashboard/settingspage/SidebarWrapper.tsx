/**
 * SidebarWrapper - SettingsPage компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: DashboardComponents
 * Подкатегория: SettingsPage
 * 
 * @component
 * @example
 * <SidebarWrapper 
 *   children="value"
 * />
 */

import React from 'react';
import StateContext from './StateContext'

interface SidebarWrapperProps {
  children: string;
}

const SidebarWrapper: React.FC<SidebarWrapperProps> = ({ children }) => {
  return (
    <StateContext.Consumer>
      {({ sidebarOpen, setSidebarOpen, sidebar }) => (
        <div
          ref={sidebar}
          className={`fixed left-0 top-0 z-90 flex h-screen w-full max-w-[300px] flex-col justify-between bg-white shadow-card duration-200 xl:translate-x-0 ${
            sidebarOpen ? '-translate-x-full' : 'translate-x-0'
          }`}
        >
          {children}
        </div>
      )}
    </StateContext.Consumer>
  )
}

export default SidebarWrapper;
