
const { gql } = require('apollo-server-azure-functions');


const typeDefs = gql`
scalar JSON

scalar JSONObject
 type Tag @cacheControl(maxAge: 2000) {
     id: ID
     name: String
 }
 type Comment {
    id: ID
    username: String
    message: String
    parent:String
    created: String
    points: Int
    comments: [Comment]
 }
 type Story {
     id: ID
     comment_count: Int
     points: Int
     Headline: String
     url: String
     text: String
     posted: String
     imgpreview: String
     tag: String
 } 
 type LongStory {
     story:Story
     comments: [JSONObject]
 }
 type FullStory {
    id: ID
    comment_count: Int
    points: Int
    Headline: String
    url: String
    text: String
    posted: String
    imgpreview: String
    tag: String
    comments: [JSONObject]
 }
 type Topic {
    id: ID
    name: String
    }
    type Pointer{
        id: ID
        title: String
        url: String
        text: String
        score: Int
        comments: Int
    }

    type Query {
        hello: String
        getTags:[Tag] @cacheControl(maxAge: 2000)
        getStoriesByTag(tagname: String):[Story!] 
        getStoryByStory(storyId:String): LongStory
        getCommentsByStory(storyId:String): FullStory  
        getStoriesByDate(tagName:String,date:String):[Story!]
        getTopics: [Topic]
        getPointers(topic: String):[Pointer!]
      }
    type Mutation {
        vote(storyId: String, tagName: String, type:String): Story
        comment(storyId: String, tagName: String, message:String, replyToId:String): FullStory
        newtag(tagName:String): Tag
        submit(title: String, url: String, text: String, tagName: String): Story
      }
    

      
      

`;
module.exports = typeDefs;