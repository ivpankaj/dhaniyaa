import { apiSlice } from '../../api/apiSlice';

export const sprintsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSprints: builder.query({
            query: ({ projectId }) => ({ url: `/sprints?projectId=${projectId}`, method: 'GET' }),
            providesTags: (result, error, { projectId }) =>
                result
                    ? [...result.map(({ _id }: any) => ({ type: 'Sprint' as const, id: _id })), { type: 'Sprint', id: 'LIST' }]
                    : [{ type: 'Sprint', id: 'LIST' }],
        }),
        createSprint: builder.mutation({
            query: (body) => ({
                url: '/sprints',
                method: 'POST',
                data: body,
            }),
            invalidatesTags: [{ type: 'Sprint', id: 'LIST' }],
        }),
        updateSprint: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/sprints/${id}`,
                method: 'PATCH',
                data: patch,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Sprint', id }],
        }),
    }),
});

export const {
    useGetSprintsQuery,
    useCreateSprintMutation,
    useUpdateSprintMutation,
} = sprintsApi;
