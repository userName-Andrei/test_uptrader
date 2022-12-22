import { ITask, TaskActionTypes } from "../../types/tasks";
import { db, storage } from '../../firebase';
import { query, orderBy, collection, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore';
import {v4 as uuid} from 'uuid';
import { AppDispatch } from "../index";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { BoardActionTypes } from "../../types/boards";
import TaskService from "../../api/TaskService";

const taskRef = collection(db, "tasks");

export const fetchTasks = () => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch({type: TaskActionTypes.FETCH_TASKS});

            const tasks = await TaskService.getTaskCollection();

            dispatch({type: TaskActionTypes.FETCH_TASKS_SUCCESS, payload: tasks})
        } catch (e) {
            dispatch({
                type: TaskActionTypes.FETCH_TASKS_ERROR,
                payload: e instanceof Error ?  e.message : "Tasks request error"
            })
        }
    }
}

export const addTask = (task: ITask, fileList: FileList | null = null) => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch({type: TaskActionTypes.ADD_TASK});

            const uploadedFiles = [];
            const id = uuid();
            let currentTask = {} as ITask;
            
            // проходим по массиву добавляемых файлов
            if (fileList) {
                for(let file of fileList) {

                    // создаем ссылку под каждый файл
                    const filesRef = ref(storage, `files/${file.name}`);
        
                    // загружаем каждый файл в облако firebase storage
                    await uploadBytes(filesRef, file)
                    
                    // создаем URL на файл в облаке firebase storage
                    const url = await getDownloadURL(ref(storage, `files/${file.name}`))
        
                    uploadedFiles.push({path: url, name: file.name});
                }
            }

            currentTask = {
                ...task,
                id,
                files: uploadedFiles.length ? uploadedFiles : null
            };

            await TaskService.addTask(currentTask);

            dispatch({type: TaskActionTypes.ADD_TASK_SUCCESS, payload: currentTask});
        } catch (e) {
            dispatch({
                type: TaskActionTypes.ADD_TASK_ERROR,
                payload: e instanceof Error ?  e.message : "Add task request error"
            })
        }
    }
}

export const editTask = (task: ITask, fileList: FileList | null = null) => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch({type: TaskActionTypes.EDIT_TASK});

            const updatedFiles: any[] = [];
            let url: string = '';
            let currentTask = {} as ITask;

            if (fileList) {

                for(let file of fileList) {

                    // создаем ссылку под каждый файл
                    const filesRef = ref(storage, `files/${file.name}`);
        
                    // загружаем каждый файл в облако firebase storage
                    await uploadBytes(filesRef, file)
                    
                    // создаем URL на файл в облаке firebase storage
                    url = await getDownloadURL(ref(storage, `files/${file.name}`))
        
                    updatedFiles.push({path: url, name: file.name});
                }
            }

            if (task.files) {
                task.files.forEach(file => updatedFiles.push(file))
            }

            currentTask = {
                ...task,
                files: updatedFiles.length ? updatedFiles : null
            };

            await TaskService.addTask(currentTask);

            dispatch({type: TaskActionTypes.EDIT_TASK_SUCCESS, payload: currentTask});
        } catch (e) {
            dispatch({
                type: TaskActionTypes.EDIT_TASK_ERROR,
                payload: e instanceof Error ?  e.message : "Edit task request error"
            })
        }
    }
}

export const deleteTask = (task: ITask) => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch({type: TaskActionTypes.DELETE_TASK})

            if (task.files) {
                // удаляем старые файлы
                if (task?.files) {
                    for(let file of task.files) {
                        deleteObject(ref(storage, `files/${file.name}`));
                    }
                }
            }

            await TaskService.deleteTask(task.id);

            dispatch({type: TaskActionTypes.DELETE_TASK_SUCCESS, payload: task.id})
        } catch (e) {
            console.log(e instanceof Error ?  e.message : "Tasks delete request error")
        }
    }
}

export const searchTask = (tasks: ITask[], searchValue: string) => {
    return (dispatch: AppDispatch) => {
        const currentTasks = tasks.filter(task => task.number === +searchValue || task.title.includes(searchValue));

        dispatch({type: TaskActionTypes.SEARCH_TASK, payload: currentTasks})
    }
}