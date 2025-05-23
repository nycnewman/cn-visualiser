import TransactionNode from './TransactionNode';

import { isTransaction } from "../utils/updates.tsx";
import type { UpdateHistoryItem, UpdateHistoryTransaction, UpdateHistoryReassignment } from '../utils/updates.tsx';

interface TransactionProps {
    transaction: UpdateHistoryItem;
}

const Transaction = (props: TransactionProps) => {

    if (isTransaction(props.transaction)) {

        const transaction = props.transaction as UpdateHistoryTransaction;
        return (
            <div className="box-with-outline">
                <label><strong>Transaction:</strong></label><p></p>
                <div><label>Update ID:</label> {transaction.update_id}</div>
                <div><label>Workflow ID:</label> {transaction.workflow_id}</div>
                <div><label>Record Time:</label> {transaction.record_time}</div>
                <div><label>Migration ID:</label> {transaction.migration_id}</div>
                <div><label>Synchronizer ID:</label> {transaction.synchronizer_id}</div>
                <ul className="col-md-4 list-group">
                    <ul>
                        {transaction.root_event_ids &&
                            transaction.root_event_ids?.map((root) => (
                                 <div key={root} className="list-row">
                                     <TransactionNode key={root} id={root} events={transaction.events_by_id}/>
                                 </div>
                                )
                            )
                        }
                     </ul>
                </ul>
            </div>
        )
    } else {
        const reassignment = props.transaction as UpdateHistoryReassignment;
        return (
            <div>TODO:  To be Handled {reassignment.update_id}</div>
        )
    }
};

export default Transaction;