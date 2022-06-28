// This file is part of antd-schema-table
// Copyright (C) 2018-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.antd-schema-table/blob/master/LICENSE

import {createElement as h, useState} from 'react'
import Select from 'antd/lib/select'
import {ASCEND, DESCEND} from '@kynikos/data-schema'

const SEP = '-'


function makeOptionKey(fieldKey, sortOrder) {
  return `${fieldKey}${SEP}${sortOrder}`
}


function splitOptionKey(optionKey) {
  const sepIndex = optionKey.lastIndexOf(SEP)
  const fieldKey = optionKey.slice(0, sepIndex)
  const sortOrder = optionKey.slice(sepIndex + 1)
  return [fieldKey, sortOrder]
}


export function Sorter({
  schema, deserializedData, deserializedDataMap, setDeserializedData,
  setSortSetup, style, dropdownStyle,
}) {
  const [selected, setSelected] = useState(() => {
    return schema.defaultSortSetup.map(([fieldKey, sortOrder]) => {
      return makeOptionKey(fieldKey, sortOrder)
    })
  })

  if (deserializedData && deserializedDataMap) {
    throw new Error("Either define 'deserializedData' or " +
      "'deserializedDataMap'")
  }

  const options = schema.fieldsFlat.reduce(
    (acc, field) => {
      if (field.sorter && field.title) {
        const ascend = makeOptionKey(field.key, ASCEND)
        const descend = makeOptionKey(field.key, DESCEND)
        acc.push(
          h(Select.Option, {
            key: ascend,
            value: ascend,
          }, `${field.title} - ${field.sortAscendLabel || 'Ascending'}`),
          h(Select.Option, {
            key: descend,
            value: descend,
          }, `${field.title} - ${field.sortDescendLabel || 'Descending'}`),
        )
      }
      return acc
    },
    [],
  )

  return h(Select, {
    mode: 'multiple',
    value: selected,
    allowClear: null,
    style,
    dropdownStyle,
    onChange: (newSelected) => {
      const oldFieldKeyToSortOrder = {}

      for (const optionKey of selected) {
        const [fieldKey, sortOrder] = splitOptionKey(optionKey)
        oldFieldKeyToSortOrder[fieldKey] = sortOrder
      }

      const newFieldKeyToSortOrder = {}

      for (const optionKey of newSelected) {
        const [fieldKey, newSortOrder] = splitOptionKey(optionKey)

        if (
          !newFieldKeyToSortOrder[fieldKey] ||
          // Prevent selecting both the 'ascend' and 'descend' option of the
          // same field
          oldFieldKeyToSortOrder[fieldKey] !== newSortOrder
        ) {
          newFieldKeyToSortOrder[fieldKey] = newSortOrder
        }
      }

      const newFilteredSelected = []
      const setup = []

      for (
        const [fieldKey, sortOrder] of Object.entries(newFieldKeyToSortOrder)
      ) {
        newFilteredSelected.push(makeOptionKey(fieldKey, sortOrder))
        setup.push([fieldKey, sortOrder])
      }

      setSelected(newFilteredSelected)

      setSortSetup(setup)

      if (newFilteredSelected.length) {
        let sortedDeserializedData

        if (deserializedDataMap) {
          sortedDeserializedData = {}

          for (const [key, data] of Object.entries(deserializedDataMap)) {
            sortedDeserializedData[key] = schema.sort(data.slice(), setup)
          }
        } else {
          sortedDeserializedData =
            schema.sort(deserializedData.slice(), setup)
        }

        setDeserializedData(sortedDeserializedData)
      }
    },
  }, ...options)
}
