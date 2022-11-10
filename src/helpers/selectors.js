export function getAppointmentsForDay(state, day) {
    let results = []
    for (let item of state.days) {
        if (item.name === day) {
            for( const app of item.appointments) {
                results.push(state.appointments[app])
            }
            return results
        }
    }
    return []
}

export function getInterviewersForDay(state, day) {
    let results = []
    for (let item of state.days) {
        if (item.name === day) {
            for( const app of item.interviewers) {
                results.push(state.interviewers[app])
            }
            return results
        }
    }
    return []
}


export function getInterview(state, id) {
    for (let int in state.interviewers) {
        if (id?.interviewer === Number(int)) {
            if (state.interviewers[int] === null) return null
            else return {student: id.student, interviewer: state.interviewers[int]}
        }
    }
    return null
}

export const addInterviews = (state) => {
    let array = Object.values(state.appointments).map(item => {
      return { ...item, interview: getInterview(state, item.interview) }
    })
    let object = {}
    for (let i = 0; i < array.length; i++) {
      object[i + 1] = array[i]
    }
    return object
  }
  
  export const calculateSpots = (daysId, appointments, days) => {
    let count = 0;
    days[daysId - 1].appointments.forEach(item => {
        if (appointments[item].interview === null) {
            count += 1
        }
    })
    return count
}
export const findDayId = (appId, days) => {
    for (const day of days) {
        if (day.appointments.includes(appId)) {
            return day.id
        }
    }
    return -1
}
