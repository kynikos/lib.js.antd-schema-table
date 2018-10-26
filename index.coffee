# This file is part of antd-schema-table
# Copyright (C) 2018-present Dario Giovannetti <dev@dariogiovannetti.net>
# Licensed under MIT
# https://github.com/kynikos/lib.js.antd-schema-table/blob/master/LICENSE

{Component, createElement: h} = require('react')
AntDTable = require('antd/lib/table')
Spin = require('antd/lib/spin')

try
    Papa = require('papaparse')
catch
    Papa = null


class SchemaField
    constructor: (props) ->
        @dataIndex = props.dataIndex ? throw Error("dataIndex must be defined")
        @key = props.key or @dataIndex
        @title = props.title ? null
        @defaultSortOrder = props.defaultSortOrder ? null
        @renderify = props.renderify ? @_renderify
        @searchify = props.searchify ? @_searchify
        @filterify = props.filterify ? @_filterify
        @sortify = props.sortify ? @_sortify
        @exportify = props.exportify ? @_exportify
        @width = props.width ? null
        @sorter = props.sorter ? @_sorter
        @className = props.className ? null

        # @_ancestorFieldTitlesPath is initialized later in _postInit()
        @_ancestorFieldTitlesPath = null

    _postInit: ({fieldsFlat, dataIndexToFields, keyToField, ancestorsPath}) ->
        if @key of keyToField
            if @key is 'key'
                # Note that this is effectively thrown when the *second* field
                # with a 'key' key is found, since the first is the actual
                # primary-key field
                throw Error("'key' is reserved for the primary key")
            throw Error("Duplicated key: #{@key}")

        fieldsFlat.push(this)
        keyToField[@key] = this

        if @dataIndex not of dataIndexToFields
            dataIndexToFields[@dataIndex] = [this]
        else
            dataIndexToFields[@dataIndex].push(this)

        @_ancestorFieldTitlesPath = ancestorsPath.concat(@title or @key)

        # Some fields (e.g. FieldAuxiliary) are only loaded to be used
        # by other fields; they don't specify a 'title'
        if @title?
            return {
                # When deserializing the data with load(), this schema
                # uses the unique 'key' as 'dataIndex'
                dataIndex: @key
                key: @key
                title: @title
                render: @render
                defaultSortOrder: @defaultSortOrder
                sorter: @sorter
                width: @width
                className: @className
            }

        return null

    _renderify: (value, item, index) -> value and String(value) or ""
    render: (value) ->
        return value.renderable

    _searchify: (value, item, index) ->
        value and String(value).toLowerCase() or ""
    search: (value, lowerCaseTerm) ->
        value.searchable.indexOf(lowerCaseTerm) >= 0

    _filterify: (value, item, index) -> value and String(value) or ""
    filter: (value, filter) ->
        value.filterable.indexOf(filter) >= 0

    _sortify: (value, item, index) ->
        value and String(value).toLowerCase() or ""
    _sorter: (a, b) ->
        av = a[@key].sortable
        bv = b[@key].sortable
        if av < bv then return -1
        if av > bv then return 1
        return 0

    _exportify: (value, item, index) -> value and String(value) or ""
    export: (value) ->
        value.exportable

    deserialize: (value, item, index) -> {
        serialized: value
        renderable: @renderify(value, item, index)
        searchable: @searchify(value, item, index)
        filterable: @filterify(value, item, index)
        sortable: @sortify(value, item, index)
        exportable: @exportify(value, item, index)
    }


# 'key' is part of the deserialized data items, so give it a special schema
# field so that it's not needed to explicitly exclude 'key' when iterating
# through the items' keys
class _FieldPrimaryKey extends SchemaField
    render: (value) -> value

    _searchify: (value, item, index) -> null
    search: (value, lowerCaseTerm) -> false

    filter: (value, filter) -> true
    _sorter: (a, b) -> 0
    export: (value) -> value

    deserialize: (value, item, index) -> value


class module.exports.FieldAuxiliary extends SchemaField
    _searchify: (value, item, index) -> null
    search: (value, lowerCaseTerm) -> false


class FieldString extends SchemaField
    _renderify: (value, item, index) -> value ? ""
    _searchify: (value, item, index) -> value and value.toLowerCase() or ""
    _filterify: (value, item, index) -> value and value.toLowerCase() or ""
    _sortify: (value, item, index) -> value and value.toLowerCase() or ""
    _exportify: (value, item, index) -> value ? ""

module.exports.FieldString = FieldString


class module.exports.FieldBooleany extends FieldString
    constructor: (props) ->
        super(props)
        @truthyValue = props.truthyValue
        @falsyValue = props.falsyValue

    _renderify: (value, item, index) ->
        if value then @truthyValue else @falsyValue

    _searchify: (value, item, index) ->
        if value then @truthyValue.toLowerCase() else @falsyValue.toLowerCase()

    _filterify: (value, item, index) ->
        if value then @truthyValue else @falsyValue

    _sortify: (value, item, index) ->
        if value then @truthyValue else @falsyValue

    _exportify: (value, item, index) ->
        if value then @truthyValue else @falsyValue


class module.exports.FieldBooleanyNull extends FieldString
    constructor: (props) ->
        super(props)
        @truthyValue = props.truthyValue
        @falsyValue = props.falsyValue
        @nullValue = props.nullValue ? ""

    _renderify: (value, item, index) ->
        if value?
            return if value then @truthyValue else @falsyValue
        return @nullValue

    _searchify: (value, item, index) ->
        if value?
            return if value then @truthyValue.toLowerCase() \
                else @falsyValue.toLowerCase()
        return @nullValue.toLowerCase()

    _filterify: (value, item, index) ->
        if value?
            return if value then @truthyValue else @falsyValue
        return @nullValue

    _sortify: (value, item, index) ->
        if value?
            return if value then @truthyValue else @falsyValue
        return @nullValue

    _exportify: (value, item, index) ->
        if value?
            return if value then @truthyValue else @falsyValue
        return @nullValue


class module.exports.FieldList extends FieldString
    constructor: (props) ->
        super(props)
        @glue = props.glue or ', '

    _renderify: (value, item, index) -> value.join(@glue)
    _searchify: (value, item, index) -> value.join(@glue).toLowerCase()
    _filterify: (value, item, index) -> value.join(@glue).toLowerCase()
    _sortify: (value, item, index) -> value.join(@glue).toLowerCase()
    _exportify: (value, item, index) -> value.join(@glue)


class module.exports.FieldChoice extends FieldString
    constructor: (props) ->
        super(props)
        @choicesMap = props.choicesMap or {}

    _renderify: (value, item, index) -> @choicesMap[value] ? ""

    _searchify: (value, item, index) ->
        (value of @choicesMap) and @choicesMap[value].toLowerCase() or ""

    _filterify: (value, item, index) -> @choicesMap[value] ? ""
    _sortify: (value, item, index) -> @choicesMap[value] ? ""
    _exportify: (value, item, index) -> @choicesMap[value] ? ""


class module.exports.FieldNumber extends SchemaField
    _renderify: (value, item, index) ->
        super(value is 0 and '0' or value, item, index)

    _searchify: (value, item, index) ->
        super(value is 0 and '0' or value, item, index)

    _filterify: (value, item, index) ->
        super(value is 0 and '0' or value, item, index)

    _sortify: (value, item, index) -> value
    _sorter: (a, b) ->
        av = a[@key].sortable
        bv = b[@key].sortable
        return av - bv

    _exportify: (value, item, index) ->
        super(value is 0 and '0' or value, item, index)


class module.exports.FieldDateTime extends SchemaField
    constructor: (props) ->
        super(props)
        @dateFormat = props.dateFormat or (value) ->
            value and String(value) or ""

    _renderify: (value, item, index) -> @dateFormat(value)

    _searchify: (value, item, index) -> @dateFormat(value).toLowerCase()

    _filterify: (value, item, index) -> @dateFormat(value)

    _sortify: (value, item, index) -> value and new Date(value) or null
    _sorter: (a, b) ->
        av = a[@key].sortable
        bv = b[@key].sortable
        return av - bv

    _exportify: (value, item, index) -> value ? ""


class SchemaFieldGroup
    constructor: (@title, fieldsSubTree...) ->
        # Support dynamic schemas where fields may be set to null or undefined
        @fieldsSubTree = fieldsSubTree.filter((field) -> field?)

        # @_ancestorFieldTitlesPath is initialized later in @_postInit()
        @_ancestorFieldTitlesPath = null

    _postInit: ({fieldsFlat, dataIndexToFields, keyToField, ancestorsPath}) ->
        @_ancestorFieldTitlesPath =
            # Note that for example the root field group has 'null' title
            if @title then ancestorsPath.concat(@title) \
            else ancestorsPath.slice()

        return @fieldsSubTree.reduce((columns, currField) =>
            if currField.fieldsSubTree?
                return columns.concat({
                    title: currField.title
                    children: currField._postInit({
                        fieldsFlat
                        dataIndexToFields
                        keyToField
                        ancestorsPath: @_ancestorFieldTitlesPath
                    })
                })

            column = currField._postInit({
                fieldsFlat
                dataIndexToFields
                keyToField
                ancestorsPath: @_ancestorFieldTitlesPath
            })

            return if column then columns.concat(column) else columns
        [])

    makeNarrowTbody: (row) ->
        h('tbody', {}
            (for field in @fieldsSubTree when field.title
                h('tr', {}
                    h('th', {}, field.title)
                    h('td', {}
                        if field.fieldsSubTree?
                            h('table', {}
                                field.makeNarrowTbody(row)
                            )
                        else
                            field.render(row[field.key])
                    )
                )
            )...
        )

module.exports.SchemaFieldGroup = SchemaFieldGroup


class module.exports.Schema
    constructor: (settings, fieldsTree...) ->
        @rowKey = settings.rowKey ? throw Error("'rowKey' not specified")
        @exportFileName = settings.exportFileName ? "data.csv"

        # 'key' is reserved for the primary key
        pkfield = new _FieldPrimaryKey({dataIndex: @rowKey, key: 'key'})
        # At least the @tableColumns reducer relies on pkfield to be the first
        # item in @fieldsTree
        # NOTE: pkfield is needed in @fieldsFlat for example by exportCSV()
        fieldsTree.unshift(pkfield)

        @fieldsTree = new SchemaFieldGroup(null, fieldsTree...)

        @fieldsFlat = []
        @dataIndexToFields = {}
        @keyToField = {}

        @tableColumns = @fieldsTree._postInit({
            fieldsFlat: @fieldsFlat
            dataIndexToFields: @dataIndexToFields
            keyToField: @keyToField
            ancestorsPath: []
        })

    load: (data) ->
        data.map((item, index) =>
            Object.keys(item).reduce((deserializedItem, currKey) =>
                for field in (@dataIndexToFields[currKey] ? [])
                    deserializedItem[field.key] =
                        field.deserialize(item[currKey], item, index)
                return deserializedItem
            # The constructor checks that 'key' isn't used by any field
            {key: item[@rowKey]})
        )

    searchGlobal: (deserializedData, searchText) ->
        if searchText
            searchTextLc = searchText.toLowerCase()
            return deserializedData.filter((item) =>
                Object.keys(item).some((key) =>
                    @keyToField[key].search(item[key], searchTextLc)
                )
            )
        return deserializedData

    exportCSV: (deserializedData) ->
        # NOTE: Do *not* use "ID" as the first field title, or Excel
        # will think that it's a SYLK file and raise warnings
        # https://annalear.ca/2010/06/10/why-excel-thinks-your-csv-is-a-sylk/
        # I should be safe in this case because the first field should always
        # be 'key'
        fields = (field.key for field in @fieldsFlat)

        data = deserializedData.map((item) =>
            (field.export(item[field.key]) for field in @fieldsFlat)
        )

        csv = Papa.unparse({fields, data})
        blob = new Blob([csv], {type: 'text/csv'})

        link = document.createElement('a')
        link.setAttribute("download", @exportFileName)
        link.setAttribute("href", window.URL.createObjectURL(blob))
        document.body.insertBefore(link, null)
        link.click()
        # Apparently iOS Safari doesn't support ChildNode.remove() yet...
        document.body.removeChild(link)


class Table extends Component
    render: ->
        {schema, loading, deserializedData, pagination, rowSelection,
         containerClassName, rowClassName, expandedRowRender,
         defaultExpandAllRows_requiresNewKey,
         defaultExpandedRowKeys_requiresNewKey, expandedRowKeys} = @props

        tableProps = {
            # Note that in the deserialized rows, the rowKey is forced to 'key'
            # schema.rowKey refers to the serialized data
            rowKey: 'key'
            pagination: pagination or false
            rowSelection: rowSelection or null
            loading
            dataSource: deserializedData
            columns: schema.tableColumns
            bordered: true
            size: 'small'
            expandedRowRender: expandedRowRender or null
            # Note that defaultExpandAllRows requires a different component key
            # for every render
            defaultExpandAllRows: defaultExpandAllRows_requiresNewKey or false
        }

        # Note that defaultExpandedRowKeys requires a different component key
        # for every render
        defaultExpandedRowKeys_requiresNewKey &&
            tableProps.defaultExpandedRowKeys = defaultExpandedRowKeys_requiresNewKey
        expandedRowKeys &&
            tableProps.expandedRowKeys = expandedRowKeys

        tableProps.className = containerClassName if containerClassName
        tableProps.rowClassName = rowClassName if rowClassName

        h(AntDTable, tableProps)

module.exports.Table = Table


module.exports.List = List = (props) ->
    return h('div', {className: props.listClassName}
        if props.loading
            h(Spin)

        else if not (props.deserializedData and props.deserializedData.length)
            h('span', {}, "No data")

        else
            h('table', {}
                (for row in props.deserializedData
                    props.schema.fieldsTree.makeNarrowTbody(row)
                )...
            )
    )

module.exports.TableResponsive = (props) ->
    h(props.narrowMode and List or Table, props)
