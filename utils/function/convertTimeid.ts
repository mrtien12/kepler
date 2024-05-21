export default function convertTimeid(timeid: string) {
    const year = timeid.slice(0, 4);
    const monthCode = timeid.slice(4);

    // Create an array of month names
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Convert the monthCode to an integer and get the month name
    const monthIndex = parseInt(monthCode, 10) - 1;
    const monthName = months[monthIndex];

    // Return the formatted string
    return `${monthName} ${year}`;
}