

export const showBHMapSearch = () => ({
        type: 'SHOW_BH_MAP_SEARCH'
    })

//AdressForm Actions
export function getLogradouroTypeList(){
    return{
        type: 'LOGRADOURO_TYPE_LIST'
    }
}

export function fetchAddress(chamada,tipo,num=0){
    
    return{
        type: 'FETCH_ADDRESS',
        payload: chamada,
        tipo:tipo,
        num:num
    }
}

export function showNearbyAddresses(nearbyAddresses={
    "endereco":[{
        "numero":"",
        "letra":"",
        "cep":"",
        "wkt":"",
        "id":"724589",
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
    }){
    
    return{
        type: 'SHOW_NEARBY_ADDRESSES',
        payload: nearbyAddresses
    }
}

//Bairro Form Actions

export function getBairroList(){
    return{
        type: 'BAIRRO_LIST'
    }
}

export function fetchBairro( id ){
    return{
        type: 'FETCH_BAIRRO',
        payload: id
    }
}

//CEP Form Actions
export function fetchCEP( cep ){
    return{
        type: 'FETCH_CEP',
        payload: cep
    }
}

//IPTU Form Actions
export function fetchIPTU( iptu ){
    return{
        type: 'FETCH_IPTU',
        payload: iptu
    }
}

//Lote CP
export function fetchLoteCP( lote ){
    return{
        type: 'FETCH_LOTE_CP',
        payload: lote
    }
}

//Filtro Form Actions

export function getCamadasList( ){
    return{
        type: 'FETCH_CAMADAS_LIST',
    }
}

export function getAtrrSuggList(camadaName,atrrValue=0){
    return{
        type: 'FETCH_ATRR_SUGG_LIST',
        camadaName:camadaName,
        atrrValue: atrrValue
    }
}

export function fetchFilter(busca,nomeCamada){
    return{
        type: 'FETCH_FILTER',
        busca,
        nomeCamada
    }
}

export function carregaAtributos(valueCamada){    
    return{
        type: 'CARREGA_ATRIBUTOS',
        valueCamada:valueCamada
    }
}