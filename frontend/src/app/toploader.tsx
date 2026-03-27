'use client'
import NextTopLoader from 'nextjs-toploader'
import React from 'react'

type Props = {}

const TopLoader = (props: Props) => {
    return (
        <NextTopLoader
            color="#FF0000"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={500}
            shadow="0 0 10px #FF0000,0 0 5px #FF0000"
        />
    )
}

export default TopLoader