import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AttendeeStatusBadge from "@/components/AttendeeStatusBadge";

export const ResaleTicketList = ({ post }) => {
    return (
        <Card>
            <CardHeader className="px-6 py-4 border-b">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        Danh sách vé đang bán ({post.attendees?.length || 0} vé)
                    </CardTitle>
                    <Badge variant={post.hasRetail ? "secondary" : "default"}
                        className={post.hasRetail ? "bg-blue-100 text-blue-700" : ""}>
                        {post.hasRetail ? "Bán lẻ" : "Không bán lẻ"}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                        <TableRow>
                            <TableHead className="w-[300px] ps-6">ID Vé</TableHead>
                            <TableHead>Trạng thái</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {post.attendees?.map((attendee) => (
                            <TableRow key={attendee.id}>
                                <TableCell className="font-medium ps-6">#{attendee.id}</TableCell>
                                <TableCell><AttendeeStatusBadge status={attendee.status} /></TableCell>
                            </TableRow>
                        ))}
                        {(!post.attendees || post.attendees.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center py-6 text-muted-foreground">Không có dữ liệu vé.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};