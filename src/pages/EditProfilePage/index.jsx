import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Camera, Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthContext } from "@/context/AuthContex";
import { updateInfoUser } from "@/services/userService";
import { HttpStatusCode } from "axios";
import { toast } from "sonner";
import BoringAvatar from "boring-avatars";
import { useNavigate } from "react-router-dom";
import { routes } from "@/config/routes";
import ButtonBack from "@/components/ButtonBack";

const profileSchema = z.object({
    fullName: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
    phoneNumber: z.string().regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, "Số điện thoại không hợp lệ").optional().or(z.literal("")),
    avatar: z.any().optional(),
});

const EditProfilePage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [previewAvatar, setPreviewAvatar] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate()

    const form = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: "",
            phoneNumber: "",
            password: "",
            avatar: null,
        },
    });

    useEffect(() => {
        const fetchUserData = async () => {
            form.reset({
                fullName: user?.fullName ?? '',
                phoneNumber: user?.phoneNumber ?? '',
                email: user?.email,
            });
            setPreviewAvatar(user.avatar);
        };

        fetchUserData();
    }, [form, user]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewAvatar(url);
            form.setValue("avatar", file);
        }
    };

    const onSubmit = async (values) => {
        setIsLoading(true);
        try {
            const formData = new FormData();

            formData.append("fullName", values.fullName);

            if (values.phoneNumber) {
                formData.append("phoneNumber", values.phoneNumber);
            }

            if (values.avatar instanceof File) {
                formData.append("avatar", values.avatar);
            }

            const response = await updateInfoUser({ id: user.id, formData: formData })

            if (response.code == HttpStatusCode.Ok) {
                toast.success("Cập nhật tài khoản thành công");

            }

        } catch (error) {
            console.error(error);
            toast.error("Cập nhật tài khoản thất bại");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mb-4 ps-2 pt-2">
            <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                    <ButtonBack />
                    <div>
                        <p className=" text-2xl font-bold text-gray-900 ">Chỉnh sửa hồ sơ</p>
                        <p className="text-muted-foreground">
                            Cập nhật thông tin cá nhân và ảnh đại diện của bạn.
                        </p>

                    </div>
                </div>
                <Button type="button"
                    className={`w-full md:w-auto px-8 bg-slate-200 text-slate-800 hover:bg-slate-300`}
                    onClick={() => navigate(routes.changePassWord)}
                >
                    Đổi mật khẩu
                </Button>
            </div>

            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">


                        <div className="max-w-3xl  space-y-6 border p-6 rounded-lg mt-8">
                            {/* --- Avatar --- */}
                            <div className="flex flex-col items-center justify-center gap-4 mb-6">
                                <div className="relative group">
                                    <Avatar className="w-32 h-32 border-4 border-white shadow-md cursor-pointer">
                                        <AvatarImage src={previewAvatar} alt={user?.fullName} />
                                        <AvatarFallback className="bg-transparent p-0 overflow-hidden">
                                            <BoringAvatar size="100%" name={user?.email || 'default'} variant="marble" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-slate-900 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-[#0f4BC4] transition-all duration-200">
                                        <Camera size={18} />
                                        <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                                    </label>
                                </div>
                            </div>
                            {/* Full name */}
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Họ và tên</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nhập họ tên của bạn" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Email */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input readOnly={true} value={field.value || ''} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* Phone number */}
                                <FormField
                                    control={form.control}
                                    name="phoneNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Số điện thoại</FormLabel>
                                            <FormControl>
                                                <Input placeholder="" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {/* --- Button Submit --- */}
                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={isLoading} className={`w-full md:w-auto px-8 bg-primary`}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Đang lưu...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Lưu thay đổi
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>


                    </form>
                </Form>
            </div>
        </div>
    );
};

export default EditProfilePage;