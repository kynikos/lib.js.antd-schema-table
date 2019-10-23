// This file is part of antd-schema-table
// Copyright (C) 2018-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.antd-schema-table/blob/master/LICENSE

import {FieldString} from './FieldString'


export class FieldList extends FieldString {
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
