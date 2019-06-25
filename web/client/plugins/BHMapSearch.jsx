import React from 'react'

import { connect } from 'react-redux';
import Dialog from '../components/misc/Dialog'
import {showBHMapSearch} from '../actions/bhmapsearch'
import PropTypes from 'prop-types';

import AddressForm from './BHMapSearchForms/AddressForm'
import BairroForm from './BHMapSearchForms/BairroForm'
import CepForm from './BHMapSearchForms/CepForm'
import IptuForm from './BHMapSearchForms/IptuForm'
import LoteCPForm from './BHMapSearchForms/LoteCPForm'
import FilterForm from './BHMapSearchForms/FilterForm'

import { Glyphicon,Tab,Tabs ,Panel,Button } from 'react-bootstrap'
import {fetchLogradourosTypeList,
    fetchedAddress,
    fetchBairroList,
    fetchedBairro,
    fetchedCEP,
    fetchedIPTU,
    fetchedLoteCP,
    fetchedCamadasList,
    fetchedAtrrSuggList,
    fetchedFilter} from '../epics/bhmapsearch'

import bhmapsearch from '../reducers/bhmapsearch'
import {get} from 'lodash';
import assign from 'object-assign';

class BHMapSearch extends React.Component{
    static propTypes = {
        show: PropTypes.string
    };

    render(){
        
        return(
            <Dialog style= {{
                    position: "relative",
                    left: "100px",
                    margin: "0px",
                    opacity: 0.9, 
                    zIndex: 5000,
                    width:'700px',
                    display:this.props.show
                    }}
                    >
                <span role="header"><span className="about-panel-title"><Glyphicon glyph="glyphicon glyphicon-search"/>   Busca</span><button onClick={this.props.onShow} className="about-panel-close close"><span><Glyphicon glyph={'1-close'}/></span></button></span>
                <div role="body">
                <Tabs defaultActiveKey={1}>
                    <Tab key='address_form' eventKey={1} title="Endereço">
                        <Panel>
                            <AddressForm/>
                        </Panel>
                    </Tab>
                    <Tab key='bairro_form' eventKey={2} title="Bairro">
                        <Panel>
                            <BairroForm/>
                        </Panel>
                    </Tab>
                    <Tab key='cep' eventKey={3} title="CEP">
                        <Panel>
                            <CepForm/>
                        </Panel>
                    </Tab>
                    <Tab key='iptu' eventKey={4} title="IPTU">
                        <Panel>
                           <IptuForm/>
                        </Panel>
                    </Tab>
                    <Tab key='lote_cp_form' eventKey={5} title="LOTE CP">
                        <Panel>
                           <LoteCPForm/>
                        </Panel>
                    </Tab>
                    <Tab key='filtro_form' eventKey={6} title="Filtro">
                        <Panel>
                           <FilterForm/>
                        </Panel>
                    </Tab>
                </Tabs>
                </div>                 
                
            </Dialog>  
        )
    }

}

const BHMapSch = connect( state => ({ 
    show: get(state, 'bhmapsearch.show')
    
}), {
    onShow: showBHMapSearch
})(BHMapSearch)

export const BHMapSearchPlugin = assign(BHMapSch, {
    
    ToolBar: {
        name: "BHMapSearch",
        id: "bhmap_search",
        priority: 1
    }
});
export const reducers = {bhmapsearch};
export const epics = {
    fetchLogradourosTypeList,
    fetchedAddress,
    fetchBairroList,
    fetchedBairro,
    fetchedCEP,
    fetchedIPTU,
    fetchedLoteCP,
    fetchedCamadasList,
    fetchedAtrrSuggList,
    fetchedFilter
};