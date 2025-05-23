import React, {useCallback, useState} from 'react';
import { Tree } from 'react-d3-tree';
//import type { components} from '../_openapi/scan';
import type { Point } from 'react-d3-tree';
import type { RawNodeDatum, RenderCustomNodeElementFn, CustomNodeElementProps } from 'react-d3-tree';
import type { TreeEvent, ExercisedEvent, UpdateHistoryItem, UpdateHistoryTransaction} from "../utils/updates.tsx";

//type TreeEvent = components["schemas"]["TreeEvent"];
//type CreatedEvent = components["schemas"]["CreatedEvent"];
//type ExercisedEvent = components["schemas"]["ExercisedEvent"];
//type UpdateHistoryTransaction = components["schemas"]["UpdateHistoryTransaction"];
//type UpdateHistoryItem = components["schemas"]["UpdateHistoryItem"];

interface JSONTreeProps {
    transaction: UpdateHistoryItem;
}

type TreeDictionary = Record<string, TreeEvent>;

interface Location {
    x: number;
    y: number;
}

//interface Dimension {
//    width: number;
//    height: number;
//}

// interface CustomNodeProps {
//     nodeDatum: TreeNodeDatum & JSONTreeType;
//     toggleNode: (nodeDatum: TreeNodeDatum) => void;
// }

const useCenteredTree = (defaultTranslate = { x: 0, y: 0 }) => {
    const [translate, setTranslate] = useState<Point>(defaultTranslate);
    const [dimensions, setDimensions] = useState({width: 0, height: 0});
    const containerRef:React.RefCallback<HTMLElement> = useCallback((containerElem) => {
        if (containerElem !== null) {
            const { width, height } = containerElem.getBoundingClientRect();

            setDimensions({width, height});
            setTranslate({ x: (width / 2)-400, y: height / 2 });
        }
    }, []);
    return [dimensions, translate, containerRef];
};

const renderRectSvgNode = ({ nodeDatum, toggleNode } : CustomNodeElementProps ) => {
    //const isLeafNode:boolean = true || !nodeDatum.child_event_ids || nodeDatum.child_event_ids.length === 0;

    return (
        <g>
            <rect width="15" height="15" x="-5" onClick={toggleNode}/>
            <text fill="black" strokeWidth="1" x="0" dy="40">
                {nodeDatum.name}
            </text>
            {nodeDatum.attributes && nodeDatum.attributes?.type && (
                <text fill="black" x="20" dy="60" strokeWidth="1">
                    Type: {nodeDatum.attributes?.type}
                </text>
            )}
            {nodeDatum.attributes && nodeDatum.attributes?.update_id && (
                <text fill="black" x="20" dy="60" strokeWidth="1">
                    Upd ID: {nodeDatum.attributes?.update_id}
                </text>
            )}
            {nodeDatum.attributes && nodeDatum.attributes?.template && (
                <text fill="black" x="20" dy="80" strokeWidth="1">
                    Template: {nodeDatum.attributes?.template}
                </text>
            )}
            {nodeDatum.attributes && nodeDatum.attributes?.choice && (
                <text fill="black" x="20" dy="100" strokeWidth="1">
                    Choice: {nodeDatum.attributes?.choice}
                </text>
            )}
        </g>
    );
};

const parseChildren = (eventId: string, events: TreeDictionary): RawNodeDatum => {
    const event:TreeEvent = events[eventId];

    const truncateEventId = eventId.substring(0,10) + '.....' + eventId.substring(eventId.length-10);
    const tmpNode: RawNodeDatum = {name: truncateEventId, attributes: {}, children: []};

    tmpNode.attributes = {};
    tmpNode.attributes.type = event.event_type;
    tmpNode.attributes.template = event.template_id.substring(event.template_id.indexOf(':') + 1);
    if (event.event_type == "exercised_event") {
        tmpNode.attributes.choice = event.choice;
    }

    if ((event as ExercisedEvent).child_event_ids !== undefined) {
        tmpNode.children = (event as ExercisedEvent).child_event_ids.map((child:string):RawNodeDatum => {
            return(parseChildren(child, events));
        })
    };

    return tmpNode;
}

const parseTree = (updateItem: UpdateHistoryItem): RawNodeDatum => {
    const tmpTree: RawNodeDatum = {
        name: 'TX Root',
        children: [],
        attributes: {update_id: updateItem.update_id.substring(0,10) + '.....' + updateItem.update_id.substring(updateItem.update_id.length-10)}
    };

    if (typeof (updateItem as UpdateHistoryTransaction).root_event_ids !== undefined) {
        const transaction = updateItem as UpdateHistoryTransaction;
        tmpTree.children = transaction.root_event_ids?.map((event_id:string) => ( parseChildren(event_id, transaction.events_by_id)));
    }

    return tmpTree;
}

const myCustomPathFunc = ({ source, target }: {source: Location, target: Location}) => {
    // Calculate custom link path, e.g., connecting to the top of the node
    const startX: number = source.y;
    const startY: number = source.x + 10;
    const endX: number = target.y;
    const endY: number = target.x + 10; // Shift the end point upwards

    return `M${startX},${startY}L${endX},${endY}`;
};

const JSONTree = (props: JSONTreeProps ): React.JSX.Element => {
    const [ dimensions, translate, containerRef ] = useCenteredTree();

    const containerStyles = {
        width: "1000px",
        height: "600px",
        border: "2px solid gray"
    };

    const JSONTreeData = parseTree(props.transaction);
    //<label>Show only leaf nodes: </label><input type={"checkbox"} />

    return (
        <div style={containerStyles} ref={containerRef as React.Ref<HTMLDivElement>}>
            <Tree
                data={JSONTreeData}
                dimensions={dimensions as {width: number; height: number;}}
                translate={translate as Point}
                nodeSize={{ x: 350, y: 150 }}
                //separation={{ siblings: 2, nonSiblings: 2 }}
                renderCustomNodeElement={renderRectSvgNode as RenderCustomNodeElementFn}
                orientation="horizontal"
                pathFunc={myCustomPathFunc}
            />
        </div>
    );
};


export default JSONTree;




