import { useState,useEffect } from "react";
import { URL } from "../App";
import TaskForm from "./TaskForm";
import Task from "./Task"
import React from 'react'
import { toast } from 'react-toastify';
import axios from "axios";
import loadingImg from "../assets/loader.gif"


const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [taskID, setTaskID] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        completed: false,
    });
    const {name} = formData;

    const handleInputChange = (e) => {
        const {name, value} = e.target
        setFormData({...formData, [name]: value})
    }; //here 'e' is for event target property

    const getTasks = async () => {
        setIsLoading(true)
        try {
            const {data} = await axios.get(`${URL}/api/tasks`)
            setTasks(data)
            setIsLoading(false) 

        } catch (error) {
            toast.error(error.message)
            setIsLoading(false)
        }
    };

    useEffect(() => {
        getTasks() 
    },[]);

    const createTask = async (e) => {
        e.preventDefault();
        if (name === "") {
            return toast.error("Input field can not be empty")
        }
        try { 
            await axios.post(`${URL}/api/tasks`,formData);
            toast.success("Task added successfully!"); 
            setFormData({...formData, name: ""});
            getTasks();
        } catch (error) {
            toast.error(error.message);
        }

    }

    const deleteTask = async (id) => {
        try {
            await axios.delete(`${URL}/api/tasks/${id}`)
            getTasks()
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        const completeTask = tasks.filter((task) => {
            return task.completed === true
        })
        setCompletedTasks(completeTask)
    },[tasks])

    const getSingleTask = async (task,id) => {
        setFormData({name: task.name, completed: false});
        setTaskID(id);
        setIsEditing(true);
    }

    const updateTask = async (e) => {
        e.preventDefault()
        if (name === "") {
            return toast.error("Input field cannot be empty.")
        }
        try {
            await axios.patch(`${URL}/api/tasks/${taskID}`, formData);
            setFormData({ ...formData, name: ""});
            setIsEditing(false);
            getTasks();
        } catch (error) {
            toast.error(error.message)
        }
    }

    const setToComplete = async (task,id) => {
        const newFormData = {
            name: task.name,
            completed: true,
        }
        try {
            await axios.patch(`${URL}/api/tasks/${id}`, newFormData);
            getTasks();
        } catch (error) {
            toast.error(error.message);
            
        }
    };

  return (
    <div>
        <h2>Task Manager</h2>
        <TaskForm 
            name = {name} 
            handleInputChange = {handleInputChange} 
            createTask = {createTask}
            isEditing = {isEditing}
            updateTask = {updateTask}
        />
        {tasks.length > 0 && (
            <div className="--flex-between --pb">
            <p>
                <b>Total Tasks:</b>{tasks.length}
            </p>
            <p>
                <b>Completed Tasks:</b>{completedTasks.length}
            </p>
        </div>
        )}
        <hr/> 
        {
            isLoading && (
                <div className="--flex-center">
                    <img src = {loadingImg} alt = "Loading" />
                </div>
            )
        }
        {
            !isLoading && tasks.length === 0 ? (
                <p className="--py">No task added. Please add a task</p>
            ) : (
                <>
                    {tasks.map((task, index) => {
                        return (
                            <Task key = {task._id} 
                                  task = {task} 
                                  index = {index} 
                                  deleteTask = {deleteTask}
                                  getSingleTask = {getSingleTask}
                                  setToComplete = {setToComplete}
                                  />
                        )
                    })}
                </>
            )
        }
        
    </div>
  );
};

export default TaskList;