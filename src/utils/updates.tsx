import type { paths, components } from "../_openapi/scan";
import { Fetcher } from 'openapi-typescript-fetch'

export type UpdateHistoryResponse = components["schemas"]["UpdateHistoryResponse"];
export type UpdateHistoryItem = components["schemas"]["UpdateHistoryItem"];
export type UpdateHistoryTransaction = components["schemas"]["UpdateHistoryTransaction"];
export type UpdateHistoryReassignment = components["schemas"]["UpdateHistoryReassignment"];
export type TreeEvent = components["schemas"]["TreeEvent"];
export type CreatedEvent = components["schemas"]["CreatedEvent"];
export type ExercisedEvent = components["schemas"]["ExercisedEvent"];

export function isTransaction(event: UpdateHistoryTransaction | UpdateHistoryReassignment): event is UpdateHistoryTransaction {
    return (event as UpdateHistoryTransaction).events_by_id !== undefined;
}

export function isCreatedEvent(event: CreatedEvent | ExercisedEvent): event is CreatedEvent {
    return (event as CreatedEvent).create_arguments !== undefined;
}

export async function getUpdate (update_id: string): Promise<UpdateHistoryItem>{

    const fetcher = Fetcher.for<paths>()

    // global configuration
    fetcher.configure({
        baseUrl: 'https://scan.sv-2.global.canton.network.digitalasset.com/api/scan',
        init: {
            headers: {
                "Accept": "application/json"
            },
        }
        //,
        //use: [...] // middlewares
    })

    // create fetch operations
    const getOneUpdate =
        fetcher.path('/v1/updates/{update_id}').method('get').create();

    // fetch
    const {data} = await getOneUpdate({
            update_id: update_id,
        });

    return data;
}