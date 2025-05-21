"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { User} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function ForPage() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log("Login attempt with:", email)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-900  relative overflow-hidden">
      {/* Background circles */}
      <div className="absolute w-[800px] h-[800px] rounded-full bg-primary-500 opacity-30 -top-[400px] -right-[400px]"></div>
      <div className="absolute w-[600px] h-[600px] rounded-full bg-primary-500 opacity-30 -bottom-[300px] -left-[300px]"></div>

      <Card className="w-full  bg-transparent max-w-md mx-4 [&>*]:px-0  border-0">
      <CardHeader className="flex h-40 bg-white py-4   justify-center pb-2">
          <Image
            src="/assets/images/DREAMWORK 4.png"
            alt="DreamWorks Global Logistics Limited"
            width={400}
            height={10}
            className="w-full h-full object-cover"
          />
        </CardHeader>
        <CardContent >
          <form onSubmit={handleSubmit} className="space-y-4 w-full ">
            <h1 className="text-white font-bold text-2xl">FORGOT PASSWORD</h1>
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <Input
                  type="email"
                  placeholder="EMAIL"
                  className="pl-10 h-12 text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 font-bold text-sm  bg-white hover:bg-gray-100 cursor-pointer transition-all duration-300 text-black border border-gray-200"
              variant="outline"
            >
              RESET PASSWORD
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex  justify-center pt-0">
          <Link
            href='/login'
            className="w-full text-white text-sm underline font-bold h-12 bg-transparent cursor-pointer transition-all duration-500 "
     
          >
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

