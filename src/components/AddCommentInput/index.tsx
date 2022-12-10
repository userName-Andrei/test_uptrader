import React, {FC, useState, KeyboardEvent} from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { addComment, addSubComment } from '../../store/action-creators/comments';
import { IComment } from '../../types/comments';

import './addCommentInput.scss';

interface AddCommentInputProps {
    taskId: string | number,
    reply?: boolean,
    comment?: IComment,
    closeModal?: () => void
}

const AddCommentInput: FC<AddCommentInputProps> = ({taskId, reply = false, comment, closeModal = () => {}}) => {

    const dispatch = useAppDispatch();
    const [newComment, setNewComment] = useState<string>('');

    const enterComment = (e: KeyboardEvent) => {
        if (e.code === 'Enter') {
            dispatch(addComment(newComment, taskId));
            setNewComment('');
            closeModal();
        }
    }

    const enterReplyComment = (e: KeyboardEvent) => {
        if (e.code === 'Enter' && comment && reply) {
            dispatch(addSubComment(newComment, comment));
            setNewComment('');
            closeModal();
        }
    }

    return (
        <div className="chat-input">
            <input 
                type="text" 
                className='chat-input__input input' 
                name='comment' 
                placeholder='Enter your comment'
                onChange={e => setNewComment(e.currentTarget.value)}
                onKeyDown={e => reply ? enterReplyComment(e) : enterComment(e)}
                value={newComment} />
            <button
                onClick={(e) => {
                    if (reply && comment) {
                        dispatch(addSubComment(newComment, comment));
                    } else {
                        dispatch(addComment(newComment, taskId));
                    }
                    closeModal();
                    setNewComment('');
                }}
                type='button'
                className='chat-input__btn-icon btn-icon btn-icon_darken _icon-send' />
        </div>
    )
};

export default AddCommentInput;