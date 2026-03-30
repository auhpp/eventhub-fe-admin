import { RoleName } from "@/utils/constant";
import { Badge } from "./ui/badge";

const RoleNameBadge = ({ roleName }) => {
    const styles = {
        [RoleName.ADMIN]: {
            color: "bg-yellow-100 text-yellow-700",
            label: "Quản trị viên"
        },
        [RoleName.ORGANIZER]: {
            color: "bg-gray-100 text-gray-700",
            label: "Nhà tổ chức"
        },
        [RoleName.USER]: {
            color: "bg-blue-100 text-blue-700",
            label: "Người dùng"
        },

    };

    return <Badge variant="outline" className={styles[roleName].color} > {styles[roleName].label}</Badge>;


};

export default RoleNameBadge