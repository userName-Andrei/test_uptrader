import React, {FC, MouseEvent, RefObject, useRef, useState} from 'react';
import { IProject } from '../../types/projects';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import Modal from '../Modal';
import ProjectForm from '../ProjectForm';

import './projectItem.scss';
import { useAppSelector } from '../../hooks/useAppSelector';
import { ITask, TaskStatus } from '../../types/tasks';
import { deleteProject } from '../../store/action-creators/projects';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import toggleAccordion from '../../utils/toggleAccordion';

interface ProjectItemProps {
    project: IProject
}

const ProjectItem: FC<ProjectItemProps> = ({project}) => {

    const dispatch = useAppDispatch();
    const [modalActive, setModalActive] = useState<boolean>(false);
    const accordionRef = useRef<HTMLLIElement>(null);
    const projectTasks = useAppSelector(state => state.tasks.tasks.filter(task => task.projectId === project.id));

    const countTask = (tasks: ITask[], status: TaskStatus) => {
        return tasks.reduce((acc, item) => {
            if (item.status === status) {
                acc++;
            }

            return acc;
        }, 0)
    }

    return (
        <>
            <li ref={accordionRef} className='project-item card'>
                <div className="project-item__top card__top">
                    <Link to={`/${project.id}/tasks`} className='project-item__link card__title'>{project.title}</Link>
                    <div className="btn-group btn-group_margin-left-auto">
                        <button 
                            onClick={(e) => toggleAccordion(e, accordionRef)}
                            className="btn-icon btn-icon_big arrow _icon-arrow" />
                        <button 
                            onClick={() => setModalActive(true)}
                            className="btn-icon btn-icon_big _icon-edit" />
                        <button 
                            onClick={() => dispatch(deleteProject(project.id))}
                            className="btn-icon btn-icon_big _icon-delete" />
                    </div>
                </div>
                <div className="project-item__wrapp">
                    <div className="project-item__body card__body card__body_p16">
                        <ReactMarkdown>{project.description}</ReactMarkdown>
                    </div>
                    <div className="project-task">
                        <span className="project-task__title">Tasks</span>
                        <div className="project-task__body">
                            <div className="project-task__item">
                                <p>Queue</p>
                                <p>{countTask(projectTasks, TaskStatus.queue)}</p>
                            </div>
                            <div className="project-task__item">
                                <p>Development</p>
                                <p>{countTask(projectTasks, TaskStatus.development)}</p>
                            </div>
                            <div className="project-task__item">
                                <p>Done</p>
                                <p>{countTask(projectTasks, TaskStatus.done)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
            <Modal 
                data='project-edit'
                title="Edit project"
                active={modalActive}
                modalHandler={setModalActive}>
                <ProjectForm type='edit' projectId={project.id} setModalActive={setModalActive}/>
            </Modal>
        </>
    );
};

export default ProjectItem;