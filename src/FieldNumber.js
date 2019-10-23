// This file is part of antd-schema-table
// Copyright (C) 2018-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.antd-schema-table/blob/master/LICENSE

import {SchemaField} from './SchemaField'


export class FieldNumber extends SchemaField {
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
