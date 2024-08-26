/** THIS FILE IS AUTOGENERATED, DO NOT EDIT IT! */
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
