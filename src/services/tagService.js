import API from "@/config/api"; 

export const createTag = async (data) => {
    const response = await API.post(`/api/v1/tag`, data, {
        requiresAuth: true
    });
    return response.data;
};


export const updateTag = async ({ id, data }) => {
    const response = await API.put(`/api/v1/tag/${id}`, data, {
        requiresAuth: true
    });
    return response.data;
};

export const deleteTag = async ({ id }) => {
    const response = await API.delete(`/api/v1/tag/${id}`, {
        requiresAuth: true
    });
    return response.data;
};

export const getAllTags = async (data = {}) => {
    const response = await API.post(`/api/v1/tag/all`, data, {
        requiresAuth: true
    });
    return response.data;
};

export const filterTags = async ({ page = 1, size = 10, ...searchData }) => {
    const response = await API.post(`/api/v1/tag/filter?page=${page}&size=${size}`, searchData, {
        requiresAuth: true
    });
    return response.data;
};