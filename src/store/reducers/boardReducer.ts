import { BoardAction, BoardActionTypes, BoardState, IBoard } from "../../types/boards";
import { ITask } from "../../types/tasks";

const initialState: BoardState = {
    boards: [
        {
            title: 'Queue',
            tasks: []
        },
        {
            title: 'Development',
            tasks: []
        },
        {
            title: 'Done',
            tasks: []
        }
    ],
    loading: false,
    error: ''
}

let currentBoards: IBoard[];

export const boardReducer = (state = initialState, action: BoardAction) => {
    switch (action.type) {
        case BoardActionTypes.SET_PROJECT_BOARDS_TASKS:
            return {boards: state.boards, loading: true, error: null}
        case BoardActionTypes.SET_PROJECT_BOARDS_TASKS_SUCCESS:
            currentBoards = state.boards.map(board => {
                let boardTasks: ITask[] = action.payload.filter(task => {
                    if (board.title.toLowerCase() === task.status) {
                        return task
                    };
                })

                return {...board, tasks: boardTasks}
            })

            return {boards: currentBoards, loading: false, error: null}
        case BoardActionTypes.SET_PROJECT_BOARDS_TASKS_ERROR:
            return {boards: state.boards, loading: false, error: action.payload}

        case BoardActionTypes.REFRESH_BOARDS:
            currentBoards = state.boards.map(board => {
                let boardTasks: ITask[] = action.payload.filter(task => {
                    if (board.title.toLowerCase() === task.status) {
                        return task
                    };
                })

                return {...board, tasks: boardTasks}
            })
            
            return {boards: currentBoards, loading: false, error: null}
        default:
            return state
    }
}