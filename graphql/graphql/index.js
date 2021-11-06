const { JSONResolver,JSONObjectResolver}=require('graphql-scalars');
const { ApolloServer, gql } = require('apollo-server-azure-functions');
const typeDefs = require('./schema');
const ServicesAPI = require('./datasources/ServicesAPI');


const resolvers = {
  JSON: JSONResolver,
  JSONObject: JSONObjectResolver,
  
  Query: {
    hello: () => 'Hello world!',
    getCommentsByStory:(_,{storyId },{dataSources})=>
        dataSources.servicesAPI.getCommentsByStory({ storyId: storyId }),
    getStoryByStory:(_,{storyId },{dataSources})=>
        dataSources.servicesAPI.getStoryByStory({ storyId: storyId }),
    getStoriesByTag: (_, { tagname }, { dataSources }) =>
      dataSources.servicesAPI.getStoriesByTag({ tagname: tagname }),
    getStoriesByDate: (_, { tagName, date }, { dataSources }) =>
      dataSources.servicesAPI.getStoriesByDate({ tagName: tagName, date:date }),
    getTags: (_, __, { dataSources }) =>
      dataSources.servicesAPI.getAllTags()
  },
  Mutation: {
    vote: async (_, { storyId, tagName, type }, { dataSources }) => {
      const s=await dataSources.servicesAPI.vote({sid:storyId,pk:tagName,t:type});
      return s;
    },
    comment: async (_, { storyId, tagName, message, replyToId }, { dataSources }) => {
      const s=await dataSources.servicesAPI.comment({sid:storyId,pk:tagName,message:message,rid:replyToId});
      return s;
    },
    newtag: async (_, {tagName}, {dataSources}) => {
      return await dataSources.servicesAPI.newtag({tagName: tagName});
    },
    submit: async (_, {title, url, text, tagName}, {dataSources}) => {
      return await dataSources.servicesAPI.submit({title:title, url:url, text:text, tagName: tagName});
    }
    
  }
};

const server = new ApolloServer(
    { typeDefs, 
        dataSources: () => ({    servicesAPI: new ServicesAPI()  }),
        resolvers,
        //introspection: false,
        //playground: false, 
    });

exports.graphqlHandler = server.createHandler({
    cors: {
      origin: '*',
     allowedHeaders:['Content-Type', 'Authorization']
   },
  });
