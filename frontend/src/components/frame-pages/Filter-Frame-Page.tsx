import React from 'react'

type FilterFrameProps = {
    filterClassname?:string
    filterSidebar:React.ReactNode
    content:React.ReactNode
}

const FilterFramePages = ({content,filterClassname,filterSidebar}: FilterFrameProps) => {
  return (
    <div className={filterClassname}>
        {filterSidebar}
        {content}
    </div>
  )
}

export default FilterFramePages