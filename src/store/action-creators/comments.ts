import dayjs from "dayjs";
import { collection, doc, getDocs, orderBy, query, setDoc, deleteDoc } from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { db } from "../../firebase";
import { CommentActionTypes, IComment, ISubcomment } from "../../types/comments";
import { AppDispatch } from "../index";

const commentsRef = collection(db, "comments");

export const fetchComments = () => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch({type: CommentActionTypes.FETCH_COMMENTS})

            const commentsSnapshot = await getDocs(query(commentsRef, orderBy('creation_date')));
            let comments: IComment[] = []; 

            commentsSnapshot.forEach(item => {
                if (item.data()) {
                    comments.push(item.data() as IComment);
                }
            })

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

            await setDoc(doc(db, 'comments', `${comment.id}`), comment);
            
            dispatch({type: CommentActionTypes.ADD_COMMENT, payload: comment})
        } catch (e) {
            dispatch({type: CommentActionTypes.ADD_COMMENT_ERROR, payload: e instanceof Error ? e.message : 'Add comment error'})
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

            await setDoc(doc(db, 'comments', `${commentWithSub.id}`), commentWithSub);
            
            dispatch({type: CommentActionTypes.ADD_SUBCOMMENT_SUCCESS, payload: commentWithSub})
        } catch (e) {
            dispatch({type: CommentActionTypes.ADD_SUBCOMMENT_ERROR, payload: e instanceof Error ? e.message : 'Add subcomment error'})
        }
    }
}

export const deleteComment = (commentId: string | number) => {
    return async (dispatch: AppDispatch) => {
        try {

            deleteDoc(doc(db, 'comments', `${commentId}`));
            
            dispatch({type: CommentActionTypes.DELETE_COMMENT, payload: commentId})
        } catch (e) {
            dispatch({type: CommentActionTypes.DELETE_COMMENT_ERROR, payload: e instanceof Error ? e.message : 'Delete comment error'})
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

            setDoc(doc(db, 'comments', `${commentWithoutSub.id}`), commentWithoutSub);
            
            dispatch({type: CommentActionTypes.DELETE_SUBCOMMENT, payload: commentWithoutSub})
        } catch (e) {
            dispatch({type: CommentActionTypes.DELETE_SUBCOMMENT_ERROR, payload: e instanceof Error ? e.message : 'Add subcomment error'})
        }
    }
}