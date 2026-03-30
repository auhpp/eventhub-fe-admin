import React from "react";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";

export const PricingAnalysis = ({ pricePerTicket, configs, minAllowedPrice, maxAllowedPrice, isPriceValid }) => {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                    Phân tích mức giá
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-3 border">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Giá người dùng đặt:</span>
                        <span className={`font-bold text-xl text-red-600`}>
                            {formatCurrency(pricePerTicket)}
                        </span>
                    </div>
                    <div className="w-full h-px bg-slate-200 dark:bg-slate-700 my-2"></div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Mức thấp nhất ({configs.minRate}%):</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(minAllowedPrice)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Mức cao nhất ({configs.maxRate}%):</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(maxAllowedPrice)}</span>
                        </div>
                    </div>

                    {!isPriceValid && (
                        <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100 flex items-start gap-1">
                            <AlertCircle size={14} className="shrink-0 mt-0.5" />
                            <span>Giá đặt bán không nằm trong biên độ quy định của hệ thống.</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between text-sm p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-lg border border-indigo-100 dark:border-indigo-800">
                    <span className="flex items-center gap-2"> Phí giao dịch sàn thu</span>
                    <span className="font-bold">{configs.commissionRate}%</span>
                </div>
            </CardContent>
        </Card>
    );
};