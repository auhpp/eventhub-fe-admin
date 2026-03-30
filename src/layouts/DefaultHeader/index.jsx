import React, { useContext } from "react";
import { Bell, Loader2, LogOut, User } from "lucide-react";
import { AuthContext } from "@/context/AuthContex";
import { Avatar } from "@/components/ui/avatar";
import DefaultAvatar from "@/components/DefaultAvatar";
import { Link } from "react-router-dom";
import { routes } from "@/config/routes";


const DefaultHeader = () => {
    const { user, isLoading, logoutAuth } = useContext(AuthContext)

    const handleLogout = () => {
        if (logoutAuth) logoutAuth();
    };

    return (
        <header className="h-16 bg-card border-b border-border flex items-center justify-end px-6 shrink-0 transition-colors sticky top-0 z-20">
            <div className="flex items-center gap-2">
                {/* Notifications */}
                <button className="relative p-2 text-muted-foreground hover:bg-accent rounded-full transition-colors">
                    <Bell size={24} />
                    <span className="absolute top-2 right-2 size-2 bg-destructive rounded-full border-2 border-card"></span>
                </button>

                {/* Divider */}
                <div className="h-8 w-[1px] bg-border mx-1"></div>

                {/* User Profile */}
                <div className="flex items-center gap-3">
                    {
                        isLoading ? (
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        ) : (
                            <>
                                {/* --- USER DROPDOWN SECTION --- */}
                                <div className="group relative">
                                    {/* Avatar Trigger */}
                                    <div className="relative flex items-center gap-2 cursor-pointer py-1
                                     hover:bg-gray-100 px-1 rounded-lg">
                                        <Avatar className="h-9 w-9 rounded-full border border-gray-200 
                                        bg-gray-100 overflow-hidden
                                         flex items-center justify-center transition-all">
                                            <DefaultAvatar user={user} />
                                        </Avatar>
                                        <div>
                                            <span className="text-sm font-medium text-gray-700 hidden lg:block 
                                        max-w-[300px] truncate">
                                                {user.fullName || "Tài khoản"}
                                            </span>
                                            <span className="text-sm text-muted-foreground hidden lg:block 
                                        max-w-[300px] truncate">
                                                {user.email}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Dropdown Menu Popup */}
                                    <div className="absolute right-0 top-full mt-1 w-60 origin-top-right rounded-xl border border-gray-200
                                     bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible 
                                     group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2
                                      group-hover:translate-y-0 z-50">
                                        <Link to={routes.profile} className="flex items-center gap-3 rounded-lg
                                         px-3 py-2.5 text-sm font-medium 
                                        text-gray-700 hover:bg-gray-100 hover:text-brand transition-colors">
                                            <User className="h-4 w-4" />
                                            Tài khoản của tôi
                                        </Link>

                                        <div className="my-1 border-t border-gray-100"></div>

                                        <button
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium 
                                            text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Đăng xuất
                                        </button>
                                    </div>
                                </div>
                                {/* --- END USER DROPDOWN --- */}
                            </>
                        )
                    }

                </div>
            </div>
        </header>
    );
};

export default DefaultHeader