import { ApolloClient, InMemoryCache } from '@apollo/client';
import { config } from './Constants';

const EffApi = new ApolloClient({
  uri: config.graphurl,
  cache: new InMemoryCache()
});

export default EffApi;

