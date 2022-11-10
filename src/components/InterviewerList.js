import React from "react"
import PropTypes from "prop-types"

import 'components/InterviewList.scss'
import InterviewerListItem from "./InterviewerListItem"

export default function InterviewerList(props) {


    return (
        <section className="interviewers">
            <h4 className="interviewers__header text--light">Interviewer</h4>
            <ul className="interviewers__list">
                {Object.values(props.interviewers).map((item) => {
                    return <InterviewerListItem
                        key={item.id}
                        name={item.name}
                        avatar={item.avatar}
                        selected={item.id === props.value}
                        setInterviewer={() => props.onChange(item.id)}
                    />
                })}
            </ul>
        </section>
    )
}

InterviewerList.propTypes = {
    interviewers: PropTypes.array.isRequired
}