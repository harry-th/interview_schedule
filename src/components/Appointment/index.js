import { useVisualMode } from "hooks/useVisualMode";
import React, { useEffect } from "react";
import Confirm from "./Confirm";
import Empty from "./Empty";
import Error from "./Error";
import Form from "./Form";
import Header from "./Header";
import Show from "./Show";
import Status from "./Status";

import './styles.scss';

export default function Appointment(props) {
    const EMPTY = "EMPTY";
    const SHOW = "SHOW";
    const CREATE = "CREATE";
    const SAVING = "SAVING";
    const REMOVE = "REMOVE";
    const DELETING = "DELETING";
    const ERROR_SAVE = "ERROR_SAVE";
    const ERROR_DELETE = "ERROR_DELETE";
    const { mode, transition, back } = useVisualMode(
        props.interview ? SHOW : EMPTY
    );
    function save(name, interviewer) {
        const interview = {
            student: name,
            interviewer
        };
        transition(SAVING, true);
        props.bookInterview(interview).then(() => {
            transition(SHOW);
        }).catch((error) => {
            transition(ERROR_SAVE, true);
        });
    }
    function deleteInterview() {
        transition(DELETING, true);
        props.cancelInterview(props.id).then(() => {
            transition(EMPTY);
        }).catch((error) =>{
            transition(ERROR_DELETE, true);
        });
    }
    //checks interviews and corrects mode for when web sockets changes interviews on another client
    useEffect(() => {
        if(props.interview && mode === EMPTY) {
            transition(SHOW);
        } else if (!props.interview && mode === SHOW) {
            transition(EMPTY);
        }
    },[mode, props.interview, transition]);

    return (
        <article className="appointment"
        data-testid="appointment">
            <Header time={props.time} />
            {mode === EMPTY && <Empty onAdd={() => {
                transition(CREATE);
            }} />}
            {mode === SHOW && props.interview && (
                <Show
                    student={props.interview?.student}
                    interviewer={props.interview?.interviewer}
                    onDelete={() => transition(REMOVE)}
                    onEdit={() => transition(CREATE)}
                />
            )}
            {mode === CREATE && (
                <Form interviewers={props.interviewers}
                    student={props.interview?.student}
                    interviewer={props.interview?.interviewer}
                    onCancel={back}
                    onSave={save} />
            )}
            {mode === SAVING && (
                <Status message={'saving...'} />
            )}
            {mode === DELETING && (
                <Status message={'deleting...'} />
            )}
            {mode === REMOVE && (
                <Confirm
                    message={'Delete this Interview?'}
                    onConfirm={deleteInterview}
                    onCancel={back} />
            )}
            {(mode === ERROR_DELETE || mode === ERROR_SAVE )&& (
                <Error message='There was an error'
                onClose={back} />
            )}
        </article>
    );
}