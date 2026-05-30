import { ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAdventureStore } from "@/store/adventure.store"
import { usegetAvailableAdventures } from "@/services/adventures/adventures.queries";
import { FlipWords } from "@/components/ui/flip-words";
import { RouterPush } from "@/components/RouterPush";
import { useRouter } from "next/navigation";

const activities = [
    { title: "Paragliding", image: "/adventures/pg.png", label: "paragliding" },
    { title: "Bungee jumping", image: "/adventures/bj.png", label: "bungee" },
    { title: "Scuba diving", image: "/adventures/sud.png", label: "diving" },
    { title: "Skydiving", image: "/adventures/sd.png", label: "sky" },
    { title: "Rafting", image: "/adventures/rft.png", label: "rafting" },
    { title: "Trekking", image: "/adventures/trk.png", label: "trekking" },
]

const imageMap: Record<string, string> = {
    paragliding: "/adventures/pg.png",
    bungee: "/adventures/bj.png",
    diving: "/adventures/sud.png",
    sky: "/adventures/sd.png",
    rafting: "/adventures/rft.png",
    trekking: "/adventures/trk.png",
}
type ActivityData = {
    category: string,
    title: string,
    startingPrice: number
}
export default function AdventureSection() {
    const { city, category, setCategory } = useAdventureStore();

    const { data, isLoading } = usegetAvailableAdventures({
        city,
        category,
        page: 1,
        limit: 10,
    });
    const fetchedCardsdata: ActivityData[] = data?.data
    const router = useRouter()
    return (
        <section className="px-2 md:px-0 w-full mx-auto my-4">
            {/* Header */}
            <div className="flex items-center gap-1 mb-6 cursor-pointer group">
                {!(city && category) ? (<h2 className="text-xl font-bold dark:text-zinc-200 text-zinc-950 ">
                    {` Search Activities in ${city}`}  <FlipWords words={["Rishikesh", "Manali", "Bhopal"]} className='text-lg' /> <br />
                </h2>) : (
                    <h2 className="text-xl font-bold dark:text-zinc-200 text-zinc-950">
                        {`Adventures Activities in ${city} `}   <br />
                    </h2>
                )}
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </div>

            {/* Grid - 2 rows as shown in your image */}
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {!city && [...activities, ...activities].map((activity, index) => (
                    <div key={index} className="space-y-3" >
                        <Card className="overflow-hidden border-none shadow-none bg-transparent py-2">
                            <CardContent className="p-0">
                                <img
                                    src={activity.image}
                                    alt={activity.title}
                                    className="aspect-[4/3] w-full object-contains rounded-sm md:rounded-md  hover:opacity-90 transition-opacity cursor-pointer"
                                />
                                <div>
                                    {/* <p>{activity.title}</p> */}
                                </div>
                            </CardContent>
                        </Card>
                        <p className="text-sm font-medium dark:text-zinc-200 text-zinc-950 px-1">
                            {activity.title}
                        </p>
                    </div>
                ))}
                {/* Skeleton loading cards */}
                {city && isLoading && Array.from({ length: 6 }).map((_, index) => (
                    <div key={`skeleton-${index}`} className="space-y-3">
                        <Card className="overflow-hidden border-none shadow-none bg-transparent py-2">
                            <CardContent className="p-0">
                                <Skeleton className="aspect-[4/3] w-full rounded-sm md:rounded-md bg-zinc-200 dark:bg-accent" />
                            </CardContent>
                        </Card>
                        <Skeleton className="h-4 w-[70%] rounded-md bg-zinc-200 dark:bg-accent mx-1" />
                        <Skeleton className="h-3 w-[45%] rounded-md bg-zinc-200 dark:bg-accent mx-1" />
                    </div>
                ))}
                {fetchedCardsdata?.length > 0 && [...fetchedCardsdata, ...fetchedCardsdata, ...fetchedCardsdata].map((a: ActivityData, indx) => (
                    <div key={indx} className="space-y-3" onClick={() => {
                        setCategory(a.category);
                        RouterPush(router, "adventures/find");
                    }}>
                        <Card className="overflow-hidden border-none shadow-none bg-transparent py-2">
                            <CardContent className="p-0">
                                <img
                                    src={imageMap[a.category]}
                                    alt={a.title}
                                    className="aspect-[4/3] w-full object-contains rounded-sm md:rounded-md  hover:opacity-90 transition-opacity cursor-pointer"
                                />
                                <div>
                                    <p>{a.title}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
            {fetchedCardsdata?.length === 0 && (
                <div className="flex flex-col items-center justify-center w-full py-12 gap-4">
                    <img
                        src={"/adventures/notfound.png"}
                        alt={"notfound"}
                        className="h-28 w-28 object-contain opacity-80"
                    />
                    <div className="flex flex-col items-center gap-1">
                        <h1 className="text-lg font-semibold dark:text-zinc-200 text-zinc-800">No Activity Found</h1>
                        <p className="text-sm dark:text-zinc-400 text-zinc-500">Try selecting a different city or category</p>
                    </div>
                </div>
            )}
        </section>
    )
}