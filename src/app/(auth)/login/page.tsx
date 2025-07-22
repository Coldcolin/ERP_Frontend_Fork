"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import Link from "next/link"
import { User, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { useRouter } from 'next/navigation'
import { loginUser } from '@/lib/redux/slices/authSlice'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from "@/lib/redux/store"
import { useState } from "react"


const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    try {
      const response = await dispatch(loginUser({
        email: data.email,
        password: data.password,
      })).unwrap();
  
      if (response?.token) {
        toast.success('Login successful!')
        const params = new URLSearchParams(window.location.search)
        const callbackUrl = params.get('callbackUrl') || '/'
        router.push(callbackUrl)
      }
      
    } catch (err: any) {
      console.error(err)
      const errorMessage =
        err?.message ||
        err?.data?.message ||
        'Invalid credentials. Please try again.'
      form.setError('root', {
        type: 'manual',
        message: errorMessage,
      })

      // TODO: FIX TOASTE MESSAGE
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-900 relative overflow-hidden">
      <div className="absolute w-[800px] h-[800px] rounded-full bg-primary-500 opacity-30 -top-[400px] -right-[400px]"></div>
      <div className="absolute w-[600px] h-[600px] rounded-full bg-primary-500 opacity-30 -bottom-[300px] -left-[300px]"></div>

      <Card className="w-full bg-transparent max-w-md mx-4 [&>*]:px-0 border-0">
        <CardHeader className="flex h-40 bg-white py-4 justify-center pb-2">
          <Image
            src="/assets/images/cover.png"
            alt="DreamWorks Global Logistics Limited"
            width={400}
            height={10}
            className="w-full h-full object-cover"
          />
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                      <FormControl>
                        <Input
                          placeholder="EMAIL"
                          className="pl-10 h-12 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="PASSWORD"
                          className="pl-10 h-12 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

<Button
  type="submit"
  className="w-full h-12 bg-white cursor-pointer transition-all duration-300 hover:bg-gray-100 text-black border border-gray-200"
  variant="outline"
  disabled={isLoading}
>
  {isLoading ? (
    <div className="flex items-center gap-2">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
      Logging in...
    </div>
  ) : (
    'LOGIN'
  )}
</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-end pt-0">
          <Link href="/forgot-password" className="text-sm text-white hover:underline">
            Forgot password?
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
