import React, { useEffect, useState } from "react";
import {
    Search, MoreVertical,
    Loader2,
    Plus,
    Pencil,
    Trash2,
    Filter
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HttpStatusCode } from "axios";
import { useSearchParams } from "react-router-dom";
import DefaultPagination from "@/components/DefaultPagination";
import ConfirmDialog from "@/components/ConfirmDialog";
import { toast } from "sonner";
import { createTag, deleteTag, filterTags, updateTag } from "@/services/tagService";
import TagFormModal from "./TagFormModal"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RefreshButton from "@/components/RefreshButton";

const TagPage = () => {
    const [tags, setTags] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingData, setIsLoadingData] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [selectedTag, setSelectedTag] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    // Filter states
    const typeFilter = searchParams.get("type") || 'ALL';
    const query = searchParams.get("query") || "";

    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);

    const currentPage = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("size") || "10");

    const fetchTags = async () => {
        try {
            const searchData = {};
            if (query) searchData.name = query;
            if (typeFilter !== "ALL") searchData.type = typeFilter;
            const response = await filterTags({
                page: currentPage,
                size: pageSize,
                ...searchData
            });

            if (response.code === HttpStatusCode.Ok) {
                setTags(response.result.data);
                setTotalPages(response.result.totalPage);
                setTotalElements(response.result.totalElements);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách thẻ", error);
            toast.error("Không thể tải danh sách thẻ");
        }
        finally{
            setIsLoading(false)
        }
    };

    useEffect(() => {
        fetchTags()
    }, [isLoadingData, currentPage, pageSize, query, typeFilter]);

    const handleCreate = () => {
        setSelectedTag(null);
        setShowModal(true);
    };

    const handleEdit = (tag) => {
        setSelectedTag(tag);
        setShowModal(true);
    };

    const onFormSubmit = async (values, form) => {
        setIsLoading(true);
        try {
            let response;
            if (selectedTag) {
                response = await updateTag({
                    id: selectedTag.id,
                    data: { name: values.name }
                });
            } else {
                response = await createTag({
                    name: values.name,
                    type: values.type
                });
            }

            if (response.code === HttpStatusCode.Ok) {
                form.reset();
                setShowModal(false);
                setIsLoadingData(prev => !prev); // Refresh list
                toast.success(selectedTag ? "Cập nhật thẻ thành công!" : "Tạo thẻ mới thành công!");
            }
        } catch (error) {
            console.error("Failed to save tag", error);
            toast.error("Lỗi khi lưu thông tin thẻ!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            const response = await deleteTag({ id: deleteId });
            if (response.code === HttpStatusCode.Ok) {
                setIsLoadingData(prev => !prev);
                toast.success("Đã xóa thẻ thành công!");
            }
        } catch (error) {
            console.error("Delete failed", error);
            toast.error("Không thể xóa thẻ này (có thể đang được sử dụng trong sự kiện).");
        } finally {
            setDeleteId(null);
        }
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

    if (!tags || isLoading) {
        return (
            <div className="flex justify-center items-center h-screen w-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-2 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-end">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black tracking-tight">Thẻ sự kiện (Tags)</h1>
                    <p className="text-muted-foreground text-base">
                        Quản lý danh sách các thẻ (topic, custom) để phân loại sự kiện
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleCreate} className="gap-2 shadow-sm">
                        <Plus size={16} /> Thêm Thẻ mới
                    </Button>
                    <RefreshButton
                        isLoading={isLoading}
                        onClick={fetchTags}
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm theo tên thẻ..."
                        className="pl-9 bg-card"
                        onKeyDown={handleSearchByName}
                        defaultValue={query}
                    />
                </div>
                <div className="flex gap-2 items-center">
                    <Select value={typeFilter} onValueChange={(e) => handleFilterChange(e, "type")}>
                        <SelectTrigger className="w-[180px] bg-card">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Tất cả các loại" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Tất cả các loại</SelectItem>
                            <SelectItem value="TOPIC">Chủ đề (TOPIC)</SelectItem>
                            <SelectItem value="CUSTOM">Tùy chỉnh (CUSTOM)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Data Table */}
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="uppercase text-xs font-semibold">Tên thẻ</TableHead>
                            <TableHead className="uppercase text-xs font-semibold">Đường dẫn (Slug)</TableHead>
                            <TableHead className="uppercase text-xs font-semibold">Loại</TableHead>
                            <TableHead className="uppercase text-xs font-semibold">Ngày tạo</TableHead>
                            <TableHead className="uppercase text-xs font-semibold text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tags.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    Không tìm thấy dữ liệu thẻ nào.
                                </TableCell>
                            </TableRow>
                        ) : tags.map((item) => (
                            <TableRow key={item.id} className="group hover:bg-muted/50">
                                <TableCell>
                                    <span className="font-medium ">{item.name}</span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-muted-foreground">
                                        {item.slug}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${item.type === 'TOPIC' ?
                                         'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {item.type}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm">
                                        {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                                    </span>
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
            {totalElements > 0 && (
                <DefaultPagination
                    currentPage={currentPage}
                    setSearchParams={setSearchParams}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    pageSize={pageSize}
                />
            )}

            {/* Create/Edit Modal */}
            <TagFormModal
                isLoading={isLoading}
                onSubmit={onFormSubmit}
                open={showModal}
                setOpen={setShowModal}
                initialData={selectedTag}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
                onConfirm={handleDelete}
                title={"Bạn có chắc chắn muốn xóa thẻ này?"}
                description={
                    <>
                        Hành động này không thể hoàn tác. Thẻ này sẽ bị xóa khỏi hệ thống.
                        <br />
                        <span className="text-red-500 text-xs italic">Lưu ý: Không thể xóa thẻ đang được đính kèm vào sự kiện.</span>
                    </>
                }
                variant="destructive"
                confirmLabel="Xóa thẻ"
                cancelLabel="Hủy"
            />
        </div>
    );
};

export default TagPage;