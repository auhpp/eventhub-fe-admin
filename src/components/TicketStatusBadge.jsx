import { TicketStatus } from "@/utils/constant";
import { Badge } from "./ui/badge";

const TicketStatusBadge = ({ status }) => {
    const styles = {
        [TicketStatus.PENDING]: {
            color: "bg-yellow-100 text-yellow-700",
            label: "Chờ duyệt"
        },
        [TicketStatus.ACTIVE]: {
            color: "bg-green-100 text-green-700",
            label: "Đang bán"
        },
        [TicketStatus.INACTIVE]: {
            color: "bg-red-100 text-red-700",
            label: "Đã hủy"
        },


    };

    return <Badge variant="outline" className={styles[status].color} > {styles[status].label}</Badge>;


};

export default TicketStatusBadge