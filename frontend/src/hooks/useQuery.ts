import { useState } from 'react';

export default function useQuery(initial: object) {
    const [query, setQuery] = useState(initial);

    function updateQuery(newQuery: object) {
        setQuery((prev) => ({
            ...prev,
            ...newQuery
        }));
    }

    function resetQuery() {
        setQuery(initial);
    }

    return [query, updateQuery, resetQuery];
}
