"use client";

import React, { useState } from "react";
import { Check, Eye, EyeSlash } from "@gravity-ui/icons";
import { Button, Description, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import { toast } from "react-toastify";
import Link from "next/link";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const data = {};

    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    toast.success("Account created successfully! 🎉");
    console.log("Form Data Submitted:", data);
  };

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
            <Input placeholder="john@example.com" />
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
      </div>
    </div>
  );
}