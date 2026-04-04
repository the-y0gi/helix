import { Button } from '@/components/ui/button'
import { useResetPassword } from '@/hooks/auth/forgotPassword'
import { useSignUp } from '@/hooks/auth/use-signup'
import type { SignUpProps } from '@/schema/auth'
import React from 'react'
import { useFormContext } from 'react-hook-form'


const ForgetPasswordHandeler = ({ currentStep, setCurrentStep }: { currentStep: number, setCurrentStep: React.Dispatch<React.SetStateAction<number>> }) => {
    const { formState, getFieldState, getValues } = useFormContext<SignUpProps>()
    const { isDirty: isPhone } = getFieldState('phone', formState)
    const { isDirty: isPassword } = getFieldState('password', formState)
    const { isDirty: isConfirmPassword } = getFieldState('confirmPassword', formState)
    const { isDirty: isOtp } = getFieldState('otp', formState)
    const { onGenerateOtp, onVerify } = useResetPassword()
    switch (currentStep) {
        case 1:
            return (
                <Button type='button' variant={"outline"} className="rounded-full "
                    {...(
                        isPhone &&
                        {
                            onClick: (e) => {
                                e.preventDefault();
                                onGenerateOtp(
                                    getValues('phone'),
                                    setCurrentStep
                                );
                            }
                        })}
                >Send Verification Code</Button>
            )
        case 2:
            return (
                <Button type='button' className="rounded-full bg-primary"
                    {...(

                        // isOtp &&

                        {
                            onClick: (e) => {
                                e.preventDefault();
                                onVerify(
                                    getValues('phone'),
                                    getValues('otp'),
                                    setCurrentStep
                                );
                            }
                        })} >Verify OTP</Button>
            )


    }
    return (
        <Button type='submit' className="rounded-full bg-primary"
        >Reset Password</Button>
    )
}

export default ForgetPasswordHandeler