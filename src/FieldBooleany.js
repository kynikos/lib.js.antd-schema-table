// This file is part of antd-schema-table
// Copyright (C) 2018-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.antd-schema-table/blob/master/LICENSE

import {FieldString} from './FieldString'


export class FieldBooleany extends FieldString {
  constructor(props) {
    super(props)
    this.truthyValue = props.truthyValue
    this.falsyValue = props.falsyValue
  }

  _renderify(value, item, index) {
    if (value) { return this.truthyValue } return this.falsyValue
  }

  _searchify(value, item, index) {
    if (value) {
      return this.truthyValue.toLowerCase()
    }
    return this.falsyValue.toLowerCase()
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
