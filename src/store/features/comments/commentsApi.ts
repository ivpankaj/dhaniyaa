import { apiSlice } from '../../api/apiSlice';

export const commentsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getComments: builder.query({
            query: (ticketId) => ({ url: `/comments/${ticketId}`, method: 'GET' }),
            providesTags: (result, error, ticketId) => [{ type: 'Comment', id: `LIST-${ticketId}` }],
        }),
        createComment: builder.mutation({
            query: (body) => ({
                url: '/comments',
                method: 'POST',
                data: body,
            }),
            invalidatesTags: (result, error, { ticketId }) => [{ type: 'Comment', id: `LIST-${ticketId}` }],
        }),
    }),
});

export const {
    useGetCommentsQuery,
    useCreateCommentMutation,
} = commentsApi;
