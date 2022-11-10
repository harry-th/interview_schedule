import { useState, useEffect } from "react";
import Axios from "axios";


const calculateSpots = (daysId, appointments, days) => {
    let count = 0;
    days[daysId-1].appointments.forEach(item =>{
           if (appointments[item].interview === null) {
            count += 1
           }
    })
    return count
}
const findDayId = (appId, days) => {
    for (const day of days) {
        if (day.appointments.includes(appId)) {
            return day.id
        }
    }
    return -1
}

export function useApplicationData() {
const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
});
 useEffect(() => {
    Promise.all([
      Axios.get('/api/days'),
      Axios.get('/api/appointments'),
      Axios.get('/api/interviewers')
    ]).then((all) => {
      setState(prev => ({
        ...prev, days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      }))
    });
  }, [setState])

return {
    state,
    setState,
    setDay: day => setState({ ...state, day }),
    bookInterview: (id) => {
        return function (interview) {
            const appointment = {
                ...state.appointments[id],
                interview: { ...interview }
            };
            const appointments = {
                ...state.appointments,
                [id]: appointment
            };
            return Axios.put('/api/appointments/' + id, appointment).then(() => {
                let days = [...state.days]
                let dayId = findDayId(id, state.days)
                days[dayId-1].spots=calculateSpots(dayId, appointments, state.days)
                setState(prev => ({ ...prev, appointments, days}))
            })
        }
    }, cancelInterview: (id) => {
        const appointments = {...state.appointments, 
            [id]:{...state.appointments[id], interview: null}}
        return Axios.delete('/api/appointments/' + id).then(() => {
            let days = [...state.days]
            let dayId = findDayId(id, state.days)
            days[dayId-1].spots=calculateSpots(dayId, appointments, state.days)
            setState(prev => ({...prev, appointments, days: days}))
        })
    }
}
}
