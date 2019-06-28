import React from 'react'
import { Form,FormGroup,FormControl, Button,Glyphicon,Row,Col,Grid } from 'react-bootstrap'

import { bindActionCreators } from 'redux'
import {getCamadasList,getAtrrSuggList,fetchFilter,carregaAtributos} from '../../actions/bhmapsearch'
import {connect} from 'react-redux'
import {Typeahead} from 'react-bootstrap-typeahead';
import If from './utils/if'
import {show} from '../../actions/notifications'

class FilterForm extends React.Component {
    constructor(props){
        super(props)
        this.state ={
            valueCamada: 0,
            valueAttr:'',
            valueOperador:'=',
            valor:'',
            valor1:'',
            valor2:'',
            showValues:false
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.carregaCamadas = this.carregaCamadas.bind(this)
        this.onSelectCamada = this.onSelectCamada.bind(this)
        this.onSelectAtributo = this.onSelectAtributo.bind(this)
    }

    componentWillMount(){
        this.props.getCamadasList()      
    }   

    componentDidMount(){      
    }

    onSelectCamada(event){    

        this.props.carregaAtributos(event.target.value)

        this.setState({  
            valueCamada: event.target.value,
            valor:'',
            valor1:'',
            valor2:''
        })
        if(this.state.valueOperador != 'BETWEEN'){
            this.refs.valor.getInstance().clear()
        }else{
            this.refs.valor1.getInstance().clear()
            this.refs.valor2.getInstance().clear()
        }
    }

    onSelectAtributo(e){
        
        this.setState({    
            valueAttr:e.target.value,        
            valor:'',
            valor1:'',
            valor2:''
        })
        if(this.state.valueOperador != 'BETWEEN'){
            this.refs.valor.getInstance().clear()
        }else{
            this.refs.valor1.getInstance().clear()
            this.refs.valor2.getInstance().clear()
        }
    }
  
    handleSubmit (){       

        if(this.state.valueOperador != "BETWEEN" && this.state.valor!=''){
            this.props.fetchFilter(
                "http://bhmap.pbh.gov.br/v2/api/wfs?version=2.0.0&request=GetFeature&typeName=ide_bhgeo_geopackage%3A"+this.props.camadasList[this.state.valueCamada].servicos.wfs.typename+"&outputFormat=application%2Fjson&CQL_FILTER="+(/^\d+$/.test(this.state.valor)?this.attr.value:"strToLowerCase("+this.attr.value+")")+"%20"+this.state.valueOperador+"%20%27"+(String(this.state.valor).toLowerCase())+"%27",
                this.props.camadasList[this.state.valueCamada].servicos.wfs.typename,
                this.props.camadasList[this.state.valueCamada].servicos.wfs.workspace
                )
        }else if(this.state.valor1!='' && this.state.valor2!=''){
            this.props.fetchFilter(
                "http://bhmap.pbh.gov.br/v2/api/wfs?version=2.0.0&request=GetFeature&typeName=ide_bhgeo_geopackage%3A"+this.props.camadasList[this.state.valueCamada].servicos.wfs.typename+"&outputFormat=application%2Fjson&CQL_FILTER="+(/^\d+$/.test(this.state.valor1) && /^\d+$/.test(this.state.valor2)?this.attr.value:"strToLowerCase("+this.attr.value+")")+"%20BETWEEN%20%27"+String(this.state.valor1).toLowerCase()+"%27%20AND%20%27"+String(this.state.valor2).toLowerCase()+"%27",
                this.props.camadasList[this.state.valueCamada].servicos.wfs.typename,
                this.props.camadasList[this.state.valueCamada].servicos.wfs.workspace
            )
        }else{
            this.props.show({
                title: "Atenção",
                message: "Nenhum valor digitado.",
                position:'tl',
                autoDismiss:5
            },'warning')
        }
        
    }

    carregaCamadas(){
            
        var list =[]        

        this.props.camadasList.map(
            (e,i)=>{            
                list.push(<option key={i} value={i}>{e.display_name}</option>)            
            }
        )
            
        return list
    }

    render() {
    
      return (
        
        <form> 
            <Grid style={{width:'100%'}}>
            <Row style={{width:'680px'}}>                
                <Col md={5}>
                    <FormGroup>
                        <FormControl componentClass="select" value={this.state.valueCamada} onChange={e => this.onSelectCamada(e)} >
                            {this.carregaCamadas()}
                        </FormControl>
                    </FormGroup>
                </Col>
                <Col md={5}>
                    <FormGroup>
                        <FormControl componentClass="select" value={this.state.valueAttr} onChange={e => {this.onSelectAtributo(e)}} inputRef={ e => this.attr=e } >
                            {this.props.atributosList}
                        </FormControl>
                    </FormGroup>
                </Col>
            </Row>
            <Row style={{width:'680px'}}>                
                <Col md={5}>
                    <FormGroup>
                        <FormControl componentClass="select" value={this.state.valueOperador} onChange={e => {
                            e.target.value=='BETWEEN'?this.setState({valueOperador:e.target.value,showValues:true}):this.setState({valueOperador:e.target.value,showValues:false})                            
                            }} >
                            <option value={'='}>{'== (Igual)'}</option> 
                            <option value={'<>'}>{'!= (Diferente)'}</option> 
                            <option value={'<'}>{'< (Menor)'}</option> 
                            <option value={'>'}>{'> (Maior)'}</option> 
                            <option value={'<='}>{'<= (Menor ou Igual)'}</option> 
                            <option value={'>='}>{'>= (Maior ou Igual)'}</option> 
                            <option value={'BETWEEN'}>{'.. (Entre)'}</option> 
                            <option value={'LIKE'}>{'~ (Similar)'}</option> 
                        </FormControl>
                    </FormGroup>
                </Col>
                <If test={!this.state.showValues}>
                    <Col md={5}>        
                        <FormGroup>      
                            <Typeahead
                                id="1"
                                ref="valor"
                                emptyLabel={'digite o valor '}                            
                                options={this.props.atrrSuggList}
                                placeholder="valor"            
                                paginationText="mostrar mais sugestões"           
                                value={this.state.valor}     
                                onInputChange ={e=>{this.setState({valor:e})}}
                                onChange ={e=>{this.setState({valor:e})}}
                                selectHintOnEnter={true}
                                onFocus={ ()=>{
                                    if(this.state.valor == '')                                    
                                        this.props.getAtrrSuggList(this.props.camadasList[this.state.valueCamada].servicos.wms.name,this.attr.value)
                                }
                                }
                                 />  
        
                        </FormGroup>
                    </Col>
                </If>
                <If test={this.state.showValues}>
                    <Col md={5}>      
                        <Row>
                            <FormGroup>      
                                <Typeahead
                                    id="1"
                                    ref="valor1"
                                    emptyLabel={'digite o valor '}                            
                                    options={this.props.atrrSuggList}
                                    placeholder="valor 1"            
                                    paginationText="mostrar mais sugestões"           
                                    value={this.state.valor1}     
                                    onInputChange ={e=>{this.setState({valor1:e})}}
                                    onChange ={e=>{this.setState({valor1:e})}}
                                    selectHintOnEnter={true}
                                    onFocus={ ()=>{
                                        if(this.state.valor1 == '')                                     
                                            this.props.getAtrrSuggList(this.props.camadasList[this.state.valueCamada].servicos.wms.name,this.attr.value)
                                    }
                                    }    
                                    />  
            
                            </FormGroup>
                        </Row>  
                        <Row>
                            <FormGroup>      
                                <Typeahead
                                    id="2"
                                    ref="valor2"
                                    emptyLabel={'digite o valor '}                            
                                    options={this.props.atrrSuggList}
                                    placeholder="valor 2"            
                                    paginationText="mostrar mais sugestões"           
                                    value={this.state.valor2}     
                                    onInputChange ={e=>{this.setState({valor2:e})}}
                                    onChange ={e=>{this.setState({valor2:e})}}
                                    selectHintOnEnter={true}
                                    onFocus={ ()=>{
                                        if(this.state.valor2 == '')  
                                            this.props.getAtrrSuggList(this.props.camadasList[this.state.valueCamada].servicos.wms.name,this.attr.value)
                                    }
                                    }     
                                    />  
            
                            </FormGroup>
                        </Row> 
                    </Col>
                </If>
                <Col md={2}>
                    <FormGroup> 
                        <Button bsStyle='primary' 
                            onClick={this.handleSubmit}
                                onKeyPress={e => {
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
 
const mapStateToProps = state => ({ 
    camadasList: state.bhmapsearch.camadasList,
    atrrSuggList: state.bhmapsearch.atrrSuggList,
    atributosList: state.bhmapsearch.atributosList
})

const mapDispatchToProps = dispatch => bindActionCreators({ getCamadasList,getAtrrSuggList,fetchFilter,carregaAtributos,show}, dispatch)
export default connect( mapStateToProps, mapDispatchToProps)(FilterForm)