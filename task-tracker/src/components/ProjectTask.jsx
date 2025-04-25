import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import API from "../services/api";

const statusOptions = {
  1: "Pending",
  2: "In Progress", 
  3: "Completed",
};

const ProjectTask = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editTaskId, setEditTaskId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState({
    createTask: false,
    saveEdit: {},
    deleteTask: {}
  });

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const res = await API.get(`/tasks/${projectId}`);
      console.log(res.data);
      setTasks(res.data);
    } catch (err) {
      console.error(`Failed to load tasks for project ${projectId}`);
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async () => {
    setLoadingStates(prev => ({ ...prev, createTask: true }));
    try {
      await API.post("/tasks", {
        ...newTask,
        status: 1,
        project_id: projectId,
      });
      setNewTask({ title: '', description: '' });
      await fetchTasks();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create task.");
    } finally {
      setLoadingStates(prev => ({ ...prev, createTask: false }));
    }
  };

  const deleteTask = async (taskId) => {
    setLoadingStates(prev => ({ ...prev, deleteTask: { ...prev.deleteTask, [taskId]: true } }));
    try {
      await API.delete(`/tasks/${taskId}`);
      await fetchTasks();
    } catch (err) {
      alert("Failed to delete task");
    } finally {
      setLoadingStates(prev => ({ ...prev, deleteTask: { ...prev.deleteTask, [taskId]: false } }));
    }
  };

  const startEditing = (task) => {
    setEditTaskId(task.id);
    setEditValues({
      title: task.title,
      description: task.description,
      status: task.status
    });
  };

  const cancelEditing = () => {
    setEditTaskId(null);
    setEditValues({});
  };

  const saveEdit = async (taskId) => {
    setLoadingStates(prev => ({ ...prev, saveEdit: { ...prev.saveEdit, [taskId]: true }}));
    try {
      await API.put(`/tasks/${taskId}`, {
        ...editValues,
        completed_at: editValues.status == 3 ? new Date() : null
      });
      setEditTaskId(null);
      setEditValues({});
      await fetchTasks();
    } catch (err) {
      alert("Failed to update task");
    } finally {
      setLoadingStates(prev => ({ ...prev, saveEdit: { ...prev.saveEdit, [taskId]: false }}));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 mt-2 bg-white">
      {/* Task Creation Form */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Task</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            placeholder="Task title"
            className="flex-1 border border-gray-300 rounded p-2 text-gray-800 bg-white"
          />
          <input
            type="text"
            value={newTask.description}
            onChange={(e) => setNewTask({...newTask, description: e.target.value})}
            placeholder="Description"
            className="flex-1 border border-gray-300 rounded p-2 text-gray-800 bg-white"
          />
          <button
            onClick={createTask}
            disabled={!newTask.title.trim() || loadingStates.createTask}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loadingStates.createTask ? 'Adding...' : 'Add Task'}
          </button>
        </div>
      </div>

      {/* Tasks List */}
      {isLoading ? (
        <div className="text-center py-8 text-gray-600">Loading tasks...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map(task => (
                editTaskId === task.id ? (
                  <tr key={task.id} className="bg-gray-50">
                    <td colSpan="6" className="px-6 py-4">
                      <div className="space-y-3">
                        <div className="flex gap-4">
                          <input
                            value={editValues.title}
                            onChange={(e) => setEditValues({...editValues, title: e.target.value})}
                            className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                            placeholder="Title"
                          />
                          <input
                            value={editValues.description}
                            onChange={(e) => setEditValues({...editValues, description: e.target.value})}
                            className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                            placeholder="Description"
                          />
                          <select
                            value={editValues.status}
                            onChange={(e) => setEditValues({...editValues, status: parseInt(e.target.value)})}
                            className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-800"
                          >
                            {Object.entries(statusOptions).map(([value, label]) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit(task.id)}
                            disabled={loadingStates.saveEdit[task.id]}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
                          >
                            {loadingStates.saveEdit[task.id] ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{statusOptions[task.status]}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(task.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.completed_at ? new Date(task.completed_at).toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(task)}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          disabled={loadingStates.deleteTask[task.id]}
                          className="text-red-500 hover:text-red-600 disabled:opacity-50"
                        >
                          {loadingStates.deleteTask[task.id] ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProjectTask;
