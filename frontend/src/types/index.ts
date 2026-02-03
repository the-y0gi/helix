export interface Tabs{
name:string
    title?: string;
      value?: string;
      content?: string | React.ReactNode | any;
}
export interface CityTrends{
  name:string
  tagline:string
  
  tabs?:Tabs[]
}