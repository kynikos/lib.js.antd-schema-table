// This file is part of antd-schema-table
// Copyright (C) 2018-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.antd-schema-table/blob/master/LICENSE

import {createElement as h, useState} from 'react'
import Button from 'antd/lib/button'
import {MinusOutlined, PlusOutlined} from '@ant-design/icons'


export function ExpandedRow({row, expandedRowRender}) {
  const [expanded, setExpanded] = useState(false)

  return h(
    'tr',
    null,
    h('th', null, h(Button, {
      icon: expanded ? h(MinusOutlined) : h(PlusOutlined),
      size: 'small',
      onClick: () => setExpanded(!expanded),
    })),
    h('td', null, expanded
      ? expandedRowRender(row)
      : null,
    ),
  )
}
