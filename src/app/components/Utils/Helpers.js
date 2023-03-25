export function formatDate(date) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    return monthNames[date.getMonth()] + String(date.getDate()).padStart(2, '0');
}

export function formatDateToHuman(timestamp) {
    //convert to UTC
    //console.log("timestamp value...",timestamp);
    let d = new Date(timestamp / 1 + (new Date()).getTimezoneOffset() * 60 * 1000)
    return [
        d.getDate().toString().padStart(2, '0'),
        `${(d.getMonth() + 1).toString().padStart(2, '0')}`,
        d.getFullYear()].join('/') + ' ' +
        [`${d.getHours()}`.padStart(2, '0'),
        `${d.getMinutes()}`.padStart(2, '0'),
        `${d.getSeconds()}`.padStart(2, '0'),
        ]
            .join(':');
}

export function formatDateToHumanChart(timestamp) {

    let d = new Date(timestamp / 1 + (new Date()).getTimezoneOffset() * 60 * 1000)
    return [
        d.getFullYear(),
        `${(d.getMonth() + 1).toString().padStart(2, '0')}`,
        d.getDate().toString().padStart(2, '0')].join('/') + ' ' +

        [`${d.getHours()}`.padStart(2, '0'),
        `${d.getMinutes()}`.padStart(2, '0'),
        `${d.getSeconds()}`.padStart(2, '0'),
        ]
            .join(':');
}

export function formatDayTimeToHuman(timestamp) {
    //convert to UTC
    let d = new Date(timestamp * 1000 + (new Date).getTimezoneOffset() * 60 * 1000)
    return [
        d.getDate(),
    ].join('/') + ' ' +
        [
            `${d.getHours()}`.padStart(2, '0'),
            `${d.getMinutes()}`.padStart(2, '0'),
            `${d.getSeconds()}`.padStart(2, '0'),
        ]
            .join(':');
}

export function formatDateOnlyToHuman(timestamp) {
    //convert to UTC
    let d = new Date(timestamp * 1000 + (new Date).getTimezoneOffset() * 60 * 1000)
    return [
        d.getDate(),
        `${(d.getMonth() + 1).toString().padStart(2, '0')}`,
        d.getFullYear()
    ].join('/')
}