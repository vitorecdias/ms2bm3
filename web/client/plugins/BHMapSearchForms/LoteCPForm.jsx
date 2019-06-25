import React from 'react'
import { Form,FormGroup,FormControl, Button,Glyphicon,Row,Col,Grid } from 'react-bootstrap'
import {fetchLoteCP } from '../../actions/bhmapsearch'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'

class LoteCPForm extends React.Component {
    constructor(props, context) {
      super(props, context);

      this.handleSubmit = this.handleSubmit.bind(this);

      this.state = {
        valueZonaFiscal: '',
        valueQuadra: '',
        valueLote:''
      };
    } 
  
    handleSubmit (){  
        
        this.props.fetchLoteCP({valueZonaFiscal: this.state.valueZonaFiscal.toUpperCase(),valueQuadra:this.state.valueQuadra.toUpperCase(),valueLote:this.state.valueLote.toUpperCase()})
     }
  
    render() {

      return (
        <form> 
        <Grid style={{width:'600px'}}>
        <Row style={{width:'600px'}}>                
            
            <Col md={3}>
                <FormGroup>
                    <FormControl
                        type="text"
                        value={this.state.valueZonaFiscal}
                        placeholder="nº Zona Fiscal"
                        onChange={e=>this.setState({ valueZonaFiscal: e.target.value })} 
                        onKeyPress={e => {
                            if(e.keyCode === 13 && e.shiftKey === false) {
                                this.handleSubmit()  
                            }}} 
                        />
                </FormGroup>
            </Col>
            <Col md={3}>
                <FormGroup>
                    <FormControl
                        type="text"
                        value={this.state.valueQuadra}
                        placeholder="nº Quadra"
                        onChange={e=>this.setState({ valueQuadra: e.target.value })} 
                        onKeyPress={e => {
                            if(e.keyCode === 13 && e.shiftKey === false) {
                                this.handleSubmit()  
                            }}} 
                        />
                </FormGroup>
            </Col>
            <Col md={3}>
                <FormGroup>
                    <FormControl
                        type="text"
                        value={this.state.valueLote}
                        placeholder="nº Lote"
                        onChange={e=>this.setState({ valueLote: e.target.value })} 
                        onKeyPress={e => {
                            if(e.keyCode === 13 && e.shiftKey === false) {
                                this.handleSubmit()  
                            }}} 
                        />
                </FormGroup>
            </Col>
            <Col md={3}>
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

const mapDispatchToProps = dispatch => bindActionCreators({fetchLoteCP}, dispatch)
export default connect( null, mapDispatchToProps)(LoteCPForm)