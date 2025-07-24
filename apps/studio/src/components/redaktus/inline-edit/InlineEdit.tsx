import React from 'react'

interface InlineEditProps {
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
}

const InlineEdit: React.FC<InlineEditProps> = ({ 
  value, 
  onChange, 
  type = 'text',
  placeholder 
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="inline-edit-input"
    />
  )
}

export default InlineEdit 