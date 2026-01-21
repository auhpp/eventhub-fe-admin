import React, { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Percent, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export const ApproveEventModal = ({
    isOpen,
    onClose,
    onConfirm,
    defaultCommission = 5,
    defaultFixedFee = 5000,
    isLoading
}) => {
    const [commission, setCommission] = useState(defaultCommission);
    const [fixedFee, setFixedFee] = useState(defaultFixedFee);

    // Reset when open modal
    useEffect(() => {
        if (isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCommission(defaultCommission);
            setFixedFee(defaultFixedFee);
        }
    }, [isOpen, defaultCommission, defaultFixedFee]);



    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-emerald-600">
                        <CheckCircle className="w-5 h-5" />
                        Phê duyệt sự kiện
                    </DialogTitle>
                    <DialogDescription>
                        Thiết lập mức phí áp dụng cho sự kiện này.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Alert */}
                    <div className="bg-emerald-50 text-emerald-800 p-3 rounded-md text-sm 
                    border border-emerald-100 flex gap-2 items-start">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <p>
                            Sự kiện này sẽ được duyệt ngay lập tức.
                            Các mức phí dưới đây sẽ áp dụng cho sự kiện này (có thể chỉnh sửa sau).
                        </p>
                    </div>

                    {/* Form*/}
                    <div className="grid grid-cols-2 gap-4">
                        {/* 1. comission rate (%) */}
                        <div className="space-y-2">
                            <Label htmlFor="commission" className="text-right font-semibold">
                                Phí hoa hồng (%)
                            </Label>
                            <div className="relative">
                                <Input
                                    id="commission"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={commission}
                                    onChange={(e) => setCommission(e.target.value)}
                                    className="pl-9"
                                />
                                <Percent className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            </div>
                            <p className="text-xs text-muted-foreground">Phí xử lý trên mỗi vé bán ra.</p>
                        </div>

                        {/* 2. commission fixed (VNĐ) */}
                        <div className="space-y-2">
                            <Label htmlFor="fixedFee" className="text-right font-semibold">
                                Phí cố định / vé
                            </Label>
                            <div className="relative">
                                <Input
                                    id="fixedFee"
                                    type="number"
                                    min="0"
                                    step="1000"
                                    value={fixedFee}
                                    onChange={(e) => setFixedFee(e.target.value)}
                                    className="pl-9"
                                />
                                <Banknote className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-medium">VNĐ</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Phí xử lý trên mỗi vé bán ra.</p>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Hủy bỏ
                    </Button>
                    <Button
                        onClick={() => onConfirm(commission, fixedFee)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                        disabled={isLoading || commission < 0 || fixedFee < 0}
                    >
                        {isLoading ? "Đang xử lý..." : "Xác nhận & Duyệt"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};