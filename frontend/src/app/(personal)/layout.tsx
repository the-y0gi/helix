import PersonalNavWroper from '@/components/navbar/personal.nav.wraper'
import React from 'react'

type Props = {}

const layout = ({children}:{children: React.ReactNode}) => {
  return (
    <PersonalNavWroper>{children}</PersonalNavWroper>
  )
}

export default layout