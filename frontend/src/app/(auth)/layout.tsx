import AuthContextProvider from '@/context/auth/auth-form-provider'
import ResetPasswordContextProvider from '@/context/auth/resetpasswordsteps'
import React from 'react'


const layout = ({ children }: {
    children: React.ReactNode
}) => {
    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <ResetPasswordContextProvider>
                <AuthContextProvider>

                    {children}
                </AuthContextProvider>
            </ResetPasswordContextProvider>
        </div>
    )
}

export default layout