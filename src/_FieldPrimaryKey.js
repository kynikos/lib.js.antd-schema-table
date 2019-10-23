// This file is part of antd-schema-table
// Copyright (C) 2018-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.antd-schema-table/blob/master/LICENSE

import {SchemaField} from './SchemaField'


// 'key' is part of the deserialized data items, so give it a special schema
// field so that it's not needed to explicitly exclude 'key' when iterating
// through the items' keys
export class _FieldPrimaryKey extends SchemaField {
  render(value) {
    return value
  }

  _searchify(value, item, index) {
    return null
  }

  search(value, lowerCaseTerm) {
    return false
  }

  filter(value, filter) {
    return true
  }

  _sorter(a, b) {
    return 0
  }

  export(value) {
    return value
  }

  deserialize(value, item, index) {
    return value
  }
}
