import { collection, deleteDoc, doc, getDocs, orderBy, query, setDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { IProject } from "../types/projects";
import { ITask } from "../types/tasks";
import { deleteObject, ref } from "firebase/storage";


export default class ProjectService {
    static projectCollectionRef = collection(db, "projects");

    static async getProjectCollection(): Promise<IProject[]> {
        const projectsSnapshot = await getDocs(query(this.projectCollectionRef, orderBy('createdAt')));
        let projects: IProject[] = []; 

        projectsSnapshot.forEach(item => {
            if (item.data()) {
                projects.push(item.data() as IProject);
            }
        })

        return projects;
    }

    static async deleteProject(projectId: string | number): Promise<void> {
        const tasksSnapshot = await getDocs(query(collection(db, "tasks")));
            let tasks: ITask[] = []; 

            tasksSnapshot.forEach(item => {
                if (item.data()) {
                    tasks.push(item.data() as ITask);
                }
            })

            tasks.forEach(task => {
                if (task.projectId === projectId) {

                    if (task.files) {
                        // удаляем файлы
                        for(let file of task.files) {
                            deleteObject(ref(storage, `files/${file.name}`));
                        }
                    }
    
                    // удаляем задачу
                    deleteDoc(doc(db, "tasks", `${task.id}`));
                } 
            })

            await deleteDoc(doc(db, "projects", `${projectId}`));
    }

    static async addProject(project: IProject): Promise<void> {
        await setDoc(doc(db, 'projects', `${project.id}`), project);
    }
}