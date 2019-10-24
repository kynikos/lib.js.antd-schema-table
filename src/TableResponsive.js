// This file is part of antd-schema-table
// Copyright (C) 2018-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.antd-schema-table/blob/master/LICENSE

import {createElement as h} from 'react'
import {Table} from './Table'
import {List} from './List'

export function TableResponsive(props) {
  return h(props.narrowMode ? List : Table, props)
}
