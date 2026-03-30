import { ResalePostStatus } from "@/utils/constant";
import { Badge } from "./ui/badge";

const ResalePostStatusBadge = ({ status }) => {
    const styles = {
        [ResalePostStatus.PENDING]: {
            color: "bg-yellow-100 text-yellow-700",
            label: "Chờ duyệt"
        },
        [ResalePostStatus.APPROVED]: {
            color: "bg-green-100 text-green-700",
            label: "Đã duyệt"
        },
        [ResalePostStatus.REJECTED]: {
            color: "bg-red-100 text-red-700",
            label: "Đã từ chối"
        },
        [ResalePostStatus.SOLD]: {
            color: "bg-blue-100 text-blue-700",
            label: "Đã bán hết"
        },
        [ResalePostStatus.CANCELLED_BY_ADMIN]: {
            color: "bg-gray-100 text-gray-700",
            label: "Admin hủy"
        },
        [ResalePostStatus.CANCELLED_BY_USER]: {
            color: "bg-gray-100 text-gray-700",
            label: "Người dùng hủy"
        },

    };

    return <Badge variant="outline" className={styles[status].color} > {styles[status].label}</Badge>;


};

export default ResalePostStatusBadge