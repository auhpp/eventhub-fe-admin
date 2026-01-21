import API from "@/config/api";

export const createCategory = async ({ name, avatar, description }) => {

    const formData = new FormData();

    formData.append('name', name);
    formData.append('avatar', avatar);
    formData.append('description', description);

    const response = await API.post('/api/v1/category',
        formData
        , {
            requiresAuth: true,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    return response.data;
};

export const getCategorisPagination = async ({ page, size }) => {
    const response = await API.get(`/api/v1/category?page=${page}&size=${size}`, {
        requiresAuth: true
    });
    return response.data;
};