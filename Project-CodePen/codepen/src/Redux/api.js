import { createApi } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';

export const api = createApi({
    baseQuery: graphqlRequestBaseQuery({
        url: '/graphql',
        prepareHeaders(headers, { getState }) {
            const { token } = getState().auth;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: ({ login, password }) => ({
                document: `
                    query login($login: String!, $password: String!) {
                        login(login: $login, password: $password)
                    }
                `,
                variables: { login, password }
            })
        }),
        register: builder.mutation({
            query: ({ login, password }) => ({
                document: `
                    mutation Register($login: String!, $password: String!) {
                        createUser(login: $login, password: $password) {
                            _id
                            login
                        }
                    }
                `,
                variables: { login, password }
            })
        }),
        ChangePassword: builder.mutation({
            query: ({ login, password, newPassword }) => ({
                document: `
                    mutation ChangePassword($login: String!, $password: String!, $newPassword: String!) {
                        changePassword(login: $login, password: $password, newPassword: $newPassword) {
                            _id
                            login
                        }
                    }
                `,
                variables: { login, password, newPassword }
            })
        }),
        Snippets: builder.query({
            query: ({ skip, searchQuery }) => ({
                document: `
                    query Snippets($query: String) {
                        SnippetFind(query: $query) {
                            _id
                            owner {
                                login
                                avatar {
                                    url
                                }
                                _id
                            }
                            createdAt
                            title
                            description
                            files {
                                name
                                type
                                text
                            }
                        }
                    }
                `,
                variables: {
                    query: JSON.stringify([
                        searchQuery ? { title: { $regex: `^${searchQuery}`, $options: 'i' } } : {},
                        { sort: [{ _id: -1 }], skip: [skip], limit: [20] }
                    ])
                }
            }),
            providesTags: ({ skip }) => [{ type: 'Snippet', id: skip }]
        }),
        SnippetOne: builder.query({
            query: ({ _id }) => ({
                document: `
                    query SnippetOne($query: String) {
                        SnippetFindOne(query: $query) {
                            _id
                            owner {
                                _id
                                login
                                avatar { url }
                            }
                            createdAt
                            title
                            description
                            files {
                                name
                                type
                                text
                            }
                            comments {
                                owner { _id login avatar { url } }
                                createdAt
                                text
                            }
                        }
                    }
                `,
                variables: { query: JSON.stringify([{ _id }]) }
            }),
            providesTags: ({ _id }) => [{ type: 'Snippet', id: _id }]
        }),
        User: builder.query({
            query: ({ _id }) => ({
                document: `
                    query User($query: String) {
                        UserFindOne(query: $query) {
                            _id
                            createdAt
                            login
                            avatar {
                                url
                                originalFileName
                                text
                            }
                        }
                    }
                `,
                variables: { query: JSON.stringify([{ _id }]) }
            }),
            providesTags: ({ _id }) => [{ type: 'User', id: _id }]
        }),
        UserSnippets: builder.query({
            query: ({ _id }) => ({
                document: `
                    query UserSnippets($query: String) {
                        SnippetFind(query: $query) {
                            _id
                            owner { login avatar { url } _id }
                            createdAt
                            title
                            description
                            files { name type text }
                        }
                    }
                `,
                variables: { query: JSON.stringify([{ ___owner: _id }, { sort: [{ _id: -1 }]}]) }
            }),
            providesTags: ({ _id }) => [{ type: 'UserSnippets', id: _id }]
        }),
        UpdateSnippet: builder.mutation({
            query: ({ _id, title, description, files }) => ({
                document: `
                    mutation UpdateSnippet($_id: ID!, $title: String!, $description: String!, $files: [FileInput!]!) {
                        SnippetUpsert(
                            snippet: {
                                _id: $_id
                                title: $title
                                description: $description
                                files: $files
                            }
                        ) {
                            _id
                            title
                            description
                            files {
                                type
                                text
                            }
                        }
                    }
                `,
                variables: { _id, title, description, files }
            }),
            invalidatesTags: ({ _id }) => [{ type: 'Snippet', id: _id },{ type: 'UserSnippets' }]
        }),
        CreateSnippet: builder.mutation({
            query: ({ title, description, files }) => ({
                document: `
                    mutation CreateSnippet($title: String!, $description: String!, $files: [FileInput!]!) {
                        SnippetUpsert(
                            snippet: {
                                title: $title
                                description: $description
                                files: $files
                            }
                        ) {
                            _id
                            title
                            description
                            files {
                                type
                                text
                            }
                        }
                    }
                `,
                variables: { title, description, files }
            }),
            invalidatesTags: [{ type: 'UserSnippets' }]
        }),
        ChangeImage: builder.mutation({
            query: ({ image }) => ({
                document: `
                    mutation UpdateImage($image: ImageInput!) {
                        ImageUpsert(image: $image) {
                            _id
                            url
                            owner {
                                login
                            }
                        }
                    }
                `,
                variables: { image }
            }),
            invalidatesTags: (result) => [
                { type: 'User', id: result?.owner?._id },
                { type: 'UserSnippets', id: result?.owner?._id },
                { type: 'Snippet', id: result?.owner?._id }
            ]
        })
    })
});

export const { useLoginMutation, useRegisterMutation, useChangePasswordMutation, useSnippetsQuery, useSnippetOneQuery, useUserQuery, useUserSnippetsQuery, useUpdateSnippetMutation, useCreateSnippetMutation, useChangeImageMutation } = api