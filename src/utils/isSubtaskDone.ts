import { ISubtask } from "../types/tasks";


const isSubtasksDone = (subtasks: ISubtask[]) => {
    let result = true;

    if (!subtasks.length) {return result}
    
    subtasks.forEach(item => {
        if (!item.status) {
            result = false;
        }
    })

    return result;
}

export default isSubtasksDone