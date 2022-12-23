import dayjs from 'dayjs';
import { v4 as uuid } from 'uuid';
import React, {ChangeEvent, FC, FormEvent, useState} from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { IProject } from '../../types/projects';
import Button from '../Button';

import './projectForm.scss';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { addProject, editProject, fetchProjects } from '../../store/action-creators/projects';
import { useAppDispatch } from '../../hooks/useAppDispatch';

interface ProjectFormProps {
    type: 'add' | 'edit',
    projectId?: string | number,
    setModalActive: (a: boolean) => void
}

const ProjectForm: FC<ProjectFormProps> = ({type, projectId, setModalActive}) => {

    const initialProject: IProject = {
        id: '',
        title: '',
        description: '',
        createdAt: dayjs().valueOf()
    };

    const dispatch = useAppDispatch();
    const oldProject = useAppSelector(state => state.projects.projects.find(item => item.id === projectId));
    const [project, setProject] = useState<IProject>(oldProject || initialProject);

    const onChangeInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProject(state => state && ({
            ...state,
            [e.target.getAttribute('name') || '']: e.target.value
        }))
    }

    const onSubmitAddForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const id = uuid();

        dispatch(addProject({
            ...project,
            id,
        }));
        setModalActive(false);
        setProject(initialProject);
    }

    const onSubmitEditForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        dispatch(editProject(project));
        setModalActive(false);
        setProject(initialProject);
    }

    if (type === 'edit') {
        return (
            <form
            onSubmit={onSubmitEditForm}
            className='form-project'>

            <label htmlFor="project-title">Project`s  title:</label>
            <input 
                type="text" 
                id='project-title' 
                className='form-project__title input' 
                name='title' 
                placeholder='Enter project name'
                value={project?.title}
                onChange={onChangeInput}
                required />

            <label htmlFor="project-description">Project`s  description:</label>
            <textarea 
                id='project-description' 
                className='form-project__description input input__textarea' 
                name='description' 
                placeholder='Enter project description'
                value={project?.description}
                onChange={onChangeInput}
                required />
                
            <div className="btn-group btn-group_form">
                <Button type='submit'>Save</Button>
                <Button type='submit' error>Delete</Button>
            </div>

        </form>
        )
    }
    
    return (
        <form
            onSubmit={onSubmitAddForm}
            className='form-project'>

            <label htmlFor="project-title">Project`s  title:</label>
            <input 
                type="text" 
                id='project-title' 
                className='form-project__title input' 
                name='title' 
                placeholder='Enter project name'
                value={project?.title}
                onChange={onChangeInput}
                required />

            <label htmlFor="project-description">Project`s  description:</label>
            <textarea 
                id='project-description' 
                className='form-project__description input input__textarea' 
                name='description' 
                placeholder='Enter project description'
                value={project?.description}
                onChange={onChangeInput}
                required />

            <Button type='submit'>Add</Button>

        </form>
    );
}

export default ProjectForm;