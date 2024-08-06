/** THIS FILE IS AUTOGENERATED, DO NOT EDIT IT! */
import * as Types from '../../types';

import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type NotesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type NotesQuery = { readonly __typename?: 'Query', readonly notes: ReadonlyArray<{ readonly __typename?: 'NoteOutput', readonly id: string, readonly content: string, readonly createdAt: string }> };


export const NotesDocument = gql`
    query Notes {
  notes {
    id
    content
    createdAt
  }
}
    `;

export function useNotesQuery(options?: Omit<Urql.UseQueryArgs<NotesQueryVariables>, 'query'>) {
  return Urql.useQuery<NotesQuery, NotesQueryVariables>({ query: NotesDocument, ...options });
};