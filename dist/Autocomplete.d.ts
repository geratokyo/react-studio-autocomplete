import * as React from 'react';
import * as _ from 'lodash';
import { Dictionary } from 'lodash';
export interface AutocompleteProps {
    className?: string;
    placeholder?: string;
    items: any[] | Dictionary<any>;
    defaultItems?: any[] | Dictionary<any>;
    searchAttribute?: string;
    labelAttribute?: string;
    onInputChange?: (value: string) => void;
    onEnterPress?: (value: any) => void;
    hasBlur?: boolean;
    shouldExecuteOnEnter?: boolean;
    charInputNumber?: number;
    shouldClearOnExecution?: boolean;
    onItemSelected?: (event: React.SyntheticEvent<any>, item: any) => void;
    shouldAlwaysShowOptions?: boolean;
    customComponent?: (item: any) => React.ReactNode;
}
export interface AutocompleteState {
    currentItemIdx: number;
    items: any[] | Dictionary<any>;
    visible: boolean;
}
export declare class Autocomplete extends React.Component<AutocompleteProps, AutocompleteState> {
    inputEl: HTMLInputElement;
    constructor(p: AutocompleteProps);
    static defaultProps: Partial<AutocompleteProps>;
    componentDidMount(): void;
    componentDidUpdate(prevProps: AutocompleteProps, prevState: AutocompleteState): void;
    getDropdownItems: () => _.Dictionary<any>;
    triggerInputUpdate: () => void;
    keyPressed: (e: any) => void;
    setToUpItem: () => void;
    setToDownItem: () => void;
    hideItems: () => void;
    showItems: () => void;
    getSelection: () => any;
    blurItems: () => void;
    executeSelection: (event: React.SyntheticEvent<any, Event>, item: any) => void;
    render(): JSX.Element;
}
