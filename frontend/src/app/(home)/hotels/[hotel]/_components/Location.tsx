import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React from 'react'

type Props = {}
const MapLocation = ({map}:{map:string}) => {
  return (
    <Card className='md:w-1/2 flx flex-col gap-10 bg-transparent border-none shadow-none'>
        <CardHeader>
            <h3 className='text-xl font-bold'>Location</h3>
        </CardHeader>
        <CardContent>
            <div className='overflow-hidden rounded-2xl'>
                <img src={map} alt="map image" />
            </div>
        </CardContent>
    </Card>
  )
}

export default MapLocation