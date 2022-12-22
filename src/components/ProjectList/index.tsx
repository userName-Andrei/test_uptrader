import React, {FC} from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useAppSelector } from '../../hooks/useAppSelector';
import ProjectItem from '../ProjectItem';
import Spinner from '../Spinner';

import './projectList.scss';

const ProjectList: FC = () => {

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
        <TransitionGroup className='project-list' component='ul'>
            {projects.map(project => 
                <CSSTransition
                    key={project.id}
                    timeout={300}
                    classNames='project-item'>
                        <ProjectItem key={project.id} project={project} />
                </CSSTransition>
            )}
        </TransitionGroup>
    );
};

export default ProjectList;