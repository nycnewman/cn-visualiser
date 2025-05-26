import React, {useEffect, useState} from 'react';
import { getUpdate } from '../utils/updates.ts';
import { useParams } from "react-router-dom";
import JSONTree from './JSONTree.tsx';
import getErrorMessage from "../utils/errMsg.tsx";
import RawJSONDisplay from "./RawJSONDisplay.tsx";
import Transaction from "./Transaction.tsx";
import Layout from "./Layout.tsx";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';


import type { UpdateHistoryItem } from '../utils/updates.ts';

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
                setError("ERROR: Error retrieving data from service: " + getErrorMessage(error));
            } finally {
                setLoading(false);
            }
        };

        void loadData();

    }, [update_id]);

    if (loading) {
        return (
            <Layout>
            <p>Loading data...</p>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <p>Error: {error}</p>
            </Layout>
        );
    }

    return (
        <Layout>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <strong>Transaction Details Page</strong>
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    '& > :not(style)': {
                        m: 1,
                    },
                }}
            >
                <Paper >
                    <Card sx={{ minWidth: 275 }}>
                        <CardContent>

                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <strong>Details for Update ID: </strong>{update_id}
                        </Typography>
                        <p></p>
                            {
                                data && (
                                    <>
                                        <JSONTree transaction={data}/>
                                        <Card sx={{ minWidth: 275 }}>
                                            <CardContent>
                                        <RawJSONDisplay transaction={data}/>
                                            </CardContent>
                                        </Card>
                                        <Transaction transaction={data}/>
                                    </>
                                )
                            }
                        </CardContent>
                    </Card>
                </Paper>
            </Box>
        </Layout>
    );
}

export default UpdatesDetail;


