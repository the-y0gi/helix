

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

export default function HotelPolicies({ id }: { id: string }) {
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