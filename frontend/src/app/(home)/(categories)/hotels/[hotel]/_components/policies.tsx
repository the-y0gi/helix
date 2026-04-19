// import { PageSkeleton } from "@/components/loader/skeleton";
// import { MessageModal } from "@/components/messagemodal";
// import { Card, CardContent } from "@/components/ui/card"
// import { useGetHotelPolicies } from "@/services/hotel/querys"
// import {
//     DoorOpen,
//     DoorClosed,
//     CalendarX,
//     Baby,
//     Users,
//     Moon,
//     Cigarette,
//     PawPrint,
//     Loader,
// } from "lucide-react"

// export function HotelPolicies({ id }: { id: string }) {
//     const { data, isLoading, isError } = useGetHotelPolicies(id)

//     if (isLoading) {
//         return <PageSkeleton />
//     }
//     if (isError) {
//         return <MessageModal title="Error" description="Something went wrong" />
//     }

//     return (
//         <div className="space-y-6">
//             <div className="space-y-1.5">
//                 <h2 className="text-xl font-semibold tracking-tight">Policies</h2>
//                 <p className="text-sm text-muted-foreground">
//                     Lazur Hotel Apartments takes special requests - add in the next step!
//                 </p>
//             </div>

//             <Card className="border shadow-sm">
//                 <CardContent className="p-0 divide-y divide-border">
//                     {/* Check-in */}
//                     <div className="flex items-center gap-x-6 gap-y-1 p-6">
//                         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted/50 text-muted-foreground">
//                             <DoorOpen className="h-5 w-5" />
//                         </div>
//                         <div className="flex-1 space-y-1">
//                             <h3 className="font-medium leading-none">Check-in</h3>
//                             <div className="space-y-0.5">
//                                 <p className="text-sm text-muted-foreground">
//                                     From 15:00 to 18:00
//                                 </p>
//                                 <p className="text-sm text-muted-foreground/90">
//                                     You’ll need to let the property know in advance what time you’ll arrive.
//                                 </p>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Check-out */}
//                     <div className="flex items-center gap-x-6 gap-y-1 p-6">
//                         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted/50 text-muted-foreground">
//                             <DoorClosed className="h-5 w-5" />
//                         </div>
//                         <div className="flex-1 space-y-1">
//                             <h3 className="font-medium leading-none">Check-out</h3>
//                             <p className="text-sm text-muted-foreground">
//                                 From 08:00 to 11:00
//                             </p>
//                         </div>
//                     </div>

//                     {/* Cancellation / Prepayment */}
//                     <div className="flex items-start gap-x-6 gap-y-1 p-6">
//                         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted/50 text-muted-foreground">
//                             <CalendarX className="h-5 w-5" />
//                         </div>
//                         <div className="flex-1 space-y-1">
//                             <h3 className="font-medium leading-none">Cancellation / prepayment</h3>
//                             <p className="text-sm text-muted-foreground leading-relaxed">
//                                 Cancellation and prepayment policies vary according to accommodation type. Please check what condition may apply to each option when making your selection.
//                             </p>
//                         </div>
//                     </div>

//                     {/* Children and beds */}
//                     <div className="flex items-start gap-x-6 gap-y-1 p-6">
//                         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted/50 text-muted-foreground">
//                             <Baby className="h-5 w-5" />
//                         </div>
//                         <div className="flex-1 space-y-1">
//                             <h3 className="font-medium leading-none">Children and beds</h3>
//                             <p className="text-sm text-muted-foreground leading-relaxed">
//                                 Child policies: children of any age are welcome. To see correct prices and occupancy information, please add the number of children in your group and their ages to your search.
//                                 <br />
//                                 Cot and extra bed policies: Cots and extra beds are not available at this property.
//                             </p>
//                         </div>
//                     </div>

//                     {/* No age restriction */}
//                     <div className="flex items-center gap-x-6 gap-y-1 p-6">
//                         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted/50 text-muted-foreground">
//                             <Users className="h-5 w-5" />
//                         </div>
//                         <div className="flex-1 space-y-1">
//                             <h3 className="font-medium leading-none">No age restriction</h3>
//                             <p className="text-sm text-muted-foreground">
//                                 Guests of all ages are welcome.
//                             </p>
//                         </div>
//                     </div>

//                     {/* Quiet hours */}
//                     <div className="flex items-center gap-x-6 gap-y-1 p-6">
//                         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted/50 text-muted-foreground">
//                             <Moon className="h-5 w-5" />
//                         </div>
//                         <div className="flex-1 space-y-1">
//                             <h3 className="font-medium leading-none">Quiet hours</h3>
//                             <p className="text-sm text-muted-foreground">
//                                 Guests must be quiet between 22:00 and 10:00.
//                             </p>
//                         </div>
//                     </div>

//                     {/* Smoking */}
//                     <div className="flex items-center gap-x-6 gap-y-1 p-6">
//                         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted/50 text-muted-foreground">
//                             <Cigarette className="h-5 w-5" />
//                         </div>
//                         <div className="flex-1 space-y-1">
//                             <h3 className="font-medium leading-none">Smoking</h3>
//                             <p className="text-sm text-muted-foreground">
//                                 Smoking not allowed.
//                             </p>
//                         </div>
//                     </div>

//                     {/* Pets */}
//                     <div className="flex items-center gap-x-6 gap-y-1 p-6">
//                         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted/50 text-muted-foreground">
//                             <PawPrint className="h-5 w-5" />
//                         </div>
//                         <div className="flex-1 space-y-1">
//                             <h3 className="font-medium leading-none">Pets</h3>
//                             <p className="text-sm text-muted-foreground">
//                                 Pets are not allowed.
//                             </p>
//                         </div>
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     )
// }

import { PageSkeleton } from "@/components/loader/skeleton";
import { MessageModal } from "@/components/messagemodal";
import { Card, CardContent } from "@/components/ui/card"
import { useGetHotelPolicies } from "@/services/hotel/querys"
import {
    DoorOpen,
    DoorClosed,
    CalendarX,
    Baby,
    Users,
    Moon,
    Cigarette,
    PawPrint,
} from "lucide-react"

export function HotelPolicies({ id }: { id: string }) {
    const { data, isLoading, isError } = useGetHotelPolicies(id)

    if (isLoading) return <PageSkeleton />
    if (isError) return <MessageModal title="Error" description="Something went wrong" />

    const PolicyItem = ({ 
        icon: Icon, 
        title, 
        children, 
        alignTop = false 
    }: { 
        icon: any, 
        title: string, 
        children: React.ReactNode, 
        alignTop?: boolean 
    }) => (
        <div className={`flex ${alignTop ? 'items-start' : 'items-center'} gap-4 p-4 sm:p-5`}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
                <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground mb-0.5">{title}</h3>
                <div className="text-sm text-muted-foreground leading-relaxed">
                    {children}
                </div>
            </div>
        </div>
    )

    return (
        <div className="w-full mx-auto space-y-4">
            <div className="px-1">
                <h2 className="text-lg md:text-xl font-bold tracking-tight dark:text-zinc-400 text-zinc-800">Hotel Policies</h2>
                <p className="text-xs md:text-sm text-muted-foreground">
                    Specific rules and information about your stay at this property.
                </p>
            </div>

            <Card className="overflow-hidden border-none sm:border shadow-none sm:shadow-sm bg-transparent sm:bg-card">
                <CardContent className="p-0 divide-y divide-border/60">
                    {/* Time Based Policies Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/60">
                        <PolicyItem icon={DoorOpen} title="Check-in">
                            <span className="font-medium text-foreground">15:00 - 18:00</span>
                            <p className="text-xs mt-1 italic">Please notify arrival time in advance.</p>
                        </PolicyItem>
                        <PolicyItem icon={DoorClosed} title="Check-out">
                            <span className="font-medium text-foreground">08:00 - 11:00</span>
                        </PolicyItem>
                    </div>

                    {/* Detailed Policies */}
                    <PolicyItem icon={CalendarX} title="Cancellation & Prepayment" alignTop>
                        Policies vary by accommodation type. Please check conditions before selection.
                    </PolicyItem>

                    <PolicyItem icon={Baby} title="Children and Extra Beds" alignTop>
                        Children of all ages welcome. <span className="font-medium">Cots and extra beds are not available.</span>
                    </PolicyItem>

                    {/* Grid for small rules */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
                        <PolicyItem icon={Users} title="Age Restriction">
                            No age restriction for guests.
                        </PolicyItem>
                        <PolicyItem icon={Moon} title="Quiet Hours">
                            Quiet between <span className="text-foreground font-medium">22:00 and 10:00</span>.
                        </PolicyItem>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
                        <PolicyItem icon={Cigarette} title="Smoking">
                            Smoking is <span className="text-destructive font-medium">not allowed</span>.
                        </PolicyItem>
                        <PolicyItem icon={PawPrint} title="Pets">
                            Pets are <span className="text-destructive font-medium">not allowed</span>.
                        </PolicyItem>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}