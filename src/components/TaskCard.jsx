import { useState } from "react";

const TaskCard = ({
    task,
    column,
    moveTask,
    updateTaskData,
    deleteTask,
    handleAddComment
}) => {
    const [editingTask, setEditingTask] = useState(null);
    const [editTaskData, setEditTaskData] = useState({ title: '', desc: '', priority: 'medium' });
    const [newComment, setNewComment] = useState("");

    const startEditTask = (task) => {
        setEditingTask(task._id);
        setEditTaskData({
            title: task.title,
            desc: task.desc,
            priority: task.priority
        });
    };

    const saveEditTask = (taskId, column) => {
        if (editTaskData.title.trim()) {
            updateTaskData(taskId, column, editTaskData);
            setEditingTask(null);
            setEditTaskData({ title: '', desc: '', priority: 'medium' });
        }
    };

    const cancelEditTask = () => {
        setEditingTask(null);
        setEditTaskData({ title: '', desc: '', priority: 'medium' });
    };

    const addComment = (taskId, column) => {
        if (newComment && newComment.trim()) {
            handleAddComment(taskId, column, newComment);
            setNewComment("");
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800 border-red-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-2">
                {editingTask === task._id ? (
                    <div className="flex-1 mr-2">
                        <input
                            type="text"
                            value={editTaskData.title}
                            onChange={(e) => setEditTaskData(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 mb-2"
                            placeholder="Task title"
                        />
                        <textarea
                            value={editTaskData.desc}
                            onChange={(e) => setEditTaskData(prev => ({ ...prev, desc: e.target.value }))}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 mb-2"
                            placeholder="Task desc"
                            rows="2"
                        />
                        <select
                            value={editTaskData.priority}
                            onChange={(e) => setEditTaskData(prev => ({ ...prev, priority: e.target.value }))}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                ) : (
                    <>
                        <h3 className="font-medium text-gray-900 text-sm">{task.title}</h3>
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                            </span>
                            {
                                (localStorage.getItem("role") == "admin" || task.cdy === localStorage.getItem("userId")) &&
                                <>
                                    {/* Edit Icon */}
                                    <button
                                        onClick={() => startEditTask(task)}
                                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                        title="Edit task"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    {/* Delete Icon */}
                                    <button
                                        onClick={() => deleteTask(task._id, column)}
                                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                        title="Delete task"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </>
                            }
                        </div>
                    </>
                )}
            </div>

            {editingTask === task._id ? (
                <div className="flex gap-2 mb-3">
                    <button
                        onClick={() => saveEditTask(task._id, column)}
                        className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    >
                        Save
                    </button>
                    <button
                        onClick={cancelEditTask}
                        className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                <>
                    {task.desc && (
                        <p className="text-gray-600 text-sm mb-3">{task.desc}</p>
                    )}

                    {/* Comments Section */}
                    {task.comments && task.comments.length > 0 && (
                        <div className="mb-3">
                            <h4 className="text-xs font-medium text-gray-700 mb-2">Recent Comments:</h4>
                            <div className="space-y-2 max-h-24 overflow-y-auto">
                                {task.comments.slice(-3).map(comment => (
                                    <div key={comment._id} className="bg-gray-50 rounded p-2">
                                        <p className="text-xs text-gray-700">{comment.text}</p>
                                        <p className="text-xs text-gray-500 mt-1">{comment.timestamp}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Add Comment */}
                    <div className="mb-3">
                        <div className="flex gap-1">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                                onClick={() => addComment(task._id, column)}
                                className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Move Buttons */}
                    <div className="flex gap-1">
                        {column !== 'todo' && (
                            <button
                                onClick={() => moveTask(task._id, column, column === 'progress' ? 'todo' : 'progress')}
                                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                            >
                                ← Move Back
                            </button>
                        )}
                        {column !== 'done' && (
                            <button
                                onClick={() => moveTask(task._id, column, column === 'todo' ? 'progress' : 'done')}
                                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                            >
                                Move Forward →
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    )
};

export default TaskCard;