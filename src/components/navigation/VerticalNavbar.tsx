import React, { useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/utils'

export interface NavItem {
  id: string
  label: string
  href?: string
  icon?: React.ReactNode
  submenu?: NavItem[]
  onClick?: () => void
}

export interface UserProfile {
  name: string
  email: string
  avatar?: string
}

export interface VerticalNavbarProps {
  logo?: {
    src: string
    alt: string
  }
  items: NavItem[]
  userProfile?: UserProfile
  className?: string
  onItemClick?: (item: NavItem) => void
}

const VerticalNavbar: React.FC<VerticalNavbarProps> = ({
  logo,
  items,
  userProfile,
  className,
  onItemClick,
}) => {
  return (
    <section className={cn('h-screen bg-gray-2', className)}>
      <div className="flex h-screen w-full max-w-[300px] flex-col justify-between overflow-y-scroll bg-white shadow-card">
        <div>
          {logo && (
            <div className="px-10 pt-10 pb-9">
              <a href="/">
                <img src={logo.src} alt={logo.alt} />
              </a>
            </div>
          )}

          <nav>
            <ul>
              {items.map((item, index) => (
                <NavItemComponent
                  key={item.id}
                  item={item}
                  onClick={() => onItemClick?.(item)}
                />
              ))}
            </ul>
          </nav>
        </div>
        
        {userProfile && (
          <div className="p-10">
            <div className="flex items-center">
              {userProfile.avatar && (
                <div className="mr-4 h-[50px] w-full max-w-[50px] rounded-full">
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.name}
                    className="h-full w-full rounded-full object-cover object-center"
                  />
                </div>
              )}
              <div>
                <h6 className="text-base font-medium text-body-color">
                  {userProfile.name}
                </h6>
                <p className="text-sm text-body-color">{userProfile.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

const NavItemComponent: React.FC<{ item: NavItem; onClick?: () => void }> = ({
  item,
  onClick,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const trigger = useRef<HTMLAnchorElement>(null)
  const dropdown = useRef<HTMLUListElement>(null)

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return
      if (
        !dropdownOpen ||
        dropdown.current.contains(target as Node) ||
        trigger.current?.contains(target as Node)
      )
        return
      setDropdownOpen(false)
    }
    document.addEventListener('click', clickHandler)
    return () => document.removeEventListener('click', clickHandler)
  }, [dropdownOpen])

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return
      setDropdownOpen(false)
    }
    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  }, [dropdownOpen])

  const handleClick = (e: React.MouseEvent) => {
    if (item.submenu) {
      e.preventDefault()
      setDropdownOpen(!dropdownOpen)
    } else {
      onClick?.()
    }
  }

  return (
    <li className="relative">
      <a
        href={item.href || '#'}
        ref={trigger}
        onClick={handleClick}
        className={cn(
          'flex items-center px-10 py-3 text-base font-medium text-body-color transition-all duration-300 hover:bg-primary hover:text-white',
          dropdownOpen && 'bg-primary text-white'
        )}
      >
        {item.icon && <span className="mr-3">{item.icon}</span>}
        {item.label}
        {item.submenu && (
          <span className="ml-auto">
            <svg
              className={cn(
                'h-4 w-4 transition-transform duration-200',
                dropdownOpen && 'rotate-180'
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
        )}
      </a>
      
      {item.submenu && dropdownOpen && (
        <ul
          ref={dropdown}
          className="absolute left-0 top-full z-40 w-full bg-white shadow-lg"
        >
          {item.submenu.map((subItem) => (
            <DropdownItem key={subItem.id} item={subItem} />
          ))}
        </ul>
      )}
    </li>
  )
}

const DropdownItem: React.FC<{ item: NavItem }> = ({ item }) => {
  return (
    <li>
      <a
        href={item.href || '#'}
        className="block px-10 py-2 text-sm text-body-color transition-all duration-300 hover:bg-primary hover:text-white"
        onClick={item.onClick}
      >
        {item.icon && <span className="mr-3">{item.icon}</span>}
        {item.label}
      </a>
    </li>
  )
}

export default VerticalNavbar 