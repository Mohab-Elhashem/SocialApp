// import ChangePasswordForm from "@/components/ChangePasswordForm";

import ChangePasswordForm from "@/components/ChangePasswordForm";

export default function SettingsPage() {
    return (
        <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Account Settings</h1>
                <p className="text-sm text-muted-foreground">
                    Manage your account security, password, and preferences.
                </p>
            </div>

            <hr className="border-border/40" />

            <ChangePasswordForm />
        </div>
    );
}