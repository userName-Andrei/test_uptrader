import { ProjectState, ProjectAction, ProjectActionTypes } from "../../types/projects";

const initialState: ProjectState = {
    projects: [],
    loading: false,
    error: null
}

export const projectReducer = (state = initialState, action: ProjectAction): ProjectState => {
    switch (action.type) {
        case ProjectActionTypes.FETCH_PROJECTS:
            return {projects: [], loading: true, error: null}
        case ProjectActionTypes.FETCH_PROJECTS_SUCCESS:
            return {projects: action.payload, loading: false, error: null}
        case ProjectActionTypes.FETCH_PROJECTS_ERROR:
            return {projects: [], loading: false, error: action.payload}

        case ProjectActionTypes.ADD_PROJECT:
            return {...state, loading: false, error: null}
        case ProjectActionTypes.ADD_PROJECT_SUCCESS:
            return {...state, projects: [...state.projects, action.payload], loading: false, error: null}
        case ProjectActionTypes.ADD_PROJECT_ERROR:
            return {...state, loading: false, error: action.payload}

        case ProjectActionTypes.EDIT_PROJECT:
            return {...state, loading: false, error: null}
        case ProjectActionTypes.EDIT_PROJECT_SUCCESS:
            let currentProjects = state.projects.map(project => {
                if (project.id === action.payload.id) {
                    return action.payload;
                }

                return project;
            })
            return {...state, projects: currentProjects, loading: false, error: null}
        case ProjectActionTypes.EDIT_PROJECT_ERROR:
            return {...state, loading: false, error: action.payload}

        case ProjectActionTypes.DELETE_PROJECT:
            return {projects: state.projects.filter(project => project.id !== action.payload), loading: false, error: null}
        default:
            return state
    }
}