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
    Loader,
} from "lucide-react"

export function HotelPolicies({id}: {id: string}) {
    const {data,isLoading,isError} = useGetHotelPolicies(id)
    if(isLoading){
        return <Loader/>
    }
    if(isError){
        return <div>Something went wrong</div>
    }
    console.log(data);
    
    return (
        <div className="space-y-6">
            <div className="space-y-1.5">
                <h2 className="text-xl font-semibold tracking-tight">Policies</h2>
                <p className="text-sm text-muted-foreground">
                    Lazur Hotel Apartments takes special requests - add in the next step!
                </p>
            </div>

            <Card className="border shadow-sm">
                <CardContent className="p-0 divide-y divide-border">
                    {/* Check-in */}
                    <div className="flex items-center gap-x-6 gap-y-1 p-6">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted/50 text-muted-foreground">
                            <DoorOpen className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <h3 className="font-medium leading-none">Check-in</h3>
                            <div className="space-y-0.5">
                                <p className="text-sm text-muted-foreground">
                                    From 15:00 to 18:00
                                </p>
                                <p className="text-sm text-muted-foreground/90">
                                    You’ll need to let the property know in advance what time you’ll arrive.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Check-out */}
                    <div className="flex items-center gap-x-6 gap-y-1 p-6">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted/50 text-muted-foreground">
                            <DoorClosed className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <h3 className="font-medium leading-none">Check-out</h3>
                            <p className="text-sm text-muted-foreground">
                                From 08:00 to 11:00
                            </p>
                        </div>
                    </div>

                    {/* Cancellation / Prepayment */}
                    <div className="flex items-start gap-x-6 gap-y-1 p-6">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted/50 text-muted-foreground">
                            <CalendarX className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <h3 className="font-medium leading-none">Cancellation / prepayment</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Cancellation and prepayment policies vary according to accommodation type. Please check what condition may apply to each option when making your selection.
                            </p>
                        </div>
                    </div>

                    {/* Children and beds */}
                    <div className="flex items-start gap-x-6 gap-y-1 p-6">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted/50 text-muted-foreground">
                            <Baby className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <h3 className="font-medium leading-none">Children and beds</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Child policies: children of any age are welcome. To see correct prices and occupancy information, please add the number of children in your group and their ages to your search.
                                <br />
                                Cot and extra bed policies: Cots and extra beds are not available at this property.
                            </p>
                        </div>
                    </div>

                    {/* No age restriction */}
                    <div className="flex items-center gap-x-6 gap-y-1 p-6">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted/50 text-muted-foreground">
                            <Users className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <h3 className="font-medium leading-none">No age restriction</h3>
                            <p className="text-sm text-muted-foreground">
                                Guests of all ages are welcome.
                            </p>
                        </div>
                    </div>

                    {/* Quiet hours */}
                    <div className="flex items-center gap-x-6 gap-y-1 p-6">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted/50 text-muted-foreground">
                            <Moon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <h3 className="font-medium leading-none">Quiet hours</h3>
                            <p className="text-sm text-muted-foreground">
                                Guests must be quiet between 22:00 and 10:00.
                            </p>
                        </div>
                    </div>

                    {/* Smoking */}
                    <div className="flex items-center gap-x-6 gap-y-1 p-6">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted/50 text-muted-foreground">
                            <Cigarette className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <h3 className="font-medium leading-none">Smoking</h3>
                            <p className="text-sm text-muted-foreground">
                                Smoking not allowed.
                            </p>
                        </div>
                    </div>

                    {/* Pets */}
                    <div className="flex items-center gap-x-6 gap-y-1 p-6">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted/50 text-muted-foreground">
                            <PawPrint className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <h3 className="font-medium leading-none">Pets</h3>
                            <p className="text-sm text-muted-foreground">
                                Pets are not allowed.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}