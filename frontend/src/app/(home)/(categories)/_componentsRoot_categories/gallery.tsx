import { cn } from '@/lib/utils'

type GalleryImage = {
  src: string
  alt: string
}

type GallerySection = {
  type?: string
  images: GalleryImage[]
}

type GalleryVariant = "default" | "base4"
const Gallery = ({
  sections,
  variant = "default",
}: {
  sections: GallerySection[]
  variant?: GalleryVariant
}) => {
  return (
    <DrawerDemo
      sections={sections}
      content={
        variant === "base4" ? (
          <div className="grid grid-cols-1 gap-1 md:gap-2 rounded-xl md:rounded-2xl overflow-hidden w-full cursor-pointer">
            {/* Main Image */}
            <div className="relative w-full aspect-[16/9] overflow-hidden">
              <img
                src={
                  sections?.[0]?.images?.[0]?.src?.length > 50
                    ? sections[0].images[0].src
                    : "/hotels/roomIdeal.png"
                }
                alt={sections?.[0]?.images?.[0]?.alt || ""}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* 4+ overlay */}
              <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                +4 more
              </div>
            </div>

            {/* Bottom Images */}
            <div className="grid grid-cols-4 gap-1 md:gap-2">
              {sections
                .flatMap((s) => s.images)
                .slice(1, 5)
                .map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-video overflow-hidden rounded-md"
                  >
                    <img
                      src={
                        image.src.length > 50
                          ? image.src
                          : "/hotels/roomIdeal.png"
                      }
                      alt={image.alt}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                ))}
            </div>
          </div>
        ) : (
          // YOUR OLD CODE EXACTLY SAME
          <div className='grid grid-cols-2 md:gap-1 gap-0.5 rounded-xl md:rounded-2xl cursor-pointer  overflow-hidden w-full aspect-[4/3] md:aspect-auto xl:h-[430px] md:h-[300px]'>
            {sections.slice(0, 2).map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className={cn(
                  'h-full w-full',
                  section.type === 'grid'
                    ? 'grid grid-cols-2 grid-rows-2 gap-0.5 md:gap-1'
                    : 'block'
                )}
              >
                {section.images.map((image, imageIndex) => (
                  <div
                    key={imageIndex}
                    className="relative w-full h-full overflow-hidden"
                  >
                    <img
                      src={image.src.length > 50 ? image.src : "/hotels/roomIdeal.png"}
                      alt={image.alt}
                      className='absolute inset-0 w-full h-full object-cover hover:grayscale-60 '
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )
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
import { Grid3X3, Minus, Plus } from "lucide-react"



export function DrawerDemo({ content, sections }: { content: React.ReactNode, sections: GallerySection[] }) {
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
        <div className="mx-auto w-full  overflow-y-scroll flex flex-col gap-1 md:gap-2 p-2">

          <InnerGallery sections={sections} />
          <InnerGallery sections={sections} />


        </div>
        <div className='h-30 w-full'></div>
      </DrawerContent>
    </Drawer>
  )
}


import { useState, useEffect, useCallback } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { IconView360 } from '@tabler/icons-react'

const InnerGallery = ({ sections }: { sections: GallerySection[] }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const allImages = sections.flatMap(section => section.images)

  const showNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % allImages.length)
    }
  }, [selectedIndex, allImages.length])

  const showPrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + allImages.length) % allImages.length)
    }
  }, [selectedIndex, allImages.length])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return
      if (e.key === 'ArrowRight') showNext()
      if (e.key === 'ArrowLeft') showPrev()
      if (e.key === 'Escape') setSelectedIndex(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex, showNext, showPrev])

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2 w-full">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className={cn("w-full h-full", section.type === 'grid' ? 'grid grid-cols-2 gap-1 md:gap-2' : 'block')}>
            {section.images.map((image, imageIndex) => {
              const globalIndex = allImages.indexOf(image)

              return (
                <div
                  key={imageIndex}
                  className="relative overflow-hidden rounded-lg bg-muted cursor-pointer group"
                  onClick={() => setSelectedIndex(globalIndex)}
                >
                  <img
                    src={image.src.length > 50 ? image.src : "/hotels/roomIdeal.png"}
                    alt={image.alt}
                    className={cn(
                      'w-full h-full object-cover transition-transform duration-500 group-hover:scale-105',
                      section.type === 'grid' ? 'aspect-video' : 'aspect-auto'
                    )}
                  />
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 animate-in fade-in duration-300"
          onClick={() => setSelectedIndex(null)}
        >
          <button className="absolute top-6 right-6 text-white/70 hover:text-white z-[110]" onClick={() => setSelectedIndex(null)}>
            <X size={13} />
          </button>

          <button
            className="absolute left-4 md:left-10 p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all z-[110]"
            onClick={showPrev}
          >
            <ChevronLeft size={48} />
          </button>

          <div className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center gap-4">
            <img
              src={allImages[selectedIndex].src.length > 50 ? allImages[selectedIndex].src : "/hotels/roomIdeal.png"}
              alt={allImages[selectedIndex].alt}
              className="max-w-full max-h-full object-contain shadow-2xl animate-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="text-white/60 text-sm font-medium">
              {selectedIndex + 1} / {allImages.length}
            </p>
          </div>

          <button
            className="absolute right-4 md:right-10 p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all z-[110]"
            onClick={showNext}
          >
            <ChevronRight size={48} />
          </button>
        </div>
      )}
    </>
  )
}