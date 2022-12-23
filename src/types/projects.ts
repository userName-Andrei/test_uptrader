export interface IProject {
    id: number | string,
    title: string,
    description: string,
    createdAt: number
}

export interface ProjectState {
    projects: IProject[],
    loading: boolean,
    error: null | string
}

export enum ProjectActionTypes {
    FETCH_PROJECTS = "FETCH_PROJECTS",
    FETCH_PROJECTS_SUCCESS ="FETCH_PROJECTS_SUCCESS",
    FETCH_PROJECTS_ERROR = "FETCH_PROJECTS_ERROR",
    ADD_PROJECT = "ADD_PROJECT",
    ADD_PROJECT_SUCCESS ="ADD_PROJECT_SUCCESS",
    ADD_PROJECT_ERROR = "ADD_PROJECT_ERROR",
    EDIT_PROJECT = "EDIT_PROJECT",
    EDIT_PROJECT_SUCCESS ="EDIT_PROJECT_SUCCESS",
    EDIT_PROJECT_ERROR = "EDIT_PROJECT_ERROR",
    DELETE_PROJECT = "DELETE_PROJECT"
}

interface FetchProjects {
    type: ProjectActionTypes.FETCH_PROJECTS
}

interface FetchProjectsSuccess {
    type: ProjectActionTypes.FETCH_PROJECTS_SUCCESS,
    payload: IProject[]
}

interface FetchProjectsError {
    type: ProjectActionTypes.FETCH_PROJECTS_ERROR,
    payload: string
}

interface AddProject {
    type: ProjectActionTypes.ADD_PROJECT
}

interface AddProjectSuccess {
    type: ProjectActionTypes.ADD_PROJECT_SUCCESS,
    payload: IProject
}

interface AddProjectError {
    type: ProjectActionTypes.ADD_PROJECT_ERROR,
    payload: string
}

interface EditProject {
    type: ProjectActionTypes.EDIT_PROJECT
}

interface EditProjectSuccess {
    type: ProjectActionTypes.EDIT_PROJECT_SUCCESS,
    payload: IProject
}

interface EditProjectError {
    type: ProjectActionTypes.EDIT_PROJECT_ERROR,
    payload: string
}

interface DeleteProject {
    type: ProjectActionTypes.DELETE_PROJECT,
    payload: string | number
}

export type ProjectAction = FetchProjects | FetchProjectsSuccess | FetchProjectsError |
                            AddProject | AddProjectSuccess | AddProjectError|
                            EditProject | EditProjectSuccess | EditProjectError|
                            DeleteProject;