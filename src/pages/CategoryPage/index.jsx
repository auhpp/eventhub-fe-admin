import React, { useEffect, useState } from "react";
import {
    Search, MoreVertical,

    Loader2,
    Plus,
    Pencil,
    Trash2
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
import { createCategory, deleteCategory, getCategorisPagination, updateCategory, } from "@/services/categoryService";
import { HttpStatusCode } from "axios";
import { useSearchParams } from "react-router-dom";
import DefaultPagination from "@/components/DefaultPagination";
import ConfirmDialog from "@/components/ConfirmDialog";
import CategoryFormModal from "@/features/category/CategoryFormModal";
import { toast } from "sonner";
import { SortBy, SortOrder } from "@/utils/constant";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RefreshButton from "@/components/RefreshButton";

const CategoryPage = () => {
    const [categories, setCategories] = useState(null)
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false)

    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [deleteId, setDeleteId] = useState(null);

    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") || "1");
    const pageSize = 10;
    const sortOrderFilter = searchParams.get("sortOrder") || SortOrder.DESCENDING;
    const sortByFilter = searchParams.get("sortBy") || SortBy.FOLLOWER;
    const query = searchParams.get("query") || "";

    const fetchCategories = async () => {
        try {
            setIsLoading(true)
            const response = await getCategorisPagination({
                name: query,
                sortOrder: sortOrderFilter,
                sortBy: sortByFilter,
                page: currentPage, size: pageSize
            })
            if (response.code == HttpStatusCode.Ok) {
                setCategories(response.result.data)
                setTotalPages(response.result.totalPage);
                setTotalElements(response.result.totalElements);
            }

        } catch (error) {
            console.log(error)
        }
        finally {
            setIsLoading(false)
        }
    }
    useEffect(
        () => {
            fetchCategories()
        }, [isLoadingData, currentPage, sortOrderFilter, query, sortByFilter]
    )

    const handleCreate = () => {
        setSelectedCategory(null);
        setShowModal(true);
    };

    // Xử lý mở Modal Edit
    const handleEdit = (category) => {
        setSelectedCategory(category);
        setShowModal(true);
    };

    const handleFilterChange = (e, param) => {
        setSearchParams(params => {
            params.set(param, e);
            params.set("page", "1");
            return params;
        });
    }

    const handleSearchByName = (e) => {
        if (e.key === 'Enter') {
            setSearchParams(params => {
                params.set('query', e.target.value);
                params.set("page", "1");
                return params;
            });
        }
    };

    if (!categories || isLoading) {
        return (
            <div className="flex justify-center items-center h-screen w-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const onFormSubmit = async (values, form, setImagePreview) => {
        setIsLoading(true);
        try {
            let response;
            const payload = {
                name: values.name,
                description: values.description,
                avatar: values.avatar && values.avatar.length > 0 ? values.avatar[0] : null
            };

            if (selectedCategory) {
                // UPDATE
                response = await updateCategory({ id: selectedCategory.id, data: payload });
            } else {
                // CREATE
                response = await createCategory({ ...payload, avatar: values.avatar[0] });
            }

            if (response.code === HttpStatusCode.Ok) {
                form.reset();
                setImagePreview(null);
                setShowModal(false);
                setIsLoadingData(prev => !prev); // Refresh list

                toast.success("Cập nhật danh mục thành công!");
            }
        } catch (error) {
            console.error("Failed to save category", error);
            toast.error("Lỗi cập nhật danh mục!")
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            const response = await deleteCategory({ id: deleteId });
            if (response.code === HttpStatusCode.Ok) {
                setIsLoadingData(prev => !prev);
            }
        } catch (error) {
            console.error("Delete failed", error);
            toast.error("Không thể xóa danh mục này (có thể do đang chứa sự kiện).");
        } finally {
            setDeleteId(null);
        }
    };

    return (
        <div className="p-2 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-end">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black tracking-tight">Danh mục sự kiện</h1>
                    <p className="text-muted-foreground text-base">
                        Quản lý danh sách danh mục sự kiện trong hệ thống
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleCreate} className="gap-2 shadow-sm">
                        <Plus size={16} /> Thêm danh mục
                    </Button>
                    <RefreshButton
                        isLoading={isLoading}
                        onClick={fetchCategories}
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
                <div className="relative flex-1 max-w-lg">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Tìm kiếm theo tên..." className="pl-9 bg-card"
                        onKeyDown={handleSearchByName}
                        defaultValue={query}
                    />
                </div>
                <div className="flex gap-6">
                    <Select value={sortByFilter} onValueChange={(e) => handleFilterChange(e, "sortBy")} >
                        <SelectTrigger className="w-[180px] bg-card">
                            <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={SortBy.EVENT}>Sự kiện</SelectItem>
                            <SelectItem value={SortBy.FOLLOWER}>Lượt theo dõi</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={sortOrderFilter} onValueChange={(e) => handleFilterChange(e, "sortOrder")} >
                        <SelectTrigger className="w-[180px] bg-card">
                            <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={SortOrder.ASCENDING}>Tăng dần</SelectItem>
                            <SelectItem value={SortOrder.DESCENDING}>Giảm dần</SelectItem>
                        </SelectContent>
                    </Select>
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
                            <TableHead className="uppercase text-xs font-semibold">Theo dõi</TableHead>
                            <TableHead className="uppercase text-xs font-semibold">Sự kiện</TableHead>
                            <TableHead className="uppercase text-xs font-semibold text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((item) => (
                            <TableRow key={item.id} className="group hover:bg-muted/50">
                                <TableCell>
                                    <Avatar className="rounded-lg h-10 w-10">
                                        <AvatarImage src={item.avatarUrl} alt={item.name} className="object-cover" />
                                    </Avatar>
                                </TableCell>
                                <TableCell>
                                    <span className="font-medium">{item.name}</span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-muted-foreground line-clamp-1">
                                        {item.description}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <p className="text-center">{item.followerCount}</p>
                                </TableCell>
                                <TableCell>
                                    <p className="text-center">{item.eventCount}</p>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="icon" variant="ghost" className="h-8 w-8">
                                                <MoreVertical size={18} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEdit(item)} className="cursor-pointer">
                                                <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => setDeleteId(item.id)}
                                                className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" /> Xóa
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
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

            {/* Create/Edit Modal */}
            <CategoryFormModal
                isLoading={isLoading}
                onSubmit={onFormSubmit}
                open={showModal}
                setOpen={setShowModal}
                initialData={selectedCategory}
            />
            <ConfirmDialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
                onConfirm={handleDelete}
                title={"Bạn có chắc chắn muốn xóa?"}
                description={<>
                    Hành động này không thể hoàn tác. Danh mục này sẽ bị xóa khỏi hệ thống.
                    <br />
                    <span className="text-red-500 text-xs italic">Lưu ý: Không thể xóa danh mục đang chứa sự kiện.</span>
                </>}
                variant="destructive"
                confirmLabel="Xóa danh mục"
                cancelLabel="Hủy"
            />
        </div >
    );
};

export default CategoryPage;