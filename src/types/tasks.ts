export enum TaskPriority {
    low = 'low',
    middle = 'middle',
    high = 'high'
}

export const enum TaskStatus {
    done = 'done',
    development = 'development',
    queue = 'queue'
}

export interface ISubtask {
    id: number | string,
    description: string,
    status: boolean,
    creation_date: number | string,
}

export interface IFile {
    name: string,
    path: string
}

export interface ITask {
    id: number | string,
    number: number | null,
    title: string,
    description: string,
    creation_date: number | string,
    finish_date: number | string,
    priority: TaskPriority,
    files: IFile[] | null,
    status: TaskStatus | string,
    subtasks: ISubtask[],
    projectId: number | string
}

export interface TaskState {
    tasks: ITask[],
    loading: boolean,
    error: null | string,
    search: ITask[]
}

export enum TaskActionTypes {
    FETCH_TASKS = "FETCH_TASKS",
    FETCH_TASKS_SUCCESS = "FETCH_TASKS_SUCCESS",
    FETCH_TASKS_ERROR = "FETCH_TASKS_ERROR",
    ADD_TASK = "ADD_TASK",
    ADD_TASK_SUCCESS = "ADD_TASK_SUCCESS",
    ADD_TASK_ERROR = "ADD_TASK_ERROR",
    EDIT_TASK = "EDIT_TASK",
    EDIT_TASK_SUCCESS = "EDIT_TASK_SUCCESS",
    EDIT_TASK_ERROR = "EDIT_TASK_ERROR",
    DELETE_TASK = "DELETE_TASK",
    DELETE_TASK_SUCCESS = "DELETE_TASK_SUCCESS",
    SEARCH_TASK = "SEARCH_TASK"
}

interface FetchTasks {
    type: TaskActionTypes.FETCH_TASKS
}

interface FetchTasksSuccess {
    type: TaskActionTypes.FETCH_TASKS_SUCCESS,
    payload: ITask[]
}

interface FetchTasksError {
    type: TaskActionTypes.FETCH_TASKS_ERROR,
    payload: string
}

interface AddTask {
    type: TaskActionTypes.ADD_TASK
}

interface AddTaskSuccess {
    type: TaskActionTypes.ADD_TASK_SUCCESS,
    payload: ITask
}

interface AddTasksError {
    type: TaskActionTypes.ADD_TASK_ERROR,
    payload: string
}

interface EditTask {
    type: TaskActionTypes.EDIT_TASK
}

interface EditTaskSuccess {
    type: TaskActionTypes.EDIT_TASK_SUCCESS,
    payload: ITask
}

interface EditTaskError {
    type: TaskActionTypes.EDIT_TASK_ERROR,
    payload: string
}

interface DeleteTasks {
    type: TaskActionTypes.DELETE_TASK,
}

interface DeleteTasksSuccess {
    type: TaskActionTypes.DELETE_TASK_SUCCESS,
    payload: string | number
}

interface SearchTask {
    type: TaskActionTypes.SEARCH_TASK,
    payload: ITask[]
}

export type TaskAction = FetchTasks | FetchTasksSuccess | FetchTasksError |
                         AddTask | AddTaskSuccess | AddTasksError |
                         EditTask | EditTaskSuccess | EditTaskError |
                         DeleteTasks | DeleteTasksSuccess |
                         SearchTask;