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

interface DeleteProject {
    type: ProjectActionTypes.DELETE_PROJECT,
    payload: string | number
}

export type ProjectAction = FetchProjects | FetchProjectsSuccess | FetchProjectsError | DeleteProject;