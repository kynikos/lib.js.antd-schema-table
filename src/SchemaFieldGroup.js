// This file is part of antd-schema-table
// Copyright (C) 2018-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.antd-schema-table/blob/master/LICENSE

import {createElement as h} from 'react'
import {ExpandedRow} from './ExpandedRow'


export class SchemaFieldGroup {
  constructor(title, ...fieldsSubTree) {
    // Support dynamic schemas where fields may be set to null or undefined
    this.title = title
    this.fieldsSubTree = fieldsSubTree.filter((field) => field != null)

    // _ancestorFieldTitlesPath is initialized later in _postInit()
    this._ancestorFieldTitlesPath = null
  }

  _postInit({fieldsFlat, dataIndexToFields, keyToField, ancestorsPath}) {
    this._ancestorFieldTitlesPath =
            // Note that for example the root field group has 'null' title
            this.title
              ? ancestorsPath.concat(this.title)
              : ancestorsPath.slice()

    return this.fieldsSubTree.reduce(
      (columns, currField) => {
        if (currField.fieldsSubTree != null) {
          return columns.concat({
            title: currField.title,
            children: currField._postInit({
              fieldsFlat,
              dataIndexToFields,
              keyToField,
              ancestorsPath: this._ancestorFieldTitlesPath,
            }),
          })
        }

        const column = currField._postInit({
          fieldsFlat,
          dataIndexToFields,
          keyToField,
          ancestorsPath: this._ancestorFieldTitlesPath,
        })

        if (column) { return columns.concat(column) } return columns
      },
      []
    )
  }

  makeNarrowTbody(row, expandedRowRender) {
    return h(
      'tbody',
      null,
      ...this.fieldsSubTree.filter((field) => field.title).map((field) => h(
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
              field.makeNarrowTbody(row)
            )
        )
      )),
      expandedRowRender && h(ExpandedRow, {row, expandedRowRender}),
    )
  }
}
