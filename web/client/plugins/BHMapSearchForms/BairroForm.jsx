import React from 'react'
import { Form,FormGroup,FormControl, Button,Glyphicon,Row,Col,Grid } from 'react-bootstrap'

import axios from 'axios'
import { bindActionCreators } from 'redux'
import {getBairroList,fetchBairro} from '../../actions/bhmapsearch'
import {connect} from 'react-redux'
import {show} from '../../actions/notifications'

import Autosuggest  from 'react-bootstrap-autosuggest'

class BairroForm extends React.Component {
    constructor(props, context) {
      super(props, context);
  
      this.state = {
        valueBairro: ''
      };

      this.onChange =this.onChange.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)
      this.findId = this.findId.bind(this)
    }
    componentWillMount(){
      this.props.getBairroList()  
      
    }

    findId(e, index, array) {
          
        if (e.nome == this.state.valueBairro) {
          return e.id;
        }
      
      return null;
    }

    handleSubmit(){     
      
      var id = this.props.bairroList.find(this.findId);
      
      if (id && id != undefined && id.id != 0){
        this.props.fetchBairro(id.id)
      }else{
        this.props.show({
            title: "Atenção",
            message: "Nenhum bairro encontrado.",
            position:'tl',
            autoDismiss:5
        },'warning')
      }

    }

    carregaTipoLogradouro(){
        
        var bairroList =[]
        this.props.bairroList.map(
            (e)=>{
              bairroList.push(e.nome)            
            }
        )
        return bairroList
    }

    onChange(e){
      console.log(e)
      this.setState({valueBairro: e})
    }  

    render() {
      return (
        
        <form> 
            <Grid style={{width:'100%'}}>
            <Row style={{width:'680px'}}>                
                
                <Col md={10}>        
                    <FormGroup>      
                    <Autosuggest
                        datalist={this.carregaTipoLogradouro()}
                        placeholder="digite o nome do bairro"
                        onChange={this.onChange}
                        value={this.state.valueBairro}
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
                <FormControl.Feedback />
            </Row>
            
            </Grid>
        </form>
      );
    }
  }
 
const mapStateToProps = state => ({ 
  bairroList: state.bhmapsearch.bairroList
})
const mapDispatchToProps = dispatch => bindActionCreators({ getBairroList,fetchBairro,show}, dispatch)
export default connect( mapStateToProps, mapDispatchToProps)(BairroForm)