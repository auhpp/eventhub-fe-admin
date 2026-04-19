import { WithdrawalStatus } from "@/utils/constant";
import { Badge } from "./ui/badge";
import { Clock, CheckCircle2, ArrowRightLeft, XCircle } from "lucide-react";

const WithdrawalStatusBadge = ({ status }) => {
    const styles = {
        [WithdrawalStatus.PENDING]: {
            color: "bg-amber-100 text-amber-700 border-amber-200",
            label: "Chờ duyệt",
            icon: <Clock size={14} className="mr-1" />
        },
        [WithdrawalStatus.PROCESSING]: {
            color: "bg-blue-100 text-blue-700 border-blue-200",
            label: "Đang xử lý",
            icon: <ArrowRightLeft size={14} className="mr-1" />
        },
        [WithdrawalStatus.COMPLETED]: {
            color: "bg-emerald-100 text-emerald-700 border-emerald-200",
            label: "Thành công",
            icon: <CheckCircle2 size={14} className="mr-1" />
        },
        [WithdrawalStatus.REJECTED]: {
            color: "bg-red-100 text-red-700 border-red-200",
            label: "Bị từ chối",
            icon: <XCircle size={14} className="mr-1" />
        },
        [WithdrawalStatus.CANCELLED]: {
            color: "bg-slate-100 text-slate-700 border-slate-200",
            label: "Đã hủy",
            icon: <XCircle size={14} className="mr-1" />
        }
    };

    return (
        <Badge
            variant="outline"
            className={`${styles[status]?.color || 'bg-gray-100 text-gray-700'} text-sm px-3 py-1 font-medium border-transparent flex items-center w-fit`}
        >
            {styles[status]?.icon}
            {styles[status]?.label || status}
        </Badge>
    );
};

export default WithdrawalStatusBadge;