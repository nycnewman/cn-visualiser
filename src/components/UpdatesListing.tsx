import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MenuBar from "../components/MenuBar.tsx";
import getErrorMessage from "../utils/errMsg.tsx";
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import type { UpdateHistoryResponse, UpdateHistoryTransaction, UpdateHistoryItem } from '../utils/updates.tsx';

function Row(props: { row: ReturnType<typeof createData> }) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    <Link to={"/cn-visualiser/" + row.update_id}>{row.update_id}</Link>
                </TableCell>
                <TableCell align="right">{row.total_events}</TableCell>
                <TableCell align="right">{row.migration_id}</TableCell>
                <TableCell align="right">{row.record_time}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Event(s)
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Event ID</TableCell>
                                        <TableCell>Event Type</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.events.map((historyRow) => (
                                        <TableRow key={historyRow.event_id}>
                                            <TableCell component="th" scope="row">
                                                {historyRow.event_id}
                                            </TableCell>
                                            <TableCell>{historyRow.event_type}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

interface rowEventItem {
    event_id: string;
    event_type: string;
}

interface rowType {
    update_id: string;
    migration_id: number;
    record_time: string;
    events: Array<rowEventItem>;
    total_events: number;
}

function createData(transaction: UpdateHistoryTransaction ): rowType {

    const events = transaction.root_event_ids.map((eventId) => {
        const event = transaction.events_by_id[eventId];
        const event_id = event.event_id;
        const event_type = event.template_id;
        return {event_id, event_type};
    });

    return {
        update_id: transaction.update_id,
        migration_id: transaction.migration_id,
        record_time: transaction.record_time,
        events: events,
        total_events: Object.keys(transaction.events_by_id).length
    };
}

const UpdatesListing: React.FC = () => {
    const [data, setData] = useState<UpdateHistoryItem[] | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | undefined>(undefined);
    const apiUrl = 'https://scan.sv-2.global.canton.network.digitalasset.com/api/scan/v1/updates';

    const fetchData = async (): Promise<UpdateHistoryItem[] | undefined> => {
        setLoading(true);

        const body = {
            after: {
                //after_record_time: "2024-06-01T21:50:04.988894Z",
                after_record_time: "2025-05-01T21:50:04.988894Z",
                after_migration_id: 2
            },
            page_size: 30,
            daml_value_encoding: 'compact_json'
        };

        try {
            const response: Response = await fetch(apiUrl, {
                mode: 'cors',
                method: "post",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const json = await response.json();
            if (typeof (json as UpdateHistoryResponse).transactions != undefined) {
                const updates: UpdateHistoryResponse = json as UpdateHistoryResponse;
                return (updates.transactions);
            } else {
                return undefined;
            }
        } catch (error) {
            setError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData()
            .then((data) => setData(data))
            .catch((error: unknown) => {
                setError(getErrorMessage(error))
            });
    }, [apiUrl]);

    if (loading) {
        return <p>Loading data...</p>;
    }

    if (error) {
        return <p>Error: {getErrorMessage(error)}</p>;
    }

    let rows: rowType[];
    if (data) {
        rows = data.map((item: UpdateHistoryItem) => {
            const transactionItem = item as UpdateHistoryTransaction;
            return (createData(transactionItem));
        });
    } else {
        rows = [];
    }

    return (
        <div>
            <p/>
            <MenuBar />
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>Update ID#</TableCell>
                                <TableCell align="right">Event Count</TableCell>
                                <TableCell align="right">Migration ID</TableCell>
                                <TableCell align="right">Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows && rows.map((row) => (
                                <Row key={row.update_id} row={row} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
        </div>
    );
}

export default UpdatesListing;