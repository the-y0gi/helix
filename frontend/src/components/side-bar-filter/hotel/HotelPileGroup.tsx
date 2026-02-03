import { parseAsInteger, useQueryState } from 'nuqs'
import CheckboxGroup from '../checkBoxGroup'
import Counter from '../counter'
import PillGroup, { type PillOption } from '../pillGroup'
import PriceRange from '../priceRange'
import Ranges from '../center-distance'


export const HotelPileGroup = ({values}:{values:PillOption[]}) => {
  return (
    <PillGroup options={values} queryKey='places' />
  )
}

export const HotelPriceRange=()=>{
    return (
        <PriceRange />
    )
}
export const HotelCounters=({values}:{values:string[]})=>{
    return (
        <div className="flex flex-col  gap-2">
          {
            values.map((opt)=>(
              <Counter key={opt} label={opt} />

            ))
          }
          
        </div>
    )
}

export const HotelCheckBoxGroupOfRoomSize=({values, stars}:{values:{value:number,label:string}[], stars?:boolean})=>{
  const [count, setCount] = useQueryState('size', parseAsInteger)
    return (
        <CheckboxGroup
        queryKey='roomSize'
                stars={stars}
                  options={values || []}
                />
    )
}
export const HotelCheckBoxGroupOfScore=({values, stars}:{values:{value:number,label:string}[], stars?:boolean})=>{
    return (
        <CheckboxGroup
        queryKey='score'
                stars={stars}
                  options={values || []}
                />
    )
}
export const HotelCheckBoxGroupOfClassification=({values, stars}:{values:{value:number,label:string}[], stars?:boolean})=>{
    return (
        <CheckboxGroup
        queryKey='classification'
                stars={stars}
                  options={values || []}
                />
    )
}
export const HotelDistanceFromCenter=()=>{
    return (
        <Ranges queryKey='distance' />
    )
}
export const HotelPileGroupOfAmenities = ({values}:{values:PillOption[]}) => {
  return (
    <PillGroup options={values} queryKey='amenities' />
  )
}
export const HotelPileGroupOfEssentials = ({values}:{values:PillOption[]}) => {
  return (
    <PillGroup options={values} queryKey='essentials' />
  )
}
export const HotelPileGroupOfOnsite = ({values}:{values:PillOption[]}) => {
  return (
    <PillGroup options={values} queryKey='onsite' />
  )
}
export const HotelPileGroupOfFeatures = ({values}:{values:PillOption[]}) => {
  return (
    <PillGroup options={values} queryKey='features' />
  )
}
export const HotelPileGroupOfLocation = ({values}:{values:PillOption[]}) => {
  return (
    <PillGroup options={values} queryKey='location' />
  )
}