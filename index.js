// This file is part of antd-schema-table
// Copyright (C) 2018-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.antd-schema-table/blob/master/LICENSE

/* eslint-disable max-classes-per-file */

const {Component, createElement: h} = require('react')
const Button = require('antd/lib/button').default
const AntDTable = require('antd/lib/table').default
const Spin = require('antd/lib/spin').default
import {SchemaField} from './src/SchemaField'
import {_FieldPrimaryKey} from './src/_FieldPrimaryKey'

export {SchemaField}
export {FieldAuxiliary} from './src/FieldAuxiliary'

let Papa
try {
  Papa = require('papaparse') // eslint-disable-line global-require
} catch (error) {
  Papa = null
}


class FieldString extends SchemaField {
  _renderify(value, item, index) { // eslint-disable-line class-methods-use-this
    return value == null ? '' : value
  }

  _searchify(value, item, index) { // eslint-disable-line class-methods-use-this
    return value && value.toLowerCase() || ''
  }

  _filterify(value, item, index) { // eslint-disable-line class-methods-use-this
    return value && value.toLowerCase() || ''
  }

  _sortify(value, item, index) { // eslint-disable-line class-methods-use-this
    return value && value.toLowerCase() || ''
  }

  _exportify(value, item, index) { // eslint-disable-line class-methods-use-this
    return value == null ? '' : value
  }
}

module.exports.FieldString = FieldString


module.exports.FieldBooleany = class FieldBooleany extends FieldString {
  constructor(props) {
    super(props)
    this.truthyValue = props.truthyValue
    this.falsyValue = props.falsyValue
  }

  _renderify(value, item, index) {
    if (value) { return this.truthyValue } return this.falsyValue
  }

  _searchify(value, item, index) {
    if (value) { return this.truthyValue.toLowerCase() } return this.falsyValue.toLowerCase()
  }

  _filterify(value, item, index) {
    if (value) { return this.truthyValue } return this.falsyValue
  }

  _sortify(value, item, index) {
    if (value) { return this.truthyValue } return this.falsyValue
  }

  _exportify(value, item, index) {
    if (value) { return this.truthyValue } return this.falsyValue
  }
}


module.exports.FieldBooleanyNull = class FieldBooleanyNull extends FieldString {
  constructor(props) {
    super(props)
    this.truthyValue = props.truthyValue
    this.falsyValue = props.falsyValue
    this.nullValue = props.nullValue == null ? '' : props.nullValue
  }

  _renderify(value, item, index) {
    if (value != null) {
      if (value) { return this.truthyValue } return this.falsyValue
    }
    return this.nullValue
  }

  _searchify(value, item, index) {
    if (value != null) {
      if (value) {
        return this.truthyValue.toLowerCase()
      } return this.falsyValue.toLowerCase()
    }
    return this.nullValue.toLowerCase()
  }

  _filterify(value, item, index) {
    if (value != null) {
      if (value) { return this.truthyValue } return this.falsyValue
    }
    return this.nullValue
  }

  _sortify(value, item, index) {
    if (value != null) {
      if (value) { return this.truthyValue } return this.falsyValue
    }
    return this.nullValue
  }

  _exportify(value, item, index) {
    if (value != null) {
      if (value) { return this.truthyValue } return this.falsyValue
    }
    return this.nullValue
  }
}


module.exports.FieldList = class FieldList extends FieldString {
  constructor(props) {
    super(props)
    this.glue = props.glue || ', '
  }

  _renderify(value, item, index) { return value.join(this.glue) }

  _searchify(value, item, index) { return value.join(this.glue).toLowerCase() }

  _filterify(value, item, index) { return value.join(this.glue).toLowerCase() }

  _sortify(value, item, index) { return value.join(this.glue).toLowerCase() }

  _exportify(value, item, index) { return value.join(this.glue) }
}


module.exports.FieldChoice = class FieldChoice extends FieldString {
  constructor(props) {
    super(props)
    this.choicesMap = props.choicesMap || {}
  }

  _renderify(value, item, index) {
    return this.choicesMap[value] == null ? '' : this.choicesMap[value]
  }

  _searchify(value, item, index) {
    return value in this.choicesMap && this.choicesMap[value].toLowerCase() || ''
  }

  _filterify(value, item, index) {
    return this.choicesMap[value] == null ? '' : this.choicesMap[value]
  }

  _sortify(value, item, index) {
    return this.choicesMap[value] == null ? '' : this.choicesMap[value]
  }

  _exportify(value, item, index) {
    return this.choicesMap[value] == null ? '' : this.choicesMap[value]
  }
}


module.exports.FieldNumber = class FieldNumber extends SchemaField {
  _renderify(value, item, index) {
    return super._renderify(value === 0 && '0' || value, item, index)
  }

  _searchify(value, item, index) {
    return super._searchify(value === 0 && '0' || value, item, index)
  }

  _filterify(value, item, index) {
    return super._filterify(value === 0 && '0' || value, item, index)
  }

  _sortify(value, item, index) { // eslint-disable-line class-methods-use-this
    return value
  }

  _sorter(a, b) {
    const av = a[this.key].sortable
    const bv = b[this.key].sortable
    return av - bv
  }

  _exportify(value, item, index) {
    return super._exportify(value === 0 && '0' || value, item, index)
  }
}


module.exports.FieldDateTime = class FieldDateTime extends SchemaField {
  constructor(props) {
    super(props)
    this.dateFormat = props.dateFormat || ((value) => value && String(value) || '')
    this.dateExportFormat = props.dateExportFormat || ((value) => value == null ? '' : value)
  }

  _renderify(value, item, index) { return this.dateFormat(value) }

  _searchify(value, item, index) { return this.dateFormat(value).toLowerCase() }

  _filterify(value, item, index) { return this.dateFormat(value) }

  _sortify(value, item, index) { // eslint-disable-line class-methods-use-this
    return value && new Date(value) || null
  }

  _sorter(a, b) {
    const av = a[this.key].sortable
    const bv = b[this.key].sortable
    return av - bv
  }

  _exportify(value, item, index) { return this.dateExportFormat(value) }
}


class SchemaFieldGroup {
  constructor(title, ...fieldsSubTree) {
    // Support dynamic schemas where fields may be set to null or undefined
    this.title = title
    this.fieldsSubTree = fieldsSubTree.filter((field) => field != null)

    // _ancestorFieldTitlesPath is initialized later in _postInit()
    this._ancestorFieldTitlesPath = null
  }

  _postInit({fieldsFlat, dataIndexToFields, keyToField, ancestorsPath}) {
    this._ancestorFieldTitlesPath =
            // Note that for example the root field group has 'null' title
            this.title
              ? ancestorsPath.concat(this.title)
              : ancestorsPath.slice()

    return this.fieldsSubTree.reduce(
      (columns, currField) => {
        if (currField.fieldsSubTree != null) {
          return columns.concat({
            title: currField.title,
            children: currField._postInit({
              fieldsFlat,
              dataIndexToFields,
              keyToField,
              ancestorsPath: this._ancestorFieldTitlesPath,
            }),
          })
        }

        const column = currField._postInit({
          fieldsFlat,
          dataIndexToFields,
          keyToField,
          ancestorsPath: this._ancestorFieldTitlesPath,
        })

        if (column) { return columns.concat(column) } return columns
      },
      []
    )
  }

  makeNarrowTbody(row, expandedRowRender) {
    return h(
      'tbody', {},
      ...this.fieldsSubTree.filter((field) => field.title).map((field) => h(
        'tr', {},
        h('th', {}, field.title),
        h(
          'td', {},
          field.fieldsSubTree == null
            ? field.render(row[field.key])
            : h(
              'table', {},
              field.makeNarrowTbody(row)
            )
        )
      )),
      expandedRowRender && h(ExpandedRow, {row, expandedRowRender}),
    )
  }
}

module.exports.SchemaFieldGroup = SchemaFieldGroup


module.exports.Schema = class Schema {
  constructor(settings, ...fieldsTree) {
    this.rowKey = settings.rowKey == null ? (() => { throw Error("'rowKey' not specified") })() : settings.rowKey
    this.exportFileName = settings.exportFileName == null ? 'data.csv' : settings.exportFileName

    // 'key' is reserved for the primary key
    const pkfield = new _FieldPrimaryKey({dataIndex: this.rowKey, key: 'key'})
    // At least the tableColumns reducer relies on pkfield to be the first
    // item in fieldsTree
    // NOTE: pkfield is needed in fieldsFlat for example by exportCSV()
    fieldsTree.unshift(pkfield)

    this.fieldsTree = new SchemaFieldGroup(null, ...fieldsTree)

    this.fieldsFlat = []
    this.dataIndexToFields = {}
    this.keyToField = {}

    this.tableColumns = this.fieldsTree._postInit({
      fieldsFlat: this.fieldsFlat,
      dataIndexToFields: this.dataIndexToFields,
      keyToField: this.keyToField,
      ancestorsPath: [],
    })
  }

  load(data) {
    return data.map((item, index) => {
      return Object.keys(item).reduce(
        (deserializedItem, currKey) => {
          for (const field of this.dataIndexToFields[currKey] == null ? [] : this.dataIndexToFields[currKey]) {
            deserializedItem[field.key] =
                        field.deserialize(item[currKey], item, index)
          }
          return deserializedItem
        },
        // The constructor checks that 'key' isn't used by any field
        {key: item[this.rowKey]}
      )
    })
  }

  searchGlobal(deserializedData, searchText) {
    if (searchText) {
      const searchTextLc = searchText.toLowerCase()
      return deserializedData.filter((item) => {
        return Object.keys(item).some((key) => {
          return this.keyToField[key].search(item[key], searchTextLc)
        })
      })
    }
    return deserializedData
  }

  exportCSV(deserializedData) {
    let field
    const fields = (() => {
      const result = []
      for (field of this.fieldsFlat) {
        result.push(field._ancestorFieldTitlesPath.join(' > '))
      }
      return result
    })()

    // Make sure not to use "ID" as the first field title, or Excel will
    // think that it's a SYLK file and raise warnings
    // https://annalear.ca/2010/06/10/why-excel-thinks-your-csv-is-a-sylk/
    if (fields[0].toLowerCase() === 'id') {
      fields[0] = 'Item ID'
    }

    const data = deserializedData.map((item) => {
      return (() => {
        const result1 = []
        for (field of this.fieldsFlat) {
          result1.push(field.export(item[field.key]))
        }
        return result1
      })()
    })

    const csv = Papa.unparse({fields, data})
    const blob = new Blob([csv], {type: 'text/csv'})

    const link = document.createElement('a')
    link.setAttribute('download', this.exportFileName)
    link.setAttribute('href', window.URL.createObjectURL(blob))
    document.body.insertBefore(link, null)
    link.click()
    // Apparently iOS Safari doesn't support ChildNode.remove() yet...
    return document.body.removeChild(link)
  }
}


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


class ExpandedRow extends Component {
  constructor() {
    super()
    this.state = {
      expanded: false,
    }
  }

  render() {
    const {row, expandedRowRender} = this.props
    const {expanded} = this.state

    return h(
      'tr', {},
      h('th', {}, h(Button, {
        icon: expanded ? 'minus' : 'plus',
        size: 'small',
        onClick: () => this.setState({expanded: !expanded}),
      })),
      h('td', {}, expanded
        ? expandedRowRender(row)
        : null
      ),
    )
  }
}


module.exports.TableResponsive = (props) => h(props.narrowMode && List || Table, props)
