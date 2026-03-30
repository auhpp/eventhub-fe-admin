import React from "react";
import ButtonBack from "@/components/ButtonBack";
import { formatDateTime } from "@/utils/format";
import ResalePostStatusBadge from "@/components/ResalePostStatusBadge";

export const PostHeader = ({ post }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-start gap-4">
            <div>
                <ButtonBack />
            </div>
            <div className="space-y-1">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-medium tracking-tight text-slate-900 dark:text-slate-100">
                        Chi tiết bài đăng bán lại vé #{post.id}
                    </h1>
                    <ResalePostStatusBadge status={post.status} />
                </div>
                <p className="text-sm text-muted-foreground">
                    Ngày tạo: {formatDateTime(post.createdAt)}
                </p>
            </div>
        </div>
    );
};