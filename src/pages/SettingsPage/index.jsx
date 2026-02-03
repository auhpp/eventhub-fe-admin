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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Save,
    Loader2,
    DollarSign,
    Percent,
    Calculator,
    Info,
    TrendingUp
} from "lucide-react";
import { toast } from "sonner";
import { getSystemConfigByKey, updateConfig } from "@/services/systemConfigurationService";
import { SystemConfigurationKey } from "@/utils/constant";
import { formatCurrency } from "@/utils/format";


const SettingsPage = () => {
    const [loading, setLoading] = useState(true);

    // Data configs
    const [commissionConfig, setCommissionConfig] = useState(null);
    const [fixedFeeConfig, setFixedFeeConfig] = useState(null);

    // Saving states
    const [savingCommission, setSavingCommission] = useState(false);
    const [savingFixedFee, setSavingFixedFee] = useState(false);

    const [previewTicketPrice, setPreviewTicketPrice] = useState(500000);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [commissionRes, fixedFeeRes] = await Promise.all([
                    getSystemConfigByKey({ key: SystemConfigurationKey.COMMISSION_RATE }),
                    getSystemConfigByKey({ key: SystemConfigurationKey.COMMISSION_FIXED_PER_TICKET }),
                ]);
                setCommissionConfig(commissionRes.result);
                setFixedFeeConfig(fixedFeeRes.result);
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
            console.log(error)
            toast.error("Lỗi cập nhật.");
        } finally {
            setSavingState(false);
        }
    };

    const simulationData = useMemo(() => {
        const rate = commissionConfig?.value || 0;
        const fixed = fixedFeeConfig?.value || 0;

        const commissionAmount = previewTicketPrice * (rate / 100);
        const totalSystemRevenue = commissionAmount + fixed;
        const organizerReceived = previewTicketPrice - totalSystemRevenue;

        return { commissionAmount, totalSystemRevenue, organizerReceived, rate, fixed };
    }, [previewTicketPrice, commissionConfig, fixedFeeConfig]);

    return (
        <div className="pb-10 max-w-6xl mx-auto space-y-6">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Cấu hình doanh thu</h1>
                    <p className="text-muted-foreground mt-1">
                        Thiết lập các khoản phí dịch vụ và hoa hồng áp dụng cho toàn bộ hệ thống.
                    </p>
                </div>
            </div>

            <Alert className="bg-primary/5 border-primary/20">
                <Info className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary font-semibold">Lưu ý quan trọng</AlertTitle>
                <AlertDescription className="text-primary/90">
                    Mọi thay đổi ở đây sẽ ảnh hưởng trực tiếp đến tính toán doanh thu của các sự kiện <strong>mới được tạo</strong> sau thời điểm lưu.
                </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* FORM CONFIG */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-border shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="size-5 text-blue-500" />
                                Tham số tính phí
                            </CardTitle>
                            <CardDescription>
                                Điều chỉnh các thông số đầu vào để tính toán doanh thu.
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
                </div>

                {/* PREVIEW */}
                <div className="lg:col-span-1">
                    <Card className="bg-muted/30 border-dashed sticky top-6">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Calculator className="size-5 text-orange-500" />
                                Mô phỏng doanh thu
                            </CardTitle>
                            <CardDescription>
                                Xem trước cách tính tiền trên một vé.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="preview-price">Giá vé giả định</Label>
                                <div className="relative">
                                    <Input
                                        id="preview-price"
                                        type="number"
                                        value={previewTicketPrice}
                                        onChange={(e) => setPreviewTicketPrice(Number(e.target.value))}
                                        className="bg-background pr-12 font-semibold"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">VNĐ</span>
                                </div>
                            </div>

                            <div className="rounded-lg border bg-card p-4 space-y-3 shadow-sm">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Hoa hồng ({simulationData.rate}%)</span>
                                    <span>{formatCurrency(simulationData.commissionAmount)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Phí cố định</span>
                                    <span>{formatCurrency(simulationData.fixed)}</span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between font-medium text-destructive">
                                    <span>Tổng phí hệ thống thu</span>
                                    <span>-{formatCurrency(simulationData.totalSystemRevenue)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-green-600 text-lg pt-1">
                                    <span>BTC thực nhận</span>
                                    <span>{formatCurrency(simulationData.organizerReceived)}</span>
                                </div>
                            </div>

                            <p className="text-xs text-center text-muted-foreground italic">
                                * Đây chỉ là con số ước tính dựa trên cấu hình hiện tại.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const ConfigItem = ({ config, loading, saving, suffix, icon, onSave }) => {
    const [value, setValue] = useState("");

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (config) setValue(config.value);
    }, [config]);

    if (loading) {
        return (
            <div className="flex items-center gap-4 py-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                </div>
            </div>
        );
    }

    if (!config) return null;

    return (
        <div className="flex flex-col sm:flex-row gap-4 sm:items-start justify-between group">
            <div className="flex gap-3 flex-1">
                <div className="flex items-center justify-center size-10 rounded-lg bg-secondary text-secondary-foreground">
                    {icon}
                </div>
                <div className="space-y-1">
                    <Label className="text-base font-semibold text-foreground">
                        {config.name}
                    </Label>
                    <p className="text-sm text-muted-foreground max-w-sm">
                        {config.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px] font-mono">
                            KEY: {config.key}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="flex items-start gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                <div className="relative w-full sm:w-40">
                    <Input
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="pr-10 font-bold text-right"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground select-none">
                        {suffix}
                    </span>
                </div>
                <Button
                    size="icon"
                    variant={value == config.value ? "outline" : "default"} 
                    onClick={() => onSave(value)}
                    disabled={saving || value == config.value}
                    className="shrink-0 transition-all"
                >
                    {saving ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <Save className="size-4" />
                    )}
                </Button>
            </div>
        </div>
    );
};

export default SettingsPage;