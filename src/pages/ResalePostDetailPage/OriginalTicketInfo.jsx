import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDateTime } from "@/utils/format";

export const OriginalTicketInfo = ({ ticketInfo, event, eventSession }) => {
    return (
        <Card>
            <CardHeader className="px-6 py-4 border-b">
                <CardTitle className="flex items-center gap-2 text-xl">
                    Thông tin vé gốc
                </CardTitle>
            </CardHeader>
            <CardContent className="px-6 py-4 space-y-4">
                {ticketInfo ? (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground mb-1">Tên loại vé</p>
                            <p className="font-semibold text-base">{ticketInfo.name}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground mb-1">Giá vé niêm yết</p>
                            <p className="font-semibold text-base text-blue-600">{formatCurrency(ticketInfo.price)}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground mb-1">Sự kiện</p>
                            <p className="font-semibold">{event?.name}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground mb-1">Khung giờ</p>
                            <div>
                                <p className="font-semibold">
                                    {eventSession?.startDateTime ? formatDateTime(eventSession.startDateTime) : "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-muted-foreground italic">Không tìm thấy dữ liệu vé gốc.</p>
                )}
            </CardContent>
        </Card>
    );
};