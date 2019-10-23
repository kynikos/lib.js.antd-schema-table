// This file is part of antd-schema-table
// Copyright (C) 2018-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.antd-schema-table/blob/master/LICENSE

import {SchemaField} from './SchemaField'


export class FieldString extends SchemaField {
  _renderify(value, item, index) {
    return value == null ? '' : value
  }

  _searchify(value, item, index) {
    return value && value.toLowerCase() || ''
  }

  _filterify(value, item, index) {
    return value && value.toLowerCase() || ''
  }

  _sortify(value, item, index) {
    return value && value.toLowerCase() || ''
  }

  _exportify(value, item, index) {
    return value == null ? '' : value
  }
}
