// This file is part of antd-schema-table
// Copyright (C) 2018-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.antd-schema-table/blob/master/LICENSE

const {createElement: h} = require('react')
const Spin = require('antd/lib/spin').default

import {Table} from './src/Table'

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


let List
module.exports.List = List = ({
  listClassName, loading, deserializedData, schema, expandedRowRender,
}) => h(
  'div',
  {className: listClassName},
  loading // eslint-disable-line no-nested-ternary
    ? h(Spin)

    : deserializedData && deserializedData.length
      ? h(
        'table', {},
        ...deserializedData.map((row) => schema.fieldsTree.makeNarrowTbody(
          row,
          expandedRowRender,
        ))
      )
      : h('span', {}, 'No data')
)


module.exports.TableResponsive = (props) => h(props.narrowMode && List || Table, props)
