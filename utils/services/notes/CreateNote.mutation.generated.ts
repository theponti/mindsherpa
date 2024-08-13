/** THIS FILE IS AUTOGENERATED, DO NOT EDIT IT! */
import * as Types from '../../types';

import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type CreateNoteMutationVariables = Types.Exact<{
  input: Types.CreateNoteInput;
}>;


export type CreateNoteMutation = { readonly __typename?: 'Mutation', readonly createNote: { readonly __typename?: 'CreateNoteOutput', readonly id: string, readonly content: string, readonly createdAt: string } };


export const CreateNoteDocument = gql`
    mutation CreateNote($input: CreateNoteInput!) {
  createNote(input: $input) {
    id
    content
    createdAt
  }
}
    `;

export function useCreateNoteMutation() {
  return Urql.useMutation<CreateNoteMutation, CreateNoteMutationVariables>(CreateNoteDocument);
};