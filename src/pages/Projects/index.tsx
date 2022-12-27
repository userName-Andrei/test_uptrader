import React, { useState } from 'react';
import Button from '../../components/Button';
import Container from '../../components/Container';
import Header from '../../components/Header';
import Modal from '../../components/Modal';
import ProjectForm from '../../components/ProjectForm';
import ProjectList from '../../components/ProjectList';

import './projects.scss';
import { CSSTransition } from 'react-transition-group';

const Projects = () => {

    const [modalActive, setModalActive] = useState<boolean>(false)

    return (
        <>
            <Header />

            <Container md>
                <div className="content">
                    <Button size='big' className='content__btn' onClick={() => setModalActive(true)} >Add project</Button>
                    <ProjectList />
                </div>
            </Container>

            <CSSTransition
                in={modalActive}
                timeout={300}
                classNames="modal"
                mountOnEnter
                unmountOnExit>
                <Modal 
                    active={modalActive}
                    title="Add project"
                    modalHandler={setModalActive}>
                    <ProjectForm type='add' setModalActive={setModalActive}/>
                </Modal>
            </CSSTransition>
            
        </>
    );
};

export default Projects;