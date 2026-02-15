import { apiSlice } from '../../api/apiSlice';

export const projectsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProject: builder.query({
            query: (id) => ({ url: `/projects/${id}`, method: 'GET' }),
            providesTags: (result, error, id) => [{ type: 'Project', id }],
        }),
        getProjects: builder.query({
            query: () => ({ url: '/projects', method: 'GET' }),
            providesTags: ['Project'],
        }),
        createProject: builder.mutation({
            query: (body) => ({
                url: '/projects',
                method: 'POST',
                data: body,
            }),
            invalidatesTags: ['Project'],
        }),
        updateProject: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/projects/${id}`,
                method: 'PATCH',
                data: patch,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Project', id }],
        }),
    }),
});

export const {
    useGetProjectQuery,
    useGetProjectsQuery,
    useCreateProjectMutation,
    useUpdateProjectMutation,
} = projectsApi;
