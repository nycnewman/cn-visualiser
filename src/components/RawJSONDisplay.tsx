import {useState} from 'react';

import type { UpdateHistoryItem } from '../utils/updates.tsx';

interface RawJSONProps {
    transaction: UpdateHistoryItem;
}

export default function RawJSONDisplay(props: RawJSONProps) {
    const [isOpen, setIsOpen] = useState(false);

    function toggle() {
        setIsOpen((isOpen: boolean) => !isOpen);
    }

    return (
        <div>
            <div onClick={toggle}><strong>Raw JSON (click to show/hide)</strong></div>
            {isOpen && <pre>{JSON.stringify(props.transaction, null, 2)}</pre>}
            <p/>
            <p/>
            <p/>
        </div>

    );
}
