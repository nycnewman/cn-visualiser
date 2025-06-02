import React, {useState, useEffect, useContext} from 'react';
import { Link } from 'react-router-dom';
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
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import Button from '@mui/material/Button';
import Layout from "./Layout.tsx";
import { RecordDateContext } from "../utils/search-context.tsx";
import { getUpdates } from "../utils/updates.ts";

import type { ExercisedEvent,TreeEvent, UpdateHistoryTransaction, UpdateHistoryItem, UpdatesRequest } from '../utils/updates.ts';

interface rowEventItem {
    event_id: string;
    event_type: string;
    template_id: string;
}

interface rowType {
    update_id: string;
    titles: string[];
    migration_id: number;
    record_time: string;
    events: Array<rowEventItem>;
    total_events: number;
}

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
                    <Link to={"/cn-visualiser/" + row.update_id}>{row.update_id} </Link><p /> <ul>{row.titles.map((title, index) => { return (<li key={index}>{title}</li>)})}</ul>
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
                                        <TableCell>Template</TableCell>
                                        <TableCell>Choice</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.events.map((historyRow) => (
                                        <TableRow key={historyRow.event_id}>
                                            <TableCell component="th" scope="row">
                                                {historyRow.event_id.split(':')[1]}
                                            </TableCell>
                                            <TableCell>{historyRow.event_type}</TableCell>
                                            <TableCell>{historyRow.template_id.split(':')[1] + ":" + historyRow.template_id.split(':')[2]}</TableCell>
                                            <TableCell>{historyRow.event_type === 'exercised_event' && (historyRow as ExercisedEvent).choice}</TableCell>
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

function createData(transaction: UpdateHistoryTransaction ): rowType {

    let events: Array<TreeEvent> = [];
    for (const key in transaction.events_by_id) {
        const data: TreeEvent = transaction.events_by_id[key];
        events.push(data);
    }

    let titles: string[] = [];
    for (const key2 in transaction.root_event_ids) {

        const data2: TreeEvent = transaction.events_by_id[transaction.root_event_ids[key2]];

        let title: string = data2.template_id.split(':')[2];
        if (data2.event_type == 'exercised_event') {
            title = title + " - " + data2.choice;
        }

        titles.push(title)
    }

    events.sort((a: TreeEvent,b: TreeEvent) => {
        const a_id: number = Number(a.event_id.split(':')[1]);
        const b_id: number = Number(b.event_id.split(':')[1]);
        if (a_id < b_id) {
            return -1;
        }
        if (a_id > b_id) {
            return 1;
        }
        return 0;
    });

    return {
        update_id: transaction.update_id,
        titles: titles,
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
    const { recordDate, updateState } = useContext( RecordDateContext );
    const [buttonClicked, setButtonClicked] = useState<boolean>(true);

    useEffect(() => {

        const fetchData = async (): Promise<UpdateHistoryItem[] | undefined> => {

            if (buttonClicked) {
                try {
                    setLoading(true);
                    setError('');
                    setButtonClicked(false);

                    // Obtained from Scan API /v0/backfilling/migration-info
                    const migration_id_boundaries = {
                        0: {
                            "min": "2024-06-24T21:08:34.404896Z",
                            "max": "2024-10-16T13:00:18.826299Z"
                        },
                        1: {
                            "min": "2024-10-16T13:24:18.493744Z",
                            "max": "2024-12-11T14:00:17.064286Z"
                        },
                        2: {
                            "min": "2024-12-11T14:23:05.779294Z",
                            "max": "2025-05-23T19:02:45.315646Z"
                        }
                    }

                    let migration_id = 0;

                    if(recordDate == null) {
                        return [];
                    }

                    if (recordDate >= new Date(migration_id_boundaries[2]['min'])) {
                        migration_id = 2;
                    } else if (recordDate >= new Date(migration_id_boundaries[1]["min"])) {
                        migration_id = 1;
                    }
                    const body: UpdatesRequest = {
                        after: {
                            //after_record_time: "2024-06-01T21:50:04.988894Z",
                            after_record_time: recordDate.toISOString(),
                            after_migration_id: migration_id
                        },
                        page_size: 25,
                        daml_value_encoding: 'compact_json'
                    };

                    const result = await getUpdates(body);
                    setData(result);

                } catch (error) {
                    setError(getErrorMessage(error));
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [buttonClicked, recordDate]);

    // if (loading) {
    //     return (
    //         <Layout>
    //             <p></p>
    //             <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
    //             Loading data...<p>If this does not return, check access to Scan UI</p>
    //             </Typography>
    //         </Layout>
    //     ) ;
    // }

    let rows: rowType[];
    if (data) {
        rows = data.map((item: UpdateHistoryItem) => {
            const transactionItem = item as UpdateHistoryTransaction;
            return (createData(transactionItem));
        });
    } else {
        rows = [];
    }

    const handleDateChange = (date: Date | null) => {
        if (Object.prototype.toString.call(date) === "[object Date]") {
            // it is a date
            if (date == null) { // d.getTime() or d.valueOf() will also work
                // date object is not valid
            } else {
                // date object is valid
                updateState({recordDate: date});
            }
        } else {
            // not a date object
        }
    };

    const handleButtonClick = () => {
        if (recordDate) {
            setButtonClicked(true);
        }
    };

    const handleNextPage = () => {
        if (data != undefined) {
            updateState({ recordDate: new Date( (data[data.length - 1].record_time).toString()) });
            setButtonClicked(true);
        }
    };

    return (
        <Layout>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <div>This application allows you to search and view Canton Network Scan "Updates". You need to use from a machine with access to Canton Network Scan service.</div>
            </Typography>
            <p></p>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Enter Record Datetime to search for:
                <DateTimePicker
                    label="Date and Time"
                    value={recordDate}
                    onChange={handleDateChange}
                    onAccept={handleButtonClick}
                    ampm={false}
                    format="yyyy-MM-dd HH:mm:ss"
                />
                &nbsp;&nbsp;
                <Button variant="contained" onClick={handleNextPage} >Next Page</Button>
            </Typography>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Update ID# <p/><ul><li>Root Events</li></ul> </TableCell>
                            <TableCell align="right">Event Count</TableCell>
                            <TableCell align="right">Migration ID</TableCell>
                            <TableCell align="right">Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            loading && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">Loading...</TableCell>
                                </TableRow>
                            )
                        }
                        {
                            error && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">ERROR: Error occurred: ... {error} </TableCell>
                                </TableRow>
                            )
                        }
                        {
                            rows && rows.map((row) => (
                                <Row key={row.update_id} row={row} />
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Layout>
    );
}

export default UpdatesListing;