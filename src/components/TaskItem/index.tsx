import { FC, useState } from "react";
import { useDrag } from "react-dnd/dist/hooks";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { deleteTask } from "../../store/action-creators/tasks";
import { ITask } from "../../types/tasks";
import Modal from "../Modal";
import TaskForm from "../TaskForm";
import TaskView from "../TaskView";

import './taskItem.scss';

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
            <Modal 
                data='task-view'
                title={`${task.title}`} 
                active={modalViewTaskActive}
                modalHandler={setModalViewTaskActive}>
                    <TaskView task={task} />
            </Modal>

            <Modal 
                data='task-edit'
                title={`Edit #${task.number}. ${task.title}`} 
                active={modalEditTaskActive}
                modalHandler={setModalEditTaskActive}>
                    <TaskForm 
                        type='edit' 
                        taskId={task.id} 
                        setModalActive={setModalEditTaskActive} />
            </Modal>
        </>
    )
}

export default TaskItem;