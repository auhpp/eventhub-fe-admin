import React from "react";
import { CheckCircle, XCircle, Ban, Loader2, ShieldAlert, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ResalePostStatus } from "@/utils/constant";

export const ModerationActions = ({ post, isPriceValid, isProcessing, onApproveClick, onRejectClick, onCancelClick }) => {
    return (
        <Card className="border-slate-200 shadow-md ring-1 ring-slate-900/5">
            <CardHeader className="pb-3 bg-slate-50/50 dark:bg-slate-900/50 border-b">
                <CardTitle className="flex items-center gap-2 text-lg">
                    Kiểm duyệt bài đăng
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
                {post.status === ResalePostStatus.APPROVED && (
                    <Alert className="bg-green-50 text-green-800 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-800 font-bold">Đã duyệt</AlertTitle>
                        <AlertDescription>Bài đăng đang hiển thị cho người mua.</AlertDescription>
                    </Alert>
                )}

                {(post.status === ResalePostStatus.REJECTED || post.status === ResalePostStatus.CANCELLED_BY_ADMIN) 
                && (
                    <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
                        <Ban className="h-4 w-4" />
                        <AlertTitle className="font-bold">
                            {post.status === "REJECTED" ? "Đã từ chối" : "Đã bị Admin hủy"}
                        </AlertTitle>
                        <AlertDescription className="mt-1">
                            Lý do: <span className="font-semibold">{post.rejectionMessage || "Không có lý do"}</span>
                        </AlertDescription>
                    </Alert>
                )}

                {post.status === ResalePostStatus.CANCELLED_BY_USER && (
                    <Alert className="bg-slate-100 text-slate-800 border-slate-200">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle className="font-bold">Người bán đã hủy</AlertTitle>
                    </Alert>
                )}

                {post.status === ResalePostStatus.PENDING && (
                    <div className="space-y-3">
                        {!isPriceValid && (
                            <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                                <AlertCircle size={14} /> Mức giá vượt ngoài quy định, cân nhắc từ chối.
                            </p>
                        )}
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant="outline"
                                onClick={onRejectClick}
                                className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                            >
                                <XCircle className="w-4 h-4 mr-2" /> Từ chối
                            </Button>
                            <Button
                                onClick={onApproveClick}
                                disabled={isProcessing}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                                {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :
                                 <CheckCircle className="w-4 h-4 mr-2" />}
                                Phê duyệt
                            </Button>
                        </div>
                    </div>
                )}

                {post.status === "APPROVED" && (
                    <Button
                        variant="destructive"
                        className="w-full"
                        onClick={onCancelClick}
                    >
                        <Ban className="w-4 h-4 mr-2" /> Hủy bài đăng này
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};