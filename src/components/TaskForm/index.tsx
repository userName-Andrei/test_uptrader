import dayjs from 'dayjs';
import { v4 as uuid } from 'uuid';
import React, {ChangeEvent, FC, FormEvent, useState, useEffect} from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import Button from '../Button';

import './taskForm.scss';
import { ISubtask, ITask, TaskPriority, TaskStatus } from '../../types/tasks';
import FilesInput from '../FilesInput';
import isSubtasksDone from '../../utils/isSubtaskDone';
import { doc, setDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useParams } from 'react-router-dom';
import { addTask, deleteTask, editTask, fetchTasks } from '../../store/action-creators/tasks';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { refreshBoards } from '../../store/action-creators/boards';

interface TaskFormProps {
    type: 'add' | 'edit',
    taskId?: string | number,
    setModalActive: (a: boolean) => void
}

const TaskForm: FC<TaskFormProps> = ({type, taskId, setModalActive}) => {

    const dispatch = useAppDispatch();
    const projectId = useParams().projectId;
    const currentNumberTask = useAppSelector(state => state.tasks.tasks.filter(task => task.projectId === projectId).length) + 1;

    const initialTask: ITask = {
        id: '',
        number: currentNumberTask,
        title: '',
        description: '',
        creation_date: dayjs().valueOf(),
        finish_date: '', 
        files: null,
        subtasks: [],
        priority: TaskPriority.middle, 
        status: TaskStatus.queue, 
        projectId: projectId ? projectId : ''
    };

    const oldTask = useAppSelector(state => state.tasks.tasks.find(item => item.id === taskId));
    const [task, setTask] = useState<ITask>(oldTask || initialTask);
    const [currentSubtask, setCurrentSubtask] = useState<string>('');
    const [fileList, setFileList] = useState<FileList | null>(null);

    const onChangeInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setTask(state => state && ({
            ...state,
            [e.target.getAttribute('name') || '']: e.target.value
        }))
    }

    const onChangeDateInput = (e: ChangeEvent<HTMLInputElement>) => {
        if (dayjs(e.target.value).isValid()) {
            setTask(state => state && ({
                ...state,
                [e.target.getAttribute('name') || '']: dayjs(e.target.value).valueOf()
            }))
        }
    }

    const onSetSubtaskToTask = () => {
        const subtask: ISubtask = {
            id: uuid(),
            description: currentSubtask,
            status: false,
            creation_date: dayjs().valueOf()
        }
        
        setTask(task => ({
            ...task,
            subtasks: [...task.subtasks, subtask]
        }))

        setCurrentSubtask('')
    }

    const onChangeSubtaskCheckbox = (e: ChangeEvent<HTMLInputElement>, id: string | number) => {
        const subtasksWithoutCurrentSubtask = task.subtasks.filter(item => item.id !== id);
        const currentSubtask = task.subtasks.find(item => item.id === id);
        
        if (currentSubtask) {
            currentSubtask.status = e.target.checked;

            const sortedSubtasks = [...subtasksWithoutCurrentSubtask, currentSubtask].sort((a: ISubtask, b: ISubtask) => +a.creation_date - +b.creation_date)

            setTask(task => ({
                ...task,
                subtasks: sortedSubtasks
            }))
        }
    }

    const onDeleteSubtask = (id: string | number) => {
        const subtasksWithoutCurrentSubtask = task.subtasks.filter(item => item.id !== id);

        setTask(task => ({
            ...task,
            subtasks: subtasksWithoutCurrentSubtask
        }))
    }

    const onSubmitAddForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        dispatch(addTask(task, fileList));
        setModalActive(false);
        setTask(initialTask);
    }

    const onSubmitEditForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        dispatch(editTask(task, fileList));
        setModalActive(false);
        setTask(initialTask);
    }

    if (type === 'edit') {
        return (
            <form
            onSubmit={onSubmitEditForm}
            className='form-task'>

            <div className="form-task__row">
                <span className="form-task__date">
                    Creation date: {dayjs(task.creation_date).format('DD.MM.YYYY')}
                </span>
                <span className="form-task__date">
                    Time at work: {task.finish_date ? `${dayjs(task.finish_date).diff(task.creation_date, 'd')} days` : '...'}
                </span>
            </div>

            <label className='form-task__label' htmlFor="task-finish">Finish date:</label>
            <input 
                type="date" 
                id='task-finish' 
                name='finish_date' 
                min={dayjs().format('YYYY-MM-DD')}
                value={dayjs(task.finish_date).format('YYYY-MM-DD')}
                className="form-task__input input"
                placeholder='Finish date' 
                onChange={onChangeDateInput}
                required/>

            <div className="form-task__row">
                <div className="form-task__column">
                    <label className='form-task__label' htmlFor="task-priority">Priority</label>
                    <select 
                        id='task-priority' 
                        className='form-task__select input' 
                        name='priority' 
                        value={task?.priority}
                        onChange={onChangeInput} >
                            <option value={TaskPriority.middle}>middle</option>
                            <option value={TaskPriority.high}>high</option>
                            <option value={TaskPriority.low}>low</option>
                    </select>
                </div>

                <div className="form-task__column">
                    <label className='form-task__label' htmlFor="task-status">Current status</label>
                    <select 
                        id='task-status' 
                        className='form-task__select input' 
                        name='status' 
                        value={task?.status}
                        onChange={onChangeInput} >
                            <option value={TaskStatus.queue}>queue</option>
                            <option value={TaskStatus.development}>development</option>
                            <option 
                                value={TaskStatus.done}
                                disabled={!isSubtasksDone(task.subtasks)}>
                                done
                            </option>
                    </select>
                </div>
            </div>

            <label className='form-task__label' htmlFor="task-title">Task`s  title:</label>
            <input 
                type="text" 
                id='task-title' 
                className='form-task__input input' 
                name='title' 
                placeholder='Enter task name'
                value={task?.title}
                onChange={onChangeInput}
                required />

            <label className='form-task__label' htmlFor="task-description">Task`s  description:</label>
            <textarea 
                id='task-description' 
                className='form-task__input input input__textarea' 
                name='description' 
                placeholder='Enter task description'
                value={task?.description}
                onChange={onChangeInput}
                required />

            <label className='form-task__label' htmlFor='file'>Choose some files: </label>

            {[...Array.from(fileList ? fileList : []), ...(task.files ? task.files : [])].length !== 0 ? 
                [...Array.from(fileList ? fileList : []), ...(task.files ? task.files : [])].map(
                    file => <div key={file.name} className='form-task__filename'>{file.name}</div>
                ):
                <span className='form-task__filename'>Load your files...</span> 
            }

            <FilesInput 
                className={'form-task__btn btn btn_small'} 
                setFiles={(files: FileList | null) => setFileList(files)} 
                placeholder="Add files"/>

            <label className='form-task__label' htmlFor="task-subtasks">Enter subtasks:</label>
            <ul className="fort-task__subtasks-list subtasks-list">
                {task.subtasks.map(item => (
                    <li key={item.id} className="subtasks-list__item">
                        <label className="subtasks-list__label" htmlFor={`subtask-${item.id}`}>
                            <input 
                                onChange={(e) => onChangeSubtaskCheckbox(e, item.id)} 
                                className="subtasks-list__checkbox" 
                                type="checkbox" 
                                id={`subtask-${item.id}`}
                                checked={item.status} />
                            <span className="subtasks-list__custom-checkbox" />
                            {item.description}
                        </label>
                        <button
                            onClick={(e) => onDeleteSubtask(item.id)} 
                            className='subtasks-list__btn btn-icon btn-icon_darken btn-icon_mini _icon-delete' />
                    </li>
                ))}
            </ul>
            <div className="form-task__input_subtasks">
                <input 
                    type="text" 
                    id='task-subtasks' 
                    className='form-task__input input' 
                    name='subtasks' 
                    placeholder='Enter task name'
                    onChange={e => setCurrentSubtask(e.currentTarget.value)}
                    value={currentSubtask} />
                <button
                    onClick={onSetSubtaskToTask}
                    type='button'
                    className='form-task__btn_icon btn-icon btn-icon_radius10 btn-icon_darken _icon-send' />
            </div>

            <div className="btn-group btn-group_form">
                <Button type='submit'>Save</Button>
                <Button 
                    onClick={() => dispatch(deleteTask(task))} 
                    type='button' 
                    error>
                        Delete
                </Button>
            </div>

        </form>
        )
    }
    
    return (
        <form
            onSubmit={onSubmitAddForm}
            className='form-task'>

            <div className="form-task__row">
                <span className="form-task__date">
                    Creation date: {dayjs(task.creation_date).format('DD.MM.YYYY')}
                </span>
                <span className="form-task__date">
                    Time at work: {task.finish_date ? `${dayjs(task.finish_date).diff(task.creation_date, 'd')} days` : '...'}
                </span>
            </div>

            <label className='form-task__label' htmlFor="task-finish">Finish date:</label>
            <input 
                type="date" 
                id='task-finish' 
                name='finish_date' 
                min={dayjs().format('YYYY-MM-DD')}
                value={dayjs(task.finish_date).format('YYYY-MM-DD')}
                className="form-task__input input"
                placeholder='Finish date' 
                onChange={onChangeDateInput}
                required/>

            <div className="form-task__row">
                <div className="form-task__column">
                    <label className='form-task__label' htmlFor="task-priority">Priority</label>
                    <select 
                        id='task-priority' 
                        className='form-task__select input' 
                        name='priority' 
                        value={task?.priority}
                        onChange={onChangeInput} >
                            <option value={TaskPriority.middle}>middle</option>
                            <option value={TaskPriority.high}>high</option>
                            <option value={TaskPriority.low}>low</option>
                    </select>
                </div>

                <div className="form-task__column">
                    <label className='form-task__label' htmlFor="task-status">Current status</label>
                    <select 
                        id='task-status' 
                        className='form-task__select input' 
                        name='status' 
                        value={task?.status}
                        onChange={onChangeInput} >
                            <option value={TaskStatus.queue}>queue</option>
                            <option value={TaskStatus.development}>development</option>
                            <option 
                                value={TaskStatus.done}
                                disabled={!isSubtasksDone(task.subtasks)}>
                                done
                            </option>
                    </select>
                </div>
            </div>

            <label className='form-task__label' htmlFor="task-title">Task`s  title:</label>
            <input 
                type="text" 
                id='task-title' 
                className='form-task__input input' 
                name='title' 
                placeholder='Enter task name'
                value={task.title}
                onChange={onChangeInput}
                required />

            <label className='form-task__label' htmlFor="task-description">Task`s  description:</label>
            <textarea 
                id='task-description' 
                className='form-task__input input input__textarea' 
                name='description' 
                placeholder='Enter task description'
                value={task?.description}
                onChange={onChangeInput}
                required />

            <label className='form-task__label' htmlFor='file'>Choose some files: </label>

            {!fileList || fileList.length === 0 ? 
                <span className='form-task__filename'>Load your files...</span> : 
                Array.from(fileList).map(file => <div key={file.name} className='form-task__filename'>{file.name}</div>)
            }

            <div className="form-task__btn-group btn-group btn-group_form">
                <FilesInput 
                    className={'btn btn_small'} 
                    setFiles={(files: FileList | null) => setFileList(files)} 
                    placeholder="Add files"/>
                <Button onClick={() => setFileList(null)} size='small' type='button' error>Cancel</Button>
            </div>

            <label className='form-task__label' htmlFor="task-subtasks">Enter subtasks:</label>
            <ul className="fort-task__subtasks-list subtasks-list">
                {task.subtasks.map(item => (
                    <li key={item.id} className="subtasks-list__item">
                        <label className="subtasks-list__label" htmlFor={`subtask-${item.id}`}>
                            <input 
                                onChange={(e) => onChangeSubtaskCheckbox(e, item.id)} 
                                className="subtasks-list__checkbox" 
                                type="checkbox" 
                                id={`subtask-${item.id}`} />
                            <span className="subtasks-list__custom-checkbox" />
                            {item.description}
                        </label>
                        <button
                            onClick={(e) => onDeleteSubtask(item.id)} 
                            className='subtasks-list__btn btn-icon btn-icon_darken btn-icon_mini _icon-delete' />
                    </li>
                ))}
            </ul>
            <div className="form-task__input_subtasks">
                <input 
                    type="text" 
                    id='task-subtasks' 
                    className='form-task__input input' 
                    name='subtasks' 
                    placeholder='Enter task name'
                    onChange={e => setCurrentSubtask(e.currentTarget.value)}
                    value={currentSubtask} />
                <button
                    onClick={onSetSubtaskToTask}
                    type='button'
                    className='form-task__btn_icon btn-icon btn-icon_radius10 btn-icon_darken _icon-send' />
            </div>

            <Button type='submit'>Add</Button>

        </form>
    );
}

export default TaskForm;