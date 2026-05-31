"use client"; // Required for localStorage access

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const NotAuthorise = ({ children, className, title, description }: {
    children: React.ReactNode,
    className?: string,
    title: string,
    description: string
}) => {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        setIsAuthorized(!!accessToken);
    }, []);

    // While checking (loading state), you might want to show nothing or a spinner
    if (isAuthorized === null) return null;

    if (!isAuthorized) {
        return (
            <div className={cn("w-full h-full flex items-center justify-center", className)}>
                <div className="text-center">
                    <h1 className="text-2xl font-bold">{title}</h1>
                    <p className="text-muted-foreground">{description}</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default NotAuthorise;