import { ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const activities = [
    { title: "Paragliding", image: "/adventures/act1.png" },
    { title: "Bungee jumping", image: "/adventures/act2.png" },
    { title: "Scuba diving", image: "/adventures/act3.png" },
    { title: "Skydiving", image: "/adventures/act4.png" },
    { title: "Skydiving", image: "/adventures/act4.png" },
]

export default function AdventureSection() {
    return (
        <section className="px-2 md:px-0 w-full mx-auto my-4">
            {/* Header */}
            <div className="flex items-center gap-1 mb-6 cursor-pointer group">
                <h2 className="text-xl font-bold text-gray-900">
                    Adventure Activities in Rishikesh
                </h2>
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </div>

            {/* Grid - 2 rows as shown in your image */}
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[...activities, ...activities].map((activity, index) => (
                    <div key={index} className="space-y-3">
                        <Card className="overflow-hidden border-none shadow-none bg-transparent py-2">
                            <CardContent className="p-0">
                                <img
                                    src={activity.image}
                                    alt={activity.title}
                                    className="aspect-[4/3] w-full object-contains rounded-sm md:rounded-md  hover:opacity-90 transition-opacity cursor-pointer"
                                />
                            </CardContent>
                        </Card>
                        {/* <p className="text-sm font-medium text-gray-800 px-1">
                            {activity.title}
                        </p> */}
                    </div>
                ))}
            </div>
        </section>
    )
}