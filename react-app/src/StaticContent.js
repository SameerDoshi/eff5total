//import React from 'react'
import React, { Component } from 'react';
import { config } from './Constants';
import StoryCard from './StoryCard';
import Button from 'react-bootstrap/Button'
import EffApi from './EffApi';
import { gql } from '@apollo/client';


class StaticContent extends Component {
    constructor(props) {
        super(props);
      
    }
    


    render() {
     return <div>

            <h2>Nothing Found </h2>
            <h3><a href="/">Eff5.io</a></h3>
        </div>;
    }

};
export default StaticContent;

