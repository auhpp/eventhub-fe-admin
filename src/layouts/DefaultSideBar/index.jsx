import React from "react";
import {
    UserCheck,
    Settings,
    Book,
    PlayCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { Link, useLocation } from "react-router-dom";

const DefaultSidebar = () => {
    const location = useLocation();
    const navItems = [
        { label: "Quản lý sự kiện", icon: Book, href: routes.eventManagement },
        { label: "Yêu cầu BTC", icon: UserCheck, href: routes.organizerRegistration },
        { label: "Danh mục", icon: PlayCircle, href: routes.category },
    ];

    return (
        <aside className="w-60 bg-card border-r border-border hidden lg:flex flex-col flex-shrink-0 h-screen sticky top-0">
            <div className="flex flex-col h-full p-4">

                {/* Logo Section */}
                <div className="flex items-center gap-3 px-2 mb-8 mt-2">
                    <div className="bg-primary rounded-xl size-10 shadow-sm flex items-center justify-center
                     text-primary-foreground font-bold text-xl">
                        EA
                    </div>
                    <h1 className="text-lg font-bold tracking-tight text-foreground">
                        EventAdmin
                    </h1>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-1.5 flex-1">
                    {navItems.map((item, index) => {
                        const isActive = location.pathname.startsWith(item.href);
                        return (
                            <Button
                                key={index}
                                variant={isActive ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start gap-3 h-10 font-medium",
                                    isActive
                                        ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary font-bold" // Custom active style
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                                asChild
                            >
                                <Link to={item.href}>
                                    <item.icon className={cn("size-5", isActive && "stroke-[2.5px]")} />

                                    {item.label}
                                </Link>
                            </Button>
                        )
                    }
                    )}
                </nav>

                {/* Bottom Actions */}
                <div className="mt-auto pt-4 border-t border-border">
                    <Button
                        variant={location.pathname.startsWith(routes.setting) ? "secondary" : "ghost"}
                        className={cn(
                            "w-full justify-start gap-3 h-10 font-medium",
                            location.pathname.startsWith(routes.setting)
                                ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary font-bold" // Custom active style
                                : "text-muted-foreground hover:text-foreground"
                        )}
                        asChild
                    >
                        <Link to={routes.setting}>
                            <Settings className={cn("size-5", location.pathname.startsWith(routes.setting) && "stroke-[2.5px]")} />
                            Cài đặt
                        </Link>
                    </Button>
                </div>
            </div>
        </aside>
    );
};

export default DefaultSidebar;