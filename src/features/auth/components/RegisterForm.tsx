import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2, ChevronDownIcon, Loader } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Link, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod';
import { differenceInYears } from "date-fns"
import { signup } from "@/api/auth";
import { useState } from "react";
import { toast } from "sonner";

const RegisterSchema = z.object(
    {
        name: z
            .string()
            .min(3, { message: "Name must be at least 3 characters" })
            .max(50, { message: "Name must not exceed 50 characters" })
            .regex(/^[a-zA-Z\s\u0600-\u06FF]+$/, {
                message: "Name can only contain letters and spaces",
            }),
        username: z
            .string()
            .min(3, { message: "Username must be at least 3 characters" })
            .max(20, { message: "Username must not exceed 20 characters" })
            .regex(/^[a-zA-Z0-9_-]+$/, {
                message: "Username can only contain letters, numbers, underscores, and hyphens",
            })
            .transform((val) => val.toLowerCase()),
        email: z
            .string()
            .min(1, { message: "Email is required" })
            .email({ message: "Invalid email address format" }),
        dateOfBirth: z
            .string()
            .min(1, { message: "Date of birth is required" })
            .refine((value) => differenceInYears(new Date(), new Date(value)) >= 13, 'At least 13YO')
            .refine((value) => new Date(value) <= new Date(), "Not in the future"),
        gender: z.enum(["male", "female"], {
            error: "Please select a gender",
        }),
        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters" })
            .max(64, { message: "Password is too long" })
            .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
            .regex(/[a-z]/, { message: "Must contain at least one lowercase letter" })
            .regex(/[0-9]/, { message: "Must contain at least one number" })
            .regex(/[^a-zA-Z0-9]/, {
                message: "Must contain at least one special character (!@#$%^&*)",
            }),
        rePassword: z
            .string()
            .min(1, { message: "Please confirm your password" })
    })
    .refine((data) => data.password === data.rePassword, {
        message: "Passwords do not match",
        path: ["rePassword"],
    });



export default function RegisterForm() {

    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState<boolean>(false)

    type RegisterFormValues = z.infer<typeof RegisterSchema>

    const { handleSubmit,
        register,
        formState: { errors },
        control
    } = useForm<RegisterFormValues>({
        defaultValues: {
            gender: 'male'
        },
        resolver: zodResolver(RegisterSchema),
        mode: "onTouched"
    })
    const [, setMsg] = useState<string | null>(null)

    // send data of all values in object to server
    function registerUser(regValues: RegisterFormValues) {
        // console.log(regValues);
        setIsLoading(true);
        signup(regValues)
            .then((data) => {
                setMsg(data.message);
                toast.success("Account created successfully!", {
                    description: data.message,
                });
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            })
            .catch((err) => {
                const errorMsg = err.response?.data?.message || "Something went wrong";
                setMsg(errorMsg);
                toast.error("Registration Failed", {
                    description: errorMsg,
                });
            })
            .finally(() => setIsLoading(false));
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-background py-8 px-4 sm:px-6 transition-colors duration-300">
            <Container>

                <div className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">

                    {/* Left Side*/}
                    <div className="hidden lg:flex flex-col justify-between p-10 bg-muted/30 border-r border-border relative">
                        <div>
                            {/* Slogan */}
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-sm">
                                    S
                                </div>
                                <span className="font-bold text-xl tracking-tight text-foreground">SocialPulse</span>
                            </div>

                            {/*features body*/}
                            <div className="space-y-6 max-w-lg pr-4">
                                <div>
                                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                                        Create your free account
                                    </h1>
                                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                                        Explore SocialPulse's core features for creators and communities.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <Card className="mx-auto w-full">
                                        <CardContent>
                                            <Collapsible defaultOpen className="rounded-md ">
                                                <CollapsibleTrigger render={<Button variant="ghost" className="w-full mb-5">Some features
                                                    <ChevronDownIcon className="ml-auto group-data-panel-open/button:rotate-180" /></Button>} />
                                                <CollapsibleContent className="flex flex-col items-start gap-5 p-2.5">
                                                    <div className="flex items-start gap-3">
                                                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                                        <div>
                                                            <h3 className="font-semibold text-foreground">Instant Sharing & Feeds</h3>
                                                            <p className="text-xs text-muted-foreground mt-0.5">Share your posts, photos, and thoughts with the world instantly.</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-3">
                                                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                                        <div>
                                                            <h3 className="font-semibold text-foreground">Real-time Engagement</h3>
                                                            <p className="text-xs text-muted-foreground mt-0.5">Connect securely with likes, comments, and direct messaging.</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-3">
                                                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                                        <div>
                                                            <h3 className="font-semibold text-foreground">Discover Communities</h3>
                                                            <p className="text-xs text-muted-foreground mt-0.5">Join niche interest groups and expand your professional network.</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-3">
                                                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                                        <div>
                                                            <h3 className="font-semibold text-foreground">Advanced Privacy Controls</h3>
                                                            <p className="text-xs text-muted-foreground mt-0.5">Manage who sees your content with fine-grained privacy settings.</p>
                                                        </div>
                                                    </div>
                                                </CollapsibleContent>
                                            </Collapsible>
                                        </CardContent>
                                    </Card>

                                </div>
                            </div>
                        </div>

                        {/* copyRights */}
                        <div className="text-xs text-muted-foreground">
                            © {new Date().getFullYear()} SocialPulse. All rights reserved.
                        </div>
                    </div>

                    {/* Right Side form register*/}
                    <form onSubmit={handleSubmit(registerUser)} className="p-6 sm:p-10 flex flex-col justify-center">
                        <FieldSet className="w-full">

                            <header className="text-center lg:text-left mb-6">
                                <h2 className="text-2xl font-bold tracking-tight text-foreground">Create an Account</h2>
                                <p className="text-sm text-muted-foreground mt-1">Fill out the form carefully for your social profile</p>
                            </header>

                            <FieldGroup className="space-y-3.5">
                                {/* Full Name */}
                                <Field>
                                    <FieldLabel htmlFor="name">Full Name</FieldLabel>
                                    <Input id="name" type="text" placeholder="Enter Your Name" {...register('name')} />
                                    {errors.name && <p className="text-xs text-destructive mt-1">
                                        {errors.name.message}
                                    </p>}
                                </Field>

                                {/* Username */}
                                <Field>
                                    <FieldLabel htmlFor="username">Username</FieldLabel>
                                    <Input id="username" type="text" placeholder="Enter Your Username" {...register('username')} />
                                    {errors.username && (
                                        <p className="text-xs text-destructive mt-1">
                                            {errors.username.message}
                                        </p>
                                    )}
                                </Field>

                                {/* Email */}
                                <Field>
                                    <FieldLabel htmlFor="email">Email</FieldLabel>
                                    <Input id="email" type="email" placeholder="name@example.com" {...register('email')} />
                                    {errors.email && (
                                        <p className="text-xs text-destructive mt-1">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </Field>

                                {/* Date Of Birth */}
                                <Field>
                                    <FieldLabel htmlFor="dateOfBirth">Date Of Birth</FieldLabel>
                                    <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} />
                                    {errors.dateOfBirth && (
                                        <p className="text-xs text-destructive mt-1">
                                            {errors.dateOfBirth.message}
                                        </p>
                                    )}
                                </Field>

                                {/* Gender */}
                                <div className="space-y-1.5 pt-1">
                                    <Label className="text-sm font-medium text-foreground">
                                        Gender
                                    </Label>
                                    <Controller
                                        name="gender"
                                        control={control}
                                        render={({ field }) => (
                                            <RadioGroup
                                                className="flex items-center gap-6"
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <div className="flex items-center space-x-2 space-x-reverse">
                                                    <RadioGroupItem value="male" id="male" />
                                                    <Label
                                                        htmlFor="male"
                                                        className="cursor-pointer font-normal mx-1 text-sm"
                                                    >
                                                        Male
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2 space-x-reverse">
                                                    <RadioGroupItem value="female" id="female" />
                                                    <Label
                                                        htmlFor="female"
                                                        className="cursor-pointer font-normal mx-1 text-sm"
                                                    >
                                                        Female
                                                    </Label>
                                                </div>
                                            </RadioGroup>
                                        )}
                                    />
                                    {errors.gender && (
                                        <p className="text-xs text-destructive mt-1">
                                            {errors.gender.message}
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
                                <Field>
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
                                    {errors.password && (
                                        <p className="text-xs text-destructive mt-1">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </Field>

                                {/* RePassword */}
                                <Field>
                                    <FieldLabel htmlFor="rePassword">Re-Password</FieldLabel>
                                    <Input id="rePassword" type="password" placeholder="••••••••" {...register('rePassword')} />
                                    {errors.rePassword && (
                                        <p className="text-xs text-destructive mt-1">
                                            {errors.rePassword.message}
                                        </p>
                                    )}
                                </Field>
                            </FieldGroup>

                            <Button type="submit" className="w-full mt-6 font-semibold py-2.5">
                                {isLoading === true ? <Loader className="animate-spin" /> : 'Create Account'}
                            </Button>

                            <p className="text-center text-sm text-muted-foreground mt-4">
                                Already have an account?
                                <Link
                                    to={'/login'}
                                    className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/80 transition-colors shadow-sm"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </FieldSet>
                    </form>

                </div>
            </Container>
        </div>
    );
}