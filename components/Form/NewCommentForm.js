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

        if (props.type === "reply") {
            // props.onCancel();
            return;
        }
        setText("");
    };
    return (
        <form className={classes.form} onSubmit={submitHandler} id={props.id}>
            <picture>
                <source type="image/webp" srcSet={props.image.webp} />
                <source type="image/png" srcSet={props.image.png} />
                <img src="/anonymous.png" alt={`${currentUser.username}`} />
            </picture>
            <div className={classes['text-block']}>
                <label className={classes['sr-only']} htmlFor={`textarea-${props.id || 'new-comment'}`}>Add a new comment:</label>
                <textarea
                    className={props.isInvalid ? classes.isInvalid : ''}
                    id={`textarea-${props.id || 'new-comment'}`}
                    required={true}
                    ref={textRef}
                    name="content"
                    rows="5"
                    readOnly={false}
                    placeholder={props.placeholder}
                    value={text}
                    onChange={textChangeHandler}
                    aria-invalid={props.isInvalid}
                />
                <p aria-live="assertive" className={classes.error}>{props.isInvalid ? 'Please enter your comment' : ''}</p>
            </div>
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
