/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React,{Component} from 'react';
import { bindActionCreators } from 'redux'
const assign = require('object-assign');

const Message = require('./locale/Message');

const {Glyphicon,Tooltip,OverlayTrigger,Button } = require('react-bootstrap');

import {showBHMapSearch} from '../actions/bhmapsearch'

import { connect } from 'react-redux';

class SearchBtnCmp extends Component {


    render() {
        let tooltip = <Tooltip id="toolbar-search-button-hide" >Buscar</Tooltip>;
        return (
            <OverlayTrigger overlay={tooltip}>            
            <Button
                {...this.props}
                id="search-button-hide"
                className="square-button"
                bsStyle="primary"
                onClick={this.props.showBHMapSearch}
                tooltip={tooltip}
                >
            <Glyphicon glyph="search"/>
            </Button>
        </OverlayTrigger>
        );
    }

}

const mapDispatchToProps = dispatch => bindActionCreators({ showBHMapSearch}, dispatch)

const SearchButton = connect(null,mapDispatchToProps)(SearchBtnCmp);

export const SearchButtonPlugin = assign(SearchButton, {        
        OmniBar: {
            name: "Search Button",
            id: "search-button-hide",
            icon: <Glyphicon glyph="search"/>,
            tool: true,
            priority: 1
        }
    });
