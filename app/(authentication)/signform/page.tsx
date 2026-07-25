"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

interface UserDataProps {
  email?: string;
  pen_name?: string;
  password?: string;
  password2?: string;
}

export default function Authentication() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isSignIn, setIsSignIn] = useState(true);
  const [userData, setUserData] = useState<UserDataProps>({
    email: "",
    pen_name: "",
    password: "",
    password2: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleErrorMessage = (error: AxiosError) => {
    let message: string;
    switch (error.response?.status || error.status) {
      case 401:
        message = "Email or Password incorrect.";
        break;
      case 429:
        message = "Too many requests. Please try again later.";
        break;
      default:
        message = "An unexpected error occurred. Please try again later.";
    }
    toast.error(message);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/users/signin", {
        email: userData.email,
        password: userData.password,
      });
      const { accessToken, user } = response.data;
      setAuth(accessToken, user);

      router.push("/");
    } catch (error) {
      handleErrorMessage(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (userData.password !== userData.password2) {
      setStatus("Password and Retype Password are different.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/users/signup", {
        email: userData.email,
        pen_name: userData.pen_name,
        password: userData.password,
      });
      const { accessToken, user } = response.data;

      setAuth(accessToken, user);

      router.push("/");
    } catch (error) {
      handleErrorMessage(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-dvh">
      {loading && (
        <div className="absolute bg-mist-900/60 w-full h-full flex justify-center items-center z-10">
          <Spinner className="size-8" />
        </div>
      )}
      <Toaster position="top-center" richColors />
      <h1 className="text-2xl font-bold my-4">Reading Platform</h1>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>
            {isSignIn ? "Get into your account" : "Create new account"}
          </CardTitle>
        </CardHeader>
        <form onSubmit={isSignIn ? handleSignIn : handleSignUp}>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  placeholder="user@example.com"
                  required
                />
              </div>

              {isSignIn ? (
                <section className="mb-2">
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      value={userData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </section>
              ) : (
                <section className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="pen_name">Pen Name</Label>
                    <Input
                      id="pen_name"
                      type="text"
                      name="pen_name"
                      value={userData.pen_name}
                      onChange={handleChange}
                      placeholder="Your Pen Name"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password2">Retype Password</Label>
                      <Input
                        id="password2"
                        type="password"
                        name="password2"
                        value={userData.password2}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <p className="ml-auto inline-block text-sm opacity-70">
                        Minimum 8 characters, including at least 1 uppercase
                        letter and 1 number.
                      </p>
                      {status && <p className="text-red-400 my-2">{status}</p>}
                    </div>
                  </div>
                </section>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full">
              {isSignIn ? "Sign In" : "Sign Up"}
            </Button>
            <CardAction>
              Or
              <Button
                variant="link"
                onClick={() => {
                  setIsSignIn((prev) => !prev);
                  setStatus("");
                }}
              >
                {isSignIn ? "Sign Up" : "Sign In"}
              </Button>
              {isSignIn ? "to create new account" : "to get into your account"}
            </CardAction>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
