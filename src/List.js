// This file is part of antd-schema-table
// Copyright (C) 2018-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.antd-schema-table/blob/master/LICENSE

import {createElement as h} from 'react'
import Spin from 'antd/lib/spin'
import {ExpandedRow} from './ExpandedRow'


export function List({
  listClassName, loading, deserializedData, schema, expandedRowRender,
}) {
  return h(
    'div',
    {className: listClassName},
    loading // eslint-disable-line no-nested-ternary
      ? h(Spin)
      : deserializedData && deserializedData.length
        ? h(
          'table',
          null,
          ...deserializedData.map((row) => makeNarrowTbody(
            schema.fieldsTree,
            row,
            expandedRowRender,
          )),
        )
        : h('span', null, 'No data'),
  )
}


function makeNarrowTbody(fieldsTree, row, expandedRowRender) {
  return h(
    'tbody',
    null,
    ...fieldsTree.fieldsSubTree.filter((field) => field.title).map((field) => h(
      'tr',
      null,
      h('th', null, field.title),
      h(
        'td',
        null,
        field.fieldsSubTree == null
          ? field.render(row[field.key])
          : h(
            'table',
            null,
            makeNarrowTbody(field, row, null),
          ),
      ),
    )),
    expandedRowRender && h(ExpandedRow, {row, expandedRowRender}),
  )
}
