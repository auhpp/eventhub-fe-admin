import React, { useEffect, useState, useMemo } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    DollarSign,
    Percent,
    Calculator,
    Info,
    TrendingUp,
    RefreshCcw,
    ArrowDownToLine,
    ArrowUpToLine,
    Ticket,
    AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import { getSystemConfigByKey, updateConfig } from "@/services/systemConfigurationService";
import { SystemConfigurationKey } from "@/utils/constant";
import { formatCurrency } from "@/utils/format";
import ConfigItem from "./ConfigItem";

const SettingsPage = () => {
    const [loading, setLoading] = useState(true);

    // Data configs - Core
    const [commissionConfig, setCommissionConfig] = useState(null);
    const [fixedFeeConfig, setFixedFeeConfig] = useState(null);

    // Data configs - Resale
    const [minResaleRateConfig, setMinResaleRateConfig] = useState(null);
    const [maxResaleRateConfig, setMaxResaleRateConfig] = useState(null);
    const [resaleCommissionRateConfig, setResaleCommissionRateConfig] = useState(null);

    // Saving states - Core
    const [savingCommission, setSavingCommission] = useState(false);
    const [savingFixedFee, setSavingFixedFee] = useState(false);

    // Saving states - Resale
    const [savingMinResale, setSavingMinResale] = useState(false);
    const [savingMaxResale, setSavingMaxResale] = useState(false);
    const [savingResaleCommission, setSavingResaleCommission] = useState(false);

    // Preview States - Issue 
    const [previewTicketPrice, setPreviewTicketPrice] = useState(500000); 

    // Preview States - Resale )
    const [previewResaleBasePrice, setPreviewResaleBasePrice] = useState(500000); 
    const [previewResalePrice, setPreviewResalePrice] = useState(600000); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    commissionRes,
                    fixedFeeRes,
                    minResaleRes,
                    maxResaleRes,
                    resaleCommissionRes
                ] = await Promise.all([
                    getSystemConfigByKey({ key: SystemConfigurationKey.COMMISSION_RATE }),
                    getSystemConfigByKey({ key: SystemConfigurationKey.COMMISSION_FIXED_PER_TICKET }),
                    getSystemConfigByKey({ key: SystemConfigurationKey.MIN_RESALE_RATE || "MIN_RESALE_RATE" }),
                    getSystemConfigByKey({ key: SystemConfigurationKey.MAX_RESALE_RATE || "MAX_RESALE_RATE" }),
                    getSystemConfigByKey({ key: SystemConfigurationKey.RESALE_COMMISSION_RATE || "RESALE_COMMISSION_RATE" }),
                ]);

                setCommissionConfig(commissionRes.result);
                setFixedFeeConfig(fixedFeeRes.result);
                setMinResaleRateConfig(minResaleRes.result);
                setMaxResaleRateConfig(maxResaleRes.result);
                setResaleCommissionRateConfig(resaleCommissionRes.result);

            } catch (error) {
                toast.error("Không thể tải cấu hình hệ thống.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSave = async (config, newValue, setSavingState, setConfigState) => {
        if (!config) return;
        setSavingState(true);
        try {
            const payload = {
                value: parseFloat(newValue),
                name: config.name,
                description: config.description,
            };
            const updatedConfig = await updateConfig({ id: config.id, data: payload });
            setConfigState(updatedConfig.result);
            toast.success(`Đã cập nhật ${config.name}`);
        } catch (error) {
            console.log(error);
            toast.error("Lỗi cập nhật.");
        } finally {
            setSavingState(false);
        }
    };

    const issueSimulationData = useMemo(() => {
        const rate = commissionConfig?.value || 0;
        const fixed = fixedFeeConfig?.value || 0;

        const commissionAmount = previewTicketPrice * (rate / 100);
        const totalSystemRevenue = commissionAmount + fixed;
        const organizerReceived = previewTicketPrice - totalSystemRevenue;

        return { commissionAmount, totalSystemRevenue, organizerReceived, rate, fixed };
    }, [previewTicketPrice, commissionConfig, fixedFeeConfig]);

    const resaleSimulationData = useMemo(() => {
        const minRate = minResaleRateConfig?.value || 0;
        const maxRate = maxResaleRateConfig?.value || 0;
        const commissionRate = resaleCommissionRateConfig?.value || 0;

        const minAllowedPrice = previewResaleBasePrice * (minRate / 100);
        const maxAllowedPrice = previewResaleBasePrice * (maxRate / 100);

        const isValidPrice = previewResalePrice >= minAllowedPrice && previewResalePrice <= maxAllowedPrice;

        const systemFee = previewResalePrice * (commissionRate / 100);
        const sellerReceived = previewResalePrice - systemFee;

        return {
            minRate, maxRate, commissionRate,
            minAllowedPrice, maxAllowedPrice,
            systemFee, sellerReceived, isValidPrice
        };
    }, [previewResaleBasePrice, previewResalePrice, minResaleRateConfig, maxResaleRateConfig, resaleCommissionRateConfig]);

    return (
        <div className="pb-4 p-2 space-y-6">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Cấu hình doanh thu & Hệ thống</h1>
                    <p className="text-muted-foreground mt-1">
                        Thiết lập các khoản phí dịch vụ, hoa hồng và quy định bán lại vé áp dụng cho toàn bộ hệ thống.
                    </p>
                </div>
            </div>

            <Alert className="bg-primary/5 border-primary/20">
                <Info className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary font-semibold">Lưu ý quan trọng</AlertTitle>
                <AlertDescription className="text-primary/90">
                    Mọi thay đổi ở đây sẽ ảnh hưởng trực tiếp đến tính toán doanh thu của các sự kiện 
                    và giao dịch <strong>mới được tạo</strong> sau thời điểm lưu.
                </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* FORM CONFIGS */}
                <div className="lg:col-span-2 space-y-6">

                    <Card className="border-border shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="size-5 text-blue-500" />
                                Phí phát hành sự kiện
                            </CardTitle>
                            <CardDescription>
                                Điều chỉnh các thông số đầu vào để tính toán doanh thu từ Ban tổ chức.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <ConfigItem
                                config={commissionConfig}
                                loading={loading}
                                saving={savingCommission}
                                suffix="%"
                                icon={<Percent className="size-4" />}
                                onSave={(val) => handleSave(commissionConfig, val, setSavingCommission, setCommissionConfig)}
                            />
                            <Separator />
                            <ConfigItem
                                config={fixedFeeConfig}
                                loading={loading}
                                saving={savingFixedFee}
                                suffix="VNĐ"
                                icon={<DollarSign className="size-4" />}
                                onSave={(val) => handleSave(fixedFeeConfig, val, setSavingFixedFee, setFixedFeeConfig)}
                            />
                        </CardContent>
                    </Card>

                    {/* Resale */}
                    <Card className="border-border shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <RefreshCcw className="size-5 text-green-500" />
                                Cấu hình thị trường bán lại 
                            </CardTitle>
                            <CardDescription>
                                Quản lý tỷ lệ giá trần/sàn và phí dịch vụ khi người dùng bán lại vé cho nhau.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <ConfigItem
                                config={minResaleRateConfig}
                                loading={loading}
                                saving={savingMinResale}
                                suffix="%"
                                icon={<ArrowDownToLine className="size-4" />}
                                onSave={(val) => handleSave(minResaleRateConfig, val, setSavingMinResale, setMinResaleRateConfig)}
                            />
                            <Separator />
                            <ConfigItem
                                config={maxResaleRateConfig}
                                loading={loading}
                                saving={savingMaxResale}
                                suffix="%"
                                icon={<ArrowUpToLine className="size-4" />}
                                onSave={(val) => handleSave(maxResaleRateConfig, val, setSavingMaxResale, setMaxResaleRateConfig)}
                            />
                            <Separator />
                            <ConfigItem
                                config={resaleCommissionRateConfig}
                                loading={loading}
                                saving={savingResaleCommission}
                                suffix="%"
                                icon={<Ticket className="size-4" />}
                                onSave={(val) => handleSave(resaleCommissionRateConfig, 
                                    val, setSavingResaleCommission, setResaleCommissionRateConfig)}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* PREVIEW SECTION */}
                <div className="lg:col-span-1 space-y-6 sticky top-6">

                    <Card className="bg-muted/30 border-dashed">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Calculator className="size-5 text-orange-500" />
                                Mô phỏng phát hành
                            </CardTitle>
                            <CardDescription>
                                Tính toán tiền BTC nhận trên một vé.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="preview-price">Giá vé gốc</Label>
                                <div className="relative">
                                    <Input
                                        id="preview-price"
                                        type="number"
                                        value={previewTicketPrice}
                                        onChange={(e) => setPreviewTicketPrice(Number(e.target.value))}
                                        className="bg-background pr-12 font-semibold"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold 
                                    text-muted-foreground">VNĐ</span>
                                </div>
                            </div>

                            <div className="rounded-lg border bg-card p-4 space-y-3 shadow-sm">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Hoa hồng ({issueSimulationData.rate}%)</span>
                                    <span>{formatCurrency(issueSimulationData.commissionAmount)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Phí cố định</span>
                                    <span>{formatCurrency(issueSimulationData.fixed)}</span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between font-medium text-destructive">
                                    <span>Hệ thống thu</span>
                                    <span>-{formatCurrency(issueSimulationData.totalSystemRevenue)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-green-600 text-lg pt-1">
                                    <span>BTC nhận</span>
                                    <span>{formatCurrency(issueSimulationData.organizerReceived)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Resale*/}
                    <Card className="bg-muted/30 border-dashed">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <RefreshCcw className="size-5 text-indigo-500" />
                                Mô phỏng bán lại
                            </CardTitle>
                            <CardDescription>
                                Mô phỏng chi phí khi người dùng bán lại vé.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">

                            <div className="space-y-2">
                                <Label htmlFor="preview-resale-base">Giá vé gốc (làm mốc)</Label>
                                <div className="relative">
                                    <Input
                                        id="preview-resale-base"
                                        type="number"
                                        value={previewResaleBasePrice}
                                        onChange={(e) => setPreviewResaleBasePrice(Number(e.target.value))}
                                        className="bg-background pr-12 font-semibold text-muted-foreground"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold 
                                    text-muted-foreground">VNĐ</span>
                                </div>
                            </div>

                            <Separator className="my-1" />

                            <div className="flex flex-col gap-1 text-xs">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Giá sàn ({resaleSimulationData.minRate}%):</span>
                                    <span className="font-medium text-foreground">
                                        {formatCurrency(resaleSimulationData.minAllowedPrice)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Giá trần ({resaleSimulationData.maxRate}%):</span>
                                    <span className="font-medium text-foreground">
                                        {formatCurrency(resaleSimulationData.maxAllowedPrice)}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="preview-resale-price">Giá muốn bán lại</Label>
                                <div className="relative">
                                    <Input
                                        id="preview-resale-price"
                                        type="number"
                                        value={previewResalePrice}
                                        onChange={(e) => setPreviewResalePrice(Number(e.target.value))}
                                        className={`bg-background pr-12 font-semibold ${!resaleSimulationData.isValidPrice ? 
                                            'border-destructive focus-visible:ring-destructive' : ''}`}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold 
                                    text-muted-foreground">VNĐ</span>
                                </div>
                                {!resaleSimulationData.isValidPrice && (
                                    <div className="flex items-center gap-1.5 text-xs text-destructive mt-1">
                                        <AlertTriangle className="size-3" />
                                        <span>Giá bán lại vi phạm mức trần/sàn.</span>
                                    </div>
                                )}
                            </div>

                            <div className="rounded-lg border bg-card p-4 space-y-3 shadow-sm opacity-100 transition-opacity"
                             style={{ opacity: resaleSimulationData.isValidPrice ? 1 : 0.6 }}>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Phí dịch vụ ({resaleSimulationData.commissionRate}%)

                                    </span>
                                    <span className="text-destructive">-{formatCurrency(resaleSimulationData.systemFee)}</span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between font-bold text-blue-600 text-lg pt-1">
                                    <span>Người bán nhận</span>
                                    <span>{formatCurrency(resaleSimulationData.sellerReceived)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
};


export default SettingsPage;