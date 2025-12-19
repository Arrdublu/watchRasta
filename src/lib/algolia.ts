import algoliasearch from 'algoliasearch';

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!;
const apiKey = process.env.NEXT_PUBLIC_ALGolia_SEARCH_KEY!;

export const searchClient = algoliasearch(appId, apiKey);