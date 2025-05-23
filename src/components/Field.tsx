//import { unixTimestampNsToDate } from "../utils/utils";

interface FieldProps {
    field: Record<string, unknown>;
}

const Field   = (props: FieldProps)=> {

    let t: any
    const fieldList = [];
    for(t in props.field) {
        const value = props.field[t];
        switch (typeof props.field[t] ) {
            case 'string':
                (typeof value) === 'string' && fieldList.push(<li key={t}><em>{t}</em>: { value }</li>)
                break;
            case 'object':
                fieldList.push(<li key={t}><em>{t}</em>: <ul><Field field={ props.field[t] as Record<string, unknown>} /></ul></li>)
                break;
            default:
                fieldList.push(<li key={t}>Unknown Field Type</li>)
                break;
        }
    }

    return fieldList;
};

export default Field;


