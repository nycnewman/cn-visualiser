
import Field from './Field';
import { isCreatedEvent } from "../utils/updates.ts";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Paper from "@mui/material/Paper";

import type { TreeEvent, CreatedEvent, ExercisedEvent} from '../utils/updates.ts';

interface TransactionNodeProps {
    id: string;
    events: { [p: string]: TreeEvent }
}

const TransactionNode = (props: TransactionNodeProps) => {

    //TODO Fill out for both Create and Exercised Events

    if (isCreatedEvent(props.events[props.id])) {
        const node = props.events[props.id] as CreatedEvent;
        return (
            <Paper elevation={2}>
            <Card  sx={{ minWidth: 275 }}>
                <CardContent>
                    <div><strong>"{props.id}": {node.event_type}  </strong></div>
                    <div>Package: {node.template_id}</div>
                    <div>Signatories:</div>
                    <ul>
                        {node.signatories.length==0 && <li>None</li>}
                        {node.signatories &&
                            node.signatories?.map((party:string) => (
                                        <li key={party}>{party}</li>
                                )
                            )
                        }
                    </ul>
                    <div>Observers:</div>
                    <ul>
                        {node.observers.length==0 && <li>None</li>}
                        {node.observers &&
                            node.observers?.map((party:string) => (
                                    <li key={party}>{party}</li>
                                )
                            )
                        }
                    </ul>

                    <div>Create Arguments: </div>
                    <ul>
                        <Field field={ node.create_arguments } />
                    </ul>

                </CardContent>
            </Card>
            </Paper>
        )
    } else {
        const node = props.events[props.id] as ExercisedEvent;

        return (
            <Paper elevation={2}>
            <Card  sx={{ minWidth: 275 }}>
                <CardContent>
                <div><strong>{props.id}: {node.event_type} </strong></div>
                <div>Package: {node.template_id}</div>
                <div>Consuming: <strong>{node.consuming ? <>True</> : <>False</>}</strong></div>
                <div>Acting Parties:</div>
                <ul>
                    {node.acting_parties.length==0 && <li>None</li>}
                    {node.acting_parties &&
                        node.acting_parties?.map((party:string) => (
                                <li key={party}>{party}</li>
                            )
                        )
                    }
                </ul>
                <div>Choice: <strong>{node.choice }</strong></div>
                <div>Choice Arguments: </div>
                <ul>
                    <Field field={ node.choice_argument } />
                </ul>
                <div>Exercise Result: </div>
                <ul>
                    <Field field={ node.choice_argument } />
                </ul>

                <div>Child Events:</div>
                <ul>
                    {node.child_event_ids.length==0 && <li>None</li>}
                    {node.child_event_ids &&
                        node.child_event_ids?.map((root:string) => (
                                <div key={root} className="list-row">
                                    <li><TransactionNode key={root} id={root} events={props.events}/></li>
                                </div>
                            )
                        )
                    }
                </ul>
                </CardContent>
            </Card>
            </Paper>
        )
    }
};

export default TransactionNode;



