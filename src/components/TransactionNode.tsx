
import type { TreeEvent, CreatedEvent, ExercisedEvent} from '../utils/updates.tsx';
import Field from './Field';
import { isCreatedEvent } from "../utils/updates.tsx";

interface TransactionNodeProps {
    id: string;
    events: { [p: string]: TreeEvent }
}

const TransactionNode = (props: TransactionNodeProps) => {

    //TODO Fill out for both Create and Exercised Events

    if (isCreatedEvent(props.events[props.id])) {
        const node = props.events[props.id] as CreatedEvent;
        return (
            <>
            <div><strong>"{props.id}": {node.event_type}  </strong></div>
            <div>Package: {node.template_id}</div>
            </>
        )
    } else {
        const node = props.events[props.id] as ExercisedEvent;

        return (
            <>
                <div><strong>{props.id}: {node.event_type} </strong></div>
                <div>Package: {node.template_id}</div>
                <div>Consuming: <strong>{node.consuming ? <>True</> : <>False</>}</strong></div>
                <div>Choice: <strong>{node.choice }</strong></div>
                <div>Choice Arguments: </div>
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
            </>
        )
    }
};

export default TransactionNode;



