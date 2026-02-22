import { Button } from '@/components/ui/button'
import { useSignUp } from '@/hooks/auth/use-signup'
import type { SignUpProps } from '@/schema/auth'
import React from 'react'
import { useFormContext } from 'react-hook-form'


const ButtonHandler = ({currentStep, setCurrentStep}:{currentStep:number , setCurrentStep:React.Dispatch<React.SetStateAction<number>>}) => {
  const { formState, getFieldState, getValues } = useFormContext<SignUpProps>()
    const { isDirty: isEmail } = getFieldState('email', formState)
  const { isDirty: isPassword } = getFieldState('password', formState)
  const {isDirty:isConfirmPassword}  = getFieldState('confirmPassword', formState)
  const {onGenerateOtp} = useSignUp()
    switch (currentStep) {
      case 1:
          return (
              <Button type='submit' variant={"outline"} 
               {...(
            isEmail &&
            isPassword &&
            isConfirmPassword && {
              onClick: () =>
                onGenerateOtp(
                  getValues('email'),
                  getValues('password'),
                  setCurrentStep
                ),
            })}
              >Get otp</Button>
          )
      
      
  }
  return (
      <Button type='submit'  >create account</Button>
  )
}

export default ButtonHandler