import classes from "./NewCommentForm.module.scss";
import { useRef, useState, useContext } from "react";
import AppContext from "../store/app-context";

const NewCommentForm = (props) => {
    const [text, setText] = useState(props.value || "");
    const textRef = useRef();
    const { currentUser } = useContext(AppContext);

    const textChangeHandler = (event) => {
        setText(event.target.value);
    };

    const submitHandler = (event) => {
        event.preventDefault();
        props.onSubmit({
            username: currentUser.username,
            content: textRef.current.value,
            image: currentUser.image,
            replyingTo: props.replyingTo,
        });
        setText("");
        if (props.type === "reply") {
            props.onCancel();
        }
    };
    return (
        <form className={classes.form} onSubmit={submitHandler}>
            <picture>
                <source type="image/webp" srcSet={props.image.webp} />
                <source type="image/png" srcSet={props.image.png} />
                <img src="/anonymous.png" />
            </picture>
            <textarea
                required={true}
                ref={textRef}
                name="content"
                rows="5"
                readOnly={false}
                placeholder={props.placeholder}
                value={text}
                onChange={textChangeHandler}
            />
            <div>
                <button type="submit">{props.type}</button>
                {props.type === "reply" && (
                    <button
                        className={classes.cancel}
                        type="button"
                        onClick={props.onCancel}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default NewCommentForm;
