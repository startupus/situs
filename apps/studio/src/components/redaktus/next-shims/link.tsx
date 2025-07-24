import React from 'react'

// Next.js Link component shim
interface LinkProps {
  href: string
  children: React.ReactNode
  className?: string
  [key: string]: any
}

const Link: React.FC<LinkProps> = ({ href, children, ...props }) => {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  )
}

export default Link 