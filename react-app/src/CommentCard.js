
import React, { Component } from 'react';


import ReplyForm from './ReplyForm'
import { Accordion, Icon} from 'semantic-ui-react'
import { MessageBox  } from 'react-chat-elements';





class CommentCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
          expanded:true,
          replyClicked: false
        }
      }
      replyClickedFun=()=>{
        let val=!this.state.replyClicked;
        this.setState( {
            replyClicked: val
          } );

      }
      replyHandler = (childData) => {
        if(this.props.comment.parent){
            childData.replyToId=childData.replyToId + ","+ this.props.comment.parent;
          
        }
        this.props.callback(childData);
        this.replyClickedFun();
    }
    getChildComments=()=>{
        
        return this.props.comment.comments.map((comment) => (
            <CommentCard callback={this.replyHandler} key={comment.id} comment={comment} />
         ));;
    }

    handleClick = (e, titleProps) => {
      e.preventDefault();
      this.setState({ expanded: !this.state.expanded});
    }
    getAccordian=()=>{
      if(!this.props.comment.comments){
        return "";
      }
      return this.props.comment.comments.length > 0 ?
    
        <Accordion 
        active={[9]}
        index={9}
        
        exclusive={false}>
          <Accordion.Title>
          <Icon name='dropdown' onClick={this.handleClick} />
         {this.props.comment.comments.length}&nbsp; Repl{this.props.comment.comments.length === 1?"y":"ies"}:
          </Accordion.Title>
          <Accordion.Content active={this.state.expanded}>
            {this.getChildComments()}
            </Accordion.Content>
          </Accordion>
        :"" ;
    }

    showReply=()=>{
      return  this.state.replyClicked?
        <ReplyForm callback={this.replyHandler} commentId={this.props.comment.id}></ReplyForm>
        :
        <div></div>;
    }
    render() {
        let comment=this.props.comment;
       

        return  <div>
          <MessageBox
        type='text'
        text={<div>{this.showReply()}{this.getAccordian()}</div>}
        title={comment.message}
        onTitleClick={this.replyClickedFun}
        replyButton={true}
  
        />
      
      
      
    
    
    </div>
  
      
      
                                      
                  
                
            
    }

};
export default CommentCard;

