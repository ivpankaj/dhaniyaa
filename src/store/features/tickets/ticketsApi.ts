import { apiSlice } from '../../api/apiSlice';

export const ticketsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTickets: builder.query({
            query: ({ projectId, sprintId }) => {
                let url = `/tickets?projectId=${projectId}&limit=100`;
                if (sprintId) url += `&sprintId=${sprintId}`;
                return { url, method: 'GET' };
            },
            providesTags: (result) =>
                result
                    ? [...result.map(({ _id }: any) => ({ type: 'Ticket' as const, id: _id })), { type: 'Ticket', id: 'LIST' }]
                    : [{ type: 'Ticket', id: 'LIST' }],
        }),
        getTicket: builder.query({
            query: (id) => ({ url: `/tickets/${id}`, method: 'GET' }),
            providesTags: (result, error, id) => [{ type: 'Ticket', id }],
        }),
        createTicket: builder.mutation({
            query: (body) => ({
                url: '/tickets',
                method: 'POST',
                data: body,
            }),
            invalidatesTags: ['Ticket'],
        }),
        updateTicket: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/tickets/${id}`,
                method: 'PATCH',
                data: patch,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Ticket', id }],
        }),
        updateTicketStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/tickets/${id}/status`,
                method: 'PATCH',
                data: { status },
            }),
            async onQueryStarted({ id, status, projectId, sprintId }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    ticketsApi.util.updateQueryData('getTickets', { projectId, sprintId }, (draft) => {
                        const ticket = draft.find((t: any) => t._id === id);
                        if (ticket) {
                            ticket.status = status;
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: (result, error, { id }) => [{ type: 'Ticket', id }],
        }),
        deleteTicket: builder.mutation({
            query: (id) => ({
                url: `/tickets/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Ticket'],
        }),
    }),
});

export const {
    useGetTicketsQuery,
    useGetTicketQuery,
    useCreateTicketMutation,
    useUpdateTicketMutation,
    useUpdateTicketStatusMutation,
    useDeleteTicketMutation,
} = ticketsApi;
