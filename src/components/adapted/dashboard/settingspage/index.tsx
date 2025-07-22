/**
 * index - SettingsPage компонент
 * 
 * Адаптировано из TailGrids Pro для редактора Редактус
 * Категория: DashboardComponents
 * Подкатегория: SettingsPage
 * 
 * @component
 * @example
 * <index 
 *   children="value"
 * />
 */

import React from 'react';
import StateContext from './StateContext'

interface indexProps {
  children: string;
}

const SettingsPage = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const trigger = useRef(null)
  const sidebar = useRef(null)

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return
      setSidebarOpen(false)
    }
    document.addEventListener('click', clickHandler)
    return (
    <div className="redaktus-component" data-component-type="index">) => document.removeEventListener('click', clickHandler)
  })

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return
      setSidebarOpen(false)
    }
    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  })

  return (
    <StateContext.Provider
      value={{ sidebarOpen, setSidebarOpen, trigger, sidebar }}
    >
      <div>
        {children}
      </div>
    </StateContext.Provider>
  )
}

export default SettingsPage
