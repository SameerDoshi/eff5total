import React, { Component } from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown'
import Nav from 'react-bootstrap/Nav'
import Row from 'react-bootstrap/Row';
import Navbar from 'react-bootstrap/Navbar'
import { config } from './Constants'
import {
    Link
} from "react-router-dom";
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import EffApi from './EffApi';
import { gql } from '@apollo/client';

const TQ=gql`
    query{
        tags: getTags {name id}
    }
`;

const NTQ=gql`
mutation($tagName:String){
    newtag(tagName:$tagName){
      id,name
    }
  }
`;
const SQ=gql`
mutation(
    $title:String
    $tagName:String
    $url:String,
    $text:String
  ){
    submit(
        title:$title,
        url:$url,
        text:$text
        tagName:$tagName
      ){ id Headline tag}
  }
`;


const navStyle = {
    marginTop: '65px'
};

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
  
class TagList extends Component {
   
    constructor(props) {
        super(props);
        this.state = {
            notfound: false,
            modal: false,
            description: '',
            url: '',
            title: '',
            tags: [],
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.handlePostSubmission = this.handlePostSubmission.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    getTags=()=>{
        EffApi.query({
          query: TQ
      })
     .then((res) => {
      
      let tags=[...res.data.tags].sort((a, b) => { return a.name.toLowerCase() > b.name.toLowerCase()});
        
        
        this.setState({ tags: tags });
      });
      }
    componentDidMount(){
        this.getTags();
    }

    handleChange = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
    }
    handlePostSubmission() {
        EffApi.mutate({
            mutation: SQ,
            variables : { 
                title:this.state.title,
                tagName:this.props.currentTag,
                text:this.state.description, 
                url:this.state.url
                }
        })
        .then((res) => {
            this.setState({ modal: false });
            sleep(1000).then(() => {
                console.log(config.base +"./c/"+this.props.currentTag+"/"+res.data.submit.id);
                //window.location=config.base +"./c/"+this.props.currentTag+"/"+res.data.submit.id;
              });
              
           
        });
    }


    toggleModal() {
        let nmodal = !this.state.modal;
        this.setState({ modal: nmodal });
    }
    
   

        

   

    
    handleClose = () => this.toggleModal();
    handleShow = () => this.toggleModal();
    createNewTag = () =>{
        console.log("New tag");
        EffApi.mutate({
            mutation: NTQ,
            variables : { 
                tagName:this.props.currentTag
                }
        })
        .then((resp)=>{
            console.log(resp);
            this.setState({notfound:false});
        });
    }
    getNavs =()=>{
        if(this.state.tags.length ===0){
            return "";
        }
        
        let randoms=Math.floor(window.innerWidth/100);
        if(randoms>this.state.tags.length){randoms=this.state.tags.length;}
        if(this.props.currentTag.length>10){randoms--;}
        let current=this.props.currentTag?this.props.currentTag:'technology';
        let ctag=this.state.tags.filter(tag => tag.name === current);
        
        if(ctag.length<1){
            ctag=[{name:this.props.currentTag}];
            if(!this.state.notfound){
                this.setState({notfound:true});
            }
        }else{
            if(this.state.notfound){
                this.setState({notfound:false});
            }
        }
        let upfront=[ctag[0]];
        for (let index = 0; index < randoms; index++) {
            let item= this.state.tags[Math.floor(Math.random() * this.state.tags.length)];
            let includedalready=upfront.filter(i=>i.name===item.name);
            includedalready.length>0?index--:upfront.push(item);

        }
        
        
        return upfront.map((tag, index) => (
            <Nav.Item key={index}>
                <Nav.Link as={Link} to={"/t/" + tag.name} eventKey={index} title="Item">
                    {tag.name.length>10 && tag.name !== current ? tag.name.substring(0,10): tag.name}
                </Nav.Link>
            </Nav.Item>
        ));
    };
    render() {

        
        let hidePills = this.props.hidePills;
        this.activeKey = 0;
        let notfound=this.state.notfound;
        this.listItems = this.getNavs();

        this.moreItems = this.state.tags.map((tag, index) => (
            <NavDropdown.Item as={Link} to={"/t/" + tag.name} key={index + 3} eventKey={index + 3}>{tag.name}</NavDropdown.Item>
        ));

        return <div>
            <Row>
                <Navbar bg="primary" variant="dark" fixed="top">
                    <Navbar.Brand>Eff5!</Navbar.Brand>
                    <span className="text-white">{this.props.currentTag ? "|" + this.props.currentTag : ""}</span>
                    
                    <Button style={{marginRight:'.5rem'}} className="ml-auto" onClick={this.toggleModal} variant="success">Add</Button>
                    
                    
                    <NavDropdown className="bg-light" title="More" id="nav-dropdown">
                        {this.moreItems}
                    </NavDropdown>
                    
                </Navbar>
            </Row>

            <Row style={navStyle} >
                {!hidePills ?
                    <Nav variant="pills" activeKey={this.activeKey} >
                        {this.listItems}
                    </Nav>
                    : ""}
            </Row>
            {notfound?
            <Row><Button onClick={this.createNewTag}>Make {this.props.currentTag} Publicly Viewable</Button></Row>
            :""}
            <Modal show={this.state.modal} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Share Something!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="postForm.headline">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" name="title" onChange={this.handleChange} placeholder="" />
                        </Form.Group>
                        <Form.Group controlId="postForm.url">
                            <Form.Label>Link</Form.Label>
                            <Form.Control type="url" name="url" onChange={this.handleChange} placeholder="" />
                            <Form.Text className="text-muted">
                                Optional
                            
    </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="postForm.ControlText">
                            <Form.Label>Text</Form.Label>
                            <Form.Control as="textarea" name="description" onChange={this.handleChange} rows="4" />
                            <Form.Text className="text-muted">
                                Optional
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Cancel
          </Button>
                    <Button variant="success" onClick={this.handlePostSubmission}>
                        Add
          </Button>
                </Modal.Footer>
            </Modal>
        </div>
    }

};
export default TagList;

