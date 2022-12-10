import React, {FC} from 'react';
import classNames from 'classnames';

import './buttons.scss';

interface ButtonProps {
    children?: React.ReactNode,
    size?: string,
    type?: 'button' | 'submit',
    className?: string
    error?: boolean,
    onClick?: () => void
}

const Button: FC<ButtonProps> = ({children, size, type, error, className, onClick}) => {

    const buttonClass = classNames({
        'btn': true,
        'btn_big': size === 'big',
        'btn_small': size === 'small',
        'btn_error': error
    })

    return (
        <button 
            className={`${buttonClass} ${className ? className : ''}`} 
            type={type || 'button'}
            onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;