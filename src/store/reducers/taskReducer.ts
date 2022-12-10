import { TaskState, TaskAction, TaskActionTypes } from "../../types/tasks";

const initialState: TaskState = {
    tasks: [],
    loading: false,
    error: null,
    search: []
}

export const taskReducer = (state = initialState, action: TaskAction): TaskState => {
    switch (action.type) {
        case TaskActionTypes.FETCH_TASKS:
            return {...state, tasks: [], loading: true, error: null}
        case TaskActionTypes.FETCH_TASKS_SUCCESS:
            return {...state, tasks: action.payload, loading: false, error: null}
        case TaskActionTypes.FETCH_TASKS_ERROR:
            return {...state, tasks: [], loading: false, error: action.payload}

        case TaskActionTypes.ADD_TASK:
            return {...state, loading: true, error: null}
        case TaskActionTypes.ADD_TASK_SUCCESS:
            return {...state, tasks: [... state.tasks, action.payload], loading: false, error: null}
        case TaskActionTypes.ADD_TASK_ERROR:
            return {...state, loading: false, error: action.payload}

        case TaskActionTypes.EDIT_TASK:
            return {...state, loading: true, error: null}
        case TaskActionTypes.EDIT_TASK_SUCCESS:
            let currentTasks = state.tasks.map(task => {
                if (task.id === action.payload.id) {
                    return action.payload;
                }

                return task;
            })
            return {...state, tasks: currentTasks, loading: false, error: null}
        case TaskActionTypes.EDIT_TASK_ERROR:
            return {...state, loading: false, error: action.payload}

        case TaskActionTypes.DELETE_TASK:
            return {...state, loading: true, error: null}
        case TaskActionTypes.DELETE_TASK_SUCCESS:
            return {...state, tasks: state.tasks.filter(task => task.id !== action.payload), loading: false, error: null}

        case TaskActionTypes.SEARCH_TASK:
            return {...state, search: action.payload, loading: false}
        default:
            return state
    }
}