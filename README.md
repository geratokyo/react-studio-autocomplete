# studio-auto-complete

This is an auto-complete component for reactJS.

## Props

| name | type |default| description  |
| ----|----|----|----|
| className?| string | "" | Class name of the component |
| placeholder? | string | "" | Placeholder for the input |
| items | any[] \| Dictionary\<any\> | | Items to be shown in the dropdowns|
| defaultItems? | any[] \| Dictionary\<any\> | null | Items to be shown in the dropdowns|
| searchAttribute? | string | null | This is a value of the attribute the data will be filtered by |
| labelAttribute? | string | null |  This is a value of the attribute the data shown in the list |
| onInputChange? | (value: string) => void | null | A function called when a change on input is triggered |
| onEnterPress? | (value: any) => void | null | A function which is trigered when enter button is clicked |
| hasBlur? | boolean | true | True if the component should hide dropdown when clicked somewhere else |
| shouldExecuteOnEnter? | boolean | null | OnClick execute the on enter function |
| charInputNumber? | number | 0 | number of characters to input in order to show the dropdown |
| shouldClearOnExecution? | boolean | true | if input should clear on execution |
| onItemSelected? | (event:React.SyntheticEvent\<any\>, item: any) => void; | null | Function to be called when an item is selected  |either with mouse click or keyboad enter |
| shouldAlwaysShowOptions? | boolean | false | true if the options should always be visible |
| customComponent? | (item: any) => React.ReactNode | null | function that returns a custom component as a list item |


## Usage

#### Simple example

```typescript
<Autocomplete
    className="example__autocomplete"
    shouldClearOnExecution={true}
    items={[{ key: "john", name: "John" }, { key: "doe", name: "Doe" }]}
    placeholder={`Search by name`}
    labelAttribute="name"
    searchAttribute="name"
    onItemSelected={(e,item) => {
        //TODO code
    }}
>
</Autocomplete>
```



#### Custom component example

```typescript
<Autocomplete
    className="example__autocomplete"
    shouldClearOnExecution={true}
    items={[{ key: "john", name: "John" }, { key: "doe", name: "Doe" }]}
    placeholder={`Search by name`}
    labelAttribute="name"
    searchAttribute="name"
    onItemSelected={(e,item) => {
        //TODO code
    }}
    customComponent={(item)=>{
        return <AvatarImage key={item.key} label={item.label} />
    }}
>
</Autocomplete>
```