import React, { Component } from 'react';
import VoteButton from './VoteButton'
import { config } from './Constants'
import CommentCard from './CommentCard';
import {Card,Image,Button} from 'react-bootstrap'
import { Link } from 'react-router-dom';
class ActionPane extends Component {
    voteHandler=(voterType, newStory)=>{
        this.props.voteFunction(voterType, newStory);
    };

    shareClick=()=> {
       
            
        let title='Saw this on Eff5: '+this.props.story.Headline ;
        let url=this.props.story.imgpreview?this.props.story.imgpreview:this.props.story.url;;
        if(this.props.story.text){
            url='https://eff5.io/c/'+ this.props.currentTag + "/" + this.props.story.id;
        }
    if (window.navigator.share) {
        
        
        let shareData={
            title:this.props.story.headline,
            text:title,
            url:url
        };
        
        window.navigator.share(shareData)
          .then()
          .catch();
        
      
      }
      
    
          
  };
    render(){
        let story=this.props.story;
        let voted=this.props.voted;
        return <div>
        {window.navigator.share ?
            <Button style={{marginRight:'.25rem'}} variant="success" onClick={this.shareClick}>Share</Button>
            :
            <Card.Link style={{marginRight:'1rem'}} as={Link} to={'/c/' + this.props.currentTag + "/" + story.id}>Perma Link</Card.Link>
            }
            
            <VoteButton tag={this.props.currentTag} callback={this.voteHandler} voted={voted} storyId={story.id} type="up" />
            <span>{story.points}</span>
            <VoteButton tag={this.props.currentTag} callback={this.voteHandler} voted={voted} storyId={story.id} type="down" />
            <VoteButton tag={this.props.currentTag} callback={this.voteHandler} voted={voted} storyId={story.id} type="stupid" />
            </div>
    }

};
export default ActionPane;
