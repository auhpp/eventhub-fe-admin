import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWithdrawalRequestById, updateWithdrawalRequest } from '@/services/withdrawalRequestService';
import { getWalletById } from '@/services/walletService';
import { formatDateTime, formatCurrency } from '@/utils/format';
import { ArrowLeft, AlertCircle, CheckCircle2, XCircle, Info, ArrowRightLeft, Loader2, Wallet, FileText, Landmark } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import ConfirmDialog from '@/components/ConfirmDialog';
import RejectReasonModal from '@/components/RejectReasonModal';
import WithdrawalStatusBadge from '@/components/WithdrawalStatusBadge';
import { WithdrawalStatus } from '@/utils/constant';
import { toast } from 'sonner';

const statusLabels = {
    PENDING: 'Chờ duyệt',
    PROCESSING: 'Đang xử lý',
    COMPLETED: 'Thành công',
    REJECTED: 'Bị từ chối',
    CANCELLED: 'Đã hủy'
};

const WithdrawalDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [requestData, setRequestData] = useState(null);
    const [walletData, setWalletData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isProcessingAction, setIsProcessingAction] = useState(false);

    const [proofImage, setProofImage] = useState(null);
    const [adminNote, setAdminNote] = useState('');
    const [uploadError, setUploadError] = useState('');

    const fetchDetailAndWallet = async () => {
        setIsLoading(true);
        try {
            const reqRes = await getWithdrawalRequestById(id);
            const requestInfo = reqRes.result || reqRes;
            setRequestData(requestInfo);

            if (requestInfo?.wallet?.id) {
                const walletRes = await getWalletById(requestInfo.wallet.id);
                setWalletData(walletRes.result || walletRes);
            }
        } catch (err) {
            console.error(err);
            setError("Không thể tải dữ liệu. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchDetailAndWallet();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setUploadError("Kích thước ảnh không được vượt quá 5MB");
                setProofImage(null);
            } else {
                setUploadError("");
                setProofImage(file);
            }
        }
    };

    const submitStatusUpdate = async (status, note, file = null) => {
        setIsProcessingAction(true);
        try {
            await updateWithdrawalRequest({
                id,
                data: {
                    status: status,
                    adminNote: note,
                    proofImage: file
                }
            });
            toast.success(`Đã cập nhật trạng thái thành: ${statusLabels[status] || status}`);
            fetchDetailAndWallet();

            setIsRejectModalOpen(false);
            setIsConfirmModalOpen(false);
            setProofImage(null);
            setAdminNote('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.');
        } finally {
            setIsProcessingAction(false);
        }
    };

    const handleStartProcessing = async () => {
        const isConfirm = window.confirm("Bạn có muốn chuyển yêu cầu này sang trạng thái Đang xử lý không?");
        if (isConfirm) {
            submitStatusUpdate(WithdrawalStatus.PROCESSING, 'Đang tiến hành kiểm tra và chuyển khoản.');
        }
    };

    const handleReject = (reason) => {
        submitStatusUpdate(WithdrawalStatus.REJECTED, reason);
    };

    const handleConfirmSuccess = () => {
        if (!proofImage) {
            setUploadError("Vui lòng tải lên ảnh hóa đơn chuyển khoản (Bắt buộc).");
            return;
        }
        submitStatusUpdate(WithdrawalStatus.COMPLETED, adminNote, proofImage);
    };

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>;
    if (!requestData) return <div className="p-8 text-center text-red-500">Không tìm thấy yêu cầu rút tiền này.</div>;

    const isPending = requestData.status === WithdrawalStatus.PENDING;
    const isProcessingStatus = requestData.status === WithdrawalStatus.PROCESSING;
    const isProcessable = isPending || isProcessingStatus;

    return (
        <div className="space-y-6 pb-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="h-9 w-9 flex-shrink-0 hover:bg-slate-100">
                    <ArrowLeft size={18} />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center flex-wrap gap-3">
                        Chi tiết yêu cầu rút tiền #{requestData.id}
                        <WithdrawalStatusBadge status={requestData.status} />
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                        <Info size={14} /> Tạo lúc: {formatDateTime(requestData.createdAt)}
                    </p>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 border border-red-200">
                    <AlertCircle size={18} />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* transaction details */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="shadow-sm border-slate-200 overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                                Thông tin nhận tiền
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">

                            {/* basic information */}
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                    <span className="text-slate-500 text-sm font-medium">Người yêu cầu</span>
                                    <div>
                                        <p className="text-slate-800 font-medium">{requestData.wallet?.appUser?.fullName || "N/A"}</p>
                                        <p className="text-slate-800">{requestData.wallet?.appUser?.email || "N/A"}</p>
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                    <span className="text-slate-500 text-sm font-medium">Số tiền rút</span>
                                    <span className="text-2xl font-bold text-blue-600">{formatCurrency(requestData.amount)}</span>
                                </div>
                            </div>

                            {/* bank details */}
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                                <div className="flex items-center gap-2 mb-2 text-slate-800 font-semibold">
                                    Chi tiết tài khoản đích
                                </div>

                                <div className="grid grid-cols-[110px_1fr] sm:grid-cols-[130px_1fr] gap-3 text-sm">
                                    <span className="text-slate-500">Ngân hàng:</span>
                                    <span className="font-bold text-slate-800 uppercase">{requestData.bankCode}</span>

                                    <span className="text-slate-500">Số tài khoản:</span>
                                    <span className="font-mono font-bold text-slate-800 text-base">{requestData.bankAccountNo}</span>

                                    <span className="text-slate-500">Tên người nhận:</span>
                                    <span className="font-bold text-slate-800 uppercase">{requestData.bankAccountName}</span>
                                </div>
                            </div>

                        </CardContent>
                    </Card>

                    {/* notes of admin */}
                    {!isProcessable && (requestData.adminNote || requestData.proofImageUrl) && (
                        <Card className={`shadow-sm ${requestData.status === WithdrawalStatus.REJECTED || requestData.status === WithdrawalStatus.CANCELLED ? 'border-red-200 bg-red-50/30' : 'border-emerald-200 bg-emerald-50/30'}`}>
                            <CardHeader className="pb-3 border-b border-transparent">
                                <CardTitle className={`text-base flex items-center gap-2 ${requestData.status === WithdrawalStatus.REJECTED || requestData.status === WithdrawalStatus.CANCELLED ? 'text-red-700' : 'text-emerald-700'}`}>
                                    <Info size={18} /> Phản hồi từ quản trị viên
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-5">
                                {requestData.adminNote && (
                                    <div>
                                        <Label className="text-slate-600 font-semibold">Ghi chú xử lý:</Label>
                                        <div className="mt-2 p-3 bg-white/60 border border-slate-200 rounded-lg text-sm text-slate-800 leading-relaxed">
                                            {requestData.adminNote}
                                        </div>
                                    </div>
                                )}
                                {requestData.proofImageUrl && (
                                    <div>
                                        <Label className="text-slate-600 font-semibold mb-2 block">Chứng từ chuyển khoản:</Label>
                                        <a href={requestData.proofImageUrl} target="_blank" rel="noreferrer" className="inline-block border border-slate-200 rounded-lg p-1 bg-white hover:shadow-md transition-all">
                                            <img
                                                src={requestData.proofImageUrl}
                                                alt="Proof"
                                                className="h-48 object-contain rounded-md"
                                            />
                                        </a>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* wallet information and action box */}
                <div className="lg:col-span-1 space-y-6">

                    {/* wallet information */}
                    {walletData && (
                        <Card className="shadow-sm border-slate-200">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                                <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                                    <Wallet size={18} className="text-blue-600" /> Ví người dùng
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-5 space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-medium">Loại ví</span>
                                    <Badge variant="secondary" className="font-medium bg-slate-100 text-slate-700 hover:bg-slate-100">
                                        {walletData.type === 'USER_WALLET' ? 'Ví Người Dùng' : 'Ví Nhà Tổ Chức'}
                                    </Badge>
                                </div>
                                <Separator />

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-500">Khả dụng</span>
                                        <span className="font-bold text-emerald-600">{formatCurrency(walletData.availableBalance)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-500">Chờ đối soát</span>
                                        <span className="font-semibold text-slate-700">{formatCurrency(walletData.pendingBalance)}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-2.5 bg-red-50 rounded-lg border border-red-100 mt-2">
                                        <span className="text-sm text-red-600 font-medium">Đang đóng băng</span>
                                        <span className="font-bold text-red-600">{formatCurrency(walletData.lockedBalance)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* action box */}
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-base text-center text-slate-800">Bảng điều khiển</CardTitle>
                            <CardDescription className="text-center text-sm mt-1">
                                Cập nhật tiến độ giải ngân
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {isProcessable ? (
                                <div className="flex flex-col gap-3">
                                    {isPending && (
                                        <Button
                                            onClick={handleStartProcessing}
                                            disabled={isProcessingAction || walletData?.status === 'LOCKED'}
                                            className="w-full bg-blue-600 hover:bg-blue-700 h-11 font-medium shadow-sm transition-all"
                                        >
                                            {isProcessingAction ? <Loader2 className="animate-spin mr-2" size={18} /> : <ArrowRightLeft className="mr-2" size={18} />}
                                            Bắt đầu xử lý
                                        </Button>
                                    )}

                                    {isProcessingStatus && (
                                        <Button
                                            onClick={() => setIsConfirmModalOpen(true)}
                                            disabled={isProcessingAction || walletData?.status === 'LOCKED'}
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 font-medium shadow-sm transition-all"
                                        >
                                            <CheckCircle2 className="mr-2" size={18} /> Xác nhận đã chuyển tiền
                                        </Button>
                                    )}

                                    <div className="relative flex items-center py-2">
                                        <div className="flex-grow border-t border-slate-100"></div>
                                        <span className="flex-shrink-0 mx-4 text-xs text-slate-400 font-medium">HOẶC</span>
                                        <div className="flex-grow border-t border-slate-100"></div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        onClick={() => setIsRejectModalOpen(true)}
                                        disabled={isProcessingAction}
                                        className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 h-11 font-medium transition-all"
                                    >
                                        <XCircle className="mr-2" size={18} /> Từ chối yêu cầu
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center py-6 bg-slate-50 rounded-xl border border-slate-100">
                                    {requestData.status === 'COMPLETED' ? (
                                        <CheckCircle2 size={48} className="mx-auto mb-3 text-emerald-500 bg-emerald-100 p-2 rounded-full" />
                                    ) : (
                                        <XCircle size={48} className="mx-auto mb-3 text-red-400 bg-red-100 p-2 rounded-full" />
                                    )}
                                    <p className="text-sm font-semibold text-slate-700">Yêu cầu này đã hoàn tất xử lý.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <RejectReasonModal
                isOpen={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                onConfirm={handleReject}
                title="Từ chối yêu cầu rút tiền"
            />

            <ConfirmDialog
                open={isConfirmModalOpen}
                onOpenChange={setIsConfirmModalOpen}
                onConfirm={handleConfirmSuccess}
                title="Xác nhận hoàn tất chuyển khoản"
                description={
                    <div className="mt-4 space-y-4 text-left">
                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                            <p className="text-sm text-blue-800 leading-relaxed">
                                Bạn xác nhận đã chuyển số tiền <strong className="text-blue-700">{formatCurrency(requestData.amount)}</strong> đến tài khoản <strong className="text-blue-700">{requestData.bankAccountNo}</strong> ({requestData.bankCode})?
                            </p>
                        </div>

                        <div className="space-y-2 pt-2">
                            <Label className="text-slate-800 font-semibold text-sm">Tải lên hóa đơn (Bắt buộc) <span className="text-red-500">*</span></Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="cursor-pointer border-slate-300"
                            />
                            {uploadError && <p className="text-xs text-red-500 font-medium">{uploadError}</p>}
                            {proofImage && <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium"><CheckCircle2 size={12} /> Đã chọn file: {proofImage.name}</p>}
                        </div>

                        <div className="space-y-2 pb-2">
                            <Label className="text-slate-800 font-semibold text-sm">Ghi chú thêm (Tùy chọn)</Label>
                            <Input
                                placeholder="VD: Đã CK qua số lệnh giao dịch #12345"
                                value={adminNote}
                                onChange={(e) => setAdminNote(e.target.value)}
                                className="border-slate-300"
                            />
                        </div>
                    </div>
                }
                confirmLabel="Hoàn tất & Cập nhật"
                cancelLabel="Quay lại"
                isLoading={isProcessingAction}
            />
        </div>
    );
};

export default WithdrawalDetailPage;