import React, {useEffect, useState} from 'react';
import { getUpdate } from '../utils/updates.tsx';
import { useParams } from "react-router-dom";
import JSONTree from './JSONTree.tsx';
import MenuBar from "../components/MenuBar.tsx";
import getErrorMessage from "../utils/errMsg.tsx";
import RawJSONDisplay from "./RawJSONDisplay.tsx";
import Transaction from "./Transaction.tsx";

import type { UpdateHistoryItem } from '../utils/updates.tsx';

type RouteParams = {
    update_id: string;
}

const UpdatesDetail: React.FC = () => {
    const [data, setData] = useState<UpdateHistoryItem>();
    const { update_id } = useParams<RouteParams>();
    const [error, setError] = React.useState<string | undefined>('');
    const [loading, setLoading] = React.useState<boolean>(false);

    useEffect(() => {

        const loadData = async () => {
            setLoading(true);
            setError('');
            try {
                let result;
                if (typeof update_id === 'string') {
                    result = await getUpdate(update_id);
                    setData(result);
                }
            } catch (error) {
                setError(getErrorMessage(error));
            } finally {
                setLoading(false);
            }
        };

        void loadData();

    }, [update_id]);

    if (loading) {
        return <p>Loading data...</p>;
    }

    if (error) {
        return <p>Error: {getErrorMessage(error)}</p>;
    }

    return (
        <>
            <MenuBar />
            <h2>Transaction Details Page</h2>
            <strong>Details for Update ID: </strong>{update_id}
            <p></p>
            {
                data && (
                    <>
                        <JSONTree transaction={data}/>
                        <Transaction transaction={data}/>
                        <p></p>
                        <RawJSONDisplay transaction={data}/>
                    </>
                )
            }
        </>
    );
}

export default UpdatesDetail;