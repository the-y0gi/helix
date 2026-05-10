import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export const DetailsPageCardWrapperUI = ({ children, classNameCard, classNameChild }: { children: React.ReactNode, classNameChild?: string, classNameCard?: string }) => {
    return (
        <Card
            className={cn(
                "w-full overflow-hidden md:border border-border/60 bg-card shadow-none border-none",
                " transition-all duration-300 rounded-2xl mb-4 last:mb-0",
                "dark:hover:shadow-[0_8px_20px_rgba(255,255,255,0.06)]", classNameCard
            )}
        >
            <div
                className={cn(
                    "grid grid-cols-1 md:grid-cols-[minmax(0,240px)_1fr_minmax(0,200px)]",
                    "lg:grid-cols-[minmax(0,280px)_1fr_minmax(0,220px)]",
                    "md:h-[200px] lg:h-[220px]", classNameChild
                )}
            >{children}</div></Card>
    )
}