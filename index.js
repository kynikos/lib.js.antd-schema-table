'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// This file is part of antd-schema-table
// Copyright (C) 2018-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.antd-schema-table/blob/master/LICENSE

/* eslint-disable max-classes-per-file */

var _require = require('react'),
    Component = _require.Component,
    h = _require.createElement;

var Button = require('antd/lib/button').default;
var AntDTable = require('antd/lib/table').default;
var Spin = require('antd/lib/spin').default;

var Papa = void 0;
try {
  Papa = require('papaparse'); // eslint-disable-line global-require
} catch (error) {
  Papa = null;
}

var SchemaField = function () {
  function SchemaField(props) {
    _classCallCheck(this, SchemaField);

    this.dataIndex = props.dataIndex == null ? function () {
      throw Error('dataIndex must be defined');
    }() : props.dataIndex;
    this.key = props.key || this.dataIndex;
    this.title = props.title == null ? null : props.title;
    this.defaultSortOrder = props.defaultSortOrder == null ? null : props.defaultSortOrder;
    this.renderify = props.renderify == null ? this._renderify : props.renderify;
    this.searchify = props.searchify == null ? this._searchify : props.searchify;
    this.filterify = props.filterify == null ? this._filterify : props.filterify;
    this.sortify = props.sortify == null ? this._sortify : props.sortify;
    this.exportify = props.exportify == null ? this._exportify : props.exportify;
    this.width = props.width == null ? null : props.width;
    this.sorter = props.sorter == null ? this._sorter : props.sorter;
    this.className = props.className == null ? null : props.className;

    // this._ancestorFieldTitlesPath is initialized later in _postInit()
    this._ancestorFieldTitlesPath = null;
  }

  _createClass(SchemaField, [{
    key: '_postInit',
    value: function _postInit(_ref) {
      var fieldsFlat = _ref.fieldsFlat,
          dataIndexToFields = _ref.dataIndexToFields,
          keyToField = _ref.keyToField,
          ancestorsPath = _ref.ancestorsPath;

      if (this.key in keyToField) {
        if (this.key === 'key') {
          // Note that this is effectively thrown when the *second* field
          // with a 'key' key is found, since the first is the actual
          // primary-key field
          throw Error("'key' is reserved for the primary key");
        }
        throw Error('Duplicated key: ' + this.key);
      }

      fieldsFlat.push(this);
      keyToField[this.key] = this;

      if (this.dataIndex in dataIndexToFields) {
        dataIndexToFields[this.dataIndex].push(this);
      } else {
        dataIndexToFields[this.dataIndex] = [this];
      }

      this._ancestorFieldTitlesPath = ancestorsPath.concat(this.title || this.key);

      // Some fields (e.g. FieldAuxiliary) are only loaded to be used
      // by other fields; they don't specify a 'title'
      if (this.title != null) {
        return {
          // When deserializing the data with load(), this schema
          // uses the unique 'key' as 'dataIndex'
          dataIndex: this.key,
          key: this.key,
          title: this.title,
          render: this.render,
          defaultSortOrder: this.defaultSortOrder,
          sorter: this.sorter,
          width: this.width,
          className: this.className
        };
      }

      return null;
    }
  }, {
    key: '_renderify',
    value: function _renderify(value, item, index) {
      // eslint-disable-line class-methods-use-this
      return value && String(value) || '';
    }
  }, {
    key: 'render',
    value: function render(value) {
      // eslint-disable-line class-methods-use-this
      return value.renderable;
    }
  }, {
    key: '_searchify',
    value: function _searchify(value, item, index) {
      // eslint-disable-line class-methods-use-this
      return value && String(value).toLowerCase() || '';
    }
  }, {
    key: 'search',
    value: function search(value, lowerCaseTerm) {
      // eslint-disable-line class-methods-use-this
      return value.searchable.indexOf(lowerCaseTerm) >= 0;
    }
  }, {
    key: '_filterify',
    value: function _filterify(value, item, index) {
      // eslint-disable-line class-methods-use-this
      return value && String(value) || '';
    }
  }, {
    key: 'filter',
    value: function filter(value, _filter) {
      // eslint-disable-line class-methods-use-this
      return value.filterable.indexOf(_filter) >= 0;
    }
  }, {
    key: '_sortify',
    value: function _sortify(value, item, index) {
      // eslint-disable-line class-methods-use-this
      return value && String(value).toLowerCase() || '';
    }
  }, {
    key: '_sorter',
    value: function _sorter(a, b) {
      var av = a[this.key].sortable;
      var bv = b[this.key].sortable;
      if (av < bv) {
        return -1;
      }
      if (av > bv) {
        return 1;
      }
      return 0;
    }
  }, {
    key: '_exportify',
    value: function _exportify(value, item, index) {
      // eslint-disable-line class-methods-use-this
      return value && String(value) || '';
    }
  }, {
    key: 'export',
    value: function _export(value) {
      // eslint-disable-line class-methods-use-this
      return value.exportable;
    }
  }, {
    key: 'deserialize',
    value: function deserialize(value, item, index) {
      return {
        serialized: value,
        renderable: this.renderify(value, item, index),
        searchable: this.searchify(value, item, index),
        filterable: this.filterify(value, item, index),
        sortable: this.sortify(value, item, index),
        exportable: this.exportify(value, item, index)
      };
    }
  }]);

  return SchemaField;
}();

// 'key' is part of the deserialized data items, so give it a special schema
// field so that it's not needed to explicitly exclude 'key' when iterating
// through the items' keys


var _FieldPrimaryKey = function (_SchemaField) {
  _inherits(_FieldPrimaryKey, _SchemaField);

  function _FieldPrimaryKey() {
    _classCallCheck(this, _FieldPrimaryKey);

    return _possibleConstructorReturn(this, (_FieldPrimaryKey.__proto__ || Object.getPrototypeOf(_FieldPrimaryKey)).apply(this, arguments));
  }

  _createClass(_FieldPrimaryKey, [{
    key: 'render',
    value: function render(value) {
      // eslint-disable-line class-methods-use-this
      return value;
    }
  }, {
    key: '_searchify',
    value: function _searchify(value, item, index) {
      // eslint-disable-line class-methods-use-this
      return null;
    }
  }, {
    key: 'search',
    value: function search(value, lowerCaseTerm) {
      // eslint-disable-line class-methods-use-this
      return false;
    }
  }, {
    key: 'filter',
    value: function filter(value, _filter2) {
      // eslint-disable-line class-methods-use-this
      return true;
    }
  }, {
    key: '_sorter',
    value: function _sorter(a, b) {
      // eslint-disable-line class-methods-use-this
      return 0;
    }
  }, {
    key: 'export',
    value: function _export(value) {
      // eslint-disable-line class-methods-use-this
      return value;
    }
  }, {
    key: 'deserialize',
    value: function deserialize(value, item, index) {
      // eslint-disable-line class-methods-use-this
      return value;
    }
  }]);

  return _FieldPrimaryKey;
}(SchemaField);

module.exports.FieldAuxiliary = function (_SchemaField2) {
  _inherits(FieldAuxiliary, _SchemaField2);

  function FieldAuxiliary() {
    _classCallCheck(this, FieldAuxiliary);

    return _possibleConstructorReturn(this, (FieldAuxiliary.__proto__ || Object.getPrototypeOf(FieldAuxiliary)).apply(this, arguments));
  }

  _createClass(FieldAuxiliary, [{
    key: '_searchify',
    value: function _searchify(value, item, index) {
      // eslint-disable-line class-methods-use-this
      return null;
    }
  }, {
    key: 'search',
    value: function search(value, lowerCaseTerm) {
      // eslint-disable-line class-methods-use-this
      return false;
    }
  }]);

  return FieldAuxiliary;
}(SchemaField);

var FieldString = function (_SchemaField3) {
  _inherits(FieldString, _SchemaField3);

  function FieldString() {
    _classCallCheck(this, FieldString);

    return _possibleConstructorReturn(this, (FieldString.__proto__ || Object.getPrototypeOf(FieldString)).apply(this, arguments));
  }

  _createClass(FieldString, [{
    key: '_renderify',
    value: function _renderify(value, item, index) {
      // eslint-disable-line class-methods-use-this
      return value == null ? '' : value;
    }
  }, {
    key: '_searchify',
    value: function _searchify(value, item, index) {
      // eslint-disable-line class-methods-use-this
      return value && value.toLowerCase() || '';
    }
  }, {
    key: '_filterify',
    value: function _filterify(value, item, index) {
      // eslint-disable-line class-methods-use-this
      return value && value.toLowerCase() || '';
    }
  }, {
    key: '_sortify',
    value: function _sortify(value, item, index) {
      // eslint-disable-line class-methods-use-this
      return value && value.toLowerCase() || '';
    }
  }, {
    key: '_exportify',
    value: function _exportify(value, item, index) {
      // eslint-disable-line class-methods-use-this
      return value == null ? '' : value;
    }
  }]);

  return FieldString;
}(SchemaField);

module.exports.FieldString = FieldString;

module.exports.FieldBooleany = function (_FieldString) {
  _inherits(FieldBooleany, _FieldString);

  function FieldBooleany(props) {
    _classCallCheck(this, FieldBooleany);

    var _this4 = _possibleConstructorReturn(this, (FieldBooleany.__proto__ || Object.getPrototypeOf(FieldBooleany)).call(this, props));

    _this4.truthyValue = props.truthyValue;
    _this4.falsyValue = props.falsyValue;
    return _this4;
  }

  _createClass(FieldBooleany, [{
    key: '_renderify',
    value: function _renderify(value, item, index) {
      if (value) {
        return this.truthyValue;
      }return this.falsyValue;
    }
  }, {
    key: '_searchify',
    value: function _searchify(value, item, index) {
      if (value) {
        return this.truthyValue.toLowerCase();
      }return this.falsyValue.toLowerCase();
    }
  }, {
    key: '_filterify',
    value: function _filterify(value, item, index) {
      if (value) {
        return this.truthyValue;
      }return this.falsyValue;
    }
  }, {
    key: '_sortify',
    value: function _sortify(value, item, index) {
      if (value) {
        return this.truthyValue;
      }return this.falsyValue;
    }
  }, {
    key: '_exportify',
    value: function _exportify(value, item, index) {
      if (value) {
        return this.truthyValue;
      }return this.falsyValue;
    }
  }]);

  return FieldBooleany;
}(FieldString);

module.exports.FieldBooleanyNull = function (_FieldString2) {
  _inherits(FieldBooleanyNull, _FieldString2);

  function FieldBooleanyNull(props) {
    _classCallCheck(this, FieldBooleanyNull);

    var _this5 = _possibleConstructorReturn(this, (FieldBooleanyNull.__proto__ || Object.getPrototypeOf(FieldBooleanyNull)).call(this, props));

    _this5.truthyValue = props.truthyValue;
    _this5.falsyValue = props.falsyValue;
    _this5.nullValue = props.nullValue == null ? '' : props.nullValue;
    return _this5;
  }

  _createClass(FieldBooleanyNull, [{
    key: '_renderify',
    value: function _renderify(value, item, index) {
      if (value != null) {
        if (value) {
          return this.truthyValue;
        }return this.falsyValue;
      }
      return this.nullValue;
    }
  }, {
    key: '_searchify',
    value: function _searchify(value, item, index) {
      if (value != null) {
        if (value) {
          return this.truthyValue.toLowerCase();
        }return this.falsyValue.toLowerCase();
      }
      return this.nullValue.toLowerCase();
    }
  }, {
    key: '_filterify',
    value: function _filterify(value, item, index) {
      if (value != null) {
        if (value) {
          return this.truthyValue;
        }return this.falsyValue;
      }
      return this.nullValue;
    }
  }, {
    key: '_sortify',
    value: function _sortify(value, item, index) {
      if (value != null) {
        if (value) {
          return this.truthyValue;
        }return this.falsyValue;
      }
      return this.nullValue;
    }
  }, {
    key: '_exportify',
    value: function _exportify(value, item, index) {
      if (value != null) {
        if (value) {
          return this.truthyValue;
        }return this.falsyValue;
      }
      return this.nullValue;
    }
  }]);

  return FieldBooleanyNull;
}(FieldString);

module.exports.FieldList = function (_FieldString3) {
  _inherits(FieldList, _FieldString3);

  function FieldList(props) {
    _classCallCheck(this, FieldList);

    var _this6 = _possibleConstructorReturn(this, (FieldList.__proto__ || Object.getPrototypeOf(FieldList)).call(this, props));

    _this6.glue = props.glue || ', ';
    return _this6;
  }

  _createClass(FieldList, [{
    key: '_renderify',
    value: function _renderify(value, item, index) {
      return value.join(this.glue);
    }
  }, {
    key: '_searchify',
    value: function _searchify(value, item, index) {
      return value.join(this.glue).toLowerCase();
    }
  }, {
    key: '_filterify',
    value: function _filterify(value, item, index) {
      return value.join(this.glue).toLowerCase();
    }
  }, {
    key: '_sortify',
    value: function _sortify(value, item, index) {
      return value.join(this.glue).toLowerCase();
    }
  }, {
    key: '_exportify',
    value: function _exportify(value, item, index) {
      return value.join(this.glue);
    }
  }]);

  return FieldList;
}(FieldString);

module.exports.FieldChoice = function (_FieldString4) {
  _inherits(FieldChoice, _FieldString4);

  function FieldChoice(props) {
    _classCallCheck(this, FieldChoice);

    var _this7 = _possibleConstructorReturn(this, (FieldChoice.__proto__ || Object.getPrototypeOf(FieldChoice)).call(this, props));

    _this7.choicesMap = props.choicesMap || {};
    return _this7;
  }

  _createClass(FieldChoice, [{
    key: '_renderify',
    value: function _renderify(value, item, index) {
      return this.choicesMap[value] == null ? '' : this.choicesMap[value];
    }
  }, {
    key: '_searchify',
    value: function _searchify(value, item, index) {
      return value in this.choicesMap && this.choicesMap[value].toLowerCase() || '';
    }
  }, {
    key: '_filterify',
    value: function _filterify(value, item, index) {
      return this.choicesMap[value] == null ? '' : this.choicesMap[value];
    }
  }, {
    key: '_sortify',
    value: function _sortify(value, item, index) {
      return this.choicesMap[value] == null ? '' : this.choicesMap[value];
    }
  }, {
    key: '_exportify',
    value: function _exportify(value, item, index) {
      return this.choicesMap[value] == null ? '' : this.choicesMap[value];
    }
  }]);

  return FieldChoice;
}(FieldString);

module.exports.FieldNumber = function (_SchemaField4) {
  _inherits(FieldNumber, _SchemaField4);

  function FieldNumber() {
    _classCallCheck(this, FieldNumber);

    return _possibleConstructorReturn(this, (FieldNumber.__proto__ || Object.getPrototypeOf(FieldNumber)).apply(this, arguments));
  }

  _createClass(FieldNumber, [{
    key: '_renderify',
    value: function _renderify(value, item, index) {
      return _get(FieldNumber.prototype.__proto__ || Object.getPrototypeOf(FieldNumber.prototype), '_renderify', this).call(this, value === 0 && '0' || value, item, index);
    }
  }, {
    key: '_searchify',
    value: function _searchify(value, item, index) {
      return _get(FieldNumber.prototype.__proto__ || Object.getPrototypeOf(FieldNumber.prototype), '_searchify', this).call(this, value === 0 && '0' || value, item, index);
    }
  }, {
    key: '_filterify',
    value: function _filterify(value, item, index) {
      return _get(FieldNumber.prototype.__proto__ || Object.getPrototypeOf(FieldNumber.prototype), '_filterify', this).call(this, value === 0 && '0' || value, item, index);
    }
  }, {
    key: '_sortify',
    value: function _sortify(value, item, index) {
      // eslint-disable-line class-methods-use-this
      return value;
    }
  }, {
    key: '_sorter',
    value: function _sorter(a, b) {
      var av = a[this.key].sortable;
      var bv = b[this.key].sortable;
      return av - bv;
    }
  }, {
    key: '_exportify',
    value: function _exportify(value, item, index) {
      return _get(FieldNumber.prototype.__proto__ || Object.getPrototypeOf(FieldNumber.prototype), '_exportify', this).call(this, value === 0 && '0' || value, item, index);
    }
  }]);

  return FieldNumber;
}(SchemaField);

module.exports.FieldDateTime = function (_SchemaField5) {
  _inherits(FieldDateTime, _SchemaField5);

  function FieldDateTime(props) {
    _classCallCheck(this, FieldDateTime);

    var _this9 = _possibleConstructorReturn(this, (FieldDateTime.__proto__ || Object.getPrototypeOf(FieldDateTime)).call(this, props));

    _this9.dateFormat = props.dateFormat || function (value) {
      return value && String(value) || '';
    };
    return _this9;
  }

  _createClass(FieldDateTime, [{
    key: '_renderify',
    value: function _renderify(value, item, index) {
      return this.dateFormat(value);
    }
  }, {
    key: '_searchify',
    value: function _searchify(value, item, index) {
      return this.dateFormat(value).toLowerCase();
    }
  }, {
    key: '_filterify',
    value: function _filterify(value, item, index) {
      return this.dateFormat(value);
    }
  }, {
    key: '_sortify',
    value: function _sortify(value, item, index) {
      // eslint-disable-line class-methods-use-this
      return value && new Date(value) || null;
    }
  }, {
    key: '_sorter',
    value: function _sorter(a, b) {
      var av = a[this.key].sortable;
      var bv = b[this.key].sortable;
      return av - bv;
    }
  }, {
    key: '_exportify',
    value: function _exportify(value, item, index) {
      // eslint-disable-line class-methods-use-this
      return value == null ? '' : value;
    }
  }]);

  return FieldDateTime;
}(SchemaField);

var SchemaFieldGroup = function () {
  function SchemaFieldGroup(title) {
    _classCallCheck(this, SchemaFieldGroup);

    // Support dynamic schemas where fields may be set to null or undefined
    this.title = title;

    for (var _len = arguments.length, fieldsSubTree = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      fieldsSubTree[_key - 1] = arguments[_key];
    }

    this.fieldsSubTree = fieldsSubTree.filter(function (field) {
      return field != null;
    });

    // _ancestorFieldTitlesPath is initialized later in _postInit()
    this._ancestorFieldTitlesPath = null;
  }

  _createClass(SchemaFieldGroup, [{
    key: '_postInit',
    value: function _postInit(_ref2) {
      var _this10 = this;

      var fieldsFlat = _ref2.fieldsFlat,
          dataIndexToFields = _ref2.dataIndexToFields,
          keyToField = _ref2.keyToField,
          ancestorsPath = _ref2.ancestorsPath;

      this._ancestorFieldTitlesPath =
      // Note that for example the root field group has 'null' title
      this.title ? ancestorsPath.concat(this.title) : ancestorsPath.slice();

      return this.fieldsSubTree.reduce(function (columns, currField) {
        if (currField.fieldsSubTree != null) {
          return columns.concat({
            title: currField.title,
            children: currField._postInit({
              fieldsFlat: fieldsFlat,
              dataIndexToFields: dataIndexToFields,
              keyToField: keyToField,
              ancestorsPath: _this10._ancestorFieldTitlesPath
            })
          });
        }

        var column = currField._postInit({
          fieldsFlat: fieldsFlat,
          dataIndexToFields: dataIndexToFields,
          keyToField: keyToField,
          ancestorsPath: _this10._ancestorFieldTitlesPath
        });

        if (column) {
          return columns.concat(column);
        }return columns;
      }, []);
    }
  }, {
    key: 'makeNarrowTbody',
    value: function makeNarrowTbody(row, expandedRowRender) {
      return h.apply(undefined, ['tbody', {}].concat(_toConsumableArray(this.fieldsSubTree.filter(function (field) {
        return field.title;
      }).map(function (field) {
        return h('tr', {}, h('th', {}, field.title), h('td', {}, field.fieldsSubTree == null ? field.render(row[field.key]) : h('table', {}, field.makeNarrowTbody(row))));
      })), [expandedRowRender && h(ExpandedRow, { row: row, expandedRowRender: expandedRowRender })]));
    }
  }]);

  return SchemaFieldGroup;
}();

module.exports.SchemaFieldGroup = SchemaFieldGroup;

module.exports.Schema = function () {
  function Schema(settings) {
    _classCallCheck(this, Schema);

    this.rowKey = settings.rowKey == null ? function () {
      throw Error("'rowKey' not specified");
    }() : settings.rowKey;
    this.exportFileName = settings.exportFileName == null ? 'data.csv' : settings.exportFileName;

    // 'key' is reserved for the primary key
    var pkfield = new _FieldPrimaryKey({ dataIndex: this.rowKey, key: 'key' });
    // At least the tableColumns reducer relies on pkfield to be the first
    // item in fieldsTree
    // NOTE: pkfield is needed in fieldsFlat for example by exportCSV()

    for (var _len2 = arguments.length, fieldsTree = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      fieldsTree[_key2 - 1] = arguments[_key2];
    }

    fieldsTree.unshift(pkfield);

    this.fieldsTree = new (Function.prototype.bind.apply(SchemaFieldGroup, [null].concat([null], fieldsTree)))();

    this.fieldsFlat = [];
    this.dataIndexToFields = {};
    this.keyToField = {};

    this.tableColumns = this.fieldsTree._postInit({
      fieldsFlat: this.fieldsFlat,
      dataIndexToFields: this.dataIndexToFields,
      keyToField: this.keyToField,
      ancestorsPath: []
    });
  }

  _createClass(Schema, [{
    key: 'load',
    value: function load(data) {
      var _this11 = this;

      return data.map(function (item, index) {
        return Object.keys(item).reduce(function (deserializedItem, currKey) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = (_this11.dataIndexToFields[currKey] == null ? [] : _this11.dataIndexToFields[currKey])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var field = _step.value;

              deserializedItem[field.key] = field.deserialize(item[currKey], item, index);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          return deserializedItem;
        },
        // The constructor checks that 'key' isn't used by any field
        { key: item[_this11.rowKey] });
      });
    }
  }, {
    key: 'searchGlobal',
    value: function searchGlobal(deserializedData, searchText) {
      var _this12 = this;

      if (searchText) {
        var searchTextLc = searchText.toLowerCase();
        return deserializedData.filter(function (item) {
          return Object.keys(item).some(function (key) {
            return _this12.keyToField[key].search(item[key], searchTextLc);
          });
        });
      }
      return deserializedData;
    }
  }, {
    key: 'exportCSV',
    value: function exportCSV(deserializedData) {
      var _this13 = this;

      var field = void 0;
      var fields = function () {
        var result = [];
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = _this13.fieldsFlat[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            field = _step2.value;

            result.push(field._ancestorFieldTitlesPath.join(' > '));
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        return result;
      }();

      // Make sure not to use "ID" as the first field title, or Excel will
      // think that it's a SYLK file and raise warnings
      // https://annalear.ca/2010/06/10/why-excel-thinks-your-csv-is-a-sylk/
      if (fields[0].toLowerCase() === 'id') {
        fields[0] = 'Item ID';
      }

      var data = deserializedData.map(function (item) {
        return function () {
          var result1 = [];
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = _this13.fieldsFlat[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              field = _step3.value;

              result1.push(field.export(item[field.key]));
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }

          return result1;
        }();
      });

      var csv = Papa.unparse({ fields: fields, data: data });
      var blob = new Blob([csv], { type: 'text/csv' });

      var link = document.createElement('a');
      link.setAttribute('download', this.exportFileName);
      link.setAttribute('href', window.URL.createObjectURL(blob));
      document.body.insertBefore(link, null);
      link.click();
      // Apparently iOS Safari doesn't support ChildNode.remove() yet...
      return document.body.removeChild(link);
    }
  }]);

  return Schema;
}();

var Table = function (_Component) {
  _inherits(Table, _Component);

  function Table() {
    _classCallCheck(this, Table);

    return _possibleConstructorReturn(this, (Table.__proto__ || Object.getPrototypeOf(Table)).apply(this, arguments));
  }

  _createClass(Table, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          schema = _props.schema,
          loading = _props.loading,
          deserializedData = _props.deserializedData,
          pagination = _props.pagination,
          rowSelection = _props.rowSelection,
          containerClassName = _props.containerClassName,
          rowClassName = _props.rowClassName,
          expandedRowRender = _props.expandedRowRender,
          defaultExpandAllRows_requiresNewKey = _props.defaultExpandAllRows_requiresNewKey,
          defaultExpandedRowKeys_requiresNewKey = _props.defaultExpandedRowKeys_requiresNewKey,
          expandedRowKeys = _props.expandedRowKeys;


      var tableProps = {
        // Note that in the deserialized rows, the rowKey is forced to 'key'
        // schema.rowKey refers to the serialized data
        rowKey: 'key',
        pagination: pagination || false,
        rowSelection: rowSelection || null,
        loading: loading,
        dataSource: deserializedData,
        columns: schema.tableColumns,
        bordered: true,
        size: 'small',
        expandedRowRender: expandedRowRender || null,
        // Note that defaultExpandAllRows requires a different component key
        // for every render
        defaultExpandAllRows: defaultExpandAllRows_requiresNewKey || false

        // Note that defaultExpandedRowKeys requires a different component key
        // for every render
      };defaultExpandedRowKeys_requiresNewKey && (tableProps.defaultExpandedRowKeys = defaultExpandedRowKeys_requiresNewKey);
      expandedRowKeys && (tableProps.expandedRowKeys = expandedRowKeys);

      if (containerClassName) {
        tableProps.className = containerClassName;
      }
      if (rowClassName) {
        tableProps.rowClassName = rowClassName;
      }

      return h(AntDTable, tableProps);
    }
  }]);

  return Table;
}(Component);

module.exports.Table = Table;

var List = void 0;
module.exports.List = List = function List(_ref3) {
  var listClassName = _ref3.listClassName,
      loading = _ref3.loading,
      deserializedData = _ref3.deserializedData,
      schema = _ref3.schema,
      expandedRowRender = _ref3.expandedRowRender;
  return h('div', { className: listClassName }, loading // eslint-disable-line no-nested-ternary
  ? h(Spin) : deserializedData && deserializedData.length ? h.apply(undefined, ['table', {}].concat(_toConsumableArray(deserializedData.map(function (row) {
    return schema.fieldsTree.makeNarrowTbody(row, expandedRowRender);
  })))) : h('span', {}, 'No data'));
};

var ExpandedRow = function (_Component2) {
  _inherits(ExpandedRow, _Component2);

  function ExpandedRow() {
    _classCallCheck(this, ExpandedRow);

    var _this15 = _possibleConstructorReturn(this, (ExpandedRow.__proto__ || Object.getPrototypeOf(ExpandedRow)).call(this));

    _this15.state = {
      expanded: false
    };
    return _this15;
  }

  _createClass(ExpandedRow, [{
    key: 'render',
    value: function render() {
      var _this16 = this;

      var _props2 = this.props,
          row = _props2.row,
          expandedRowRender = _props2.expandedRowRender;
      var expanded = this.state.expanded;


      return h('tr', {}, h('th', {}, h(Button, {
        icon: expanded ? 'minus' : 'plus',
        size: 'small',
        onClick: function onClick() {
          return _this16.setState({ expanded: !expanded });
        }
      })), h('td', {}, expanded ? expandedRowRender(row) : null));
    }
  }]);

  return ExpandedRow;
}(Component);

module.exports.TableResponsive = function (props) {
  return h(props.narrowMode && List || Table, props);
};
