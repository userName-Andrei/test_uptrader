import classNames from 'classnames';
import React, { FC, MouseEvent, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import './modal.scss';

interface ModalProps {
    children: React.ReactNode,
    title: string,
    active: boolean,
    data: string,
    modalHandler: (state: boolean) => void
}

const modalRootElement = document.querySelector('#modal');

const Modal: FC<ModalProps> = ({
    children, 
    title, 
    active, 
    data,
    modalHandler
}) => {

    const scrollWidth = window.innerWidth - document.documentElement.clientWidth;
    const modalClass = classNames({
        'modal': true,
        'open': active
    })

    const modalElement = useMemo(() => {
        const element = document.createElement('div');
        element.dataset.modal = data;

        return element
    }, [data])

    const onClose = (e: MouseEvent) => {
        if (e.currentTarget === e.target) modalHandler(false);
    }

    useEffect(() => {
        if (active) {
            document.body.style.overflow = 'hidden';
	        document.body.style.paddingRight = scrollWidth + 'px';

            modalRootElement!.appendChild(modalElement);

            return () => {
                modalRootElement!.removeChild(modalElement);
            }
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = 0 + 'px';
        }
    }, [active])

    if (active) {
        return createPortal(
            <div
                onClick={onClose} 
                className={modalClass}>

                <div className="modal__dialog">

                    <div className="modal__top">
                        <span className='modal__title'>{title}</span>
                        <button onClick={onClose} className="modal__close btn-icon _icon-delete" />
                    </div>

                    <div className="modal__body">
                        {children}
                    </div>

                </div>

            </div>,
            modalElement
        )
    }

    return null;
};

export default Modal;