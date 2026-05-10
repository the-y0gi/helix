
// import { ItineraryDay } from '@/app/(home)/(categories)/tours/services/[serviceid]/_components/HotelItems'



// interface ChangelogContentProps {
//     releases: ItineraryDay[]
// }

// const ChangelogContent = ({ releases }: ChangelogContentProps) => {
//     return (
//         <>

//             {releases.map((release, index) => (
//                 <div key={release.day} id={String(index + 1)} className='relative flex scroll-mt-18 justify-end gap-2'>
//                     <div className='sticky top-19 flex md:w-16  w-4 flex-col items-end gap-2 self-start pb-4 max-md:hidden'>
//                         {/* <Badge className='flex size-6 w-auto justify-end rounded-sm text-sm font-medium'>{release.day}</Badge> */}
//                         <div className='text-muted-foreground text-right text-sm font-medium'>Day {release.day}</div>
//                     </div>
//                     <div className='flex flex-col items-center'>
//                         <div className='sticky top-19 flex size-6 items-center justify-center max-sm:top-5'>
//                             <span className='bg-primary/20 flex size-4.5 shrink-0 items-center justify-center rounded-full'>
//                                 <span className='bg-primary size-3 rounded-full' />
//                             </span>
//                         </div>
//                         <span className='-mt-2.5 w-px flex-1 border' />
//                     </div>
//                     <div className='flex flex-1 flex-col gap-4 pb-11 pl-3 md:pl-6 lg:pl-9'>
//                         <div className='flex flex-col gap-2 md:hidden'>
//                             {/* <Badge className='flex rounded-sm font-medium'>{release.version}</Badge> */}
//                             <div className='font-medium'>{release.title}</div>
//                         </div>
//                         {/* {release.subtitle && <div className='font-medium'>{release.subtitle}</div>} */}
//                         {release.description && <div className='font-medium'>{release.description}</div>}
//                         {release.highlights && release.highlights.map((highlight, index) => (
//                             <div key={index} className='font-medium'>{highlight}</div>
//                         ))}
//                     </div>
//                 </div>
//             ))}
//         </>
//     )
// }

// export default ChangelogContent



// import { ItineraryDay } from '@/app/(home)/(categories)/tours/services/[serviceid]/_components/HotelItems'
// import { MapPin } from 'lucide-react';
// import { cn } from "@/lib/utils";

// interface ChangelogContentProps {
//     releases: ItineraryDay[]
// }

// const ChangelogContent = ({ releases }: ChangelogContentProps) => {
//     return (
//         <div className="mx-auto py-6 md:py-10 rounded-sm shadow-sm border-border border px-3 sm:px-5 bg-background">
//             {releases.map((release, index) => (
//                 <div key={release.day} className='relative flex group'>


//                     <div className='hidden md:flex flex-col items-end w-24 md:w-28 pr-6 md:pr-10 pt-1 shrink-0'>
//                         <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 leading-none mb-1">
//                             Day
//                         </span>
//                         <span className="text-3xl md:text-4xl font-black text-primary leading-none">
//                             {release.day}
//                         </span>
//                     </div>

//                     <div className='flex flex-col items-center shrink-0'>
//                         <div className={cn(
//                             "relative z-10 flex size-8 md:size-10 items-center justify-center rounded-full shadow-sm transition-all duration-300",
//                             "bg-background border-2 border-primary group-hover:scale-110 group-hover:shadow-md"
//                         )}>
//                             <MapPin className="size-4 md:size-5 text-primary fill-primary/10" />
//                         </div>

//                         {index !== releases.length - 1 && (
//                             <div className='w-0.5 flex-1 bg-border my-1 group-hover:bg-primary/30 transition-colors' />
//                         )}
//                     </div>
//                     <div className='flex-1 pb-10 md:pb-16 pl-4 sm:pl-6 md:pl-12'>

//                         <div className='md:hidden flex items-center gap-2 mb-2'>
//                             <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground/80">Day</span>
//                             <span className="text-xl font-black text-primary leading-none">{release.day}</span>
//                         </div>

//                         <h3 className='text-lg md:text-2xl font-bold tracking-tight text-foreground mb-3 group-hover:text-primary transition-colors'>
//                             {release.title}
//                         </h3>

//                         <div className='space-y-4'>
//                             {release.description && (
//                                 <p className='text-muted-foreground leading-relaxed text-sm md:text-base'>
//                                     {release.description}
//                                 </p>
//                             )}

//                             {release.highlights && release.highlights.length > 0 && (
//                                 <ul className='grid gap-2 md:gap-3'>
//                                     {release.highlights.map((highlight, hIndex) => (
//                                         <li key={hIndex} className='flex items-start gap-2 md:gap-3 group/item'>
//                                             <div className='mt-2 size-1.5 shrink-0 rounded-full bg-primary/40 group-hover/item:bg-primary transition-colors' />
//                                             <span className='text-muted-foreground/80 text-sm md:text-[15px] leading-snug'>
//                                                 {highlight}
//                                             </span>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     )
// }

// export default ChangelogContent;


import { ItineraryDay } from '@/app/(home)/(categories)/tours/services/[serviceid]/_components/HotelItems'
import { MapPin } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ChangelogContentProps {
    releases: ItineraryDay[]
}

const ChangelogContent = ({ releases }: ChangelogContentProps) => {
    return (
        <div className="mx-auto py-3 md:py-4 rounded-xl border border-border bg-card/30 px-3 sm:px-3">
            {releases.map((release, index) => (
                <div
                    key={release.day}
                    className='relative flex group min-h-[120px]'
                >
                    {/* --- Left Side: Day Label (Desktop Only) --- */}
                    <div className='hidden md:flex flex-col items-end w-24 pr-8 shrink-0'>
                        <div className="sticky top-24 pt-1 transition-all duration-300 group-hover:translate-x-1">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 block">
                                Day
                            </span>
                            <span className="text-4xl font-black text-primary/40 group-hover:text-primary transition-colors">
                                {release.day}
                            </span>
                        </div>
                    </div>

                    {/* --- Center: Timeline Track --- */}
                    <div className='flex flex-col items-center shrink-0 w-8 md:w-10'>
                        {/* Sticky Marker */}
                        <div className="sticky top-24 z-20 flex size-8 md:size-10 items-center justify-center ">
                            <div className={cn(
                                // "flex size-6 md:size-10 items-center justify-center rounded-full shadow-sm transition-all duration-500",
                                // "bg-background border-2 border-primary group-hover:scale-110",
                                // "ring-4 ring-background"
                            )}>
                                <MapPin className="size-3 md:size-5 text-primary fill-primary/10 hidden md:block" />
                                <span className=" md:hidden text-sm font-black text-primary mr-2 ">Day {release.day} </span>
                            </div>
                        </div>

                        {/* Vertical Connector Line */}
                        <div className={cn(
                            "w-px flex-1 bg-border my-[-10px] md:my-[-20px]",
                            index === releases.length - 1 ? "bg-transparent" : "bg-gradient-to-b from-border via-border to-transparent",
                            "group-hover:bg-primary/30 transition-colors"
                        )} />
                    </div>

                    {/* --- Right Side: Content --- */}
                    <div className='flex-1 pb-12 md:pb-24 pl-4 md:pl-12'>

                        {/* Mobile Sticky Header (Visible only < 768px) */}
                        <div className='md:hidden sticky top-20  hidden md:block z-10 bg-background/95 backdrop-blur-md py-2 mb-3 flex items-center gap-2 border-b border-border/50'>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Day</span>
                            <span className="text-2xl font-black text-primary">{release.day}</span>
                            <div className="h-px flex-1 bg-border/30 ml-2" />
                        </div>

                        <h3 className='text-lg md:text-xl font-bold tracking-tight text-foreground mb-3 group-hover:text-primary transition-colors duration-300'>
                            {release.title}
                        </h3>

                        <div className='space-y-2 md:space-y-3'>
                            {release.description && (
                                <p className='text-muted-foreground leading-relaxed text-sm md:text-md max-w-2xl'>
                                    {release.description}
                                </p>
                            )}

                            {release.highlights && release.highlights.length > 0 && (
                                <ul className='grid gap-1 md:gap-1.5'>
                                    {release.highlights.map((highlight, hIndex) => (
                                        <li key={hIndex} className='flex items-start gap-1 bg-muted/20 md:bg-muted/30 md:p-2  rounded-lg 0 transition-all'>
                                            <div className='mt-1.5 size-1 md:size-1 shrink-0 rounded-full bg-primary/40' />
                                            <span className='text-muted-foreground/90 text-xs md:text-base leading-snug'>
                                                {highlight}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ChangelogContent;