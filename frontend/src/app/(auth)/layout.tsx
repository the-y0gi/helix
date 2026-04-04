import ResetPasswordContextProvider from '@/context/auth/resetpasswordsteps'
import React from 'react'


const layout = ({ children }: {
    children: React.ReactNode
}) => {
    return (
        <div className='w-full h-full flex justify-center items-center'>
            <ResetPasswordContextProvider>
                {children}
            </ResetPasswordContextProvider>
        </div>
    )
}

export default layout