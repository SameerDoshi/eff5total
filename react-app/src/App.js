import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'semantic-ui-css/semantic.min.css';
import 'react-chat-elements/dist/main.css';
import StoryList from './StoryList'
import CommentList from './CommentList'
import TagList from './TagList'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";


class App extends Component {
 
  render() {
    
    return (
    
        <Router>
       
        <Switch>
          <Route path="/about"/>
          <Route path="/c/:curtag/:storyId" render={(props) => <div><TagList hidePills="true" currentTag={props.match.params.curtag} /> <CommentList storyId={props.match.params.storyId} /></div>} />
          <Route path="/t/:curtag" render={(props) => <div><TagList currentTag={props.match.params.curtag} /><StoryList currentTag={props.match.params.curtag}/></div>} />
          <Route path="/" render={() => <div><TagList currentTag="technology"/><StoryList currentTag={this.props.currentTag} /></div>} />
        </Switch>
      </Router>
      
    );
  }
}
export default App;

