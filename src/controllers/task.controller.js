const TaskModel = require('../models/task.model');

class TaskController {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    async getTasks() {
        try {
            const tasks = await TaskModel.find({});
            this.res.status(200).send(tasks);
        } catch (error) {
            this.res.status(500).send({message: error.message});
        }
    }

    async getTaskById() {
        try {
            const taskId = this.req.params.id;
            const task = await TaskModel.findById(taskId);
            if (!task) {
                return this.res.status(404).send({message: 'Essa tarefa não foi encontrada.'});
            }
            return this.res.status(200).send({message: 'Task encontrada com sucesso!', task: task});
        } catch (error) {
            this.res.status(500).send({ message: error.message });
        }
    }

    async createNewTask() {
        try {
            const newTask = new TaskModel(this.req.body);
            await newTask.save();
            this.res.status(201).send({message: 'Task criada com sucesso!', task: newTask});
        } catch (error) {
            this.res.status(500).send({message: error.message});
        }
    }

    async updateTask() {
        try {
            const taskId = this.req.params.id;
            const taskData = this.req.body;
            const taskToUpdate = await TaskModel.findById(taskId);
    
            const allowedUpdates = ['isCompleted'];
            const requestedUpdates = Object.keys(taskData);
    
            for (const update of requestedUpdates) {
                if (allowedUpdates.includes(update)) {
                    taskToUpdate[update] = taskData[update];
                } else {
                    return this.res.status(500).send({message: 'Um ou mais campos inseridos não são editáveis.'})
                }
            }
    
            await taskToUpdate.save();
            return this.res.status(200).send(taskToUpdate);
        } catch (error) {
            return this.res.status(500).send({message: error.message});
        }
    }

    async deleteTask() {
        try {
            const taskId = this.req.params.id;
            const taskToDelete = await TaskModel.findById(taskId);
            if (!taskToDelete) {
                return this.res.status(404).send({message: 'Task não encontrada!'});
            }
            const deletedTask = await TaskModel.findByIdAndDelete(taskId);
            this.res.status(200).send({message: 'Task deletada com sucesso!', task: deletedTask});
        } catch (error) {
            this.res.status(500).send({message: error.message});
        }
    }
}

module.exports = TaskController;