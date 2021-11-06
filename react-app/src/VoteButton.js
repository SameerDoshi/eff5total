//import React from 'react'
import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import { config } from './Constants';
import EffApi from './EffApi';
import { gql } from '@apollo/client';

const VQ=gql`
mutation(
    $storyId:String
    $tagName:String
    $type:String){
  vote(
    storyId:$storyId
    tagName:$tagName
    type:$type
  ){id comment_count points Headline url text posted imgpreview tag }
}
`;
const buttonStyle = {
    marginLeft: '.25rem',
    marginRight: '.25rem',
    marginTop: '0rem'
};

class VoteButton extends Component {
    constructor(props) {
        super(props);
        this.state = { submitting: false, toggled: false };

        this.replyClicked = this.replyClicked.bind(this);
        

         

      
    }

    replyClicked(ev) {
        
        let atltText = this.getTextAlt();
        this.setState(
            { submitting: true, text: atltText },
             () => {
                EffApi.mutate({
                        mutation: VQ,
                        variables : { 
                            tagName:this.props.tag,
                            storyId:this.props.storyId,
                            
                            type: (this.props.type).toLowerCase().charAt(0) 
                        }
                })
                .then((resp) =>{
                    let newStory=resp.data.vote;
                    this.setState({ submitting: false, toggled: !this.state.toggled })
                    if(newStory){
                        this.props.callback(this.props.type,newStory);
                    }
                });
        });
    }

    getTextAlt = function () {
        let ret = "......";
        if (this.props.type === "up") { ret = ".."; }
        if (this.props.type === "down") { ret = "...."; }
        return ret;
    }

    getText = function () {
        let isSmall=window.innerWidth <300 ;
        let ret =isSmall?"Stu":"Stupid";
        if (this.props.type === "up") { ret = "Up"; }
        if (this.props.type === "down") { ret=isSmall ?"Dn":"Down"; }
        return ret;
    }
    getColor = function () {
        let ret = "danger";
        if (this.props.type === "up") { ret = "primary"; }
        if (this.props.type === "down") { ret = "primary"; }
        return ret;
    }
    getRight = function () {
       let ret="";
       if(this.props.type === "down"){ret="mr-auto";}
       if(this.props.type === "stupid" ){ret="float-right";}
       return ret;
        
    }

    render() {
        let toggled = (this.props.voted === this.props.type?true:false);
        let text = this.state.submitting?this.getTextAlt():this.getText();
        let color = this.getColor();

        return <Button
            style={buttonStyle} className={this.getRight()}
            variant={toggled ? "success" : color}
            onClick={this.replyClicked}
        >
            {text}</Button>

    }

};
export default VoteButton;

