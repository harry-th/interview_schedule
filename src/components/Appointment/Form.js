import React, { useState } from "react";

import InterviewerList from "../InterviewerList";
import Button from "../Button.js";

export default function Form(props) {
    const [student, setStudent] = useState(props.student || "");
    const [interviewer, setInterviewer] = useState(props?.interviewer?.id || null);
    const [error, setError] = useState("");

    function validate() {
        if (student === "") {
          setError("Student name cannot be blank");
          return;
        }
        if (interviewer === null) {
            setError("Please select an interviewer");
            return;
          }
        props.onSave(student, interviewer);
        setError('');
      }

    const reset = () => {
        setStudent('');
        setError('');
        setInterviewer(null);
    };
    const cancel = () => {
        props.onCancel();
        reset();
    };
    return (
        <main className="appointment__card appointment__card--create">
            <section className="appointment__card-left">
                <form autoComplete="off" onSubmit={e=>e.preventDefault()}>
                    <input
                        data-testid="student-name-input"                  
                        onChange={(e) => setStudent(e.target.value)}
                        className="appointment__create-input text--semi-bold"
                        name="name"
                        type="text"
                        placeholder="Enter Student Name"
                        value={student}
                         />
                         <section className="appointment__validation">{error}</section>
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
                    <Button confirm onClick={() => validate(student, interviewer)}>Save</Button>
                </section>
            </section>
        </main>
    );
}