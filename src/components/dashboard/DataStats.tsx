import React from 'react'
import { cn } from '../../lib/utils'

export interface DataStatsCardProps {
  title: string
  subtitle?: string
  value: string | number
  change?: {
    value: string
    type: 'increase' | 'decrease'
  }
  percent?: number
  icon?: React.ReactNode
  color?: string
  className?: string
}

export interface DataStatsProps {
  cards: DataStatsCardProps[]
  className?: string
}

const DataStatsCard: React.FC<DataStatsCardProps> = ({
  title,
  subtitle,
  value,
  change,
  percent,
  icon,
  color = '#13C296',
  className,
}) => {
  return (
    <div className={cn('w-full px-4 sm:w-1/2 lg:w-1/4 xl:w-1/4', className)}>
      <div className="wow fadeInUp mb-8" data-wow-delay=".1s">
        <div className="flex items-center">
          <div
            className="mr-4 flex h-[60px] w-[60px] items-center justify-center rounded-md bg-opacity-10"
            style={{ backgroundColor: `${color}20` }}
          >
            {icon}
          </div>
          <div className="w-full">
            <h4 className="mb-1 text-2xl font-bold text-dark dark:text-white">
              {value}
            </h4>
            <p className="text-base text-body-color dark:text-dark-6">{title}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {change && (
              <span
                className={cn(
                  'mr-2 flex items-center text-sm font-medium',
                  change.type === 'increase' ? 'text-success' : 'text-danger'
                )}
              >
                {change.type === 'increase' ? '↗' : '↘'} {change.value}
              </span>
            )}
            {subtitle && (
              <span className="text-sm text-body-color dark:text-dark-6">
                {subtitle}
              </span>
            )}
          </div>
          {percent && (
            <div className="flex items-center">
              <span className="mr-2 text-sm font-medium text-dark dark:text-white">
                {percent}%
              </span>
              <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-dark-3">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const DataStats: React.FC<DataStatsProps> = ({ cards, className }) => {
  return (
    <section className={cn('bg-gray-2 pb-12 pt-20 dark:bg-dark lg:pb-[90px] lg:pt-[120px]', className)}>
      <div className="mx-auto px-4 md:container">
        <div className="-mx-4 flex flex-wrap">
          {cards.map((card, index) => (
            <DataStatsCard key={index} {...card} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default DataStats 