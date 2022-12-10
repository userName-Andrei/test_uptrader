import dayjs from 'dayjs';
import React, { FC, useState, useRef } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { deleteComment, deleteSubComment } from '../../store/action-creators/comments';
import { IComment } from '../../types/comments';
import { ITask } from '../../types/tasks';
import toggleAccordion from '../../utils/toggleAccordion';
import AddCommentInput from '../AddCommentInput';
import Modal from '../Modal';

import './taskView.scss';

interface TaskViewProps {
    task: ITask
}

const TaskView: FC<TaskViewProps> = ({task}) => {

    const files = task.files && task.files.length !== 0 ? Array.from(task.files) : [];
    
    return (
        <div className='task-view'>

            <div className="task-view__row">
                <div className="task-view__column">
                    <span className="task-view__subtitle">
                        Creation date:
                    </span>
                    <span className="task-view__subtitle">
                        {dayjs(task.creation_date).format('DD.MM.YYYY')}
                    </span>
                </div>
                <div className="task-view__column">
                    <span className="task-view__subtitle">
                        Time at work:
                    </span>
                    <span className="task-view__subtitle">
                        {task.finish_date ? `${dayjs(task.finish_date).diff(task.creation_date, 'd')} days` : '...'}
                    </span>
                </div>
                <div className="task-view__column">
                    <span className="task-view__subtitle">
                        Finish date:
                    </span>
                    <span className="task-view__subtitle">
                        {dayjs(task.finish_date).format('DD.MM.YYYY')}
                    </span>
                </div>
            </div>

            <div className="task-view__row">
                <span className="task-view__subtitle">
                    Priority: {task.priority}
                </span>
                <span className="task-view__subtitle">
                    Current status: {task.status}
                </span>
            </div>
            
            <div className="task-view__column">
                <span className='task-view__subtitle'>Task`s  description:</span>
                <span className='task-view__description'>{task.description}</span>
            </div>

            <div className='wrapper'>
                <div className="task-view__column task-view__column_inline-flex">
                    <span className="task-view__subtitle">
                        Files:
                    </span>
                    {!task.files || task.files.length === 0 ? 
                        <span className='task-view__subtitle'>Load your files...</span> : 
                        files.map(file => <a href={file.path} target='_blank' key={file.name} className='task-view__filename'>{file.name}</a>)
                    }
                </div>
            </div>

            <div className="task-view__column">
                <span className="task-view__subtitle">
                    Subtasks:
                </span>
                <ul className="task-view__subtasks-list task-subtasks">
                    {task.subtasks.map(item => (
                        <li key={item.id} className={`task-subtasks__item task-subtasks__status${item.status ? '_done' : '_atwork'}`}>
                            <span className='task-subtasks__subtask'>{item.description}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="task-view__column">
                <span className="task-view__subtitle">
                    Comments:
                </span>
                <CommentList taskId={task.id} />
            </div>

        </div>
    );
};

interface CommentListProps {
    taskId: string | number
}

const CommentList: FC<CommentListProps> = ({taskId}) => {
    
    const comments = useAppSelector(state => state.comments.comments.filter(comment => comment.taskId === taskId));
    
    if (comments.length === 0) {
        return (
            <>
                <div className="task-comments">
                    <span className='task-comments__not-comments'>
                        Enter your comment
                    </span>
                </div>

                <AddCommentInput taskId={taskId} />
            </>
        )
    }

    return (
        <>
            <ul className="task-comments">
                {comments.map(comment => (
                    <CommentItem key={comment.id} comment={comment} taskId={taskId} />
                ))}
            </ul>

            <AddCommentInput taskId={taskId} />
        </>
    );
}

interface CommentItemProps {
    comment: IComment,
    taskId: string | number
}

const CommentItem: FC<CommentItemProps> = ({comment, taskId}) => {

    const dispatch = useAppDispatch();
    const [isSubOpen, setIsSubOpen] = useState<boolean>(false);
    const [replyModal, setReplyModal] = useState<{active: boolean, currentComment: IComment | null}>({active: false, currentComment: null});
    const accordionRef = useRef<HTMLLIElement>(null);

    const renderSubcommentsSelector = (comment: IComment) => {

        if (!comment.subcomments || !comment.subcomments.length) {
            return null;
        }
        
        return (
            <span 
                onClick={(e) => {
                    toggleAccordion(e, accordionRef);
                    setIsSubOpen(status => !status);
                }}
                className={`comments-item__subcomment-selector comments-item__subcomment-selector${isSubOpen ? '_open' : '_close'}`}>
                    {isSubOpen ? 'close subcomments' : 'open subcomments'}
            </span>
        );
    }

    return (
        <>
            <li ref={accordionRef} className="task-comments__item comments-item">
                <div className="wrapp">
                    <span className="comments-item__date">{`${dayjs(comment.creation_date).format('DD/MM/YYYY HH:mm')}`}</span>
                    <span className="comments-item__body">{comment.body}</span>
                    <div className="comments-item__row">
                        {renderSubcommentsSelector(comment)}
                        <span onClick={() => setReplyModal(state => ({active: true, currentComment: comment}))} className="comments-item__reply">reply</span>
                        <span onClick={() => dispatch(deleteComment(comment.id))} className="comments-item__delete">
                            delete
                        </span>
                    </div>
                </div>
                <Subcomments comment={comment} />
            </li>

            <Modal 
            data='project-edit'
            title="Reply to comment"
            active={replyModal.active}
            modalHandler={(status) => setReplyModal(state => ({...state, active: status}))}>
                <>
                    <span className='form-task__label'>Reply to comment:</span>
                    <AddCommentInput 
                        taskId={taskId} 
                        closeModal={() => setReplyModal(state => ({...state, active: false}))}
                        comment={replyModal.currentComment ? replyModal.currentComment : undefined} 
                        reply />
                </>
            </Modal>
        </>
    );
}

interface SubcommentsProps {
    comment: IComment
}

const Subcomments: FC<SubcommentsProps> = ({comment}) => {

    const dispatch = useAppDispatch();
    const {subcomments} = comment; 

    if (!subcomments || subcomments.length === 0) {
        return null;
    }

    return (
        <ul className='subcomments'>
            {subcomments.map(subcomment => (
                <div key={subcomment.id} className="wrapp">
                    <li className="subcomments__item comments-item">
                        <span className="comments-item__date">{`${dayjs(comment.creation_date).format('DD/MM/YYYY HH:mm')}`}</span>
                        <span className="comments-item__body">{subcomment.body}</span>
                        <span 
                            onClick={e => {
                                dispatch(deleteSubComment(subcomment.id, comment))
                            }} 
                            className="subcomments__delete comments-item__delete">
                                delete
                        </span>
                    </li>
                </div>
            ))}
        </ul>
    );
}

export default TaskView;