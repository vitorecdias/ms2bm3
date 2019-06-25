/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import Rx from 'rxjs'

import axios from 'axios';
import {show} from '../actions/notifications'

const mapUtils = require('../utils/MapUtils');
const toBbox = require('turf-bbox');
const CoordinatesUtils = require('../utils/CoordinatesUtils');
import { layerLoading, layerLoad ,clearLayers,addLayer,updateNode,removeNode} from '../actions/layers'
import { showNearbyAddresses } from '../actions/bhmapsearch'

const {
  changeMapView
} = require('../actions/map');

var layerBase = {
  id: 'ide_bhgeo:MAPA_BASE__0',
  format: 'image/jpeg',
  group: 'background',
  source: 'bhmap',
  name: 'ide_bhgeo:MAPA_BASE',
  opacity: 1,
  title: 'Mapa Base BH Map',
  type: 'wms',
  url: [
    'http://bhmapogcbase.pbh.gov.br/bhmapogcbase/wms'
  ],
  visibility: true,
  singleTile: false,
  dimensions: [],
  hideLoading: false,
  handleClickOnLayer: false,
  useForElevation: false,
  hidden: false,
  loading: false,
  loadingError: false
}
var layerOrto = {
  id: 'ide_bhgeo:ORTOFOTO_2015__1',
  format: 'image/jpeg',
  group: 'background',
  source: 'ortofoto',
  name: 'ide_bhgeo:ORTOFOTO_2015',
  opacity: 1,
  title: 'Ortofoto BH 2015',
  type: 'wms',
  url: [
    'http://bhmapogcbase.pbh.gov.br/bhmapogcbase/wms'
  ],
  visibility: false,
  singleTile: false,
  dimensions: [],
  hideLoading: false,
  handleClickOnLayer: false,
  useForElevation: false,
  hidden: false
}

var layerLog ={
  type: 'wms',
  url: 'http://bhmapogcbase.pbh.gov.br/bhmapogcbase/wms',
  visibility: true,
  dimensions: [],
  name: 'ide_bhgeo_geopackage:TRECHO_LOGRADOURO',
  title: 'TRECHO_LOGRADOURO',
  description: 'TRECHO_LOGRADOURO',
  bbox: {
    crs: 'EPSG:4326',
    bounds: {
      minx: '-44.06443224752186',
      miny: '-20.054426718192648',
      maxx: '-43.85659489205602',
      maxy: '-19.776289071564925'
    }
  },
  links: [],
  params: {},
  allowedSRS: {
    'EPSG:3785': true,
    'EPSG:3857': true,
    'EPSG:4269': true,
    'EPSG:4326': true,
    'EPSG:31983': true,
    'EPSG:102113': true,
    'EPSG:900913': true
  },
  catalogURL: null,
  id: 'ide_bhgeo_geopackage:TRECHO_LOGRADOURO__2'
}

var layerBairro = {
  type: 'wms',
  url: 'http://bhmapogcbase.pbh.gov.br/bhmapogcbase/wms',
  visibility: true,
  dimensions: [],
  name: 'ide_bhgeo_geopackage:BAIRRO',
  title: 'BAIRRO',
  description: 'BAIRRO',
  bbox: {
    crs: 'EPSG:4326',
    bounds: {
      minx: '-44.06443743875966',
      miny: '-20.059779436586837',
      maxx: '-43.85576115758091',
      maxy: '-19.7761767390773'
    }
  },
  links: [],
  params: {},
  allowedSRS: {
    'EPSG:3785': true,
    'EPSG:3857': true,
    'EPSG:4269': true,
    'EPSG:4326': true,
    'EPSG:31983': true,
    'EPSG:102113': true,
    'EPSG:900913': true
  },
  catalogURL: null,
  id: 'ide_bhgeo_geopackage:BAIRRO__2',
  loading: false,
  search: {
    url: 'http://bhmapogcbase.pbh.gov.br:80/bhmapogcbase/wfs',
    type: 'wfs'
  },
  loadingError: false
}

var layerEnd = {
  type: 'wms',
  url: 'http://bhmapogcbase.pbh.gov.br/bhmapogcbase/wms',
  visibility: true,
  dimensions: [],
  name: 'ide_bhgeo_geopackage:ENDERECO',
  title: 'ENDERECO',
  description: 'ENDERECO',
  bbox: {
    crs: 'EPSG:4326',
    bounds: {
      minx: '-44.06431705510664',
      miny: '-20.028938784088783',
      maxx: '-43.861071836821964',
      maxy: '-19.776633719675576'
    }
  },
  links: [],
  params: {},
  allowedSRS: {
    'EPSG:3785': true,
    'EPSG:3857': true,
    'EPSG:4269': true,
    'EPSG:4326': true,
    'EPSG:31983': true,
    'EPSG:102113': true,
    'EPSG:900913': true
  },
  catalogURL: null,
  id: 'ide_bhgeo_geopackage:ENDERECO__2',
  loading: false,
  search: {
    url: 'http://bhmapogcbase.pbh.gov.br:80/bhmapogcbase/wfs',
    type: 'wfs'
  },
  loadingError: false
}

import { addMarker } from '../actions/search'

////////////////ADDRESS FORM
const fetchLogradourosTypeList = action$ =>
  action$.ofType('LOGRADOURO_TYPE_LIST').switchMap(() => {

    return Rx.Observable.fromPromise(
      axios.get("http://geocoder.pbh.gov.br/geocoder/v2/logradouros/tipos")
        .then(result => ({ type: 'LOGRADOURO_TYPE_LIST_FETCHED', payload: result }))
        .catch(e => console.log('Erro', e))

    )
  })

const fetchedAddress = action$ =>
  action$.ofType('FETCH_ADDRESS').switchMap(action => {    
    
    if (action.tipo === 1) {
      return Rx.Observable.fromPromise(
        axios.get(action.payload)
      ).concatMap(result => {
        
        layerLoading(0)
        console.log(result.data)
          if(result.data.features.length > 0){
            var marker = result.data

            let mapSize = {
              width: 1920,
              height: 909
            };

            let bbox = CoordinatesUtils.reprojectBbox(toBbox(marker),"EPSG:31983","EPSG:4326")

            let newZoom = mapUtils.getZoomForExtent(CoordinatesUtils.reprojectBbox(bbox, "EPSG:4326", "EPSG:31983"), mapSize, 0, 21, null) ;

            let newCenter = mapUtils.getCenterForExtent(bbox, "EPSG:31983");

            layerLoad(0)
            return Rx.Observable.of(
              addMarker(CoordinatesUtils.reprojectGeoJson(marker,"EPSG:31983","EPSG:4326")),
              changeMapView(newCenter, newZoom, {
                bounds: {
                  minx: bbox[0],
                  miny: bbox[1],
                  maxx: bbox[2],
                  maxy: bbox[3]
                },
                crs: "EPSG:31983",
                rotation: 0
              }, mapSize, null, "EPSG:31983"),
              removeNode('ide_bhgeo_geopackage:BAIRRO__2','layers'),
              removeNode('ide_bhgeo_geopackage:ENDERECO__2','layers'),
              addLayer(layerLog),
              updateNode("ide_bhgeo_geopackage:TRECHO_LOGRADOURO__2", "layers", {opacity:0}))
          }
          return Rx.Observable.of(show({
            title: "Atenção",
            message: "Nenhum resultado encotrado!",
            position:'tl',
            autoDismiss:5
        },'warning'))
        }
      )
    } else if (action.tipo === 2) {
      layerLoading(0)
      return Rx.Observable.fromPromise(
        axios.get(action.payload)
      ).concatMap(result => {

        var test = 0
        if (result.data.endereco[0].id != '') {

          var geoJson = {
            type: "FeatureCollection",
            features: [],
          }
          console.log(result.data.endereco)
          result.data.endereco.map(e => {
              
            var feature = {
              type: "Feature",
              id: e.id,
              geometry: {
                type: 'Point',
                coordinates: [parseFloat(e.wkt.replace('POINT(', '').replace(' ', ',').replace(')', '').split(',')[0]), parseFloat(e.wkt.replace('POINT(', '').replace(' ', ',').replace(')', '').split(',')[1])]
              }
            }
            test = e.numero == action.num || e.numero + e.letra == action.num ? ++test : test

            geoJson.features.push(feature)

          })

          if (test == 0) {
            return Rx.Observable.of(showNearbyAddresses(result.data))
          }

          var marker = geoJson

          let mapSize = {
            width: 1920,
            height: 909
          };

          let bbox = CoordinatesUtils.reprojectBbox(toBbox(marker), "EPSG:31983", "EPSG:4326")

          let newZoom = mapUtils.getZoomForExtent(CoordinatesUtils.reprojectBbox(bbox, "EPSG:4326", "EPSG:31983"), mapSize, 0, 21, null);

          let newCenter = mapUtils.getCenterForExtent(bbox, "EPSG:4326");

          console.log(newCenter)

          layerLoad(0)
          return Rx.Observable.of(
            addMarker(CoordinatesUtils.reprojectGeoJson(marker,"EPSG:31983","EPSG:4326")),
            changeMapView(newCenter, newZoom, {
              bounds: {
                minx: bbox[0],
                miny: bbox[1],
                maxx: bbox[2],
                maxy: bbox[3]
              },
              crs: "EPSG:31983",
              rotation: 0
            }, mapSize, null, "EPSG:31983"),
            showNearbyAddresses(),
            removeNode('ide_bhgeo_geopackage:BAIRRO__2','layers'),
            removeNode('ide_bhgeo_geopackage:TRECHO_LOGRADOURO__2','layers'),
            addLayer(layerEnd),
            updateNode("ide_bhgeo_geopackage:ENDERECO__2", "layers", {opacity:0}))
        }else{
          return Rx.Observable.of(show({
            title: "Atenção",
            message: "Nenhum resultado encotrado!",
            position:'tl',
            autoDismiss:5
        },'warning'))
        }
      }
      )
    }

  }
  )

////////////////////////BAIRRO FORM
const fetchBairroList = action$ =>
  action$.ofType('BAIRRO_LIST').switchMap(() => {

    return Rx.Observable.fromPromise(
      axios.get('http://bhmapogcbase.pbh.gov.br/bhmapogcbase/wfs/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ide_bhgeo:BAIRRO&outputFormat=application%2Fjson&propertyName=NOME&sortBy=NOME')
        .then(result => ({ type: 'BAIRRO_LIST_FETCHED', payload: result }))
        .catch(e => console.log('Erro', e))

    )
  })

const fetchedBairro = action$ =>
  action$.ofType('FETCH_BAIRRO').switchMap(action => {
    
      return Rx.Observable.fromPromise(
        axios.get("http://bhmap.pbh.gov.br/v2/api/wfs?version=2.0.0&request=GetFeature&typeName=ide_bhgeo_geopackage%3ABAIRRO&outputFormat=application%2Fjson&CQL_FILTER=ID%3D"+action.payload)
      ).concatMap(result => {
        layerLoading(0)
        console.log(result.data)
        var marker = result.data

        let mapSize = {
          width: 1920,
          height: 909
        };

        let bbox = CoordinatesUtils.reprojectBbox(toBbox(marker), "EPSG:31983", "EPSG:4326")

        let newZoom = mapUtils.getZoomForExtent(CoordinatesUtils.reprojectBbox(bbox, "EPSG:4326", "EPSG:31983"), mapSize, 0, 21, null);

        let newCenter = mapUtils.getCenterForExtent(bbox, "EPSG:4326");

        layerLoad(0)
        return Rx.Observable.of(
          addMarker(CoordinatesUtils.reprojectGeoJson(marker,"EPSG:31983","EPSG:4326")),
          changeMapView(newCenter, newZoom, {
            bounds: {
              minx: bbox[0],
              miny: bbox[1],
              maxx: bbox[2],
              maxy: bbox[3]
            },
            crs: "EPSG:31983",
            rotation: 0
          }, mapSize, null, "EPSG:31983"))
      }
      )
  }
  )

  /////////////////CEP FORM

  const fetchedCEP = action$ =>
  action$.ofType('FETCH_CEP').switchMap(action => {
    
      return Rx.Observable.fromPromise(
        axios.get("http://geocoder.pbh.gov.br/geocoder/v2/address/?cep="+action.payload)
      ).concatMap(result => {
        
          if(result.data.endereco[0].id == ''){
              return Rx.Observable.of(show({
                  title: "Atenção",
                  message: "Nenhum resultado encotrado!",
                  position:'tl',
                  autoDismiss:5
              },'warning'))    
          }
        return Rx.Observable.fromPromise(
          axios.get("http://bhmap.pbh.gov.br/v2/BHMapProxy.jsp?server=http%3A%2F%2Fbhmapogcbase.pbh.gov.br%2Fbhmapogcbase%2Fwfs%3Fversion%3D2.0.0%26request%3DGetFeature%26typeName%3Dide_bhgeo_geopackage%253ATRECHO_LOGRADOURO%26maxFeatures%3D50%26outputFormat%3Dapplication%252Fjson%26CQL_FILTER%3DID_LOGRADOURO%2520IN%2520("+result.data.endereco[0].idlogradouro+")")
        ).concatMap(result1 => {
                  layerLoading(0)
                  console.log(result1.data)
                  var marker = result1.data

                  let mapSize = {
                    width: 1920,
                    height: 909
                  };

                  let bbox = CoordinatesUtils.reprojectBbox(toBbox(marker), "EPSG:31983", "EPSG:4326")

                  let newZoom = mapUtils.getZoomForExtent(CoordinatesUtils.reprojectBbox(bbox, "EPSG:4326", "EPSG:31983"), mapSize, 0, 21, null);

                  let newCenter = mapUtils.getCenterForExtent(bbox, "EPSG:31983");

                  layerLoad(0)
                  return Rx.Observable.of(
                    addMarker(CoordinatesUtils.reprojectGeoJson(marker,"EPSG:31983","EPSG:4326")),
                    changeMapView(newCenter, newZoom, {
                      bounds: {
                        minx: bbox[0],
                        miny: bbox[1],
                        maxx: bbox[2],
                        maxy: bbox[3]
                      },
                      crs: "EPSG:31983",
                      rotation: 0
                    }, mapSize, null, "EPSG:31983"),)
        }      
      )
      }
    )
  }
  )

  /////////////////IPTU FORM

  const fetchedIPTU = action$ =>
  action$.ofType('FETCH_IPTU').switchMap(action => {
      console.log(action.payload)
      return Rx.Observable.fromPromise(
        axios.get("http://bhmap.pbh.gov.br/v2/api/wfs?version=2.0.0&request=GetFeature&typeName=pbh_sirgas%3AS2000_LOTE_CTM&outputFormat=application%2Fjson&CQL_FILTER=INDICE_CADASTRAL%3D%27"+action.payload+"%27")
      ).concatMap(result => {        
        layerLoading(0)
        console.log(result.data)
        if(result.data.features.length == 0){
            return Rx.Observable.of(show({
                title: "Atenção",
                message: "Nenhum resultado encotrado!",
                position:'tl',
                autoDismiss:5
            },'error'))    
        }
        var marker = result.data

        let mapSize = {
          width: 1920,
          height: 909
        };

        let bbox = CoordinatesUtils.reprojectBbox(toBbox(marker), "EPSG:31983", "EPSG:4326")

        let newZoom = mapUtils.getZoomForExtent(CoordinatesUtils.reprojectBbox(bbox, "EPSG:4326", "EPSG:31983"), mapSize, 0, 21, null);

        let newCenter = mapUtils.getCenterForExtent(bbox, "EPSG:31983");

        layerLoad(0)
        return Rx.Observable.of(
          addMarker(CoordinatesUtils.reprojectGeoJson(marker,"EPSG:31983","EPSG:4326")),
          changeMapView(newCenter, newZoom, {
            bounds: {
              minx: bbox[0],
              miny: bbox[1],
              maxx: bbox[2],
              maxy: bbox[3]
            },
            crs: "EPSG:31983",
            rotation: 0
          }, mapSize, null, "EPSG:31983"))
              
      
      }
    )
  }
  )
  /////////////////LOTE CP FORM

  const fetchedLoteCP = action$ =>
  action$.ofType('FETCH_LOTE_CP').switchMap(action => {
      console.log(action.payload)
      return Rx.Observable.fromPromise(
        axios.get("http://bhmap.pbh.gov.br/v2/api/wfs?version=2.0.0&request=GetFeature&typeName=ide_bhgeo%3ALOTE_APROVADO&outputFormat=application%2Fjson&CQL_FILTER=ZONA_FISCAL%3D%27"+action.payload.valueZonaFiscal+"%27%20AND%20QUARTEIRAO%3D%27"+action.payload.valueQuadra+"%27%20AND%20LOTE%3D%27"+action.payload.valueLote+"%27")
      ).concatMap(result => {        
        layerLoading(0)
        console.log(result.data)
        if(result.data.features.length > 0){
            var marker = result.data

            let mapSize = {
              width: 1920,
              height: 909
            };

            let bbox = CoordinatesUtils.reprojectBbox(toBbox(marker), "EPSG:31983", "EPSG:4326")

            let newZoom = mapUtils.getZoomForExtent(CoordinatesUtils.reprojectBbox(bbox, "EPSG:4326", "EPSG:31983"), mapSize, 0, 21, null);

            let newCenter = mapUtils.getCenterForExtent(bbox, "EPSG:31983");

            layerLoad(0)
            return Rx.Observable.of(
              addMarker(CoordinatesUtils.reprojectGeoJson(marker,"EPSG:31983","EPSG:4326")),
              changeMapView(newCenter, newZoom, {
                bounds: {
                  minx: bbox[0],
                  miny: bbox[1],
                  maxx: bbox[2],
                  maxy: bbox[3]
                },
                crs: "EPSG:31983",
                rotation: 0
              }, mapSize, null, "EPSG:31983"))
        }else{
          return Rx.Observable.of(show({
              title: "Atenção",
              message: "Nenhum resultado encotrado!",
              position:'tl',
              autoDismiss:5
          },'error'))  
        }
      
      }
    )
  }
  )

    /////////////////FILTRO FORM

const fetchedCamadasList = action$ =>
      action$.ofType('FETCH_CAMADAS_LIST').switchMap(action => {
        return Rx.Observable.fromPromise(
          axios.get('http://bhmap.pbh.gov.br/v2/api/metacamada',{
            headers: {
                'Content-Type': 'application/json',
            }}
          )
            .then(result => {
              return { type: 'CAMADAS_LIST_FETCHED', payload: result.data,atributosList:result.data[0].servicos.wfs.attributes }
            })
            .catch(e => console.log('Erro', e))    
        )
      })

const fetchedAtrrSuggList = action$ =>
    action$.ofType('FETCH_ATRR_SUGG_LIST').switchMap(action => {
      return Rx.Observable.fromPromise(
        axios.get('http://bhmapogcbase.pbh.gov.br/bhmapogcbase/wfs/ows?service=WFS&version=1.0.0&request=GetFeature&typeName='+
        action.camadaName+'&outputFormat=application%2Fjson')
          .then(resp=>{
              if( resp.data.features){
                  var list =[]
                  resp.data.features.map(x => {
                  //console.log(x.properties[action.atrrValue])
                  if(list.indexOf(x.properties[action.atrrValue]) === -1 && x.properties[action.atrrValue] != 'undefined' && x.properties[action.atrrValue] != null && x.properties[action.atrrValue] != 'null') {
                    list.push(x.properties[action.atrrValue]+"");
                  }
                  })
                  return { type: 'ATRR_SUGG_LIST_FETCHED', payload: list }
              }
              return { type: 'ATRR_SUGG_LIST_FETCHED', payload: [] }
          })
          .catch(e=>{
              console.log('Erro', e)
          })   
      )
    })

const fetchedFilter = action$ =>
    action$.ofType('FETCH_FILTER').switchMap(action => {
        layerLoading(0)
        
        return Rx.Observable.fromPromise(
          axios.get(action.busca)
        ).concatMap(result => {        
          
          console.log(result.data)
          let mapSize = {
            width: 1920,
            height: 909
          };

          if(result.data.features.length > 0){
              var marker = result.data              
      
              let bbox = CoordinatesUtils.reprojectBbox(toBbox(marker), "EPSG:31983", "EPSG:4326")
      
              let newZoom = mapUtils.getZoomForExtent(CoordinatesUtils.reprojectBbox(bbox, "EPSG:4326", "EPSG:31983"), mapSize, 0, 21, null);
      
              let newCenter = mapUtils.getCenterForExtent(bbox, "EPSG:31983");
      
              layerLoad(0)
              return Rx.Observable.of(
                addMarker(CoordinatesUtils.reprojectGeoJson(marker,"EPSG:31983","EPSG:4326")),
                changeMapView(newCenter, newZoom, {
                  bounds: {
                    minx: bbox[0],
                    miny: bbox[1],
                    maxx: bbox[2],
                    maxy: bbox[3]
                  },
                  crs: "EPSG:31983",
                  rotation: 0
                }, mapSize, null, "EPSG:31983"))                    
            }            
          
          return Rx.Observable.of(show({
                title: "Atenção",
                message: "Nenhum resultado encotrado!",
                position:'tl',
                autoDismiss:5
            },'warning'))     
      }
      )
    }
    )
  
export {
  fetchLogradourosTypeList,
  fetchedAddress,
  fetchBairroList,
  fetchedBairro,
  fetchedCEP,
  fetchedIPTU,
  fetchedLoteCP ,
  fetchedCamadasList,
  fetchedAtrrSuggList,
  fetchedFilter
};
