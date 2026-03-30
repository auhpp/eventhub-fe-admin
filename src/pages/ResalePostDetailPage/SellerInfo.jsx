import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import DefaultAvatar from "@/components/DefaultAvatar";

export const SellerInfo = ({ user }) => {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                    Người đăng bán
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4 mt-2">
                    <Avatar>
                        <DefaultAvatar user={user} />
                    </Avatar>
                    <div>
                        <p className="font-bold text-base">{user?.fullName}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                </div>
                {user?.biography && (
                    <div className="mt-4 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-3 rounded-md italic border">
                        "{user.biography}"
                    </div>
                )}
            </CardContent>
        </Card>
    );
};