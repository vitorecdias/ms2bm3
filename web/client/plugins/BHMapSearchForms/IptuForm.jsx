import React from 'react'
import { Form,FormGroup,FormControl, Button,Glyphicon,Row,Col,Grid } from 'react-bootstrap'
import MaskedFormControl from 'react-bootstrap-maskedinput'
import {fetchIPTU } from '../../actions/bhmapsearch'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import {show} from '../../actions/notifications'

class IptuForm extends React.Component {
    constructor(props, context) {
      super(props, context);
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);

      this.state = {
        valueIPTU: ''
      };
    } 
  
    handleChange(e) {
      this.setState({ valueIPTU: e.target.value });
    }

    handleSubmit (){  
        var iptu =this.state.valueIPTU.replace(/\./g, '').replace(/\-/,"").replace(/\_/,"")
        if(iptu.length >= 15){
            this.props.fetchIPTU(iptu)
        }else{
            this.props.show({
                title: "Atenção",
                message: "IPTU Inválido.",
                position:'tl',
                autoDismiss:5
            },'warning')
        }
     }
  
    render() {

      return (
        <form> 
        <Grid style={{width:'100%'}}>
        <Row style={{width:'600px'}}>                
            
            <Col md={8}>        
                <FormGroup>
                <MaskedFormControl 
                    type="text"
                    value={this.state.valueIPTU}
                    placeholder="___.____.____.___-_"
                    onChange={this.handleChange} 
                    onKeyPress={e => {
                        if(e.keyCode === 13 && e.shiftKey === false) {
                            this.handleSubmit()  
                        }}} 
                    mask={'111.111f.111f.111-z'}
                    formatCharacters={{
                        'f': {
                            validate(char) { return /[A-Z-a-z- -0-9]$/.test(char) },
                            transform(char) { return char}
                        },
                        'z': {
                            validate(char) { return /[A-Z-a-z-0-9]$/.test(char) },
                            transform(char) { return char}
                            },
                        }}
                    />
                        
                </FormGroup>
            </Col>           
            <Col md={2}>
                <FormGroup> 
                    <Button bsStyle='primary' onClick={this.handleSubmit} onKeyPress={e => {
                            if(e.keyCode === 13 && e.shiftKey === false) {
                                this.handleSubmit()  
                            }}}><Glyphicon glyph="glyphicon glyphicon-search"/></Button>
                </FormGroup> 
            </Col>
        </Row>
        
        </Grid>
      </form>
      );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({fetchIPTU,show}, dispatch)
export default connect( null, mapDispatchToProps)(IptuForm)