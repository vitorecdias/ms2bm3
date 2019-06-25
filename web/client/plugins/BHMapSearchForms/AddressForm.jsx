import React from 'react'
import { Form,FormGroup,FormControl, Button,Glyphicon,Row,Col,Grid } from 'react-bootstrap'

import axios from 'axios'
import { bindActionCreators } from 'redux'
import {getLogradouroTypeList, fetchAddress} from '../../actions/bhmapsearch'
import {show} from '../../actions/notifications'
import {connect} from 'react-redux'

import {Typeahead} from 'react-bootstrap-typeahead';

class AddressForm extends React.Component {
    constructor(props){
        super(props)

        this.state ={
            valueType: 'RUA',
            valueLogradouro:'',
            valueNumber:'',
            logSuggestionsList:[],
            disableNum:false
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChangeLogField = this.handleChangeLogField.bind(this)
        this.onSelectSuggestion = this.onSelectSuggestion.bind(this)
        this.onSelectType = this.onSelectType.bind(this)
        this.onChangeNumber = this.onChangeNumber.bind(this)
        this.submitSuggAddress =this.submitSuggAddress.bind(this)
        this.carregaTipoLogradouro = this.carregaTipoLogradouro.bind(this)
    }

    componentWillMount(){
         this.props.getLogradouroTypeList()  
 
    }    

  handleChangeLogField(value){    
    this.setState({valueLogradouro: value})  
    if(value.length >0){
    axios.get("http://geocoder.pbh.gov.br/geocoder/v2/logradouros?filtrado=true&tipo="+(this.state.valueType=='TODOS'?'':this.state.valueType)+"&nome="+value)
    .then(resp=>{
        var list = []
        if(resp.data.length > 0){       
            resp.data.map(e =>{
            list.push({'labelKey':e.idlogradouro+"",'label':e.nomelogradouro})                    
        } )
        let distinctList = [...new Set(list.map(x=>x))]

        this.setState({logSuggestionsList: distinctList})
        } else{
            this.setState({logSuggestionsList: []}) 
        }
        })
        .catch(e=>{
            console.log('Erro', e)
        })
         
    }else{
        this.setState({logSuggestionsList: []}) 
    }
  }

  onSelectSuggestion(event){
      console.log(event)
      this.setState({
          valueLogradouro: event.suggestion
      })
  }
  
  handleSubmit (){        

      if(this.state.valueLogradouro === '' && !this.state.idLogradouro){
          this.props.show({
                title: "Atenção",
                message: "Insira pelo menos o nome do Logradouro.",
                position:'tl',
                autoDismiss:5
            },'warning')
      }else if(this.state.valueNumber === ''){
          if(this.state.valueType != 'TODOS'){
            this.props.fetchAddress(
                "http://bhmapogcbase.pbh.gov.br/bhmapogcbase/wfs?version=2.0.0&request=GetFeature&typeName=ide_bhgeo_geopackage:TRECHO_LOGRADOURO&maxFeatures=50&outputFormat=application/json&CQL_FILTER=NOME_LOGRADOURO%20=%20%27"+this.state.valueLogradouro.toUpperCase().trim()+"%27%20and%20TIPO_LOGRADOURO=%27"+this.state.valueType+"%27",
                1
            )
          }else{
            axios.get("http://geocoder.pbh.gov.br/geocoder/v2/logradouros/?nome="+this.state.valueLogradouro.trim()).
            then(result => {
                var ids = ''
                result.data.map(e=>{ids+=e.idlogradouro+','})
                this.props.fetchAddress(
                    "http://bhmap.pbh.gov.br/v2/BHMapProxy.jsp?server=http%3A%2F%2Fbhmapogcbase.pbh.gov.br%2Fbhmapogcbase%2Fwfs%3Fversion%3D2.0.0%26request%3DGetFeature%26typeName%3Dide_bhgeo_geopackage%253ATRECHO_LOGRADOURO%26maxFeatures%3D50%26outputFormat%3Dapplication%252Fjson%26CQL_FILTER%3DID_LOGRADOURO%2520IN%2520("+ids.substr(0, ids.length-1)+")",
                    1
                )
            }
            ).catch(function (error) {
                this.props.show({
                    title: "Atenção",
                    message: "Nenhum resultado encontrado.",
                    position:'tl',
                    autoDismiss:5
                },'error')
                return
              })
            
          }
      }else if(this.state.valueLogradouro != ''){

        this.props.fetchAddress('http://geocoder.pbh.gov.br/geocoder/v2/address/?'
                    +(this.state.valueType?'tipologradouro='+this.state.valueType+'&':'')
                    +(this.state.valueLogradouro?'logradouro='+this.state.valueLogradouro.toUpperCase().trim()+'&':'')
                    +(this.state.valueNumber?'numero='+this.state.valueNumber.toUpperCase().trim():'')
                    +("&aproximado=true"),
                    2,
                    this.state.valueNumber.toUpperCase())
      }
  }

  submitSuggAddress(){

        this.props.fetchAddress('http://geocoder.pbh.gov.br/geocoder/v2/address/?'
                +('tipologradouro='+this.props.nearbyAddresses.endereco[0].tipologradouro+'&')
                +('logradouro='+this.props.nearbyAddresses.endereco[0].nomelogradouro+'&')
                +('numero='+this.props.nearbyAddresses.endereco[0].numero)
                +("&aproximado=true"),2,this.props.nearbyAddresses.endereco[0].numero+this.props.nearbyAddresses.endereco[0].letra)

        this.setState({valueNumber:this.props.nearbyAddresses.endereco[0].numero+this.props.nearbyAddresses.endereco[0].letra})
  }
  onSelectType(event){
       
    event.target.value=='TODOS'?this.setState({disableNum:true,valueNumber:''}):this.setState({disableNum:false})

    this.handleChangeLogField('')
    this.setState({
        valueType: event.target.value,
        valueLogradouro:'',
        valueNumber:'',
        logSuggestionsList:[]
    })
    this.refs.logField.getInstance().clear()
  }

  onChangeNumber(event){

      this.setState({valueNumber: event.target.value})
  }

  onChangeLog = (e) => {
        this.setState({valueLogradouro: e.target.value})

  };

  carregaTipoLogradouro(){
      
      var typeList =[]
      this.props.logradouroTypeList.map(
          (e,i)=>{
            typeList.push(<option key={i}value={e}>{e}</option>)            
          }
      )
      
    return typeList
  }
    render() {
      return (
        
        <form> 
            <Grid style={{width:'100%'}}>
            <Row style={{width:'680px'}}>                
                <Col md={3}>
                    <FormGroup>
                        <FormControl componentClass="select" value={this.state.valueType} onChange={e => this.onSelectType(e)} >
                            {this.carregaTipoLogradouro()}
                        </FormControl>
                    </FormGroup>
                </Col>
                <Col md={5}>        
                    <FormGroup>      
                        <Typeahead
                            id='1'
                            value={this.state.valueLogradouro}
                            ref="logField"
                            emptyLabel={'digite o nome de '+this.state.valueType}                            
                            options={this.state.logSuggestionsList}
                            placeholder="logradouro"
                            onInputChange={e=> this.handleChangeLogField(e)}
                            onChange={e=>{
                                console.log(e)
                                e[0] != undefined?this.handleChangeLogField(e[0].label):null
                            }}
                            filterBy={['labelKey']}
                            selectHintOnEnter={true}
                            onKeyDown={e => {
                                if(e.keyCode === 13 && e.shiftKey === false && this.state.idLogradouro != 0) {
                                    this.handleSubmit()  
                                }}}
                            
                            />  
     
                    </FormGroup>
                </Col>
                <Col md={2}>
                    <FormGroup>
                        <FormControl
                            disabled={this.state.disableNum}
                            type="text"
                            value={this.state.valueNumber}
                            placeholder="nº"
                            onChange={this.onChangeNumber} 
                            onKeyPress={e => {
                                if(e.keyCode === 13 && e.shiftKey === false) {
                                    this.handleSubmit()  
                                }}} 
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
            <Row style={{display:this.props.showNearAddresses}}>
                <h4><b>Não encontramos o endereço.</b></h4>
                <h5 onClick={()=>this.submitSuggAddress()}>      
                    Endereço aproximado:                         
                            <u>{this.props.nearbyAddresses.endereco[0].tipologradouro} {this.props.nearbyAddresses.endereco[0].nomelogradouro}, {this.props.nearbyAddresses.endereco[0].numero}{this.props.nearbyAddresses.endereco[0].letra}</u>              
                </h5>                
            </Row>
            </Grid>
        </form>
 
      );
    }
  }
 
const mapStateToProps = state => ({ 
    logradouroTypeList: state.bhmapsearch.logradouroTypeList,
    showNearAddresses: state.bhmapsearch.showNearAddresses,
    nearbyAddresses: state.bhmapsearch.nearbyAddresses
})

const mapDispatchToProps = dispatch => bindActionCreators({ fetchAddress,getLogradouroTypeList,show}, dispatch)
export default connect( mapStateToProps, mapDispatchToProps)(AddressForm)