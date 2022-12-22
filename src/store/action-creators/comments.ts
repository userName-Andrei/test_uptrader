import dayjs from "dayjs";
import { v4 as uuid } from "uuid";
import { CommentActionTypes, IComment, ISubcomment } from "../../types/comments";
import { AppDispatch } from "../index";
import CommentService from "../../api/CommentService";

export const fetchComments = () => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch({type: CommentActionTypes.FETCH_COMMENTS})

            const comments = await CommentService.getCommentCollection();

            dispatch({type: CommentActionTypes.FETCH_COMMENTS_SUCCESS, payload: comments})
        } catch (e) {
            dispatch({
                type: CommentActionTypes.FETCH_COMMENTS_ERROR,
                payload: e instanceof Error ?  e.message : "Comments request error"
            })
        }
    }
}

export const addComment = (commentBody: string, taskId: string | number) => {
    return async (dispatch: AppDispatch) => {
        try {

            const comment: IComment = {
                id: uuid(),
                body: commentBody,
                creation_date: dayjs().valueOf(),
                subcomments: [],
                taskId
            }

            await CommentService.addComment(comment);
            
            dispatch({type: CommentActionTypes.ADD_COMMENT, payload: comment})
        } catch (e) {
            dispatch({type: CommentActionTypes.ADD_COMMENT_ERROR, payload: e instanceof Error ? e.message : 'Add comment error'})
        }
    }
}

export const deleteComment = (commentId: string | number) => {
    return async (dispatch: AppDispatch) => {
        try {

            CommentService.deleteComment(commentId);
            
            dispatch({type: CommentActionTypes.DELETE_COMMENT, payload: commentId})
        } catch (e) {
            dispatch({type: CommentActionTypes.DELETE_COMMENT_ERROR, payload: e instanceof Error ? e.message : 'Delete comment error'})
        }
    }
}

export const addSubComment = (commentBody: string, comment: IComment) => {
    return async (dispatch: AppDispatch) => {
        try {

            dispatch({type: CommentActionTypes.ADD_SUBCOMMENT})

            const subcomment: ISubcomment = {
                id: uuid(), 
                body: commentBody, 
                creation_date: dayjs().valueOf(), 
                commentId: comment.id
            }

            const commentWithSub: IComment = {
                ...comment,
                subcomments: [...(comment.subcomments ? comment.subcomments : []), subcomment]
            }

            await CommentService.addComment(commentWithSub)
            
            dispatch({type: CommentActionTypes.ADD_SUBCOMMENT_SUCCESS, payload: commentWithSub})
        } catch (e) {
            dispatch({type: CommentActionTypes.ADD_SUBCOMMENT_ERROR, payload: e instanceof Error ? e.message : 'Add subcomment error'})
        }
    }
}

export const deleteSubComment = (subcommentId: string | number, comment: IComment) => {
    return async (dispatch: AppDispatch) => {
        try {

            const commentWithoutSub: IComment = {
                ...comment,
                subcomments: comment.subcomments?.filter(item => item.id !== subcommentId)
            }

            CommentService.addComment(commentWithoutSub)
            
            dispatch({type: CommentActionTypes.DELETE_SUBCOMMENT, payload: commentWithoutSub})
        } catch (e) {
            dispatch({type: CommentActionTypes.DELETE_SUBCOMMENT_ERROR, payload: e instanceof Error ? e.message : 'Add subcomment error'})
        }
    }
}