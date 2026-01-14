import { Card, CardContent } from "./ui/card";

// eslint-disable-next-line no-unused-vars
export const StatCard = ({ title, count, badgeText, badgeColorClass, icon: Icon, iconColorClass }) => (
    <Card className="relative overflow-hidden group hover:shadow-md transition-shadow border-border">
        <CardContent className="p-6 flex flex-col justify-between h-32 relative z-10">
            <div>
                <p className="text-muted-foreground text-sm font-medium mb-1">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-bold text-foreground">{count}</h3>
                    {
                        badgeText != "" &&
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeColorClass}`}>
                            {badgeText}
                        </span>
                    }
                </div>
            </div>
        </CardContent>
        {/* Decorative Icon Background */}
        <div className={`absolute right-[-20px] top-[-20px] opacity-10 group-hover:opacity-20 transition-opacity ${iconColorClass}`}>
            <Icon size={120} />
        </div>
    </Card>
);
