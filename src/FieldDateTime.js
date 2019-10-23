// This file is part of antd-schema-table
// Copyright (C) 2018-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.antd-schema-table/blob/master/LICENSE

import {SchemaField} from './SchemaField'


export class FieldDateTime extends SchemaField {
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
