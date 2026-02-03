import API from "@/config/api";

export const getSystemConfigByKey = async ({ key }) => {
    const response = await API.get('/api/v1/system-config/' + key, {
        requiresAuth: true
    });
    return response.data;
};

export const updateConfig = async ({ id, data }) => {
    const response = await API.put(`/api/v1/system-config/${id}`, data, {
        requiresAuth: true
    });
    return response.data;
};
