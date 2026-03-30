import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, User, Phone, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { confirmAdminUserAccount } from "@/services/userService";
import { routes } from "@/config/routes";
import { RequirementItem } from "./RequirementItem";

// 1. Zod Schema
const formSchema = z
    .object({
        email: z.string().email(),
        fullName: z.string().min(1, { message: "Vui lòng nhập họ và tên" }),
        phoneNumber: z.string().optional(),
        password: z
            .string()
            .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" })
            .regex(/[A-Z]/, { message: "Phải có ít nhất 1 chữ in hoa" })
            .regex(/[0-9]/, { message: "Phải có ít nhất 1 số" })
            .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Phải có ký tự đặc biệt" }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu xác nhận không khớp",
        path: ["confirmPassword"],
    });

const parseJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.log(e)
        return null;
    }
};

const ConfirmAdminUserPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("accessToken");

    const [isTokenInvalid, setIsTokenInvalid] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // 2. init form with react-hook-form
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            fullName: "",
            phoneNumber: "",
            password: "",
            confirmPassword: "",
        },
        mode: "onChange",
    });

    const passwordValue = form.watch("password") || "";
    const passwordCriteria = {
        length: passwordValue.length >= 8,
        uppercase: /[A-Z]/.test(passwordValue),
        number: /[0-9]/.test(passwordValue),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue),
    };

    // 3. handle token
    useEffect(() => {
        if (!token) {
            setIsTokenInvalid(true);
            return;
        }

        const decodedToken = parseJwt(token);
        if (decodedToken && decodedToken.sub) {
            form.setValue("email", decodedToken.sub);

            const currentTime = Math.floor(Date.now() / 1000);
            if (decodedToken.exp && decodedToken.exp < currentTime) {
                toast.error("Link kích hoạt đã hết hạn!");
                setIsTokenInvalid(true);
            }
        } else {
            setIsTokenInvalid(true);
        }
    }, [token, form]);

    // 4. submit
    const onSubmit = async (values) => {
        try {
            await confirmAdminUserAccount({
                email: values.email,
                fullName: values.fullName,
                phoneNumber: values.phoneNumber,
                password: values.password,
                token
            });

            toast.success("Kích hoạt tài khoản thành công! Vui lòng đăng nhập.");
            navigate(routes.signin);

        } catch (error) {
            console.error("Lỗi xác nhận tài khoản:", error);
            const errorCode = error.response?.data?.code;
            console.log(errorCode)
            if (errorCode === 1053) {
                toast.error("Tài khoản đã được kích hoạt!");
            } else if (error.response?.status === 401) {
                toast.error("Link kích hoạt không hợp lệ hoặc đã hết hạn!");
            } else {
                toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
            }
        }
    };

    if (isTokenInvalid) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
                <Card className="max-w-md w-full text-center py-8">
                    <CardHeader>
                        <CardTitle className="text-red-500 text-2xl">Đường dẫn không hợp lệ</CardTitle>
                        <CardDescription className="text-base mt-2">
                            Đường dẫn kích hoạt không tồn tại, đã bị sửa đổi hoặc đã hết hạn.
                            Vui lòng liên hệ quản trị viên để nhận link mới.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => navigate(routes.signin)} className="mt-4">
                            Quay về trang đăng nhập
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <Card className="max-w-lg w-full shadow-lg">
                <CardHeader className="space-y-2 text-center">
                    <CardTitle className="text-2xl font-bold">Hoàn tất thiết lập tài khoản</CardTitle>
                    <CardDescription>
                        Vui lòng nhập đầy đủ thông tin bên dưới để kích hoạt tài khoản Quản trị viên của bạn.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                            {/* Email Field (Read-only) */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="font-semibold">Email tài khoản</FormLabel>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled
                                                    className="pl-10 bg-slate-100 dark:bg-slate-800 cursor-not-allowed
                                                     text-muted-foreground"
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Full Name Field */}
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="font-semibold">Họ và tên <span 
                                        className="text-red-500">*</span></FormLabel>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Nhập họ và tên của bạn"
                                                    className="pl-10"
                                                    disabled={form.formState.isSubmitting}
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Phone Number Field */}
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="font-semibold">Số điện thoại</FormLabel>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Nhập số điện thoại"
                                                    className="pl-10"
                                                    disabled={form.formState.isSubmitting}
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
                                        <FormLabel className="font-semibold">Mật khẩu mới
                                             <span className="text-red-500">*</span></FormLabel>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Tối thiểu 8 ký tự"
                                                    className="pl-10 pr-10"
                                                    disabled={form.formState.isSubmitting}
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
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        <FormMessage />

                                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-900/50 dark:border-slate-800 mt-3 space-y-3">
                                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                Yêu cầu độ mạnh mật khẩu:
                                            </h4>
                                            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                                <RequirementItem met={passwordCriteria.length} text="Tối thiểu 8 ký tự" />
                                                <RequirementItem met={passwordCriteria.number} text="Ít nhất 1 số" />
                                                <RequirementItem met={passwordCriteria.uppercase} text="Ít nhất 1 chữ in hoa" />
                                                <RequirementItem met={passwordCriteria.special} text="Ký tự đặc biệt" />
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            {/* Confirm Password Field */}
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem className="space-y-2 pt-2">
                                        <FormLabel className="font-semibold">Xác nhận mật khẩu 
                                            <span className="text-red-500">*</span></FormLabel>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="Nhập lại mật khẩu"
                                                    className="pl-10 pr-10"
                                                    disabled={form.formState.isSubmitting}
                                                />
                                            </FormControl>
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> :
                                                 <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full mt-6"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang xử lý...</>
                                ) : (
                                    "Kích hoạt & Đăng nhập"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ConfirmAdminUserPage;