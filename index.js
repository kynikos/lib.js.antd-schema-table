// This file is part of antd-schema-table
// Copyright (C) 2018-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.antd-schema-table/blob/master/LICENSE

const {createElement: h} = require('react')

import {Table} from './src/Table'
import {List} from './src/List'

export {FieldAuxiliary} from './src/FieldAuxiliary'
export {FieldString} from './src/FieldString'
export {FieldBooleany} from './src/FieldBooleany'
export {FieldBooleanyNull} from './src/FieldBooleanyNull'
export {FieldList} from './src/FieldList'
export {FieldChoice} from './src/FieldChoice'
export {FieldNumber} from './src/FieldNumber'
export {FieldDateTime} from './src/FieldDateTime'
export {Schema} from './src/Schema'
export {SchemaField} from './src/SchemaField'
export {SchemaFieldGroup} from './src/SchemaFieldGroup'
export {Table}
export {List}


module.exports.TableResponsive = (props) => h(props.narrowMode && List || Table, props)
