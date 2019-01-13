import * as React from 'react';
import * as _ from 'lodash';
import { Dictionary } from 'lodash';


export interface AutocompleteProps {
    /**
     * Class name of the component
     */
    className?: string;

    /**
     * Placeholder for the input 
     */
    placeholder?: string;

    /**
     * Items to be shown in the dropdowns
     */
    items: any[] | Dictionary<any>;

    /**
     * Items to be shown in the dropdowns
     */
    defaultItems?: any[] | Dictionary<any>;

    /**
     * This is a value of the attribute the data will be filtered by
     */
    searchAttribute: string;

    /**
     * A function called when a change on input is triggered
     */
    onInputChange?: (value: string) => void;

    /**
     * A function which is trigered when enter button is clicked
     */
    onEnterPress?: (value: any) => void;

    /**
     * True if the component should hide dropdown when clicked somewhere else
     */
    hasBlur?: boolean;

    /**
     * OnClick execute the on enter function
     */
    shouldExecuteOnEnter?: boolean;

    /**
     * number of characters to input in order to show the dropdown
     */
    charInputNumber?: number;

    /**
     * if input should clear on execution
     */
    shouldClearOnExecution?: boolean;


    /**
     * Function to be called when an item is selected either 
     * with mouse click or keyboad enter
     */
    onItemSelected?: (e:any) => void;


    /**
     * true if the options should always be visible
     */
    shouldAlwaysShowOptions?: boolean;
}

export interface AutocompleteState {
    currentItemIdx: number;
    items: any[] | Dictionary<any>
    visible: boolean;
}

export class Autocomplete extends React.Component<AutocompleteProps, AutocompleteState>{
    inputEl: HTMLInputElement;
    constructor(p: AutocompleteProps) {
        super(p);
        this.state = {
            items: [],
            currentItemIdx: 0,
            visible: false
        }
    }

    public static defaultProps: Partial<AutocompleteProps> = {
        hasBlur: true,
        onInputChange: () => { },
        onEnterPress: () => { },
        onItemSelected: () => { },
        shouldExecuteOnEnter: false,
        charInputNumber: 0,
        shouldClearOnExecution: true,
        shouldAlwaysShowOptions: false
    };

    componentDidMount() {
        this.setState({
            items: this.props.defaultItems || this.props.items,
            visible: this.props.shouldAlwaysShowOptions
        })
    }

    componentDidUpdate(prevProps: AutocompleteProps, prevState: AutocompleteState) {
        if (Array.isArray(this.props.items)) {
            if ((prevProps.items as any[]).length !== this.props.items.length) {
                this.setState({
                    items: this.props.defaultItems || this.props.items
                })
            }
        } else {
            if (Object.keys(prevProps.items as Dictionary<any>).length
                !== Object.keys(this.props.items as Dictionary<any>).length) {
                this.setState({
                    items: this.props.defaultItems || this.props.items
                })
            }
        }
        if (this.props.defaultItems) {
            if (Array.isArray(this.props.defaultItems)) {
                if ((prevProps.defaultItems as any[]).length !== this.props.defaultItems.length) {
                    this.setState({
                        items: this.props.defaultItems || this.props.defaultItems
                    })
                }
            } else {
                if (Object.keys(prevProps.defaultItems as Dictionary<any>).length
                    !== Object.keys(this.props.defaultItems as Dictionary<any>).length) {
                    this.setState({
                        items: this.props.defaultItems || this.props.defaultItems
                    })
                }
            }
        }
    }

    getDropdownItems = ()=>{
        if (this.props.defaultItems && this.inputEl.value.length <= 1) {
            return this.props.defaultItems;
        }else if(this.inputEl.value.length <= 1){
            return this.props.items
        }else {
            const filterItems = (e:any) => {
                let kk = (e[this.props.searchAttribute]).toLowerCase();
                return kk.includes(this.inputEl.value.toLowerCase());
            };
            if (Array.isArray(this.props.items)) {
                return _.filter(this.props.items, filterItems);
            } else {
                return _.pickBy(this.props.items, filterItems)
            }
        }
    }

    triggerInputUpdate = () => {
        let s=this.getDropdownItems();

        if (this.props.onInputChange) {
            this.props.onInputChange(this.inputEl.value);
        }

        this.setState({
            currentItemIdx: 0,
            items: s,
            visible: true
        });
    }

    keyPressed = (e) => {
        e = e || window.event;
        if (e.keyCode == '38') {
            this.setToUpItem();
        } else if (e.keyCode == '40') {
            this.setToDownItem();
        } else if (e.keyCode == "13") {
            if (this.state.items[this.state.currentItemIdx]) {
                this.executeSelection(this.state.items[this.state.currentItemIdx]);
            }
        }
    }

    setToUpItem = () => {
        let cIdx = this.state.currentItemIdx - 1;
        let len = Array.isArray(this.state.items) ? this.state.items.length : Object.keys(this.state.items).length;
        cIdx = cIdx < 0 ? len - 1 : cIdx;
        this.setState({
            currentItemIdx: cIdx
        })
    }

    setToDownItem = () => {
        let cIdx = this.state.currentItemIdx + 1;
        let len = Array.isArray(this.state.items) ? this.state.items.length : Object.keys(this.state.items).length;
        cIdx = cIdx < len ? cIdx : 0;

        this.setState({
            currentItemIdx: cIdx
        })
    }

    hideItems = () => {
        this.setState({
            visible: false
        })
    }

    showItems = () => {
        if (this.inputEl.value.length >= this.props.charInputNumber) {
            this.setState({
                visible: true
            })
        }
    }

    getSelection = () => {
        return this.state.items[this.state.currentItemIdx];
    }


    blurItems = () => {
        if (this.props.hasBlur) {
            setTimeout(() => {
                this.hideItems();
            }, 200)
        }
    }

    executeSelection = (item: any) => {
        this.blurItems();
        if (this.props.shouldClearOnExecution) {
            this.inputEl.value = ""
        }
        this.props.onItemSelected(item)
    }

    render() {
        let props = this.props,
            state = this.state,
            cls = this.props.className || "";
        let len = Array.isArray(this.state.items) ? this.state.items.length : Object.keys(this.state.items).length;
        return (
            <div className={"autocomplete " + cls}
                onBlur={this.blurItems}>
                <input
                    className="autocomplete__input"
                    type="text"
                    placeholder={props.placeholder && props.placeholder || ""}
                    onChange={this.triggerInputUpdate}
                    ref={(e) => { this.inputEl = e }}
                    onKeyDown={this.keyPressed}
                    onFocus={this.showItems}
                />

                {
                    (props.children && len > 0) &&
                    <div className="autocomplete__menu"
                        data-visible={state.visible}>
                        {
                            Array.isArray(state.items) &&
                            GET_ARRAY_ITEMS(state.items, props, this)
                            ||
                            GET_OBJECT_ITEMS(state, props, this)
                        }

                    </div>
                }
            </div>
        )
    }
}

/**
 * Return a cloned element for that will appear on the Autocomplete dropdown
 * @param child Child component passed from the parent element
 * @param item The object from where information is taken
 * @param idx Index of the object in the array
 * @param state Autocomplete state
 * @param component Autocomplete component
 */
const CLONE_ELEMENTS = (child: React.ReactElement<any>, item, idx, currentItemIdx, component) => {
    return React.cloneElement(child, {
        ...child.props,
        key: idx,
        className: (currentItemIdx == idx ? child.props.className + " grey lighten-3" : child.props.className),
        label: child.props.label(item),
        imgSrc: child.props.imgSrc(item),
        mouseEnter: () => { component.setState({ currentItemIdx: idx }); },
        onClick: () => { component.executeSelection(item); }
    });
};


/**
 * This function will loop through an object to show in the dropdown
 * by selecting the keys of the object
 * @param state Autocomplete component state
 * @param props Autocomplete component props
 * @param component Autocomplete component
 */
function GET_OBJECT_ITEMS(items: any, props, component): React.ReactNode {
    return Object.keys(items).map((idx, ii) => {
        let e = items[idx];

        return React.Children.map(props.children,
            (child: React.ReactElement<any>) => CLONE_ELEMENTS(child, e, ii, component.state.currentItemIdx, component))[0]

    });
}

/**
 * This function will loop through an array of objects to show in the dropdown
 * @param state Autocomplete component state
 * @param props Autocomplete component props
 * @param component Autocomplete component
 */
function GET_ARRAY_ITEMS(items: any[], props, component): React.ReactNode {
    return (items as any[]).map((e, ii) => {
        return React.Children.map(props.children,
            (child: React.ReactElement<any>) => CLONE_ELEMENTS(child, e, ii, component.state.currentItemIdx, component))[0];
    });
}
