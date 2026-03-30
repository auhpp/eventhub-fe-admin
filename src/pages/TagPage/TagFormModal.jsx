import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
const TagFormModal = ({ open, setOpen, onSubmit, isLoading, initialData }) => {
    const isEditMode = !!initialData;
    const form = useForm({
        defaultValues: {
            name: '',
            type: 'TOPIC' 
        }
    });

    useEffect(() => {
        if (open) {
            if (initialData) {
                form.reset({
                    name: initialData.name,
                    type: initialData.type
                });
            } else {
                form.reset({ name: '', type: 'TOPIC' });
            }
        }
    }, [open, initialData, form]);

    const handleSubmit = (values) => {
        onSubmit(values, form);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Chỉnh sửa thẻ' : 'Thêm thẻ mới'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tên thẻ <span className="text-red-500">*</span></label>
                        <Input
                            placeholder="Nhập tên thẻ..."
                            {...form.register("name", { required: true })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Loại thẻ <span className="text-red-500">*</span></label>
                        <Controller
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={isEditMode}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Chọn loại thẻ" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="TOPIC">Chủ đề (TOPIC)</SelectItem>
                                        <SelectItem value="CUSTOM">Tùy chỉnh (CUSTOM)</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {isEditMode && <p className="text-xs text-muted-foreground">Không thể thay đổi loại thẻ sau khi tạo.</p>}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Lưu thông tin
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default TagFormModal;