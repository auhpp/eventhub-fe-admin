import { Badge } from "./ui/badge";

const UserStatusBadge = ({ status }) => {
    const styles = {
        [true]: {
            color: "bg-green-100 text-green-700",
            label: "Hoạt động"
        },
        [false]: {
            color: "bg-gray-100 text-gray-700",
            label: "Không hoạt động"
        },

    };

    return <Badge variant="outline" className={styles[status].color} > {styles[status].label}</Badge>;


};

export default UserStatusBadge