import { FC, useState } from "react";
import { useDrag } from "react-dnd/dist/hooks";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { deleteTask } from "../../store/action-creators/tasks";
import { ITask } from "../../types/tasks";
import Modal from "../Modal";
import TaskForm from "../TaskForm";
import TaskView from "../TaskView";

import './taskItem.scss';
import { CSSTransition } from "react-transition-group";

interface TaskItemProps {
    task: ITask
}

const TaskItem: FC<TaskItemProps> = ({task}) => {

    const dispatch = useAppDispatch();
    const [{isDragging}, drag]  = useDrag(() => ({
        type: 'task-card',
        item: {task},
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    }));
    const [modalViewTaskActive, setModalViewTaskActive] = useState<boolean>(false);
    const [modalEditTaskActive, setModalEditTaskActive] = useState<boolean>(false);

    return (
        <>
            <li 
                ref={drag}
                key={task.id} 
                style={{
                    opacity: isDragging ? 0.8 : 1,
                    cursor: 'move',
                }}
                className="task-item card">

                <div className="task-item__top">

                    <span className='task-item__title'
                        onClick={() => setModalViewTaskActive(true)}>
                            {`#${task.number}. ${task.title}`}
                    </span>

                    <div className="btn-group btn-group_margin-left-auto">
                        <button 
                            onClick={() => setModalEditTaskActive(true)}
                            className="btn-icon btn-icon_big _icon-edit" />
                        <button 
                            onClick={() => dispatch(deleteTask(task))}
                            className="btn-icon btn-icon_big _icon-delete" />
                    </div>

                </div>
            </li>
            <CSSTransition
                in={modalViewTaskActive}
                timeout={300}
                classNames="modal"
                mountOnEnter
                unmountOnExit>
                    <Modal 
                        active={modalViewTaskActive}
                        title={`${task.title}`} 
                        modalHandler={setModalViewTaskActive}>
                            <TaskView task={task} />
                    </Modal>
            </CSSTransition>
            
            <CSSTransition
                in={modalEditTaskActive}
                timeout={300}
                classNames="modal"
                mountOnEnter
                unmountOnExit>
                <Modal 
                    active={modalEditTaskActive}
                    title={`Edit #${task.number}. ${task.title}`} 
                    modalHandler={setModalEditTaskActive}>
                        <TaskForm 
                            type='edit' 
                            taskId={task.id} 
                            setModalActive={setModalEditTaskActive} />
                </Modal>
            </CSSTransition>
            
        </>
    )
}

export default TaskItem;