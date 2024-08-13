import { CodegenConfig } from '@graphql-codegen/cli';
require('dotenv').config();

const config: CodegenConfig = {
  schema: process.env.EXPO_PUBLIC_GRAPHQL_ENDPOINT,
  documents: [
    'app/**/*.tsx', // this is for tagged documents eg gql`...` tags @REVIEW
    'utils/**/*.graphql', // this is for documents in .graphql files
  ],
  ignoreNoDocuments: true, // if a project doesn't have any .graphql files, nor gql`...` tags, we don't want it to fail
  config: {
    avoidOptionals: {
      field: true,
      inputValue: false,
      object: false,
      defaultValue: false,
    },
    scalars: {
      DateTime: {
        input: 'string',
        output: 'string',
      },
      UUID: {
        input: 'string',
        output: 'string',
      },
    },
  },
  generates: {
    utils: {
      preset: 'near-operation-file',
      presetConfig: {
        baseTypesPath: './types.ts',
      },
      config: {
        withHooks: true,
        immutableTypes: true,
        avoidOptionals: true,
        scalars: {
          DateTime: {
            input: 'string',
            output: 'string',
          },
          UUID: {
            input: 'string',
            output: 'string',
          },
        },
      },
      plugins: [
        {
          add: {
            placement: 'prepend',
            content: '/** THIS FILE IS AUTOGENERATED, DO NOT EDIT IT! */',
          },
        },
        'typescript-operations',
        'typescript-urql',
      ],
    },
    'utils/schema/schema-types.ts': {
      config: {
        immutableTypes: true,
        avoidOptionals: true,
        scalars: {
          DateTime: {
            input: 'string',
            output: 'string',
          },
          UUID: {
            input: 'string',
            output: 'string',
          },
        },
      },
      plugins: [
        {
          add: {
            placement: 'prepend',
            content: '/** THIS FILE IS AUTOGENERATED, DO NOT EDIT IT! */',
          },
        },
        'typescript',
      ],
    },
    'utils/schema/introspection.json': {
      plugins: ['urql-introspection'],
    },
    'utils/schema/graphcache.ts': {
      config: {
        immutableTypes: true,
        avoidOptionals: true,
        scalars: {
          DateTime: {
            input: 'string',
            output: 'string',
          },
          UUID: {
            input: 'string',
            output: 'string',
          },
        },
      },
      plugins: [
        {
          add: {
            placement: 'prepend',
            content: '/** THIS FILE IS AUTOGENERATED, DO NOT EDIT IT! */',
          },
        },
        'typescript',
        'typescript-urql-graphcache',
      ],
    },
  },
};

export default config;