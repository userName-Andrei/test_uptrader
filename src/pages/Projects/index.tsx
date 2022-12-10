import React, { useState } from 'react';
import Button from '../../components/Button';
import Container from '../../components/Container';
import Header from '../../components/Header';
import Modal from '../../components/Modal';
import ProjectForm from '../../components/ProjectForm';
import ProjectList from '../../components/ProjectList';

import './projects.scss';

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
            <Modal 
                data='project-add'
                title="Add project"
                active={modalActive}
                modalHandler={setModalActive}>
                <ProjectForm type='add' setModalActive={setModalActive}/>
            </Modal>
        </>
    );
};

export default Projects;