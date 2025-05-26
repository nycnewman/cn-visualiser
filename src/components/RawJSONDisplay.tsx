import {useState} from 'react';
import Typography from '@mui/material/Typography';

import type { UpdateHistoryItem } from '../utils/updates.ts';

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
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <div onClick={toggle}>Raw JSON <strong>(click to show/hide)</strong></div>
            </Typography>
            {isOpen && <pre>{JSON.stringify(props.transaction, null, 2)}</pre>}
            <p/>
            <p/>
            <p/>
        </div>

    );
}
