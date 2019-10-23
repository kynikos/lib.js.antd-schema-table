// This file is part of antd-schema-table
// Copyright (C) 2018-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.antd-schema-table/blob/master/LICENSE

import {createElement as h} from 'react'
import Spin from 'antd/lib/spin'


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
          ...deserializedData.map((row) => schema.fieldsTree.makeNarrowTbody(
            row,
            expandedRowRender,
          ))
        )
        : h('span', null, 'No data')
  )
}
