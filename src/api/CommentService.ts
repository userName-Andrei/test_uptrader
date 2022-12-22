import { collection, deleteDoc, doc, getDocs, orderBy, query, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { IComment } from "../types/comments";


export default class CommentService {
    static async getCommentCollection(): Promise<IComment[]> {
        const commentCollectionRef = collection(db, "comments");
        const commentsSnapshot = await getDocs(query(commentCollectionRef, orderBy('creation_date')));
        let comments: IComment[] = []; 

        commentsSnapshot.forEach(item => {
            if (item.data()) {
                comments.push(item.data() as IComment);
            }
        })

        return comments;
    }

    static async addComment(comment: IComment): Promise<void> {
        setDoc(doc(db, 'comments', `${comment.id}`), comment);
    }

    static async deleteComment(commentId: string | number): Promise<void> {
        deleteDoc(doc(db, 'comments', `${commentId}`));
    }
}