import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ChangePasswordSchema, type ChangePasswordFormData } from "@/lib/changePassword";
import { changeMyPassword } from "@/api/user.api";
import { useNavigate } from "react-router-dom";

export default function ChangePasswordForm() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(ChangePasswordSchema),
    });

    const { mutate, isPending } = useMutation({
        mutationFn: changeMyPassword,
        onSuccess: () => {
            toast.success("Password changed successfully! Please login with your new password. 🔐");
            localStorage.removeItem("token");
            setTimeout(() => {
                navigate("/logIn");
            }, 1000);
        },

    });

    const onSubmit = (data: ChangePasswordFormData) => {
        mutate(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border/60 rounded-xl p-6 space-y-4 shadow-sm w-full max-w-lg">
            <h2 className="text-lg font-bold text-foreground">Change Password</h2>

            {/* Current Password */}
            <div className="space-y-1.5">
                <Label htmlFor="password">Current Password</Label>
                <Input id="password" type="password" {...register("password")} />
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" {...register("newPassword")} />
                {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword.message}</p>}
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
                <Label htmlFor="rePassword">Confirm New Password</Label>
                <Input id="rePassword" type="password" {...register("rePassword")} />
                {errors.rePassword && <p className="text-xs text-destructive">{errors.rePassword.message}</p>}
            </div>

            {/* Submit Button */}
            <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Updating...
                    </>
                ) : (
                    "Update Password"
                )}
            </Button>
        </form>
    );
}