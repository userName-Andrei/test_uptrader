import { AppDispatch } from "..";
import { BoardActionTypes } from "../../types/boards";
import { ITask } from "../../types/tasks";
import TaskService from "../../api/TaskService";

export const setProjectBoardsTasks = (projectId: string | number) => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch({type: BoardActionTypes.SET_PROJECT_BOARDS_TASKS})

            const tasks: ITask[] = await TaskService.getTaskCollection();
            const projectTasks: ITask[] = [];

            tasks.forEach(task => {
                if (task.projectId === projectId) {
                    projectTasks.push(task);
                }
            })

            dispatch({type: BoardActionTypes.SET_PROJECT_BOARDS_TASKS_SUCCESS, payload: projectTasks})
        } catch (e) {
            dispatch({
                type: BoardActionTypes.SET_PROJECT_BOARDS_TASKS_ERROR,
                payload: e instanceof Error ?  e.message : "Boards request error"
            })
        }
    }
}

export const refreshBoards = (tasks: ITask[], projectId: string | number) => {
    return (dispatch: AppDispatch) => {

        const projectTasks = tasks.filter(task => task.projectId === projectId);

        dispatch({type: BoardActionTypes.REFRESH_BOARDS, payload: projectTasks});
    }
}