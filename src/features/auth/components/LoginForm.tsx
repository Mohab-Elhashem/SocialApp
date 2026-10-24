import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { login } from "@/api/auth";
import { useContext, useState } from "react";
import { Loader } from "lucide-react";
import { toast } from "sonner"; 
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthContext } from "@/context/AuthContext/AuthContext";

const LoginSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email address format" }),
    password: z
        .string()
        .min(1, { message: "Password is required" }),
});

export default function LoginForm() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    type LoginFormValues = z.infer<typeof LoginSchema>;

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(LoginSchema),
        mode: "onTouched",
    });

    const { setToken } = useContext(AuthContext)

    function loginUser(values: LoginFormValues) {
        setIsLoading(true);
        login(values)
            .then((data) => {
                toast.success("Welcome back!", {
                    description: data.message || "Logged in successfully",
                });
                if (data.data?.token) {
                    setToken(data.data?.token)
                    localStorage.setItem('token', data.data?.token)
                }
                setTimeout(() => {
                    navigate('/posts');
                }, 1500);
            })
            .catch((err) => {
                const errorMsg = err.response?.data?.message || "Invalid email or password";
                toast.error("Login Failed", {
                    description: errorMsg,
                });
            })
            .finally(() => setIsLoading(false));
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background py-8 px-4 sm:px-6 transition-colors duration-300">
            <Container className="max-w-md w-full">
                <form onSubmit={handleSubmit(loginUser)} className="p-6 sm:p-10 bg-card border border-border rounded-2xl shadow-xl flex flex-col justify-center">
                    <FieldSet className="w-full">
                        <header className="text-center mb-6">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome Back</h1>
                            <p className="text-sm text-muted-foreground mt-1">Enter your credentials to access your account</p>
                        </header>

                        <FieldGroup className="space-y-4">
                            {/* Email */}
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    {...register('email')}
                                />
                                {errors.email && (
                                    <p className="text-xs text-destructive mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </Field>

                            {/* Password */}
                            <Field>
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    {...register('password')}
                                />
                                {errors.password && (
                                    <p className="text-xs text-destructive mt-1">
                                        {errors.password.message}
                                    </p>
                                )}
                            </Field>
                        </FieldGroup>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-6 font-semibold py-2.5 flex items-center justify-center"
                        >
                            {isLoading ? <Loader className="animate-spin w-5 h-5" /> : 'Login'}
                        </Button>
                        <p className="text-center text-sm text-muted-foreground mt-4">
                            Don't have an account?
                            <Link
                                to={'/register'}
                                className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/80 transition-colors shadow-sm"
                            >
                                Sign Up
                            </Link>
                        </p>
                    </FieldSet>
                </form>
            </Container>
        </div>
    );
}