// This file is part of antd-schema-table
// Copyright (C) 2018-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.antd-schema-table/blob/master/LICENSE

import {createElement as h} from 'react'
import AntDTable from 'antd/lib/table'


export function Table({
  schema, loading, deserializedData, pagination, rowSelection,
  containerClassName, rowClassName, expandedRowRender,
  defaultExpandAllRows_requiresNewKey,
  defaultExpandedRowKeys_requiresNewKey, expandedRowKeys,
}) {
  const tableProps = {
    // Note that in the deserialized rows, the rowKey is forced to 'key'
    // schema.rowKey refers to the serialized data
    rowKey: 'key',
    pagination: pagination || false,
    rowSelection: rowSelection || null,
    loading,
    dataSource: deserializedData,
    columns: schema.tableColumns,
    bordered: true,
    size: 'small',
    expandedRowRender: expandedRowRender || null,
    // Note that defaultExpandAllRows requires a different component key
    // for every render
    defaultExpandAllRows: defaultExpandAllRows_requiresNewKey || false,
  }

  // Note that defaultExpandedRowKeys requires a different component key
  // for every render
  defaultExpandedRowKeys_requiresNewKey &&
          (tableProps.defaultExpandedRowKeys = defaultExpandedRowKeys_requiresNewKey)
  expandedRowKeys &&
          (tableProps.expandedRowKeys = expandedRowKeys)

  if (containerClassName) { tableProps.className = containerClassName }
  if (rowClassName) { tableProps.rowClassName = rowClassName }

  return h(AntDTable, tableProps)
}
