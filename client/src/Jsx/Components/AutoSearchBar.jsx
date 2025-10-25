import { useState, useEffect } from "react";

function AutoSearchBar(props) {
    const [searchString, setSearchString] = useState("");

    const { onSearch, delay, ...otherProps } = props;

    useEffect(() => {
        const handler = setTimeout(() => {
        if (searchString.trim() !== "") {
            onSearch(searchString);
        }
        }, delay || 1000);

        return () => clearTimeout(handler);
    }, [searchString, onSearch]);

    return (
        <input
            type="text"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            className={otherProps}
        />
    );
}

export default AutoSearchBar;
