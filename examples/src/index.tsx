import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Autocomplete } from 'studio-auto-complete';
import "./main.scss";

(function () {
    if (typeof document !== "undefined") {
        ReactDOM.render(
            <Autocomplete
                className="job-assignment-panel__autocomplete"
                shouldClearOnExecution={true}
                items={[{ key: "test", name: "Test" }, { key: "ra", name: "RA" }]}
                placeholder={`Add`}
                labelAttribute="name"
                searchAttribute="name"
                onItemSelected={(e,i) => {
                    console.log("GEAAAA",e,i)
                }}
            >
            </Autocomplete>
            , document.getElementById('SiteContainer'), () => {
            });
    }
}()); 



