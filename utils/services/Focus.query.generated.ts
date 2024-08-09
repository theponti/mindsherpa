/** THIS FILE IS AUTOGENERATED, DO NOT EDIT IT! */
import * as Types from '../types';

import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type FocusQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type FocusQuery = { readonly __typename?: 'Query', readonly focus: { readonly __typename?: 'FocusOutput', readonly items: ReadonlyArray<{ readonly __typename?: 'FocusOutputItem', readonly id: string, readonly type: string, readonly taskSize: string, readonly text: string, readonly category: string, readonly priority: string, readonly sentiment: string, readonly dueDate: string }> } };


export const FocusDocument = gql`
    query Focus {
  focus {
    items {
      id
      type
      taskSize
      text
      category
      priority
      sentiment
      dueDate
    }
  }
}
    `;

export function useFocusQuery(options?: Omit<Urql.UseQueryArgs<FocusQueryVariables>, 'query'>) {
  return Urql.useQuery<FocusQuery, FocusQueryVariables>({ query: FocusDocument, ...options });
};