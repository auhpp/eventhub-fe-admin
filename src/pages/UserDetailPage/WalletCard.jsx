import React from 'react';
import { Wallet } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const WalletCard = ({ walletData, title = "Ví người dùng" }) => {
    if (!walletData) return null;

    return (
        <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                    <Wallet size={18} className="text-blue-600" />
                    {title}
                </CardTitle>
            </CardHeader>

            <CardContent className="pt-5 space-y-4">
                {/* wallet type */}
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Loại ví</span>
                    <Badge variant="secondary" className="font-medium bg-slate-100 text-slate-700 hover:bg-slate-100">
                        {walletData.type === 'USER_WALLET' ? 'Ví Người Dùng' : 'Ví Ban Tổ Chức'}
                    </Badge>
                </div>

                {/* wallet status */}
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Trạng thái ví</span>
                    {walletData.status === 'ACTIVE' ? (
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none font-medium">
                            Đang hoạt động
                        </Badge>
                    ) : (
                        <Badge variant="destructive" className="font-medium">
                            Bị Khóa
                        </Badge>
                    )}
                </div>

                <Separator />

                {/* Balance Information */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Khả dụng</span>
                        <span className="font-bold text-emerald-600">
                            {formatCurrency(walletData.availableBalance)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Chờ đối soát</span>
                        <span className="font-semibold text-slate-700">
                            {formatCurrency(walletData.pendingBalance)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center p-2.5 bg-red-50 rounded-lg border border-red-100 mt-2">
                        <span className="text-sm text-red-600 font-medium">Đang đóng băng</span>
                        <span className="font-bold text-red-600">
                            {formatCurrency(walletData.lockedBalance)}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default WalletCard;