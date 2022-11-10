
let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today
const api_url = "http://localhost:8080/api/event";

export async function getEvents() {
    const response = await fetch(api_url);
    var data = await response.json();
    //console.log(data);
}


export const INITIAL_EVENTS = [
    {
        id: createEventId(),
        title: 'All-day event',
        start: todayStr
    },
    {
        id: createEventId(),
        title: 'Timed event',
        start: todayStr + 'T22:00:00'
    }
]

export function createEventId() {
    return String(eventGuid++)
}
