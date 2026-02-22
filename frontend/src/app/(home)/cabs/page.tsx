import { cn } from '@/lib/utils'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import MainFramePage from '../../../components/frame-pages/MainFramePage'
import type { CityTrends } from '@/types'



export const  HotelPopularCites:CityTrends[]=[
 {
  name:"cabs",
  tagline:"Premium cabs services",
  tabs:[
    {name:"Primium"},
    {name:"Luxury"},
    {name:"Economy"},
    {name:"Prime Luxury"},
    {
      name:"Elite"
    }
  ]
  
 },
 {
  name:"Bangalore",
  tagline:"Available feets near you",
  tabs:[
    {name:"Ecnomy"},
    {name:"Mini"},
    {name:"Sedan"},
    {name:"Prime"},
    {
      name:"Ececutive"
    }
  ]
 },
 {
  name:"south goa",
  tagline:"Available feets near you"
 },
 {
  name:"Bangalore",
  tagline:"Available feets near you"
 },
 {
  name:"south goa",
  tagline:"Available feets near you"
 },
 {
  name:"Bangalore",
  tagline:"Available feets near you"
 },
]
const Cabs = ({className}: {className?:string}) => {
  return (
    <div className={cn(" w-full", className)}>
          <ErrorBoundary fallback={<p>error</p>}>
            <Suspense fallback={<p>loading</p>}>
              <MainFramePage 
              type="cabs"
              popularTrends={HotelPopularCites}
              
                // searchHotels={<SearchHotels/>}
                
    
                
              />
            </Suspense>
          </ErrorBoundary>
        </div>
  )
}

export default Cabs