"use client";

import React, { useState } from "react";
import { Check, Eye, EyeSlash } from "@gravity-ui/icons";
import { Button, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import { toast } from "react-toastify";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const data = {};

    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    toast.success("Logged in successfully! Welcome back! 👋");
    console.log("Login Data Submitted:", data);
  };

  const onInvalid = (e) => {
    e.preventDefault();
    toast.error("Please fill out all fields correctly.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-md">
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
          Login Page
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Welcome back! Please enter your details.
        </p>

        <Form 
          className="flex flex-col gap-5" 
          onSubmit={onSubmit}
          onInvalid={onInvalid}
        >
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
            <Input placeholder="john@example.com" />
            <FieldError />
          </TextField>

          {/* Password Field */}
          <TextField
            isRequired
            name="password"
            type={showPassword ? "text" : "password"}
          >
            <Label>Password</Label>
            <div className="relative w-full">
              <Input 
                placeholder="Enter your password" 
                className="pr-10" 
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
            <FieldError />
          </TextField>

          {/* Action Buttons & Redirect Link */}
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex gap-3">
              <Button type="submit" className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Login
              </Button>
              <Button type="reset" variant="secondary">
                Reset
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-2">
              Don't have an account?{" "}
              <Link
                href='/register'
                className="text-primary hover:underline font-medium transition-all"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
}