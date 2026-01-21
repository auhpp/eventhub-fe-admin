import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Plus, Save, UploadCloud, X } from 'lucide-react'; 
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
    name: z.string().min(1, { message: "Nhập tên danh mục" }),
    description: z.string().optional(),
    avatar: z
        .any()
        .refine((files) => files instanceof FileList && files.length > 0, {
            message: "Tải ảnh danh mục lên",
        }),
});

export default function CreateCategoryModal({ open, setOpen, onSubmit, isLoading }) {
    const [imagePreview, setImagePreview] = useState(null);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            avatar: undefined,
        },
    });

    const handleImageChange = (e, fieldChange) => {
        const file = e.target.files[0];
        if (file) {
            fieldChange(e.target.files);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const createCategory = (values) => {
        onSubmit(values, form, setImagePreview)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Tạo mới danh mục</DialogTitle>
                    <DialogDescription>
                        Thêm một danh mục mới cho hệ thống
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(createCategory)} className="space-y-4">

                        <FormField
                            control={form.control}
                            name="avatar"
                            // eslint-disable-next-line no-unused-vars
                            render={({ field: { value, onChange, ...fieldProps } }) => (
                                <FormItem className="flex flex-col items-center justify-center gap-3">
                                    <FormLabel className="text-center">
                                        Ảnh danh mục <span className="text-red-500">*</span>
                                    </FormLabel>

                                    <FormControl>
                                        <div className="relative group w-32 h-32 rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 bg-muted/30 flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden">
                                            {imagePreview ? (
                                                <>
                                                    <img
                                                        src={imagePreview}
                                                        alt="Avatar Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <UploadCloud className="w-8 h-8 text-white" />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
                                                    <span className="text-xs text-muted-foreground font-medium text-center px-2">
                                                        Tải ảnh lên
                                                    </span>
                                                </>
                                            )}

                                            <Input
                                                {...fieldProps}
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 opacity-0 cursor-pointer h-full w-full z-10"
                                                onChange={(e) => handleImageChange(e, onChange)}
                                            />
                                        </div>
                                    </FormControl>

                                    <FormMessage className="text-xs text-center" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Âm nhạc, Công nghệ..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mô tả</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Mô tả danh mục..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Hủy
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Save />
                                Lưu danh mục
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}