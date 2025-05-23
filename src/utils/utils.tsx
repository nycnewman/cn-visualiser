export function unixTimestampNsToDate(timestampNs :number) {
    const timestampMs = timestampNs / 1_000_000;
    return new Date(timestampMs);
}
