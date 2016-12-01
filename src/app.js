import React, { Component } from 'react';
import ReactDom from 'react-dom';

import rem from 'utils/rem';

import Login from 'components/login';
import Innerpage from 'components/innerpage';
import Attribute from 'components/attribute';
import AttributePanel from 'components/attributepanel';
import TextAttribute from './components/attribute/textattribute';

//start ...undo redo...
import Undoable from 'components/undoable';
import { undoableReducer } from 'reducer/reducer';
import { createStore, combineReducers } from 'redux';
import undoable from 'redux-undo';

const reducer = combineReducers({
	undoRedo: undoable(undoableReducer)
});
const store = createStore(reducer);

store.subscribe(()=> {
	console.log(store.getState());
});
// <Undoable store={store}/>,
//end  ...undo redo...
import './styles/common.less';
// <Innerpage fuck='you'/>,
// 
// image crop...
import ImageCrop from 'components/crop';
// end image crop
ReactDom.render(
	<ImageCrop fuck='you'/>,
	document.getElementById('app')
);