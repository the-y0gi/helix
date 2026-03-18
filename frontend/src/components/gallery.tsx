import { cn } from '@/lib/utils'

type GalleryImage = {
  src: string
  alt: string
}

type GallerySection = {
  type?: string
  images: GalleryImage[]
}

const Gallery = ({ sections }: { sections: GallerySection[] }) => {
  return (
        <DrawerDemo
        sections={sections}
        content={
             <div className='grid md:gap-3 gap-0.5 grid-cols-2 rounded-lg overflow-hidden xl:h-[430px]'>
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className={cn({ 'grid grid-cols-2 gap-0.5 md:gap-3': section.type === 'grid' })}>
              {section.images.map((image, imageIndex) => (
                <img key={imageIndex} src={image.src} alt={image.alt} className=' object-contain' />
              ))}
            </div>
          ))}
        </div>
        }
        />

       
  )
}

export default Gallery





import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Minus, Plus } from "lucide-react"



export function DrawerDemo({content, sections}:{content:React.ReactNode , sections:GallerySection[]}) {
  const [goal, setGoal] = React.useState(350)

  function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)))
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {content}
      </DrawerTrigger>
      <DrawerContent className='data-[vaul-drawer-direction=bottom]:max-h-[92vh] rounded-4xl'>
        <DrawerHeader>
      <DrawerTitle>Hotel Gallery</DrawerTitle>           {/* ← Add this */}
      {/* Optional: */}
      <DrawerDescription>View all photos of the property</DrawerDescription>
    </DrawerHeader>
        <div className="mx-auto w-full  overflow-y-scroll flex flex-col gap-3 p-2">
         
          <InnerGallery sections={sections}/>
          <InnerGallery sections={sections}/>
          
         
        </div>
        <div className='h-30 w-full'></div>
      </DrawerContent>
    </Drawer>
  )
}




const InnerGallery = ({ sections }: { sections: GallerySection[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full">
      {sections.map((section, sectionIndex) => (
        <div 
          key={sectionIndex} 
          className={cn(
            "w-full h-full",
            // If it's a sub-grid, we handle its internal layout
            section.type === 'grid' ? 'grid grid-cols-2 gap-2 md:gap-3' : 'block'
          )}
        >
          {section.images.map((image, imageIndex) => (
            <div key={imageIndex} className="relative overflow-hidden rounded-lg bg-muted">
              <img 
                src={image.src} 
                alt={image.alt} 
                className={cn(
                  'w-full h-full object-cover transition-transform hover:scale-105',
                  // Ensure square layout for grid items to keep it tight
                  section.type === 'grid' ? 'aspect-video' : 'aspect-auto'
                )} 
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
