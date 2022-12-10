import { CommentState, CommentAction, CommentActionTypes, IComment } from "../../types/comments";

let newComments: IComment[];

const initialState: CommentState = {
    comments: [],
    loading: false,
    error: null
}

export const commentReducer = (state = initialState, action: CommentAction): CommentState => {
    switch (action.type) {
        case CommentActionTypes.FETCH_COMMENTS:
            return {comments: [], loading: true, error: null}
        case CommentActionTypes.FETCH_COMMENTS_SUCCESS:
            return {comments: action.payload, loading: false, error: null}
        case CommentActionTypes.FETCH_COMMENTS_ERROR:
            return {comments: [], loading: false, error: action.payload}

        case CommentActionTypes.ADD_COMMENT:
            return {comments: [...state.comments, action.payload], loading: false, error: null}
        case CommentActionTypes.ADD_COMMENT_ERROR:
            return {comments: [], loading: false, error: action.payload}

        case CommentActionTypes.ADD_SUBCOMMENT:
            return {...state, loading: true, error: null}
        case CommentActionTypes.ADD_SUBCOMMENT_SUCCESS:
            newComments = state.comments.map(item => {
                return item.id === action.payload.id ? action.payload : item
            })
            return {comments: newComments, loading: false, error: null}
        case CommentActionTypes.ADD_SUBCOMMENT_ERROR:

            return {comments: [], loading: false, error: action.payload}
        case CommentActionTypes.DELETE_COMMENT:
            return {comments: state.comments.filter(item => item.id !== action.payload), loading: false, error: null}
        case CommentActionTypes.DELETE_COMMENT_ERROR:
            return {comments: [], loading: false, error: action.payload}

        case CommentActionTypes.DELETE_SUBCOMMENT:
            newComments = state.comments.map(item => {
                return item.id === action.payload.id ? action.payload : item
            })
            return {comments: newComments, loading: false, error: null}
        case CommentActionTypes.DELETE_SUBCOMMENT_ERROR:
            return {comments: [], loading: false, error: action.payload}
        default:
            return state
    }
}