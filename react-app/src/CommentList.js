//import React from 'react'
import React, { Component } from 'react';
import ReplyForm from './ReplyForm';
import ActionPane from './ActionPane.js';
import CommentCard from './CommentCard';
import {Image} from 'react-bootstrap'
import ReactPlayer from "react-player"
import EffApi from './EffApi';
import { gql } from '@apollo/client';
import { Header } from 'semantic-ui-react';
import StaticContent from './StaticContent';
import Countdown from 'react-countdown';

const RQ=gql`
mutation(
    $storyId:String
    $tagName:String
    $message:String,
    $replyToId:String
  ){
    comment(
     storyId:$storyId
    tagName:$tagName
    replyToId:$replyToId
   message:$message
    ){
      id Headline url text points comment_count tag
      comments  } 
  }
`;

const SCQ=gql`
  query($storyId:String){
      s:getCommentsByStory(storyId:$storyId){
        id Headline url text points comment_count tag posted 
        comments  } 
    }
`;
class CommentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storyId: props.storyId,
      story: {},
      comments: [],
      voted: 'nothing'
    };
    
    
    
  }
   
   
  

  
  componentDidMount() {
 
  EffApi.query({
     query: SCQ,
     variables : { storyId:this.props.storyId}
  }) 
  .then((res) => {
    this.setState({
      story: res.data.s
     
    });
    }
  );
  }
  

 
  replyHandler = ({message, doneSubmitting, replyToId}) => {
   
      
  
    EffApi.mutate({
      mutation: RQ,
      onCompleted: doneSubmitting,
      variables : { 
          storyId:this.state.story.id,
          tagName:this.state.story.tag,
          message:message ,
          replyToId:replyToId?replyToId.split("").reverse().join(""):null 
          }
  })
  .then((res,doneSubmitting) => {

    this.setState({story: res.data.comment});
    });
    
  }
  voteHandler = (voterType, newStory) => {
    
    this.setState({ story:newStory, voted: voterType });
    
}

  getKind = function (url) {
    let ret = 'link';
    if (!url) { ret = 'self'; } else {
      if (url.includes('i.redd')) {
        ret = 'image';
      } else {
        if (url.includes('https://www.youtub') || url.includes('https://youtu.be')) {
          ret = 'video';
        }
      }
    }
    return (ret);
  };

  render() {

    let story = this.state.story;
   
   
    let comments=[];
    let kind='text';
    let hasText = false;
    if(!story){
      return <StaticContent></StaticContent>;
    }
    if(story.comments){
       comments = story.comments.map((comment) => (
      <CommentCard callback={this.replyHandler} key={comment.id} children={comment.comments} comment={comment} />
   ));
       }
       kind = this.getKind(story.url);
       hasText = story.text;
      

    let voted=this.state.voted;
    
    let isImage = kind === "image";
    let isKindVideo = kind === "video";
    let expiry=new Date(Date.parse(story.posted));
    expiry.setDate(expiry.getDate() + 5);
    return <div>
      <h2>{story.Headline}</h2>
      {hasText ?

  <h3><p>{story.text}</p></h3>

:
""}
      <h4>{story.points} points</h4>
      Expires In: <Countdown date={expiry}/>   
      <br></br>
      {isImage ?
        <Image style={{ marginTop: '.5rem', marginBottom: '.5rem', marginLeft: '.25rem', marginRight: '.25rem' }} fluid src={story.imgpreview ? story.imgpreview : story.url} />
        :
        ""}
        {isKindVideo?
         <ReactPlayer
         url={story.url}
     />
      :
      ""
      } 
      <ActionPane currentTag={this.state.story.tag} story={story} voteFunction={this.voteHandler} voted={voted}/>
<Header as='h3' dividing>
      Reply
    </Header>
      <br /><br />
      <ReplyForm callback={this.replyHandler} />
      <br/>
      <br/>
      
        <Header as='h3' dividing>
          Comments
        </Header>
        
          {comments}
        
      
    </div>;
  }

};
export default CommentList;

