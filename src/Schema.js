// This file is part of antd-schema-table
// Copyright (C) 2018-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.antd-schema-table/blob/master/LICENSE

import {_FieldPrimaryKey} from './_FieldPrimaryKey'
import {SchemaFieldGroup} from './SchemaFieldGroup'

let Papa
try {
  Papa = require('papaparse') // eslint-disable-line global-require
} catch (error) {
  Papa = null
}

let XLSX
try {
  XLSX = require('xlsx') // eslint-disable-line global-require
} catch (error) {
  XLSX = null
}


export class Schema {
  constructor(settings, ...fieldsTree) {
    this.rowKey = settings.rowKey == null
      ? (() => { throw Error("'rowKey' not specified") })()
      : settings.rowKey
    this.exportFileName = settings.exportFileName == null
      ? 'data.csv'
      : settings.exportFileName
    this.exportWorksheetName = settings.exportWorksheetName == null
      ? 'data'
      : settings.exportWorksheetName

    // 'key' is reserved for the primary key
    const pkfield = new _FieldPrimaryKey({dataIndex: this.rowKey, key: 'key'})
    // At least the tableColumns reducer relies on pkfield to be the first
    // item in fieldsTree
    // NOTE: pkfield is needed in fieldsFlat for example by exportCSV()
    fieldsTree.unshift(pkfield)

    this.fieldsTree = new SchemaFieldGroup(null, ...fieldsTree)

    this.fieldsFlat = []
    this.dataIndexToFields = {}
    this.keyToField = {}

    this.tableColumns = this.fieldsTree._postInit({
      fieldsFlat: this.fieldsFlat,
      dataIndexToFields: this.dataIndexToFields,
      keyToField: this.keyToField,
      ancestorsPath: [],
    })
  }

  load(data) {
    return data.map((item, index) => {
      return Object.keys(item).reduce(
        (deserializedItem, currKey) => {
          for (const field of this.dataIndexToFields[currKey] == null
            ? []
            : this.dataIndexToFields[currKey]
          ) {
            deserializedItem[field.key] =
                        field.deserialize(item[currKey], item, index)
          }
          return deserializedItem
        },
        // The constructor checks that 'key' isn't used by any field
        {key: item[this.rowKey]}
      )
    })
  }

  searchGlobal(deserializedData, searchText) {
    if (searchText) {
      const searchTextLc = searchText.toLowerCase()
      return deserializedData.filter((item) => {
        return Object.keys(item).some((key) => {
          return this.keyToField[key].search(item[key], searchTextLc)
        })
      })
    }
    return deserializedData
  }

  export(deserializedData) {
    const fields = this.fieldsFlat.map((field) => {
      return field._ancestorFieldTitlesPath.join(' > ')
    })

    // Make sure not to use "ID" as the first field title, or Excel will
    // think that it's a SYLK file and raise warnings
    // https://annalear.ca/2010/06/10/why-excel-thinks-your-csv-is-a-sylk/
    if (fields[0].toLowerCase() === 'id') {
      fields[0] = 'Item ID'
    }

    const data = deserializedData.map((item) => {
      return this.fieldsFlat.map((field) => {
        return field.export(item[field.key])
      })
    })

    return {fields, data}
  }

  exportCSV(deserializedData) {
    const {fields, data} = this.export(deserializedData)
    const csv = Papa.unparse({fields, data})
    const blob = new Blob([csv], {type: 'text/csv'})
    const link = document.createElement('a')
    link.setAttribute('download', this.exportFileName)
    link.setAttribute('href', window.URL.createObjectURL(blob))
    document.body.insertBefore(link, null)
    link.click()
    // Apparently iOS Safari doesn't support ChildNode.remove() yet...
    return document.body.removeChild(link)
  }

  exportXLSX(deserializedData) {
    const {fields, data} = this.export(deserializedData)
    const workbook = XLSX.utils.book_new()
    // Excel disallows worksheet names longer than 31 characters
    const worksheetName = this.exportWorksheetName
    const worksheet = XLSX.utils.aoa_to_sheet([fields].concat(data))
    XLSX.utils.book_append_sheet(workbook, worksheet, worksheetName)
    return XLSX.writeFile(workbook, this.exportFileName)
  }
}
