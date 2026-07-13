"use client";

import React, { useState } from "react";
import { Check, Eye, EyeSlash } from "@gravity-ui/icons";
import { Button, Description, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import { toast } from "react-toastify";
import Link from "next/link";
import { authClient, signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";


export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

 const onSubmit = async(e) => {
    e.preventDefault();
    
    const formDataObj = Object.fromEntries(new FormData(e.currentTarget));
    console.log(formDataObj)
    try {
      const { data, error } = await signUp.email({
        name: formDataObj.name,
        email: formDataObj.email,
        password: formDataObj.password,
        image: formDataObj.photoUrl,
      });

      if (error != null) {
        const errorMessage = error?.message || "Unable to complete registration.";
        toast.error(errorMessage);
        return;
      }

      if (data != null) {
        toast.success("Account created successfully. Redirecting to dashboard...");
        window.location.href = "/" ;
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    } 
  };

  const handleGoogleSignIn = async() => {
    await authClient.signIn.social({
      provider: "google", 
    })
  }

  const onInvalid = (e) => {
    e.preventDefault();
    toast.error("Please fix the validation errors in the form before submitting.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-md">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-foreground">
          Register Page
        </h2>

        <Form 
          className="flex flex-col gap-5" 
          onSubmit={onSubmit}
          onInvalid={onInvalid}
        >
          {/* Name Field */}
          <TextField isRequired name="name" type="text">
            <Label>Name</Label>
            <Input placeholder="John Doe" />
            <FieldError />
          </TextField>

          {/* Email Field */}
          <TextField
            isRequired
            name="email"
            type="email"
            validate={(value) => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return "Please enter a valid email address";
              }
              return null;
            }}
          >
            <Label>Email</Label>
            <Input placeholder="john@example.com" name="email" type="email"/>
            <FieldError />
          </TextField>

          {/* Photo URL Field */}
          <TextField
            isRequired
            name="photoUrl"
            type="url"
            validate={(value) => {
              if (value && !/^https?:\/\/.+/i.test(value)) {
                return "URL must begin with http:// or https://";
              }
              return null;
            }}
          >
            <Label>Photo URL</Label>
            <Input placeholder="https://example.com/avatar.jpg" />
            <FieldError />
          </TextField>

          {/* Password Field */}
          <TextField
            isRequired
            name="password"
            type={showPassword ? "text" : "password"}
            validate={(value) => {
              if (value.length < 6) {
                return "Password must be at least 6 characters long";
              }
              if (!/[A-Z]/.test(value)) {
                return "Password must contain at least one uppercase letter";
              }
              if (!/[a-z]/.test(value)) {
                return "Password must contain at least one lowercase letter";
              }
              return null;
            }}
          >
            <Label>Password</Label>
            <div className="relative w-full">
              <Input 
                placeholder="Enter your password" 
                className="pr-10" 
                name="password"
                type="password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeSlash className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <Description>
              Must have at least 6 characters with 1 uppercase and 1 lowercase letter.
            </Description>
            <FieldError />
          </TextField>

          {/* Action Buttons & Redirect Link */}
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex gap-3">
              <Button type="submit" className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Sign Up
              </Button>
              <Button type="reset" variant="secondary">
                Reset
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-2">
              Already have an account?{" "}
              <Link
                href='/login'
                className="text-primary hover:underline font-medium transition-all"
              >
                Login here
              </Link>
            </p>
          </div>
        </Form>
            {/* GOOGLE LOGIN BUTTON */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.33 0 3.357 2.673 1.414 6.573l3.852 3.192z"
            />
            <path
              fill="#4285F4"
              d="M23.727 12.273c0-.818-.073-1.609-.209-2.364H12v4.51h6.6a5.64 5.64 0 01-2.445 3.7l3.782 2.928c2.21-2.036 3.79-5.036 3.79-8.774z"
            />
            <path
              fill="#FBBC05"
              d="M5.266 14.235L1.414 17.43A11.947 11.947 0 0012 24c3.082 0 5.882-1.018 7.945-2.773l-3.782-2.927a7.126 7.126 0 01-4.163 1.164c-3.11 0-5.79-2.091-6.734-4.964z"
            />
            <path
              fill="#34A853"
              d="M1.414 6.573A11.947 11.947 0 000 12c0 1.936.464 3.764 1.414 5.43l4.814-3.736A7.017 7.017 0 016 12c0-1.41.41-2.727 1.118-3.836L1.414 6.573z"
            />
          </svg>
          <span>Sign in with Google</span>
        </button>

      </div>
    </div>
  );
}
