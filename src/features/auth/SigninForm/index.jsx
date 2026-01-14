import React, { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HttpStatusCode } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "@/config/routes";
import { authenticate, getCurrentUserInfo } from "@/services/authenticationService";
import { AuthContext } from "@/context/AuthContex";

const signinFormSchema = z
    .object({
        email: z
            .string()
            .min(1, { message: "Vui lòng nhập email" })
            .email({ message: "Email không hợp lệ" }),
        password: z
            .string()
            .min(1, { message: "Vui lòng nhập mật khẩu" })
    })

export default function SigninForm() {
    const [showPassword, setShowPassword] = useState(false);
    const togglePassword = () => setShowPassword(!showPassword);
    const navigate = useNavigate()
    const { setUser } = useContext(AuthContext)
    const form = useForm({
        resolver: zodResolver(signinFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onChange",
    })

    const onSubmit = async (values) => {
        console.log("Dữ liệu hợp lệ:", values);
        try {
            const data = await authenticate({ email: values.email, password: values.password })
            console.log("login response", data)
            if (data.code == HttpStatusCode.Ok) {
                localStorage.setItem('access_token', data.result.accessToken);
                const userInfoResponse = await getCurrentUserInfo();
                if (userInfoResponse.code == HttpStatusCode.Ok) {
                    setUser(userInfoResponse.result)
                }
                navigate(routes.home, { replace: true })
            }
        } catch (error) {
            console.log(error)
            form.setError("email", {
                type: "manual",
                message: "Email hoặc mật khẩu không chính xác",
            });
            form.setError("password", {
                type: "manual",
                message: "Email hoặc mật khẩu không chính xác",
            });
            form.setFocus("email");
            form.setValue("email", "");
            form.setValue("password", "");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Email Field */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="font-semibold">Email</FormLabel>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <FormControl>
                                    <Input
                                        id="email"
                                        placeholder="nhapemail@example.com"
                                        className="pl-10 h-12 rounded-xl bg-white dark:bg-slate-950 focus-visible:ring-brand"
                                        {...field}
                                    />
                                </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Password Field */}
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <div className="flex items-center justify-between">
                                <FormLabel className="font-semibold">Mật khẩu</FormLabel>
                                <Link
                                    to={""}
                                    className="text-xs font-bold text-brand hover:text-brand-dark transition-colors"
                                >
                                    Quên mật khẩu?
                                </Link>
                            </div>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <FormControl>
                                    <Input
                                        id="password"
                                        placeholder="Nhập mật khẩu mới"
                                        type={showPassword ? "text" : "password"}
                                        className="pl-10 pr-10 h-12 rounded-xl bg-white dark:bg-slate-950 focus-visible:ring-brand"
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            if (form.getValues("confirmPassword")) {
                                                form.trigger("confirmPassword");
                                            }
                                        }}
                                    />
                                </FormControl>
                                <button
                                    type="button"
                                    onClick={togglePassword}
                                    className="absolute right-3 top-2.5 text-gray-500 hover:text-brand transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Submit Button */}
                <Button
                    disabled={form.formState.isSubmitting}
                    className="w-full h-12 text-md font-bold rounded-xl bg-brand hover:bg-brand-dark shadow-lg shadow-brand/20"
                >
                    {form.formState.isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang xác thực...
                        </>
                    ) : (
                        "Đăng nhập"
                    )}
                </Button>


            </form>
        </Form>
    );
}