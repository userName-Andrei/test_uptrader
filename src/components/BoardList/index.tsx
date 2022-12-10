import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { refreshBoards, setProjectBoardsTasks } from '../../store/action-creators/boards';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import BoardItem from '../BoardItem';
import Spinner from '../Spinner';

import './boardList.scss';

const BoardList = () => {

    const dispatch = useAppDispatch();
    const projectId = useParams().projectId;
    const searchTasks = useAppSelector(state => {
        if (state.tasks.search.length !== 0) {
            return state.tasks.search.filter(task => task.projectId === projectId)
        }
        return state.tasks.tasks.filter(task => task.projectId === projectId)
    });
    const boards = useAppSelector(state => state.boards.boards);
    const boardLoading = useAppSelector(state => state.boards.loading);
    const error = useAppSelector(state => state.tasks.error);
    const taskLoading = useAppSelector(state => state.tasks.loading);
    const commentLoading = useAppSelector(state => state.comments.loading);

    useEffect(() => {
        dispatch(setProjectBoardsTasks(projectId ? projectId : ''))
    }, [])

    useEffect(() => {
        if (!taskLoading) {
            dispatch(refreshBoards(searchTasks, (projectId ? projectId : '')))
        }
    }, [taskLoading])

    if (error) {
        return <h3>{error}</h3>
    }

    if (boardLoading) {
        return <Spinner />
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="boards">
                {boards.map(board => (
                    <BoardItem key={board.title} board={board} />
                ))}
            </div>
        </DndProvider>
    );
};

export default BoardList;