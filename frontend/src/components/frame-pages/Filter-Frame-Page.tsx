'use client'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { CommonPagesStyles } from '@/styles/commonpages-styles'
import React from 'react'

type FilterFrameProps = {
  filterClassname?: string
  filterSidebar: React.ReactNode
  content: React.ReactNode
}

const FilterFramePages = ({ content, filterClassname, filterSidebar }: FilterFrameProps) => {
  const ismobile = useIsMobile()
  return (
    <div className={cn(CommonPagesStyles, " md:flex-col  flex gap-4 w-full bg-background py-4 ")}>

      <div className={filterClassname}>
        <div className='hidden xl:block'>
          {filterSidebar}
        </div>
        {content}
      </div>
    </div>
  )
}

export default FilterFramePages