import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import React from 'react'
import { RouterPush } from '../RouterPush'

type Props = {}

const LOGO = (props: Props) => {
    const ismobile = useIsMobile()
    const navigate = useRouter()
    return (
        <div className={cn("min-w-14  p-2 rounded-full transition hover:scale-105", ismobile ? "h-10" : "h-14")} onClick={() => RouterPush(navigate, '/hotels')}>
            <img
                src="/logo.png"
                alt="Company logo"
                className="w-full h-full object-contain"
            />
        </div>
    )
}

export default LOGO