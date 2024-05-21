export default function parseTimeid(timeid: string) {
    const year = parseInt(timeid.substring(0, 4));
    const month = parseInt(timeid.substring(4));

    const data = {
        startDate : new Date(year, month-1, 1),
        endDate : new
         Date(year, month, 0)
    }
    return data;
}   