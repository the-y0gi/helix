'use client'
import { useIsMobile } from '@/hooks/use-mobile'
import React from 'react'

type FilterFrameProps = {
  filterClassname?: string
  filterSidebar: React.ReactNode
  content: React.ReactNode
}

const FilterFramePages = ({ content, filterClassname, filterSidebar }: FilterFrameProps) => {
  const ismobile = useIsMobile()
  return (
    <div className={filterClassname}>
      <div className='hidden xl:block'>
        {filterSidebar}
      </div>
      {content}
    </div>
  )
}

export default FilterFramePages