import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import {
    Mail,
    Phone,
    CalendarDays,
    Clock,
    Shield,
    UserCircle,
    CheckCircle2,
    XCircle
} from "lucide-react";

import { getUserById, changeRole, changeStatus } from "@/services/userService";
import { RoleName } from "@/utils/constant";
import RoleNameBadge from "@/components/RoleNameBadge";
import UserStatusBadge from "@/components/UserStatusBadge";
import ConfirmDialog from "@/components/ConfirmDialog";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { HttpStatusCode } from "axios";
import ButtonBack from "@/components/ButtonBack";
import DefaultAvatar from "@/components/DefaultAvatar";
import { AuthContext } from "@/context/AuthContex";


const UserDetailPage = () => {
    const { id } = useParams();

    const { user: currentUser } = useContext(AuthContext);

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedRole, setSelectedRole] = useState("");
    const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const fetchUserDetail = async () => {
        try {
            setIsLoading(true);
            const data = await getUserById({ id });
            if (data.code == HttpStatusCode.Ok) {
                const resData = data.result
                setUser(resData);
                setSelectedRole(resData?.role?.name || "");
            }
        } catch (error) {
            toast.error("Không thể tải thông tin người dùng!");
            console.error("Fetch user error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchUserDetail();
    }, [id]);

    const handleConfirmChangeRole = async () => {
        try {
            setIsActionLoading(true);
            await changeRole({ id, roleName: selectedRole });
            toast.success("Thay đổi vai trò thành công!");
            setIsRoleDialogOpen(false);
            fetchUserDetail();
        } catch (error) {
            console.error("change role user error:", error);
            toast.error("Thay đổi vai trò thất bại!");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleConfirmChangeStatus = async () => {
        try {
            setIsActionLoading(true);
            const newStatus = !user.status;
            await changeStatus({ id, status: newStatus });
            toast.success("Cập nhật trạng thái thành công!");
            setIsStatusDialogOpen(false);
            fetchUserDetail();
        } catch (error) {
            console.error("change status user error:", error);
            toast.error("Cập nhật trạng thái thất bại!");
        } finally {
            setIsActionLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-6 max-w-6xl mx-auto space-y-6">
                <Skeleton className="h-10 w-32" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton className="h-[400px] rounded-xl" />
                    <Skeleton className="md:col-span-2 h-[400px] rounded-xl" />
                </div>
            </div>
        );
    }

    if (!user) {
        return <div className="p-6 text-center text-gray-500">Không tìm thấy người dùng!</div>;
    }

    const isCurrentUser = currentUser?.id === user?.id;

    return (
        <div className="flex-1 overflow-y-auto p-2 dark:bg-slate-950">
            <div className=" space-y-6">
                {/* Header Section */}
                <div className="flex items-center gap-4">
                    <ButtonBack />
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Chi tiết hồ sơ</h1>
                        <p className="text-sm text-slate-500">Quản lý thông tin và quyền hạn của người dùng</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Content left */}
                    <Card className="md:col-span-1 border-slate-200 shadow-sm">
                        <CardContent className="pt-6 flex flex-col items-center text-center">
                            <Avatar className="w-24 h-24 border-4 border-white shadow-md mb-4">
                                <DefaultAvatar user={user} />
                            </Avatar>
                            <h2 className="text-xl font-bold mb-1">{user.fullName}</h2>
                            <p className="text-sm text-slate-500 mb-4">{user.biography || "Chưa có tiểu sử"}</p>

                            <div className="flex flex-wrap gap-2 justify-center mb-6">
                                <RoleNameBadge roleName={user.role?.name} />
                                <UserStatusBadge status={user.status} />
                                {isCurrentUser && (
                                    <Badge variant="outline" className="bg-purple-100 text-purple-700">Tài khoản của bạn</Badge>
                                )}
                            </div>

                            <div className="w-full border-t border-slate-100 pt-4 space-y-3 text-left">
                                <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                    <Mail className="w-4 h-4 mr-3 text-slate-400" />
                                    <span className="truncate">{user.email}</span>
                                </div>
                                <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                    <Phone className="w-4 h-4 mr-3 text-slate-400" />
                                    {user.phoneNumber || "Chưa cập nhật"}
                                </div>
                                <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                    <CalendarDays className="w-4 h-4 mr-3 text-slate-400" />
                                    Tham gia: {user.createdAt ? format(new Date(user.createdAt), 'dd/MM/yyyy') : 'N/A'}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content right */}
                    <div className="md:col-span-2 space-y-6">

                        {/* Session 1: Hoạt động & Hệ thống */}
                        {!isCurrentUser && (
                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg">Hoạt động & Hệ thống</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Clock className="w-4 h-4 text-slate-500" />
                                            <span className="text-sm font-medium text-slate-500">Hoạt động cuối</span>
                                        </div>
                                        <p className="font-semibold mt-2">
                                            {user.lastSeen ? format(new Date(user.lastSeen), 'HH:mm - dd/MM/yyyy') : 'Không rõ'}
                                        </p>
                                    </div>

                                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg ">
                                        <div className="flex items-center gap-2 mb-2">
                                            <UserCircle className="w-4 h-4 text-slate-500" />
                                            <span className="text-sm font-medium text-slate-500">Sở thích / Chủ đề (Tags)</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {user.userTags && user.userTags.length > 0 ? (
                                                user.userTags.map(tag => (
                                                    <Badge key={tag.id} variant="secondary">
                                                        {tag.name}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <span className="text-sm text-slate-400 italic">Chưa có tag nào</span>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Session 2: Kiểm soát tài khoản*/}
                        <Card className="border-slate-200 shadow-sm ">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    Kiểm soát tài khoản
                                </CardTitle>
                                <CardDescription>Quản lý vai trò và quyền truy cập của người dùng này</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/*  Role */}
                                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 
                                    border rounded-lg ${isCurrentUser ? 'opacity-60' : ''}`}>
                                    <div>
                                        <h4 className="font-medium text-sm text-slate-900 dark:text-white">Thay đổi vai trò</h4>
                                        <p className="text-sm text-slate-500 mt-1">Gán quyền quản trị hoặc nhà tổ chức.</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Select
                                            value={selectedRole}
                                            onValueChange={setSelectedRole}
                                            disabled={isCurrentUser} 
                                        >
                                            <SelectTrigger className="w-[160px]">
                                                <SelectValue placeholder="Chọn vai trò" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={RoleName.ADMIN}>Quản trị viên</SelectItem>
                                                <SelectItem value={RoleName.ORGANIZER}>Nhà tổ chức</SelectItem>
                                                <SelectItem value={RoleName.USER}>Người dùng</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            variant="secondary"
                                            disabled={selectedRole === user.role?.name || isCurrentUser} 
                                            onClick={() => setIsRoleDialogOpen(true)}
                                        >
                                            Cập nhật
                                        </Button>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border
                                     rounded-lg bg-slate-50/50 dark:bg-slate-900/50 ${isCurrentUser ? 'opacity-60' : ''}`}>
                                    <div>
                                        <h4 className="font-medium text-sm text-slate-900 dark:text-white">
                                            Trạng thái tài khoản</h4>
                                        <p className="text-sm text-slate-500 mt-1">Vô hiệu hóa sẽ ngăn người này đăng nhập.</p>
                                    </div>
                                    <Button
                                        variant={user.status ? "destructive" : "default"}
                                        onClick={() => setIsStatusDialogOpen(true)}
                                        className="min-w-[160px]"
                                        disabled={isCurrentUser} 
                                    >
                                        {user.status ? (
                                            <><XCircle className="w-4 h-4 mr-2" /> Khóa tài khoản</>
                                        ) : (
                                            <><CheckCircle2 className="w-4 h-4 mr-2" /> Mở khóa tài khoản</>
                                        )}
                                    </Button>
                                </div>

                                {isCurrentUser && (
                                    <p className="text-sm text-orange-500 italic mt-2 text-center">
                                        * Bạn không thể tự thay đổi quyền hoặc khóa tài khoản của chính mình.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Dialogs */}
            <ConfirmDialog
                open={isRoleDialogOpen}
                onOpenChange={setIsRoleDialogOpen}
                title="Xác nhận thay đổi vai trò"
                description={`Bạn có chắc chắn muốn thay đổi vai trò của người dùng này thành quyền mới không? Hành động này sẽ ảnh hưởng đến quyền truy cập hệ thống của họ.`}
                confirmLabel="Xác nhận đổi"
                isLoading={isActionLoading}
                onConfirm={handleConfirmChangeRole}
            />

            <ConfirmDialog
                open={isStatusDialogOpen}
                onOpenChange={setIsStatusDialogOpen}
                variant={user?.status ? "destructive" : "default"}
                title={user?.status ? "Xác nhận khóa tài khoản" : "Xác nhận mở khóa tài khoản"}
                description={user?.status
                    ? `Người dùng ${user?.fullName} sẽ bị đăng xuất và không thể truy cập vào hệ thống cho đến khi được mở khóa trở lại.`
                    : `Tài khoản ${user?.fullName} sẽ được cấp phép hoạt động trở lại.`
                }
                confirmLabel="Xác nhận"
                isLoading={isActionLoading}
                onConfirm={handleConfirmChangeStatus}
            />
        </div>
    );
};

export default UserDetailPage;