"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var _ = require("lodash");
var Autocomplete = (function (_super) {
    __extends(Autocomplete, _super);
    function Autocomplete(p) {
        var _this = _super.call(this, p) || this;
        _this.getDropdownItems = function () {
            if (_this.props.defaultItems && _this.inputEl.value.length <= 1) {
                return _this.props.defaultItems;
            }
            else if (_this.inputEl.value.length <= 1) {
                return _this.props.items;
            }
            else {
                var filterItems = function (e) {
                    var kk = (e[_this.props.searchAttribute]).toLowerCase();
                    return kk.includes(_this.inputEl.value.toLowerCase());
                };
                if (Array.isArray(_this.props.items)) {
                    return _.filter(_this.props.items, filterItems);
                }
                else {
                    return _.pickBy(_this.props.items, filterItems);
                }
            }
        };
        _this.triggerInputUpdate = function () {
            var s = _this.getDropdownItems();
            if (_this.props.onInputChange) {
                _this.props.onInputChange(_this.inputEl.value);
            }
            _this.setState({
                currentItemIdx: 0,
                items: s,
                visible: true
            });
        };
        _this.keyPressed = function (e) {
            e = e || window.event;
            if (e.keyCode == '38') {
                _this.setToUpItem();
            }
            else if (e.keyCode == '40') {
                _this.setToDownItem();
            }
            else if (e.keyCode == "13") {
                if (_this.state.items[_this.state.currentItemIdx]) {
                    _this.executeSelection(e, _this.state.items[_this.state.currentItemIdx]);
                }
            }
        };
        _this.setToUpItem = function () {
            var cIdx = _this.state.currentItemIdx - 1;
            var len = Array.isArray(_this.state.items) ? _this.state.items.length : Object.keys(_this.state.items).length;
            cIdx = cIdx < 0 ? len - 1 : cIdx;
            _this.setState({
                currentItemIdx: cIdx
            });
        };
        _this.setToDownItem = function () {
            var cIdx = _this.state.currentItemIdx + 1;
            var len = Array.isArray(_this.state.items) ? _this.state.items.length : Object.keys(_this.state.items).length;
            cIdx = cIdx < len ? cIdx : 0;
            _this.setState({
                currentItemIdx: cIdx
            });
        };
        _this.hideItems = function () {
            _this.setState({
                visible: false
            });
        };
        _this.showItems = function () {
            if (_this.inputEl.value.length >= _this.props.charInputNumber) {
                _this.setState({
                    visible: true
                });
            }
        };
        _this.getSelection = function () {
            return _this.state.items[_this.state.currentItemIdx];
        };
        _this.blurItems = function () {
            if (_this.props.hasBlur) {
                setTimeout(function () {
                    _this.hideItems();
                }, 200);
            }
        };
        _this.executeSelection = function (event, item) {
            _this.blurItems();
            if (_this.props.shouldClearOnExecution) {
                _this.inputEl.value = "";
            }
            _this.props.onItemSelected(event, item);
        };
        _this.state = {
            items: [],
            currentItemIdx: 0,
            visible: false
        };
        return _this;
    }
    Autocomplete.prototype.componentDidMount = function () {
        this.setState({
            items: this.props.defaultItems || this.props.items,
            visible: this.props.shouldAlwaysShowOptions
        });
    };
    Autocomplete.prototype.componentDidUpdate = function (prevProps, prevState) {
        if (Array.isArray(this.props.items)) {
            if (prevProps.items.length !== this.props.items.length) {
                this.setState({
                    items: this.props.defaultItems || this.props.items
                });
            }
        }
        else {
            if (Object.keys(prevProps.items).length
                !== Object.keys(this.props.items).length) {
                this.setState({
                    items: this.props.defaultItems || this.props.items
                });
            }
        }
        if (this.props.defaultItems) {
            if (Array.isArray(this.props.defaultItems)) {
                if (prevProps.defaultItems.length !== this.props.defaultItems.length) {
                    this.setState({
                        items: this.props.defaultItems || this.props.defaultItems
                    });
                }
            }
            else {
                if (Object.keys(prevProps.defaultItems).length
                    !== Object.keys(this.props.defaultItems).length) {
                    this.setState({
                        items: this.props.defaultItems || this.props.defaultItems
                    });
                }
            }
        }
    };
    Autocomplete.prototype.render = function () {
        var _this = this;
        var props = this.props, state = this.state, cls = props.className || "";
        var len = Array.isArray(state.items) ? state.items.length : Object.keys(state.items).length;
        return (React.createElement("div", { className: "autocomplete " + cls, onBlur: this.blurItems },
            React.createElement("input", { className: "autocomplete__input", type: "text", placeholder: props.placeholder && props.placeholder || "", onChange: this.triggerInputUpdate, ref: function (e) { _this.inputEl = e; }, onKeyDown: this.keyPressed, onFocus: this.showItems }),
            React.createElement("ul", { className: "autocomplete__menu", "data-visible": state.visible }, props.customComponent &&
                _.map(state.items, function (e, ii) {
                    return React.createElement("li", { className: "autocomplete__item", onClick: function (event) { _this.executeSelection(event, e); }, onMouseEnter: function () { _this.setState({ currentItemIdx: ii }); }, key: ii }, props.customComponent(e));
                })
                ||
                    _.map(state.items, function (e, ii) {
                        var s = props.labelAttribute ? e[props.labelAttribute] : e;
                        return React.createElement("li", { className: "autocomplete__item", onClick: function (event) { _this.executeSelection(event, e); }, onMouseEnter: function () { _this.setState({ currentItemIdx: ii }); }, key: ii }, props.labelAttribute &&
                            s[props.labelAttribute] ||
                            s);
                    }))));
    };
    Autocomplete.defaultProps = {
        hasBlur: true,
        onInputChange: function () { },
        onEnterPress: function () { },
        onItemSelected: function () { },
        shouldExecuteOnEnter: false,
        charInputNumber: 0,
        shouldClearOnExecution: true,
        shouldAlwaysShowOptions: false,
        customComponent: null,
        searchAttribute: null,
        labelAttribute: null,
    };
    return Autocomplete;
}(React.Component));
exports.Autocomplete = Autocomplete;
//# sourceMappingURL=Autocomplete.js.map