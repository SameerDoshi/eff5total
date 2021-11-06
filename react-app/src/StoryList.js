//import React from 'react'
import React, { Component } from 'react';
import StaticContent from './StaticContent';
import StoryCard from './StoryCard';
import Button from 'react-bootstrap/Button'
import EffApi from './EffApi';
import { gql } from '@apollo/client';

const footerStyle = {
    marginTop: '0px'
};

const footerButtonStyle = {
    margin: '1rem'
};


const SQ=gql`
    query($tname:String){
        stories:getStoriesByTag(tagname:$tname){id comment_count points Headline url text posted imgpreview}}
`;



class StoryList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fetching: false,
            nextpage: 0,
            currentTag: props.currentTag ? props.currentTag : "politics",
            stories: [],
        };
        this.handleFetchMore = this.handleFetchMore.bind(this);
    }
    formatDate(offset) {
        var gt = new Date();
        gt.setDate(gt.getDate() - offset);
        var d = new Date(gt),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('');
    }

   

    handleFetchMore() {
        this.setState({ fetching: true });
      
        EffApi.query({
            query: SQ,
            variables: { tname: this.props.currentTag + '-' + this.formatDate(this.state.nextpage) }
          })
            .then(response => {
                let np = this.state.nextpage + 1;
                let shadowstories = this.state.stories;
                let allstories=shadowstories.concat(response.data.stories)
                const uniquestories = Array.from(new Set(allstories.map(a => a.id)))
                    .map(id => {
                        return allstories.find(a => a.id === id)
                    })
                this.setState({ nextpage: np, fetching: false, stories: uniquestories });
            });

    }
    

    componentDidMount() {
        this.handleFetchMore();
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.currentTag !== prevState.currentTag) {
            return {
                currentTag: nextProps.currentTag,
                stories: []
            }
        }
        return null;
    }



    componentDidUpdate(prevProps, prevState) {
        if (prevState.currentTag !== this.state.currentTag) {
            this.handleFetchMore();
        }

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
    handleVote = (newStory) => {
        var all = this.state.stories;
        var storyIndex = all.findIndex(function (c) {
            return c.id === newStory.id;
        });
        
        
        
        all.splice(storyIndex, 1, newStory);

        this.setState({ stories: all });
    }


    render() {



        let stories = [];
        
        let sorted = [...this.state.stories].sort((a, b) => a.posted < b.posted);
        stories = sorted.map((story, index) => (
            <StoryCard currentTag={this.props.currentTag} callback={this.handleVote} style={footerStyle} key={index} story={story} kind={this.getKind(story.url)} />
        ));

        
        return <div>

            {this.state.stories.length>1 ?
                stories
                :
                <StaticContent></StaticContent>
            }
            {this.state.fetching ?
                <Button style={footerButtonStyle} variant="warning" size="lg" block>Fetching...</Button>
                :
                <Button style={footerButtonStyle} onClick={this.handleFetchMore} variant="primary" size="lg" block>More</Button>

            }
        </div>;
    }

};
export default StoryList;

