import { IProject, ProjectActionTypes } from "../../types/projects";
import { AppDispatch } from "../index";
import { collection, deleteDoc, doc, getDocs, orderBy, query, setDoc } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { deleteObject, ref } from "firebase/storage";
import { ITask } from "../../types/tasks";
import ProjectService from "../../api/ProjectService";



export const fetchProjects = () => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch({type: ProjectActionTypes.FETCH_PROJECTS})

            let projects: IProject[] = await ProjectService.getProjectCollection(); 

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

            ProjectService.deleteProject(projectId);

            dispatch({type: ProjectActionTypes.DELETE_PROJECT, payload: projectId})
        } catch (e) {
            console.log(e instanceof Error ?  e.message : "Project delete request error")
        }
    }
}

export const addProject = (project: IProject) => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch({type: ProjectActionTypes.ADD_PROJECT})

            ProjectService.addProject(project); 

            dispatch({type: ProjectActionTypes.ADD_PROJECT_SUCCESS, payload: project})
        } catch (e) {
            dispatch({
                type: ProjectActionTypes.ADD_PROJECT_ERROR,
                payload: e instanceof Error ?  e.message : "Projects request error"
            })
        }
    }
}