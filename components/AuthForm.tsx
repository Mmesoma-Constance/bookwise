"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, DefaultValues, FieldValues, Path, SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import z from "zod";

import { Button } from "@/components/ui/button"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import Link from "next/link";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import ImageUpload from "./ImageUpload";


interface Props<T extends FieldValues> {
    type: "SIGN_IN" | "SIGN_UP";
    schema: z.ZodType<T>;
    defaultValues: T;
    onSubmit: (data: T) => Promise<{success: boolean; error?: string }>;
}

const AuthForm =  <T extends FieldValues>({ type, schema, defaultValues, onSubmit }: Props<T>) => {
    const isSignedIn = type === "SIGN_IN"
    const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>
  })
 
  const handleSubmit: SubmitHandler<T> = async (data) => {}

  return (
    <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-white">
            {isSignedIn ? "Welcome back to Bookwise" : "Create your library account" }
        </h1>

        <p className="text-light-100">
            {isSignedIn ? "Access the vast collection of resources, and stay updated" 
            : "Please complete all fields and upload a valid university ID to gain access to the library"}
        </p>
    
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 w-full">

        {Object.keys(defaultValues).map((field) => (
           <FieldGroup key={field}>
        <Controller
          name={field as Path<T>}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="capitalize" >{FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}</FieldLabel>
             
                {field.name === "universityCard" ? (
                <ImageUpload />
          ) : (

              <Input
              required
              type={
                FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]
              }
              {...field}
              className="form-input"
              />
            )
            }


             {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>    
        ))}

      <Button type="submit" className="form-btn cursor-pointer">
        {isSignedIn ? "Sign In" : "Sign Up"}
      </Button>
    </form>

    <p className="text-center text-basse font-medium">
        {isSignedIn? "New to BookWise? " : "Already have an account? "}

    <Link href={isSignedIn ? "/sign-up" : "/sign-in"}className="font-bold text-primary">
    {isSignedIn ? "Create an Account" : "Sign in"}
    </Link>
    </p>
    </div>
  )
}

export default AuthForm
