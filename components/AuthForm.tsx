"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import FormField from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { auth } from "@/firebase/client";
import { signUp, signIn } from "@/lib/actions/auth.action";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(4) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(8),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        const { name, email, password } = values;
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );

        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result?.success) {
          toast.error(result?.message || "There was an error");
          return;
        }

        toast.success("Account is created successfully, please sign in!");
        router.push("/sign-in");
      } else {
        const { email, password } = values;

        const userCredentials = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );

        const idToken = await userCredentials.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in failed");
          return;
        }
        await signIn({
          email,
          idToken,
        });

        toast.success("Sign in was successful!");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <div className={"card-border lg:min-w-[566px]"}>
      <div className={"flex flex-col gap-6 card py-14 px-10"}>
        <div className={"flex flex-row justify-center gap-2"}>
          <Image
            src={"/logo.svg"}
            alt={"prepWise logo"}
            height={32}
            width={32}
          />
          <h2 className={"text-primary-100"}>PrepWise</h2>
        </div>
        <h3>Practice job interview with AI</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name={"name"}
                label={"Name"}
                placeholder={"Your name"}
              />
            )}
            <FormField
              control={form.control}
              name={"email"}
              label={"Email"}
              placeholder={"Enter your email address"}
              type={"email"}
            />
            <FormField
              control={form.control}
              name={"password"}
              label={"Password"}
              placeholder={"Password must be at least 8 characters"}
              type={"password"}
            />
            <Button className={"btn"} type="submit">
              {isSignIn ? "Sign In" : "Create Account"}
            </Button>
          </form>
        </Form>
        <p className={"text-center "}>
          {isSignIn ? "Don't have an account?" : "Already have an account? "}
          <Link
            className={"font-bold text-user-primary ml-2"}
            href={!isSignIn ? "/sign-in" : "/sign-up"}
          >
            {type === "sign-in" ? "Sign up" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  );
};
export default AuthForm;
