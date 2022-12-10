import { IProject, ProjectActionTypes } from "../../types/projects";
import { AppDispatch } from "../index";
import { collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { deleteObject, ref } from "firebase/storage";
import { ITask } from "../../types/tasks";

const projectRef = collection(db, "projects");

export const fetchProjects = () => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch({type: ProjectActionTypes.FETCH_PROJECTS})

            const projectsSnapshot = await getDocs(query(projectRef, orderBy('createdAt')));
            let projects: IProject[] = []; 

            projectsSnapshot.forEach(item => {
                if (item.data()) {
                    projects.push(item.data() as IProject);
                }
            })

            dispatch({type: ProjectActionTypes.FETCH_PROJECTS_SUCCESS, payload: projects})
        } catch (e) {
            dispatch({
                type: ProjectActionTypes.FETCH_PROJECTS_ERROR,
                payload: e instanceof Error ?  e.message : "Projects request error"
            })
        }
    }
}

export const deleteProject = (projectId: string | number) => {
    return async (dispatch: AppDispatch) => {
        try {

            const tasksSnapshot = await getDocs(query(collection(db, "tasks")));
            let tasks: ITask[] = []; 

            tasksSnapshot.forEach(item => {
                if (item.data()) {
                    tasks.push(item.data() as ITask);
                }
            })

            tasks.forEach(task => {
                if (task.projectId === projectId) {

                    if (task.files) {
                        // удаляем файлы
                        for(let file of task.files) {
                            deleteObject(ref(storage, `files/${file.name}`));
                        }
                    }
    
                    // удаляем задачу
                    deleteDoc(doc(db, "tasks", `${task.id}`));
                } 
            })

            await deleteDoc(doc(db, "projects", `${projectId}`));

            dispatch({type: ProjectActionTypes.DELETE_PROJECT, payload: projectId})
        } catch (e) {
            console.log(e instanceof Error ?  e.message : "Project delete request error")
        }
    }
}