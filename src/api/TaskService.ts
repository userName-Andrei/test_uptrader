import { collection, deleteDoc, doc, getDocs, orderBy, query, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { ITask } from "../types/tasks";


export default class TaskService {
    static async getTaskCollection(): Promise<ITask[]> {
        const taskCollectionRef = collection(db, "tasks");
        const tasksSnapshot = await getDocs(query(taskCollectionRef, orderBy('creation_date')));
        let tasks: ITask[] = []; 

        tasksSnapshot.forEach(item => {
            if (item.data()) {
                tasks.push(item.data() as ITask);
            }
        })

        return tasks;
    }

    static async addTask(task: ITask) {
        setDoc(doc(db, 'tasks', `${task.id}`), task);
    }

    static async deleteTask(taskId: string | number) {
        deleteDoc(doc(db, "tasks", `${taskId}`));
    }
}