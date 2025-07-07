import React, { useEffect, useState } from 'react'
import { GET_USER_LIST, ADD_USER_TASK, GET_USER_TASK_LIST, UPDATE_USER_TASK, DELETE_USER_TASK } from '../utils/URL'
import { _get, _post } from '../utils/services';
import TaskCard from '../components/TaskCard';
import { socket } from '../socket';

export default function Home() {
    const [newTask, setNewTask] = useState('');
    const [userList, setUserList] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');

    const [todoTask, setTodoTask] = useState([]);
    const [progressTask, setProgressTask] = useState([]);
    const [doneTask, setDoneTask] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Join appropriate socket rooms when component mounts or user changes
    useEffect(() => {
        const currentUserId = localStorage.getItem("userId");

        const joinRooms = () => {
            // Join user-specific room
            if (currentUserId) {
                socket.emit('joinRoom', currentUserId);
            }

            // Join specific user room for admin
            if (selectedUser) {
                socket.emit('joinRoom', selectedUser);
            }
        };

        // Join rooms immediately if socket is connected
        if (socket.connected) {
            joinRooms();
        }

        socket.on('connect', joinRooms);

        return () => {
            socket.off('connect', joinRooms);
        };
    }, [selectedUser]);

    useEffect(() => {
        let taskCreatedTimeout;
        let taskUpdatedTimeout;
        let taskDeletedTimeout;

        // Socket event listener for new tasks
        const handleTaskCreated = (task) => {
            console.log("New task received:", task);
            if (task.status === 'todo') {
                setTodoTask(prev => [...prev, task]);
            } else if (task.status === 'progress') {
                setProgressTask(prev => [...prev, task]);
            } else if (task.status === 'done') {
                setDoneTask(prev => [...prev, task]);
            }
        };

        // Socket event listener for task updates
        const handleTaskUpdated = (updatedTask) => {
            console.log("Task updated:", updatedTask);

            // Remove from all columns first
            setTodoTask(prev => prev.filter(task => task._id !== updatedTask._id));
            setProgressTask(prev => prev.filter(task => task._id !== updatedTask._id));
            setDoneTask(prev => prev.filter(task => task._id !== updatedTask._id));

            // Add to the correct column based on new status
            if (updatedTask.status === 'todo') {
                setTodoTask(prev => [...prev, updatedTask]);
            } else if (updatedTask.status === 'progress') {
                setProgressTask(prev => [...prev, updatedTask]);
            } else if (updatedTask.status === 'done') {
                setDoneTask(prev => [...prev, updatedTask]);
            }
        };

        // Socket event listener for task deletions
        const handleTaskDeleted = ({ taskId }) => {
            setTodoTask(prev => prev.filter(task => task._id != taskId));
            setProgressTask(prev => prev.filter(task => task._id != taskId));
            setDoneTask(prev => prev.filter(task => task._id != taskId));
        };

        // Listen for socket events
        socket.on("taskCreated", handleTaskCreated);
        socket.on("taskUpdated", handleTaskUpdated);
        socket.on("taskDeleted", handleTaskDeleted);

        // Cleanup function to remove event listeners and timeouts
        return () => {
            clearTimeout(taskCreatedTimeout);
            clearTimeout(taskUpdatedTimeout);
            clearTimeout(taskDeletedTimeout);
            socket.off("taskCreated", handleTaskCreated);
            socket.off("taskUpdated", handleTaskUpdated);
            socket.off("taskDeleted", handleTaskDeleted);
        };
    }, [selectedUser]); // Removed state dependencies to prevent recreation

    useEffect(() => {
        const userRole = localStorage.getItem("role");
        if (userRole === "admin") {
            _get(GET_USER_LIST).then(res => {
                if (res.status === 'success') {
                    if (res.data) {
                        setUserList(res.data);
                    }
                } else {
                    alert(res.message);
                }
            });
        }
        return () => {
            setUserList([]);
        }
    }, []);

    useEffect(() => {
        getTasks();
    }, [selectedUser]);

    const addTask = async () => {
        if (newTask.trim()) {
            setIsLoading(true);
            const task = {
                userId: selectedUser || null,
                title: newTask,
                status: 'todo',
                priority: 'medium',
            };

            try {
                const res = await _post(ADD_USER_TASK, task);
                if (res.status === 'success') {
                    // Don't add to local state here - let the socket event handle it
                    // This prevents duplicate tasks when multiple windows are open
                    console.log("Task created successfully, waiting for socket event");
                } else {
                    alert(res.message);
                }
            } catch (error) {
                console.error("Error adding task:", error);
                alert("Failed to add task");
            } finally {
                setIsLoading(false);
            }

            setNewTask('');
        }
    };

    const getTasks = async () => {
        setIsLoading(true);
        try {
            const userId = selectedUser || null;
            const res = await _get(GET_USER_TASK_LIST, { userId });
            if (res.status === 'success') {
                if (res.data) {
                    let todo = res.data.filter((x) => x.status == 'todo');
                    let progress = res.data.filter((x) => x.status == 'progress');
                    let done = res.data.filter((x) => x.status == 'done');

                    setTodoTask(todo);
                    setProgressTask(progress);
                    setDoneTask(done);
                }
            } else {
                alert(res.message);
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
            alert("Failed to fetch tasks");
        } finally {
            setIsLoading(false);
        }
    }

    const updateTaskData = async (taskId, column, updatedData) => {
        if (column === 'todo') {
            setTodoTask(prev => prev.map(task =>
                task._id === taskId ? { ...task, ...updatedData } : task
            ));
        } else if (column === 'progress') {
            setProgressTask(prev => prev.map(task =>
                task._id === taskId ? { ...task, ...updatedData } : task
            ));
        } else if (column === 'done') {
            setDoneTask(prev => prev.map(task =>
                task._id === taskId ? { ...task, ...updatedData } : task
            ));
        }

        const payload = {
            _id: taskId,
            ...updatedData,
        }
        const res = await _post(UPDATE_USER_TASK, payload);
        if (res.status !== 'success') {
            alert(res.message);
        }
    }

    const getList = (id) => {
        if (id == 'todo') {
            return todoTask;
        } else if (id == "progress") {
            return progressTask;
        } else if (id == "done") {
            return doneTask;
        }
    }

    const deleteTask = async (taskId, column) => {
        try {
            const payload = {
                _id: taskId,
            };
            const res = await _post(DELETE_USER_TASK, payload);
            if (res.status !== 'success') {
                alert(res.message);
            }
        } catch (error) {
            console.error("Error deleting task:", error);
            alert("Failed to delete task");
        }
    };

    const handleAddComment = async (taskId, column, comment) => {
        const taskList = getList(column);
        const taskToUpdate = taskList.find(task => task._id === taskId);

        if (!taskToUpdate) {
            console.error('Task not found');
            return;
        }
        // Add comment to the task
        const updatedTask = {
            ...taskToUpdate,
            comments: [...(taskToUpdate.comments || []), { text: comment }]
        };

        // Update the task in the appropriate state
        if (column === 'todo') {
            setTodoTask(prev => prev.map(task =>
                task._id === taskId ? updatedTask : task
            ));
        }
        else if (column === 'progress') {
            setProgressTask(prev => prev.map(task =>
                task._id === taskId ? updatedTask : task
            ));
        }
        else if (column === 'done') {
            setDoneTask(prev => prev.map(task =>
                task._id === taskId ? updatedTask : task
            ));
        }
        // Update the task in the backend
        const payload = {
            _id: taskId,
            comments: updatedTask.comments,
        };

        await _post(UPDATE_USER_TASK, payload);
    }

    const moveTask = async (taskId, fromColumn, toColumn) => {
        try {
            // Update the task in the backend first
            const payload = {
                _id: taskId,
                status: toColumn,
            };
            const res = await _post(UPDATE_USER_TASK, payload);
            if (res.status != 'success') {
                alert(res.message);
            }
        } catch (error) {
            console.error("Error moving task:", error);
            alert("Failed to move task");
        }
    };

    const Column = ({ title, tasks, column, color }) => (
        <div className="flex-1 bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className={`font-semibold text-lg ${color}`}>{title}</h2>
                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm font-medium">
                    {tasks.length}
                </span>
            </div>
            <div className="space-y-3">
                {tasks.map(task => (
                    <TaskCard
                        key={task._id}
                        task={task}
                        column={column}
                        moveTask={moveTask}
                        updateTaskData={updateTaskData}
                        deleteTask={deleteTask}
                        handleAddComment={handleAddComment} />
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Board</h1>
                        <p className="text-gray-600">Manage your tasks and track progress</p>
                    </div>
                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("role");
                            window.location.href = '/';
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </div>
                {/* if Admin login than show select user dropdown */}
                {
                    localStorage.getItem("role") === "admin" && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select User:</label>
                            <select
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                                disabled={userList.length === 0}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Users</option>
                                {userList.map(user => (
                                    <option key={user._id} value={user._id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )
                }
                {/* Add Task Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="Add a new task..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                            onClick={addTask}
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Adding...
                                </div>
                            ) : (
                                'Add Task'
                            )}
                        </button>
                    </div>
                </div>

                {/* Kanban Board */}
                <div className="relative">
                    {isLoading && (
                        <div className="absolute inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                            <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading tasks...
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Column
                            title="To Do"
                            tasks={todoTask}
                            column="todo"
                            color="text-red-600"
                        />
                        <Column
                            title="In Progress"
                            tasks={progressTask}
                            column="progress"
                            color="text-yellow-600"
                        />
                        <Column
                            title="Done"
                            tasks={doneTask}
                            column="done"
                            color="text-green-600"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
