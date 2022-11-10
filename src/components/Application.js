import React, { useEffect, useState } from "react";

import "components/Application.scss";

import { useApplicationData } from "hooks/useApplicationData";

import DayList from "./DayList";
import Appointment from "./Appointment";
import Axios from "axios";

import { getAppointmentsForDay, getInterviewersForDay, addInterviews } from "../helpers/selectors"

export default function Application(props) {
  const { state, setDay, bookInterview, cancelInterview } = useApplicationData()
  
 let interviewers = getInterviewersForDay(state, state.day)

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            value={state.day}
            onChange={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {getAppointmentsForDay({
          days: state.days, appointments: addInterviews(state)
        }, state.day).map(item => {
          return <Appointment
            bookInterview={bookInterview(item.id)}
            cancelInterview={cancelInterview}
            interviewers={interviewers}
            key={item.id}
            {...item}
          />
        })}
      </section>
    </main>
  );
}
