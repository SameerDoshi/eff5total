//import React from 'react'
import React, { Component } from 'react';
import {Card,Image,Button} from 'react-bootstrap'
import ActionPane from './ActionPane.js';
import ReactPlayer from "react-player";
import { Link } from 'react-router-dom';
import { config } from './Constants';



const ReactMarkdown = require('react-markdown')



const footerStyle = {
    marginLeft: '.25rem',
};


class StoryCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            voted: 'nothing'
        };
    }

    

    gethost = function (url) {

        if (!url) { url = 'https://eff5.io'; }
        let parser = document.createElement('a');
        parser.href = url;
        let h = (parser.hostname).replace('www.', '');
        let host = h;
        if (h.split(".").length > 2) {
            host = h.substr(h.indexOf('.') + 1, h.length);
        }
        return (host);
    };
    getyoutube = function (url) {
        let link = "";

        if (url.includes('https://www.you')) {
            link = url.split('watch?v=')[1]
        }
        if (url.includes('https://youtu.be')) {
            link = url.split('.be/')[1]
        }
        link = link.split('&')[0];

        return ('https://www.youtube.com/embed/' + link + '?controls=0');
    };

    getDefImage = function (ev) {
        ev.target.src = config.defimgurl;
    }
    voteHandler = (voterType, newStory) => {
        let modifer = 1;
        if (voterType === "stupid") { modifer = -5; }
        if (voterType === "down") { modifer = -1; }
        this.setState({ voted: voterType });
        this.props.callback(newStory);
    }


    render() {

        let story = this.props.story;
        let kind = this.props.kind;
        let short = this.gethost(story.url);
        let imgsrc = config.imgbase + short + '.png';
        let voted = this.state.voted;
        

        return <Card bg={voted==='stupid'?'danger':'light'} >
            <Card.Body style={{paddingLeft: '0rem', paddingBottom: '0rem' }}>
                <Card.Title  variant="secondary">
                    {kind !== "image" && kind !== "video" ?
                        <a style={{paddingTop:'.5rem',paddingRight:'.5rem'}}className="float-left" href={story.url}><Image rounded width="50px" src={imgsrc} onError={this.getDefImage} /></a>
                        : ""}

                    <ReactMarkdown className="div"  source={story.Headline} escapeHtml={false}/>
                    
                    
                </Card.Title>
                


                {story.text ?
                    <ReactMarkdown source={story.text.replace('&amp;#x200B;', "\n")} escapeHtml={false} />
                    : ''}

                {kind === 'image' ?
                    <Card.Img src={story.imgpreview ? story.imgpreview : story.url} />
                    :
                    ""}
                {kind === 'video' ?
                    <ReactPlayer
                        height="123"
                        width="219"
                        url={story.url}
                    />
                    :
                    ""}

            </Card.Body>
            <Card.Footer >
            <Card.Link style={footerStyle} as={Link} to={'/c/' + this.props.currentTag + "/" + story.id}>Reply {story.comment_count} </Card.Link>
            <Card.Link style={footerStyle} className="float-right" as={Link} to={story.url}>{short}</Card.Link>
            </Card.Footer>
            <Card.Footer style={{ paddingLeft: '0rem', paddingRight: '0rem' }}>
               <ActionPane currentTag={this.props.currentTag} story={story} voteFunction={this.voteHandler} voted={voted}/>
            </Card.Footer>
        </Card>
    }

};
export default StoryCard;

