import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

class ReplyForm extends Component {
    constructor(props) {
        super(props);

        this.state = { submitting: false, value: '' };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) { this.setState({ value: event.target.value }); }
    finishedSubmitting=()=>{
        this.setState({submitting:false});
    }    
    
    handleSubmit(event) {
        event.preventDefault();
        this.setState({submitting:true},()=>{
           
           
           
            this.props.callback({
                message:this.state.value,
                doneSubmitting:this.finishedSubmitting,
                replyToId:this.props.commentId}
                );
                this.finishedSubmitting();
        });
        
                
                
        
        
        
        
    }
    render() {
        let submitting = this.state.submitting;

        return <Form>
            {
                !submitting ?
                    <Form.Group controlId="replyFormText">
                        <Form.Control as="textarea" rows="3" value={this.state.value} onChange={this.handleChange} />
                    </Form.Group>
                    :
                    ""}
            {
                !submitting ?
                    <Button variant="primary" onClick={this.handleSubmit}>
                        Reply
                    </Button>
                    :
                    <Button variant="danger" >Submitting please wait...</Button>
            }

        </Form>;
    }

};
export default ReplyForm;