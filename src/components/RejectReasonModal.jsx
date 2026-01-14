import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";

const RejectReasonModal = ({ isOpen, onClose, onConfirm }) => {
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    const handleOpenChange = (open) => {
        if (!open) {
            setReason("");
            setError("");
            onClose();
        }
    };

    const handleConfirm = () => {
        if (!reason.trim()) {
            setError("Vui lòng nhập lý do từ chối.");
            return;
        }
        onConfirm(reason);
        setReason("");
        setError("");
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden rounded-xl">
                {/* Header */}
                <DialogHeader className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex flex-row items-center justify-between">
                    <DialogTitle className="text-lg font-bold text-gray-900 dark:text-white">
                        Từ chối yêu cầu đăng ký
                    </DialogTitle>
                </DialogHeader>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label
                            htmlFor="reason"
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                        >
                            Lý do từ chối <span className="text-red-500">*</span>
                        </Label>

                        <Textarea
                            id="reason"
                            placeholder="Nhập lý do cụ thể (ví dụ: Thông tin không chính xác, thiếu giấy tờ pháp lý...) để gửi thông báo cho người dùng"
                            className={`min-h-[120px] resize-none text-sm ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                            value={reason}
                            onChange={(e) => {
                                setReason(e.target.value);
                                if (e.target.value.trim()) setError("");
                            }}
                        />

                        {error && <p className="text-xs text-red-500 font-medium mt-1">{error}</p>}
                    </div>

                    {/* Info Note */}
                    <div className="flex items-start gap-2 text-gray-500 dark:text-gray-400">
                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <p className="text-xs">
                            Lý do này sẽ được gửi qua email cho người gửi yêu cầu.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <DialogFooter className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 flex flex-row justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={() => handleOpenChange(false)}
                        className="h-10 px-6 border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        className="h-10 px-6 bg-red-600 hover:bg-red-700 shadow-sm"
                    >
                        Xác nhận từ chối
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default RejectReasonModal;