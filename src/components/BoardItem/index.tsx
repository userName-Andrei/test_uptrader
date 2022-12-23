import React, {FC, useState} from 'react';
import { useDrop } from 'react-dnd/dist/hooks';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { addTask, deleteTask, editTask } from '../../store/action-creators/tasks';
import { IBoard } from '../../types/boards';
import { ITask, TaskStatus } from '../../types/tasks';
import Modal from '../Modal';
import TaskForm from '../TaskForm';
import TaskItem from '../TaskItem';

import './boardItem.scss'

interface BoardItemProps {
    board: IBoard,
}

const BoardItem: FC<BoardItemProps> = ({board}) => {

    const dispatch = useAppDispatch();
    const [{isOver}, drop] = useDrop(() => ({
        accept: 'task-card',
        drop: (item: any) => dropTaskToBoard(item.task),
        collect: monitor => ({
            isOver: !!monitor.isOver()
        })
    }), [board])
    const [modalAddTaskActive, setModalAddTaskActive] = useState<boolean>(false);

    function dropTaskToBoard(task: ITask) {
        if (task.status !== board.title.toLowerCase()) {
            if (task.subtasks.length !== 0 && board.title.toLowerCase() === 'done') {
                let allSubtasksDone = task.subtasks.reduce((acc, subtask) => {
                    if (!subtask.status) {
                        return acc = false;
                    }
                    return acc
                }, true)

                if (!allSubtasksDone) return
            }

            const currentTask: ITask = {...task, status: board.title.toLowerCase()};
            dispatch(editTask(currentTask));
        }
    }

    return (
        <div className='board card'
            ref={drop}
            style={{
                boxShadow: isOver ? '0px 0px 15px #6f6e80' : 'none'
            }}>

            <div className="board__top">
                <span className="card__title">{board.title}</span>
            </div>

            <div className="board__body card__body card__body_p10">

                <TransitionGroup component='ul'>
                    {board.tasks.map(task => (
                        <CSSTransition
                            key={task.id}
                            timeout={300}
                            classNames="task-item">
                                <TaskItem key={task.id} task={task} />
                        </CSSTransition>
                    ))}
                </TransitionGroup>

                {board.title.toLowerCase() === TaskStatus.queue && 
                    <>
                        <button className="btn board__btn" onClick={() => setModalAddTaskActive(true)}>Add</button>
                        <Modal 
                            data='task-add'
                            title="Add new task" 
                            active={modalAddTaskActive}
                            modalHandler={setModalAddTaskActive}>
                            <TaskForm type='add' setModalActive={setModalAddTaskActive} />
                        </Modal>
                    </>
                }
            </div>

        </div>
    );
};

export default BoardItem;