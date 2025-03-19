import { Head, useForm } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Link } from "@inertiajs/react";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="flex min-h-screen items-center justify-center">
                <Card className="w-[400px] shadow-lg">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">
                            Forgot Password
                        </CardTitle>
                        <CardDescription className="text-center">
                            Enter your email address and we'll send you a link
                            to reset your password
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {status && (
                            <div className="p-4 rounded-lg bg-green-50 text-sm text-green-600 border border-green-200">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    placeholder="name@example.com"
                                    className="w-full"
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.email}
                                    className="mt-1"
                                />
                            </div>

                            <Button className="w-full" disabled={processing}>
                                Send Reset Link
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter>
                        <div className="text-sm text-center w-full text-muted-foreground">
                            Remember your password?{" "}
                            <Link
                                href={route("login")}
                                className="text-primary hover:underline font-medium"
                            >
                                Back to login
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </GuestLayout>
    );
}
