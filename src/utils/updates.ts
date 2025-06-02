import type { paths, components } from "../_openapi/scan";
import { Fetcher } from 'openapi-typescript-fetch'

export type UpdateHistoryResponse = components["schemas"]["UpdateHistoryResponse"];
export type UpdateHistoryItem = components["schemas"]["UpdateHistoryItem"];
export type UpdateHistoryTransaction = components["schemas"]["UpdateHistoryTransaction"];
export type UpdateHistoryReassignment = components["schemas"]["UpdateHistoryReassignment"];
export type TreeEvent = components["schemas"]["TreeEvent"];
export type CreatedEvent = components["schemas"]["CreatedEvent"];
export type ExercisedEvent = components["schemas"]["ExercisedEvent"];

export type UpdatesRequest = paths['/v1/updates']['post']['requestBody']['content']['application/json'];

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
            signal: AbortSignal.timeout(10000)
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

export async function getUpdates (params: paths['/v1/updates']['post']['requestBody']['content']['application/json']): Promise<UpdateHistoryItem[] | undefined> {

    const fetcher = Fetcher.for<paths>();

    fetcher.configure({
        baseUrl: 'https://scan.sv-2.global.canton.network.digitalasset.com/api/scan',
        init: {
            headers: {
                "Accept": "application/json"
            },
            body: JSON.stringify(params),
            signal: AbortSignal.timeout(10000)
        },
        //,
        //use: [...] // middlewares
    })

    const apiEndpoint = fetcher
        .path('/v1/updates')
        .method('post')
        .create();

    try {
        const {data} = await apiEndpoint(params);
        if (data) {
            return data.transactions;
        }
    } catch (e) {
        console.error('An error occurred:', e);
        if (e instanceof apiEndpoint.Error) {
        // get discriminated union { status, data }
            const error = e.getActualType()
            console.error('Error getting updates:', error);
            if (error.status === 400) {
                console.error(error.data); // only available for a 400 response
            } else if (error.status === 500) {
                console.error(error.data); // only available for a 500 response
            }
        }
        throw e;
    }
}