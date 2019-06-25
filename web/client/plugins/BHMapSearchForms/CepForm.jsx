import React from 'react'
import { Form,FormGroup,FormControl, Button,Glyphicon,Row,Col,Grid } from 'react-bootstrap'
import MaskedFormControl from 'react-bootstrap-maskedinput'
import {fetchCEP } from '../../actions/bhmapsearch'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import {show} from '../../actions/notifications'

class CepForm extends React.Component {
    constructor(props, context) {
      super(props, context);
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);

      this.state = {
        valueCEP: ''
      };
    }
 
  
    handleChange(e) {
      this.setState({ valueCEP: e.target.value });
    }

    handleSubmit (){  
      if(this.state.valueCEP.replace("-","").replace(/_/g,"").length >=8){
        this.props.fetchCEP(this.state.valueCEP.replace("-","").replace(/_/g,""))
      }else{
        this.props.show({
            title: "Atenção",
            message: "CEP Inválido.",
            position:'tl',
            autoDismiss:5
        },'warning')
      }
     }
  
    render() {
      return (
        <form> 
        <Grid style={{width:'100%'}}>
        <Row style={{width:'680px'}}>                
            
            <Col md={8}>        
                <FormGroup>
                    <MaskedFormControl 
                        type="text"
                        value={this.state.valueCEP}
                        placeholder="_____-___"
                        onChange={this.handleChange} 
                        mask='11111-111'
                        onKeyPress={e => {
                          if(e.keyCode === 13 && e.shiftKey === false) {
                              this.handleSubmit()  
                          }}}
                        onKeyDown={e => {
                          if(e.keyCode === 13 && e.shiftKey === false) {
                              this.handleSubmit()  
                          }}}
                        />
                </FormGroup>
            </Col>           
            <Col md={2}>
                <FormGroup> 
                    <Button bsStyle='primary' onClick={this.handleSubmit}><Glyphicon glyph="glyphicon glyphicon-search"/></Button>
                </FormGroup> 
            </Col>
            <FormControl.Feedback />
        </Row>
        
        </Grid>
      </form>
      );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({ fetchCEP,show}, dispatch)
export default connect( null, mapDispatchToProps)(CepForm)