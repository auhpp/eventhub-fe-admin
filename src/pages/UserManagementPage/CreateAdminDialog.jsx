import React, { useState, useEffect } from "react";
import { format, addHours, isBefore } from "date-fns";
import { vi } from "date-fns/locale";
import { Loader2, Mail, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner"; // Hoặc thư viện toast bạn đang dùng

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
// Giả sử bạn có component DateTimePicker, import đúng đường dẫn nhé
import { sendEmailCreateAdminUser } from "@/services/userService";
import { HttpStatusCode } from "axios";
import DateTimePicker from "@/components/DateTimePicker";

const CreateAdminDialog = ({ open, onOpenChange, onSuccess }) => {
    const [email, setEmail] = useState("");
    const [isResend, setIsResend] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Date Time States
    const [expireDuration, setExpireDuration] = useState("48"); // Mặc định 48h
    const [customExpireDate, setCustomExpireDate] = useState(null);
    const [calculatedExpiredAt, setCalculatedExpiredAt] = useState(null);

    // Tính toán thời gian hết hạn mỗi khi duration hoặc customDate thay đổi
    useEffect(() => {
        if (expireDuration === "custom") {
            setCalculatedExpiredAt(customExpireDate);
        } else {
            const hours = parseInt(expireDuration, 10);
            if (!isNaN(hours)) {
                setCalculatedExpiredAt(addHours(new Date(), hours));
            }
        }
    }, [expireDuration, customExpireDate]);

    // Reset form khi mở modal
    useEffect(() => {
        if (open) {
            setEmail("");
            setIsResend(false);
            setExpireDuration("48");
            setCustomExpireDate(null);
        }
    }, [open]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate cơ bản
        if (!email.trim()) {
            toast.error("Vui lòng nhập email hợp lệ!");
            return;
        }

        if (!calculatedExpiredAt) {
            toast.error("Vui lòng chọn thời gian hết hạn!");
            return;
        }

        if (isBefore(calculatedExpiredAt, new Date())) {
            toast.error("Thời gian hết hạn phải ở trong tương lai!");
            return;
        }

        try {
            setIsLoading(true);
            // Format datetime sang chuẩn ISO (hoặc chuẩn mà backend Spring Boot yêu cầu, ví dụ: "YYYY-MM-DDTHH:mm:ss")
            const formattedDateTime = format(calculatedExpiredAt, "yyyy-MM-dd'T'HH:mm:ss");

            const payload = {
                email: email.trim(),
                expireDateTime: formattedDateTime,
                resend: isResend
            };

            const res = await sendEmailCreateAdminUser(payload);
            console.log("res", res.code)
            if (res.code == HttpStatusCode.Ok) {
                toast.success(isResend ? "Đã gửi lại email mời thành công!" : "Đã gửi email tạo tài khoản Admin!");
                onOpenChange(false); // Đóng modal
                if (onSuccess) onSuccess(); // Gọi hàm refresh lại danh sách người dùng
            }

        } catch (error) {
            console.error("Lỗi gửi email admin:", error);
            // Xử lý lỗi từ backend (Ví dụ mã ErrorCode.EMAIL_ALREADY_EXISTS)
            const errorMsg = error.response.data.code == 1000 ? "Email đã tồn tại" : "Thời gian hết hạn không hợp lệ";
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Tạo tài khoản Quản trị viên</DialogTitle>
                    <DialogDescription>
                        Hệ thống sẽ gửi một email kèm link xác nhận đến địa chỉ này để thiết lập mật khẩu và kích hoạt tài khoản.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    {/* Input Email */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <div className="col-span-3 relative">
                            <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@example.com"
                                className="pl-9"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </div>
                    </div>

                    {/* Expired Time Logic (Đoạn code bạn cung cấp) */}
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right pt-2">Hạn xác nhận</Label>
                        <div className="col-span-3 space-y-2">
                            <Select
                                value={expireDuration}
                                onValueChange={setExpireDuration}
                                disabled={isLoading}
                            >
                                <SelectTrigger className="w-full">
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-muted-foreground" />
                                        <SelectValue placeholder="Chọn thời hạn" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="24">24 giờ tới</SelectItem>
                                    <SelectItem value="48">48 giờ tới (Mặc định)</SelectItem>
                                    <SelectItem value="72">3 ngày tới</SelectItem>
                                    <SelectItem value="168">1 tuần tới</SelectItem>
                                    <SelectItem value="custom">Tùy chọn ngày giờ...</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Input Custom Date */}
                            {expireDuration === 'custom' && (
                                <DateTimePicker
                                    onChange={(val) => setCustomExpireDate(val)}
                                    value={customExpireDate}
                                    disabled={isLoading}
                                />
                            )}

                            {calculatedExpiredAt && (
                                <div className="text-xs text-muted-foreground flex items-center gap-1.5 bg-muted/50 p-2 rounded">
                                    <AlertCircle size={12} />
                                    Link sẽ hết hạn lúc: <span className="font-semibold text-foreground">{format(calculatedExpiredAt, "HH:mm dd/MM/yyyy", { locale: vi })}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Checkbox Resend */}
                    <div className="grid grid-cols-4 items-start gap-4">
                        <div className="col-start-2 col-span-3">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="resend"
                                    checked={isResend}
                                    onCheckedChange={setIsResend}
                                    disabled={isLoading}
                                />
                                <Label
                                    htmlFor="resend"
                                    className="text-sm font-normal cursor-pointer leading-tight text-muted-foreground hover:text-foreground"
                                >
                                    Gửi lại link (Tích chọn nếu tài khoản đã tồn tại nhưng chưa được kích hoạt hoặc link cũ đã hết hạn).
                                </Label>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isResend ? "Gửi lại Email" : "Gửi Email Mời"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateAdminDialog;