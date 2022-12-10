import React, {FC} from 'react';
import { useEffect } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { fetchProjects } from '../../store/action-creators/projects';
import { IProject } from '../../types/projects';
import ProjectItem from '../ProjectItem';
import Spinner from '../Spinner';

import './projectList.scss';

const ProjectList: FC = () => {

    const dispatch = useAppDispatch();
    const projects = useAppSelector(state => state.projects.projects);
    const loading = useAppSelector(state => state.projects.loading);
    const error = useAppSelector(state => state.projects.error);

    if (error) {
        return <h3>{error}</h3>
    }

    if (loading) {
        return <Spinner />
    }

    return (
        <ul className='project-list'>
            {projects.map(project => <ProjectItem key={project.id} project={project} />)}
        </ul>
    );
};

export default ProjectList;