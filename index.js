// This file is part of antd-schema-table
// Copyright (C) 2018-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.antd-schema-table/blob/master/LICENSE

const {Component, createElement: h} = require('react')
const AntDTable = require('antd/lib/table').default
const Spin = require('antd/lib/spin').default

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


class Table extends Component {
  render() {
    const {schema, loading, deserializedData, pagination, rowSelection,
      containerClassName, rowClassName, expandedRowRender,
      defaultExpandAllRows_requiresNewKey,
      defaultExpandedRowKeys_requiresNewKey, expandedRowKeys} = this.props

    const tableProps = {
      // Note that in the deserialized rows, the rowKey is forced to 'key'
      // schema.rowKey refers to the serialized data
      rowKey: 'key',
      pagination: pagination || false,
      rowSelection: rowSelection || null,
      loading,
      dataSource: deserializedData,
      columns: schema.tableColumns,
      bordered: true,
      size: 'small',
      expandedRowRender: expandedRowRender || null,
      // Note that defaultExpandAllRows requires a different component key
      // for every render
      defaultExpandAllRows: defaultExpandAllRows_requiresNewKey || false,
    }

    // Note that defaultExpandedRowKeys requires a different component key
    // for every render
    defaultExpandedRowKeys_requiresNewKey &&
            (tableProps.defaultExpandedRowKeys = defaultExpandedRowKeys_requiresNewKey)
    expandedRowKeys &&
            (tableProps.expandedRowKeys = expandedRowKeys)

    if (containerClassName) { tableProps.className = containerClassName }
    if (rowClassName) { tableProps.rowClassName = rowClassName }

    return h(AntDTable, tableProps)
  }
}

module.exports.Table = Table


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
