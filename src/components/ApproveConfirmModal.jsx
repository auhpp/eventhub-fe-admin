import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BadgeCheck } from "lucide-react";


export function ApproveConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    orgName,
}) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden rounded-2xl border-none shadow-2xl">
                <div className="p-6 bg-white dark:bg-slate-900">
                    <DialogHeader className="flex-row items-center gap-4 mb-4 space-y-0">
                        {/* Icon Circle */}
                        <div className="flex items-center justify-center w-12 h-12 flex-shrink-0 rounded-full bg-blue-50 dark:bg-blue-900/30">
                            <BadgeCheck className="w-6 h-6 text-[#135bec] dark:text-blue-400" />
                        </div>

                        <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                            Xác nhận phê duyệt
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <DialogDescription className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                            Bạn có chắc chắn muốn phê duyệt cho{" "}
                            <span className="font-bold text-gray-900 dark:text-white">
                                "{orgName}"
                            </span>{" "}
                            trở thành Ban tổ chức chính thức?
                        </DialogDescription>

                        {/* Note Box */}
                        <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 dark:bg-blue-900/10 dark:border-blue-800/50">
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                <span className="font-bold text-[#135bec] dark:text-blue-400">
                                    Lưu ý:
                                </span>{" "}
                                Sau khi phê duyệt, người dùng này sẽ có quyền tạo, quản lý sự
                                kiện và hệ thống sẽ tự động gửi email thông báo chúc mừng.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100 dark:bg-gray-800/50 dark:border-gray-700">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="border-gray-300 text-gray-700 font-bold hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="bg-[#135bec] hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20"
                    >
                        Xác nhận phê duyệt
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}