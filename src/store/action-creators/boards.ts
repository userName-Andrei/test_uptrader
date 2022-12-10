import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { AppDispatch } from ".."
import { db } from "../../firebase";
import { BoardActionTypes, IBoard } from "../../types/boards"
import { ITask } from "../../types/tasks"

const taskRef = collection(db, "tasks");

export const setProjectBoardsTasks = (projectId: string | number) => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch({type: BoardActionTypes.SET_PROJECT_BOARDS_TASKS})

            const tasksSnapshot = await getDocs(query(taskRef, orderBy('creation_date')));
            const tasks: ITask[] = []; 
            const projectTasks: ITask[] = [];

            tasksSnapshot.forEach(item => {
                if (item.data()) {
                    tasks.push(item.data() as ITask);
                }
            })

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