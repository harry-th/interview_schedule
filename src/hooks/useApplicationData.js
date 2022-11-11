import { useEffect, useReducer } from "react";
import Axios from "axios";
import { findDayId, calculateSpots } from '../helpers/selectors';


export function useApplicationData() {
    const reducer = (state, action) => {
        if (action.type === 'setDay') {
            return { ...state, day: action.day };
        }
        if (action.type === 'setApplicationData') {
            let day = action.day || state.day;
            let days = action.days || state.days;
            let appointments = action.appointments || state.appointments;
            let interviewers = action.interviewers || state.interviewers;
            return {
                ...state,
                day,
                days,
                appointments,
                interviewers
            };
        }
        if (action.type === "SET_INTERVIEW") {
            let days = state.days;
            let appointments = { ...state.appointments, [action.id]: { ...state.appointments[action.id], interview: action.interview } };
            let dayId = findDayId(action.id, days);
            days[dayId - 1].spots = calculateSpots(dayId, appointments, state.days);
            return {
                ...state,
                days: [...days],
                appointments
            };
        };

        let error = new Error(`Tried to reduce with unsupported action type: ${action.type}`);
        throw error;
    };
    const [state, dispatch] = useReducer(reducer, {
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
            dispatch({
                type: 'setApplicationData',
                days: all[0].data,
                appointments: all[1].data,
                interviewers: all[2].data
            });
        });


        const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
        socket.onopen = () => {
            socket.onmessage = (e) => {
                let { type, interview, id } = JSON.parse(e.data);
                //runs reducer with Set_Interview
                dispatch({ type, id, interview });
            };
            return () => {socket.close();};
        };
    }, []);
    return {
        state,
        setDay: day => dispatch({ type: 'setApplicationData', day }),
        bookInterview: (id) => {
            //returns function with once fed with id
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
                    let days = [...state.days];
                    let dayId = findDayId(id, state.days);
                    days[dayId - 1].spots = calculateSpots(dayId, appointments, state.days);
                    dispatch({
                        type: 'setApplicationData',
                        appointments, days
                    });
                });
            };
        }, cancelInterview: (id) => {
            const appointments = {
                ...state.appointments,
                [id]: { ...state.appointments[id], interview: null }
            };
            return Axios.delete('/api/appointments/' + id).then(() => {
                let days = [...state.days];
                let dayId = findDayId(id, state.days);
                days[dayId - 1].spots = calculateSpots(dayId, appointments, state.days);
                dispatch({
                    type: 'setApplicationData',
                    appointments, days
                });
            });
        }
    };
}
