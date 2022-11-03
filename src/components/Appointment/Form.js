import React, { useState } from "react";

import InterviewerList from "../InterviewerList";
import Button from "../Button.js"

export default function Form(props) {
    const [student, setStudent] = useState(props.student || "");
    const [interviewer, setInterviewer] = useState(props.interviewer || null);

    const reset = () => {
        setStudent('');
        setInterviewer(null)
    }
    const cancel = () => {
        props.onCancel();
        reset();
    }
    return (
        <main className="appointment__card appointment__card--create">
            <section className="appointment__card-left">
                <form autoComplete="off" onSubmit={e=>e.preventDefault()}>
                    <input
                        onChange={(e) => setStudent(e.target.value)}
                        className="appointment__create-input text--semi-bold"
                        name="name"
                        type="text"
                        placeholder={student}
                        value={student}
                    />
                </form>
                <InterviewerList
                    interviewers={props.interviewers}
                    value={interviewer}
                    onChange={setInterviewer}
                />
            </section>
            <section className="appointment__card-right">
                <section className="appointment__actions">
                    <Button danger onClick={cancel}>Cancel</Button>
                    <Button confirm onClick={props.onSave}>Save</Button>
                </section>
            </section>
        </main>
    )
}