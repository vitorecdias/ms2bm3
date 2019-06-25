import React from 'react'

function bhmapsearch(state = { show: 'none',logradouroTypeList:[],addressResult:[],showNearAddresses:[],showNearAddresses:'none',
nearbyAddresses:{
    "endereco":[{
        "numero":"",
        "letra":"",
        "cep":"",
        "wkt":"",
        "id":"",
        "nomelogradouro":"",
        "idlogradouro":"",
        "tipologradouro":"",
        "bairropopular":"",
        "idbairro":"",
        "nomeregional":"",
        "idregional":"",
        "codregional":"",
        "idterritorio":"",
        "siglaterritorio":""}]
    },
    bairroList:[],
    camadasList:[],
    atrrSuggList:[],
    atributosList:[]
    }
    , action) {
    switch (action.type) {
        case 'SHOW_BH_MAP_SEARCH':
            return {...state, show: state.show === 'none'?'block':'none'};
            
        //reducers AddressForm
        case "LOGRADOURO_TYPE_LIST_FETCHED":{
            const list = []
            const list2 = ['TODOS']
            action.payload.data.map(e => list.push(e.descricao))
            return {...state, logradouroTypeList: list2.concat(list.sort())};
        }
        
        case "FETCHED_ADDRESS":{                        
            return {...state, addressResult: action.payload};
        }  

        case "SHOW_NEARBY_ADDRESSES":{
            return {...state, 
                    showNearAddresses: action.payload.endereco[0].tipologradouro!=''? 'block':'none',
                    nearbyAddresses: action.payload 
                }
        }

        //reducers BairroForm
        case "BAIRRO_LIST_FETCHED":{
            const list = []
            action.payload.data.features.map(e => list.push({nome:e.properties.NOME,id:e.properties.ID}))
            return {...state, bairroList: list.sort()};
        }

        //reducers Filter Form
        case "CAMADAS_LIST_FETCHED":{
            let list =[]
            let atrList = []

            action.payload.map(e=> !e.privado && e.display_name != 'Base BH' ?list.push(e):null)

            Object.keys(action.atributosList).map(
                (e,j)=>{
                    atrList.push(<option key={j} value={action.atributosList[e]}>{e}</option>)            
                }
            )

            return {...state, camadasList: list,atributosList: atrList};
        }

        case "ATRR_SUGG_LIST_FETCHED":{
            
            return {...state, atrrSuggList: action.payload};
        }
        case "CARREGA_ATRIBUTOS":{            
            let atrList = []

            Object.keys(state.camadasList[action.valueCamada].servicos.wfs.attributes).map(
                (e,j)=>{
                    atrList.push(<option key={j} value={state.camadasList[action.valueCamada].servicos.wfs.attributes[e]} selected={j==0?true:false}>{e}</option>)            
                }
            )
            return {...state, atributosList: atrList};
            
        }
        default:
            return state;
    }
}


module.exports = bhmapsearch;