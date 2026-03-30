import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Badge } from "./ui/badge";

export const StatusBadge = ({ status }) => {
    switch (status) {
        case "PENDING":
            return (
                <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200 gap-1.5 whitespace-nowrap">
                    Chờ duyệt
                </Badge>
            );
        case "APPROVED":
            return (
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 gap-1.5 whitespace-nowrap">
                    Đã phê duyệt
                </Badge>
            );
        case "REJECTED":
            return (
                <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 gap-1.5 whitespace-nowrap">
                    Đã từ chối
                </Badge>
            );
        case "CANCELLED":
            return (
                <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 gap-1.5 whitespace-nowrap">
                    Đã hủy
                </Badge>
            );
        default:
            return <Badge variant="outline">Unknown</Badge>;
    }
};