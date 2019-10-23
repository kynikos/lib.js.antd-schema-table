// This file is part of antd-schema-table
// Copyright (C) 2018-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.antd-schema-table/blob/master/LICENSE

import {FieldString} from './FieldString'


export class FieldChoice extends FieldString {
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
