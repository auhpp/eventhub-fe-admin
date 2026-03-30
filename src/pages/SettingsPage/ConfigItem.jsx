import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";

const ConfigItem = ({ config, loading, saving, suffix, icon, onSave }) => {
    const [value, setValue] = useState("");

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (config) setValue(config.value);
    }, [config]);

    if (loading) {
        return (
            <div className="flex items-center gap-4 py-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                </div>
            </div>
        );
    }

    if (!config) return null;

    return (
        <div className="flex flex-col sm:flex-row gap-4 sm:items-start justify-between group">
            <div className="flex gap-3 flex-1">
                <div className="flex items-center justify-center size-10 rounded-lg bg-secondary text-secondary-foreground">
                    {icon}
                </div>
                <div className="space-y-1">
                    <Label className="text-base font-semibold text-foreground">
                        {config.name}
                    </Label>
                    <p className="text-sm text-muted-foreground max-w-sm">
                        {config.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[12px]">
                            KEY: {config.key}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="flex items-start gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                <div className="relative w-full sm:w-40">
                    <Input
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="pr-10 font-bold text-right"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground select-none">
                        {suffix}
                    </span>
                </div>
                <Button
                    size="icon"
                    variant={value == config.value ? "outline" : "default"}
                    onClick={() => onSave(value)}
                    disabled={saving || value == config.value}
                    className="shrink-0 transition-all"
                >
                    {saving ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <Save className="size-4" />
                    )}
                </Button>
            </div>
        </div>
    );
};


export default ConfigItem