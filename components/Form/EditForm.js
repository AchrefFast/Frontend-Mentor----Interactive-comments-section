import classes from "./EditForm.module.scss";
import { useRef } from "react";

const EditForm = (props) => {
    const textRef = useRef();

    function onUpdate(event) {
        event.preventDefault();
        props.onEdit(textRef.current.value);
    }
    return (
        <form
            onSubmit={onUpdate}
            className={`${classes.form} ${props.className ? props.className : ""}`}
        >
            <textarea ref={textRef} name="content" defaultValue={props.content} />
            <button type="submit">Update</button>
        </form>
    );
};

export default EditForm;
