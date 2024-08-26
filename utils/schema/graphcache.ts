/** THIS FILE IS AUTOGENERATED, DO NOT EDIT IT! */
import { cacheExchange } from '@urql/exchange-graphcache';
import { Resolver as GraphCacheResolver, UpdateResolver as GraphCacheUpdateResolver, OptimisticMutationResolver as GraphCacheOptimisticMutationResolver } from '@urql/exchange-graphcache';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  DateTime: { input: string; output: string; }
  UUID: { input: string; output: string; }
};

export type AuthPayload = {
  readonly __typename?: 'AuthPayload';
  readonly accessToken: Scalars['String']['output'];
  readonly refreshToken: Scalars['String']['output'];
  readonly userId: Scalars['String']['output'];
};

export type ChatMessagesResponse = {
  readonly __typename?: 'ChatMessagesResponse';
  readonly messages: ReadonlyArray<MessageOutput>;
};

export type ChatOutput = {
  readonly __typename?: 'ChatOutput';
  readonly createdAt: Scalars['String']['output'];
  readonly id: Scalars['String']['output'];
  readonly title: Scalars['String']['output'];
};

export type CreateUserInput = {
  readonly email: Scalars['String']['input'];
};

export type CreateUserPayload = {
  readonly __typename?: 'CreateUserPayload';
  readonly profile: Profile;
  readonly user: User;
};

export type DeleteFocusItemInput = {
  readonly id: Scalars['Int']['input'];
};

export type DeleteFocusItemOutput = {
  readonly __typename?: 'DeleteFocusItemOutput';
  readonly success: Scalars['Boolean']['output'];
};

export type FocusOutput = {
  readonly __typename?: 'FocusOutput';
  readonly items: ReadonlyArray<FocusOutputItem>;
};

export type FocusOutputItem = {
  readonly __typename?: 'FocusOutputItem';
  readonly category: Scalars['String']['output'];
  readonly createdAt: Scalars['DateTime']['output'];
  readonly dueDate: Maybe<Scalars['Date']['output']>;
  readonly id: Scalars['Int']['output'];
  readonly priority: Scalars['Int']['output'];
  readonly profileId: Scalars['UUID']['output'];
  readonly sentiment: Scalars['String']['output'];
  readonly state: FocusState;
  readonly taskSize: Scalars['String']['output'];
  readonly text: Scalars['String']['output'];
  readonly type: Scalars['String']['output'];
  readonly updatedAt: Scalars['DateTime']['output'];
};

export enum FocusState {
  Active = 'active',
  Backlog = 'backlog',
  Completed = 'completed',
  Deleted = 'deleted'
}

export type GetFocusFilter = {
  readonly category: Scalars['String']['input'];
};

export type GetProfileOutput = {
  readonly __typename?: 'GetProfileOutput';
  readonly fullName: Scalars['String']['output'];
  readonly id: Scalars['String']['output'];
  readonly userId: Scalars['String']['output'];
};

export type MessageOutput = {
  readonly __typename?: 'MessageOutput';
  readonly chatId: Scalars['String']['output'];
  readonly createdAt: Scalars['String']['output'];
  readonly id: Scalars['String']['output'];
  readonly message: Scalars['String']['output'];
  readonly profileId: Scalars['String']['output'];
  readonly role: MessageRole;
};

export enum MessageRole {
  Assistant = 'ASSISTANT',
  User = 'USER'
}

export type Mutation = {
  readonly __typename?: 'Mutation';
  readonly createUser: CreateUserPayload;
  readonly deleteFocusItem: DeleteFocusItemOutput;
  readonly saveAppleUser: AuthPayload;
  readonly sendChatMessage: ReadonlyArray<MessageOutput>;
  readonly updateProfile: UpdateProfilePayload;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteFocusItemArgs = {
  input: DeleteFocusItemInput;
};


export type MutationSaveAppleUserArgs = {
  idToken: Scalars['String']['input'];
  nonce: Scalars['String']['input'];
};


export type MutationSendChatMessageArgs = {
  chatId: Scalars['String']['input'];
  message: Scalars['String']['input'];
};


export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};

export type NoteOutput = {
  readonly __typename?: 'NoteOutput';
  readonly content: Scalars['String']['output'];
  readonly createdAt: Scalars['String']['output'];
  readonly id: Scalars['String']['output'];
};

export type Profile = {
  readonly __typename?: 'Profile';
  readonly fullName: Maybe<Scalars['String']['output']>;
  readonly id: Scalars['Int']['output'];
  readonly userId: Scalars['String']['output'];
};

export type Query = {
  readonly __typename?: 'Query';
  readonly chatMessages: ChatMessagesResponse;
  readonly chats: ReadonlyArray<ChatOutput>;
  readonly currentUser: User;
  readonly focus: FocusOutput;
  readonly notes: ReadonlyArray<NoteOutput>;
  readonly profile: GetProfileOutput;
};


export type QueryChatMessagesArgs = {
  chatId: Scalars['String']['input'];
};


export type QueryFocusArgs = {
  filter?: InputMaybe<GetFocusFilter>;
};

export type UpdateProfileInput = {
  readonly fullName: Scalars['String']['input'];
  readonly userId: Scalars['String']['input'];
};

export type UpdateProfilePayload = {
  readonly __typename?: 'UpdateProfilePayload';
  readonly profile: Profile;
};

export type User = {
  readonly __typename?: 'User';
  readonly email: Maybe<Scalars['String']['output']>;
  readonly id: Scalars['String']['output'];
};

export type WithTypename<T extends { __typename?: any }> = Partial<T> & { __typename: NonNullable<T['__typename']> };

export type GraphCacheKeysConfig = {
  AuthPayload?: (data: WithTypename<AuthPayload>) => null | string,
  ChatMessagesResponse?: (data: WithTypename<ChatMessagesResponse>) => null | string,
  ChatOutput?: (data: WithTypename<ChatOutput>) => null | string,
  CreateUserPayload?: (data: WithTypename<CreateUserPayload>) => null | string,
  DeleteFocusItemOutput?: (data: WithTypename<DeleteFocusItemOutput>) => null | string,
  FocusOutput?: (data: WithTypename<FocusOutput>) => null | string,
  FocusOutputItem?: (data: WithTypename<FocusOutputItem>) => null | string,
  GetProfileOutput?: (data: WithTypename<GetProfileOutput>) => null | string,
  MessageOutput?: (data: WithTypename<MessageOutput>) => null | string,
  NoteOutput?: (data: WithTypename<NoteOutput>) => null | string,
  Profile?: (data: WithTypename<Profile>) => null | string,
  UpdateProfilePayload?: (data: WithTypename<UpdateProfilePayload>) => null | string,
  User?: (data: WithTypename<User>) => null | string
}

export type GraphCacheResolvers = {
  Query?: {
    chatMessages?: GraphCacheResolver<WithTypename<Query>, QueryChatMessagesArgs, WithTypename<ChatMessagesResponse> | string>,
    chats?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<ChatOutput> | string>>,
    currentUser?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, WithTypename<User> | string>,
    focus?: GraphCacheResolver<WithTypename<Query>, QueryFocusArgs, WithTypename<FocusOutput> | string>,
    notes?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<NoteOutput> | string>>,
    profile?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, WithTypename<GetProfileOutput> | string>
  },
  AuthPayload?: {
    accessToken?: GraphCacheResolver<WithTypename<AuthPayload>, Record<string, never>, Scalars['String'] | string>,
    refreshToken?: GraphCacheResolver<WithTypename<AuthPayload>, Record<string, never>, Scalars['String'] | string>,
    userId?: GraphCacheResolver<WithTypename<AuthPayload>, Record<string, never>, Scalars['String'] | string>
  },
  ChatMessagesResponse?: {
    messages?: GraphCacheResolver<WithTypename<ChatMessagesResponse>, Record<string, never>, Array<WithTypename<MessageOutput> | string>>
  },
  ChatOutput?: {
    createdAt?: GraphCacheResolver<WithTypename<ChatOutput>, Record<string, never>, Scalars['String'] | string>,
    id?: GraphCacheResolver<WithTypename<ChatOutput>, Record<string, never>, Scalars['String'] | string>,
    title?: GraphCacheResolver<WithTypename<ChatOutput>, Record<string, never>, Scalars['String'] | string>
  },
  CreateUserPayload?: {
    profile?: GraphCacheResolver<WithTypename<CreateUserPayload>, Record<string, never>, WithTypename<Profile> | string>,
    user?: GraphCacheResolver<WithTypename<CreateUserPayload>, Record<string, never>, WithTypename<User> | string>
  },
  DeleteFocusItemOutput?: {
    success?: GraphCacheResolver<WithTypename<DeleteFocusItemOutput>, Record<string, never>, Scalars['Boolean'] | string>
  },
  FocusOutput?: {
    items?: GraphCacheResolver<WithTypename<FocusOutput>, Record<string, never>, Array<WithTypename<FocusOutputItem> | string>>
  },
  FocusOutputItem?: {
    category?: GraphCacheResolver<WithTypename<FocusOutputItem>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<FocusOutputItem>, Record<string, never>, Scalars['DateTime'] | string>,
    dueDate?: GraphCacheResolver<WithTypename<FocusOutputItem>, Record<string, never>, Scalars['Date'] | string>,
    id?: GraphCacheResolver<WithTypename<FocusOutputItem>, Record<string, never>, Scalars['Int'] | string>,
    priority?: GraphCacheResolver<WithTypename<FocusOutputItem>, Record<string, never>, Scalars['Int'] | string>,
    profileId?: GraphCacheResolver<WithTypename<FocusOutputItem>, Record<string, never>, Scalars['UUID'] | string>,
    sentiment?: GraphCacheResolver<WithTypename<FocusOutputItem>, Record<string, never>, Scalars['String'] | string>,
    state?: GraphCacheResolver<WithTypename<FocusOutputItem>, Record<string, never>, FocusState | string>,
    taskSize?: GraphCacheResolver<WithTypename<FocusOutputItem>, Record<string, never>, Scalars['String'] | string>,
    text?: GraphCacheResolver<WithTypename<FocusOutputItem>, Record<string, never>, Scalars['String'] | string>,
    type?: GraphCacheResolver<WithTypename<FocusOutputItem>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<FocusOutputItem>, Record<string, never>, Scalars['DateTime'] | string>
  },
  GetProfileOutput?: {
    fullName?: GraphCacheResolver<WithTypename<GetProfileOutput>, Record<string, never>, Scalars['String'] | string>,
    id?: GraphCacheResolver<WithTypename<GetProfileOutput>, Record<string, never>, Scalars['String'] | string>,
    userId?: GraphCacheResolver<WithTypename<GetProfileOutput>, Record<string, never>, Scalars['String'] | string>
  },
  MessageOutput?: {
    chatId?: GraphCacheResolver<WithTypename<MessageOutput>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<MessageOutput>, Record<string, never>, Scalars['String'] | string>,
    id?: GraphCacheResolver<WithTypename<MessageOutput>, Record<string, never>, Scalars['String'] | string>,
    message?: GraphCacheResolver<WithTypename<MessageOutput>, Record<string, never>, Scalars['String'] | string>,
    profileId?: GraphCacheResolver<WithTypename<MessageOutput>, Record<string, never>, Scalars['String'] | string>,
    role?: GraphCacheResolver<WithTypename<MessageOutput>, Record<string, never>, MessageRole | string>
  },
  NoteOutput?: {
    content?: GraphCacheResolver<WithTypename<NoteOutput>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<NoteOutput>, Record<string, never>, Scalars['String'] | string>,
    id?: GraphCacheResolver<WithTypename<NoteOutput>, Record<string, never>, Scalars['String'] | string>
  },
  Profile?: {
    fullName?: GraphCacheResolver<WithTypename<Profile>, Record<string, never>, Scalars['String'] | string>,
    id?: GraphCacheResolver<WithTypename<Profile>, Record<string, never>, Scalars['Int'] | string>,
    userId?: GraphCacheResolver<WithTypename<Profile>, Record<string, never>, Scalars['String'] | string>
  },
  UpdateProfilePayload?: {
    profile?: GraphCacheResolver<WithTypename<UpdateProfilePayload>, Record<string, never>, WithTypename<Profile> | string>
  },
  User?: {
    email?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['String'] | string>,
    id?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['String'] | string>
  }
};

export type GraphCacheOptimisticUpdaters = {
  createUser?: GraphCacheOptimisticMutationResolver<MutationCreateUserArgs, WithTypename<CreateUserPayload>>,
  deleteFocusItem?: GraphCacheOptimisticMutationResolver<MutationDeleteFocusItemArgs, WithTypename<DeleteFocusItemOutput>>,
  saveAppleUser?: GraphCacheOptimisticMutationResolver<MutationSaveAppleUserArgs, WithTypename<AuthPayload>>,
  sendChatMessage?: GraphCacheOptimisticMutationResolver<MutationSendChatMessageArgs, Array<WithTypename<MessageOutput>>>,
  updateProfile?: GraphCacheOptimisticMutationResolver<MutationUpdateProfileArgs, WithTypename<UpdateProfilePayload>>
};

export type GraphCacheUpdaters = {
  Query?: {
    chatMessages?: GraphCacheUpdateResolver<{ chatMessages: WithTypename<ChatMessagesResponse> }, QueryChatMessagesArgs>,
    chats?: GraphCacheUpdateResolver<{ chats: Array<WithTypename<ChatOutput>> }, Record<string, never>>,
    currentUser?: GraphCacheUpdateResolver<{ currentUser: WithTypename<User> }, Record<string, never>>,
    focus?: GraphCacheUpdateResolver<{ focus: WithTypename<FocusOutput> }, QueryFocusArgs>,
    notes?: GraphCacheUpdateResolver<{ notes: Array<WithTypename<NoteOutput>> }, Record<string, never>>,
    profile?: GraphCacheUpdateResolver<{ profile: WithTypename<GetProfileOutput> }, Record<string, never>>
  },
  Mutation?: {
    createUser?: GraphCacheUpdateResolver<{ createUser: WithTypename<CreateUserPayload> }, MutationCreateUserArgs>,
    deleteFocusItem?: GraphCacheUpdateResolver<{ deleteFocusItem: WithTypename<DeleteFocusItemOutput> }, MutationDeleteFocusItemArgs>,
    saveAppleUser?: GraphCacheUpdateResolver<{ saveAppleUser: WithTypename<AuthPayload> }, MutationSaveAppleUserArgs>,
    sendChatMessage?: GraphCacheUpdateResolver<{ sendChatMessage: Array<WithTypename<MessageOutput>> }, MutationSendChatMessageArgs>,
    updateProfile?: GraphCacheUpdateResolver<{ updateProfile: WithTypename<UpdateProfilePayload> }, MutationUpdateProfileArgs>
  },
  Subscription?: {},
  AuthPayload?: {
    accessToken?: GraphCacheUpdateResolver<Maybe<WithTypename<AuthPayload>>, Record<string, never>>,
    refreshToken?: GraphCacheUpdateResolver<Maybe<WithTypename<AuthPayload>>, Record<string, never>>,
    userId?: GraphCacheUpdateResolver<Maybe<WithTypename<AuthPayload>>, Record<string, never>>
  },
  ChatMessagesResponse?: {
    messages?: GraphCacheUpdateResolver<Maybe<WithTypename<ChatMessagesResponse>>, Record<string, never>>
  },
  ChatOutput?: {
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<ChatOutput>>, Record<string, never>>,
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<ChatOutput>>, Record<string, never>>,
    title?: GraphCacheUpdateResolver<Maybe<WithTypename<ChatOutput>>, Record<string, never>>
  },
  CreateUserPayload?: {
    profile?: GraphCacheUpdateResolver<Maybe<WithTypename<CreateUserPayload>>, Record<string, never>>,
    user?: GraphCacheUpdateResolver<Maybe<WithTypename<CreateUserPayload>>, Record<string, never>>
  },
  DeleteFocusItemOutput?: {
    success?: GraphCacheUpdateResolver<Maybe<WithTypename<DeleteFocusItemOutput>>, Record<string, never>>
  },
  FocusOutput?: {
    items?: GraphCacheUpdateResolver<Maybe<WithTypename<FocusOutput>>, Record<string, never>>
  },
  FocusOutputItem?: {
    category?: GraphCacheUpdateResolver<Maybe<WithTypename<FocusOutputItem>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<FocusOutputItem>>, Record<string, never>>,
    dueDate?: GraphCacheUpdateResolver<Maybe<WithTypename<FocusOutputItem>>, Record<string, never>>,
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<FocusOutputItem>>, Record<string, never>>,
    priority?: GraphCacheUpdateResolver<Maybe<WithTypename<FocusOutputItem>>, Record<string, never>>,
    profileId?: GraphCacheUpdateResolver<Maybe<WithTypename<FocusOutputItem>>, Record<string, never>>,
    sentiment?: GraphCacheUpdateResolver<Maybe<WithTypename<FocusOutputItem>>, Record<string, never>>,
    state?: GraphCacheUpdateResolver<Maybe<WithTypename<FocusOutputItem>>, Record<string, never>>,
    taskSize?: GraphCacheUpdateResolver<Maybe<WithTypename<FocusOutputItem>>, Record<string, never>>,
    text?: GraphCacheUpdateResolver<Maybe<WithTypename<FocusOutputItem>>, Record<string, never>>,
    type?: GraphCacheUpdateResolver<Maybe<WithTypename<FocusOutputItem>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<FocusOutputItem>>, Record<string, never>>
  },
  GetProfileOutput?: {
    fullName?: GraphCacheUpdateResolver<Maybe<WithTypename<GetProfileOutput>>, Record<string, never>>,
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<GetProfileOutput>>, Record<string, never>>,
    userId?: GraphCacheUpdateResolver<Maybe<WithTypename<GetProfileOutput>>, Record<string, never>>
  },
  MessageOutput?: {
    chatId?: GraphCacheUpdateResolver<Maybe<WithTypename<MessageOutput>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<MessageOutput>>, Record<string, never>>,
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<MessageOutput>>, Record<string, never>>,
    message?: GraphCacheUpdateResolver<Maybe<WithTypename<MessageOutput>>, Record<string, never>>,
    profileId?: GraphCacheUpdateResolver<Maybe<WithTypename<MessageOutput>>, Record<string, never>>,
    role?: GraphCacheUpdateResolver<Maybe<WithTypename<MessageOutput>>, Record<string, never>>
  },
  NoteOutput?: {
    content?: GraphCacheUpdateResolver<Maybe<WithTypename<NoteOutput>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<NoteOutput>>, Record<string, never>>,
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<NoteOutput>>, Record<string, never>>
  },
  Profile?: {
    fullName?: GraphCacheUpdateResolver<Maybe<WithTypename<Profile>>, Record<string, never>>,
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<Profile>>, Record<string, never>>,
    userId?: GraphCacheUpdateResolver<Maybe<WithTypename<Profile>>, Record<string, never>>
  },
  UpdateProfilePayload?: {
    profile?: GraphCacheUpdateResolver<Maybe<WithTypename<UpdateProfilePayload>>, Record<string, never>>
  },
  User?: {
    email?: GraphCacheUpdateResolver<Maybe<WithTypename<User>>, Record<string, never>>,
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<User>>, Record<string, never>>
  },
};

export type GraphCacheConfig = Parameters<typeof cacheExchange>[0] & {
  updates?: GraphCacheUpdaters,
  keys?: GraphCacheKeysConfig,
  optimistic?: GraphCacheOptimisticUpdaters,
  resolvers?: GraphCacheResolvers,
};