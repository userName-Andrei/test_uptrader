export interface ISubcomment {
    id: number | string,
    body: string,
    creation_date: number | string,
    commentId: number | string
}

export interface IComment {
    id: number | string,
    body: string,
    creation_date: number | string,
    subcomments?: ISubcomment[],
    taskId: number | string
}

export interface CommentState {
    comments: IComment[],
    loading: boolean,
    error: null | string
}

export enum CommentActionTypes {
    FETCH_COMMENTS = "FETCH_COMMENTS",
    FETCH_COMMENTS_SUCCESS = "FETCH_COMMENTS_SUCCESS",
    FETCH_COMMENTS_ERROR = "FETCH_COMMENTS_ERROR",
    ADD_COMMENT = "ADD_COMMENT",
    ADD_COMMENT_ERROR = "ADD_COMMENT_ERROR",
    ADD_SUBCOMMENT = "ADD_SUBCOMMENT",
    ADD_SUBCOMMENT_SUCCESS = "ADD_SUBCOMMENT_SUCCESS",
    ADD_SUBCOMMENT_ERROR = "ADD_SUBCOMMENT_ERROR",
    DELETE_COMMENT = "DELETE_COMMENT",
    DELETE_COMMENT_ERROR = "DELETE_COMMENT_ERROR",
    DELETE_SUBCOMMENT = "DELETE_SUBCOMMENT",
    DELETE_SUBCOMMENT_ERROR = "DELETE_SUBCOMMENT_ERROR",
}

interface FetchComments {
    type: CommentActionTypes.FETCH_COMMENTS
}

interface FetchCommentsSuccess {
    type: CommentActionTypes.FETCH_COMMENTS_SUCCESS,
    payload: IComment[]
}

interface FetchCommentsError {
    type: CommentActionTypes.FETCH_COMMENTS_ERROR,
    payload: string
}

interface AddComment {
    type: CommentActionTypes.ADD_COMMENT,
    payload: IComment
}

interface AddCommentError {
    type: CommentActionTypes.ADD_COMMENT_ERROR,
    payload: string
}

interface AddSubComment {
    type: CommentActionTypes.ADD_SUBCOMMENT,
}

interface AddSubCommentSuccess {
    type: CommentActionTypes.ADD_SUBCOMMENT_SUCCESS,
    payload: IComment
}

interface AddSubCommentError {
    type: CommentActionTypes.ADD_SUBCOMMENT_ERROR,
    payload: string
}

interface DeleteComment {
    type: CommentActionTypes.DELETE_COMMENT,
    payload: string | number
}

interface DeleteCommentError {
    type: CommentActionTypes.DELETE_COMMENT_ERROR,
    payload: string
}

interface DeleteSubComment {
    type: CommentActionTypes.DELETE_SUBCOMMENT,
    payload: IComment
}

interface DeleteSubCommentError {
    type: CommentActionTypes.DELETE_SUBCOMMENT_ERROR,
    payload: string
}

export type CommentAction = FetchComments | FetchCommentsSuccess | FetchCommentsError |
                            AddComment | AddCommentError |
                            DeleteComment | DeleteCommentError |
                            AddSubComment | AddSubCommentError | AddSubCommentSuccess |
                            DeleteSubComment | DeleteSubCommentError;