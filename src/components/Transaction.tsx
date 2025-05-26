import TransactionNode from './TransactionNode';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import { isTransaction } from "../utils/updates.ts";
import type { UpdateHistoryItem, UpdateHistoryTransaction, UpdateHistoryReassignment } from '../utils/updates.ts';
import Paper from "@mui/material/Paper";
import Typography from '@mui/material/Typography';

interface TransactionProps {
    transaction: UpdateHistoryItem;
}

const Transaction = (props: TransactionProps) => {

    if (isTransaction(props.transaction)) {

        const transaction = props.transaction as UpdateHistoryTransaction;
        return (
            <Paper elevation={2}>
                <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                        <div className="box-with-outline">
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <label><strong>Transaction:</strong></label><p></p>
                            </Typography>
                            <div><label>Update ID:</label> {transaction.update_id}</div>
                            <div><label>Workflow ID:</label> {transaction.workflow_id}</div>
                            <div><label>Record Time:</label> {transaction.record_time}</div>
                            <div><label>Migration ID:</label> {transaction.migration_id}</div>
                            <div><label>Synchronizer ID:</label> {transaction.synchronizer_id}</div>
                            <p></p>
                            {transaction.root_event_ids &&
                                transaction.root_event_ids?.map((root) => (
                                     <div key={root} className="list-row">
                                         <TransactionNode key={root} id={root} events={transaction.events_by_id}/>
                                     </div>
                                    )
                                )
                            }
                        </div>
                    </CardContent>
                </Card>
            </Paper>
        )
    } else {
        const reassignment = props.transaction as UpdateHistoryReassignment;
        return (
            <div>TODO:  To be Handled {reassignment.update_id}</div>
        )
    }
};

export default Transaction;