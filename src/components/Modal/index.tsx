import React, { FC, MouseEvent } from 'react';
import './modal.scss';
import { CSSTransition } from 'react-transition-group';

interface ModalProps {
    children: React.ReactNode,
    title: string,
    active: boolean,
    modalHandler: (state: boolean) => void
}

const Modal: FC<ModalProps> = ({
    children, 
    title,
    active,
    modalHandler
}) => {
    
    const onClose = (e: MouseEvent) => {
        if (e.currentTarget === e.target) modalHandler(false);
    }

    return (
        <div
            onClick={onClose} 
            className="modal">

            <CSSTransition
                in={active}
                timeout={300}
                classNames="modal__dialog"
                appear>
                <div className="modal__dialog">

                    <div className="modal__top">
                        <span className='modal__title'>{title}</span>
                        <button onClick={onClose} className="modal__close btn-icon _icon-delete" />
                    </div>

                    <div className="modal__body">
                        {children}
                    </div>

                </div>
            </CSSTransition>
            

        </div>
    )
};

export default Modal;