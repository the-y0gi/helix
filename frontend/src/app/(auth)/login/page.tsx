'use client'
import { ResetPassword, Sign_in_hover, SignInForm, SignupForm } from '@/components/auth/_components/sign-in-hover'
import React from 'react'

type Props = {}

const LoginPage = (props: Props) => {
    const [tag, setTag] = React.useState<"Log-in" | "Sign-up" | "ResetPassword">("Log-in");
    return (
        <div className='w-full h-full flex justify-center items-center'>
            {tag === "Sign-up" ? (
                <SignupForm setTag={setTag} />
            ) : tag === "ResetPassword" ? (
                <ResetPassword setTag={setTag} />
            ) : (
                <SignInForm setTag={setTag} />
            )}
        </div>
    )
}

export default LoginPage