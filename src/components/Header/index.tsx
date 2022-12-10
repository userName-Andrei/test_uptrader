import React, {ChangeEvent, FC, useState, useEffect, MouseEvent} from 'react';
import { useMatch, useParams } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { refreshBoards } from '../../store/action-creators/boards';
import { searchTask } from '../../store/action-creators/tasks';

import './header.scss';

const Header: FC = () => {

    const dispatch = useAppDispatch();
    const projectId = useParams().projectId;
    const tasks = useAppSelector(state => state.tasks.tasks.filter(task => task.projectId === projectId));
    const searchTasks = useAppSelector(state => state.tasks.search);
    const [searchValue, setSearchValue] = useState<string>('');
    const matchUrl = useMatch({
        path: '/:projectId/tasks'
    })

    useEffect(() => {
        dispatch(refreshBoards(searchTasks, (projectId ? projectId : '')))
    }, [searchValue])
    
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(state => e.target.value);
        dispatch(searchTask(tasks, e.target.value));
    }

    const onClickHandler = (e: MouseEvent) => {
        dispatch(searchTask(tasks, searchValue));
        setSearchValue('');
    }

    if (matchUrl) {
        return (
            <div className='header'>
                <div className="search-box">
                    <input 
                        type="text" 
                        className='search-box__input' 
                        placeholder='Add number or title of task'
                        onChange={onChangeHandler}
                        value={searchValue} />
                    <div className="search-box__divider" />
                    <button onClick={onClickHandler} className="search-box__btn _icon-search" />
                </div>
            </div>
        )
    }

    return (
        <div className='header'>
            <h1 className='header__title'>Choose the project</h1>
        </div>
    );
};

export default Header;