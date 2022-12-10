import { ITask } from "./tasks";

export interface IBoard {
    title: string,
    tasks: ITask[]
}

export interface BoardState {
    boards: IBoard[],
    loading: boolean,
    error: string | null
}

export enum BoardActionTypes {
    SET_PROJECT_BOARDS_TASKS = "SET_PROJECT_BOARDS_TASKS",
    SET_PROJECT_BOARDS_TASKS_SUCCESS = "SET_PROJECT_BOARDS_TASKS_SUCCESS",
    SET_PROJECT_BOARDS_TASKS_ERROR = "SET_PROJECT_BOARDS_TASKS_ERROR",
    REFRESH_BOARDS = "REFRESH_BOARDS"
}

interface SetProjectBoardsTasks {
    type: BoardActionTypes.SET_PROJECT_BOARDS_TASKS,
}

interface SetProjectBoardsTasksSuccess {
    type: BoardActionTypes.SET_PROJECT_BOARDS_TASKS_SUCCESS,
    payload: ITask[]
}

interface SetProjectBoardsTasksError {
    type: BoardActionTypes.SET_PROJECT_BOARDS_TASKS_ERROR,
    payload: string
}

interface RefreshBoards {
    type: BoardActionTypes.REFRESH_BOARDS,
    payload: ITask[]
}

export type BoardAction = SetProjectBoardsTasks | SetProjectBoardsTasksSuccess | SetProjectBoardsTasksError |
                          RefreshBoards;