import React, { useEffect, useState } from "react";
import {
    Search, MoreVertical,

    Loader2,
    Plus
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateCategoryModal from "@/features/category/CreateCategoryModal";
import { createCategory, getCategorisPagination, } from "@/services/categoryService";
import { HttpStatusCode } from "axios";
import { useSearchParams } from "react-router-dom";
import DefaultPagination from "@/components/DefaultPagination";

const CategoryPage = () => {
    const [categories, setCategories] = useState(null)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false)
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") || "1");
    const pageSize = 2;

    useEffect(
        () => {
            const fetchCategories = async () => {
                try {
                    const response = await getCategorisPagination({ page: currentPage, size: pageSize })
                    if (response.code == HttpStatusCode.Ok) {
                        setCategories(response.result.data)
                        setTotalPages(response.result.totalPage);
                        setTotalElements(response.result.totalElements);
                    }
                } catch (error) {
                    console.log(error)
                }
            }
            fetchCategories()
        }, [isLoadingData, currentPage]
    )

    if (!categories) {
        return (
            <div className="flex justify-center items-center h-screen w-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const onSubmit = async (values, form, setImagePreview) => {
        setIsLoading(true);
        try {
            console.log(values)
            const response = await createCategory({ name: values.name, avatar: values.avatar[0], description: values.description })
            if (response.code == HttpStatusCode.Ok) {
                form.reset();
                setImagePreview(null);
                setShowCreateModal(false);
                setIsLoadingData(prev => !prev)
            }
        } catch (error) {
            console.error("Failed to create category", error);
        } finally {
            setIsLoading(false);
        }
    }
    return (

        <div className="p-2 md:p-6 space-y-6">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-end">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight">
                        Danh mục sự kiện
                    </h1>
                    <p className="text-muted-foreground text-base">
                        Quản lý danh sách danh mục sự kiện trong hệ thống
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={() => setShowCreateModal(true)}
                        className="gap-2 shadow-sm">
                        <Plus size={16} />
                        Thêm danh mục
                    </Button>
                </div>
            </div>


            {/* Filters & Actions Bar */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
                {/* Search Input */}
                <div className="relative flex-1 max-w-lg">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm theo tên..."
                        className="pl-9 bg-card"
                    />
                </div>

            </div>

            {/* Data Table */}
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="uppercase text-xs font-semibold">Ảnh</TableHead>
                            <TableHead className="uppercase text-xs font-semibold">Tên</TableHead>
                            <TableHead className="uppercase text-xs font-semibold">Mô tả</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((item) => (
                            <TableRow key={item.id} className="group hover:bg-muted/50">

                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="rounded-lg">
                                            <AvatarImage src={item.avatarUrl} alt={item.name} />
                                        </Avatar>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium flex items-center gap-2">
                                            {item.name}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-muted-foreground">
                                        {item.description}
                                    </span>
                                </TableCell>

                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                                    <MoreVertical size={18} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                    }}
                                                >Chỉnh sửa</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <DefaultPagination
                currentPage={currentPage}
                setSearchParams={setSearchParams}
                totalPages={totalPages}
                totalElements={totalElements}
                pageSize={pageSize}
            />
            <CreateCategoryModal
                isLoading={isLoading}
                onSubmit={onSubmit}
                open={showCreateModal}
                setOpen={setShowCreateModal}
                setIsLoading={setIsLoading}
            />
        </div>
    );
};

export default CategoryPage;