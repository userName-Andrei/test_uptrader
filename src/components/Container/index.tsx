import classNames from 'classnames';
import React, {FC} from 'react';

import './container.scss';

interface ContainerProps {
    children: React.ReactNode,
    md?: boolean,
    sm?: boolean
}

const Container: FC<ContainerProps> = ({children, md, sm}) => {
    const containerClass = classNames({
        'container': true,
        'md': md,
        'sm': sm
    })
    return (
        <div className={containerClass}>
            {children}
        </div>
    );
};

export default Container;