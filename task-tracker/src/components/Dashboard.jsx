import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const statusOptions = {
  1: "Pending",
  2: "In Progress",
  3: "Completed",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [tasks, setTasks] = useState({});
  const [newTask, setNewTask] = useState({});
  const [editTaskId, setEditTaskId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [loadingtask, setLoadingTasks] = useState(false)
  const uid = localStorage.getItem("uid");
  console.log(new Date())
  useEffect(() => {
    fetchProjects();
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [projectLoading, setProjectLoading] = useState(false);

  const fetchProjects = async () => {
    setProjectLoading(true);
    try {
      const res = await API.get(`/projects/${uid}`);
      setProjects(res.data);
      res.data.forEach((project) => fetchTasks(project.id));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to fetch projects.");
    } finally {
      setProjectLoading(false);
    }
  };

  const fetchTasks = async (projectId) => {
    try {
      const res = await API.get(`/tasks/${projectId}`);

      setTasks((prev) => ({ ...prev, [projectId]: res.data }));
    } catch (err) {
      console.error(`Failed to load tasks for project ${projectId}`);
    }
  };

  const createProject = async () => {
    setIsLoading(true);
    try {
      await API.post("/projects", { name: projectName, user_id: uid });
      setProjectName("");
      await fetchProjects();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create project.");
    } finally {
      setIsLoading(false);
    }
  };

  const [loadingStates, setLoadingStates] = useState({
    createProject: false,
    createTask: {},
    saveEdit: {},
    deleteTask: {},
    deleteProject: {}
  });

  const deleteProject = async (projectId) => {
    setLoadingStates(prev => ({ ...prev, deleteProject: { ...prev.deleteProject, [projectId]: true } }));
    try {
      await API.delete(`/projects/${projectId}`);
      await fetchProjects();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete project.");
    } finally {
      setLoadingStates(prev => ({ ...prev, deleteProject: { ...prev.deleteProject, [projectId]: false } }));
    }
  };

  // Modify createTask function
  const createTask = async (projectId) => {
    setLoadingStates(prev => ({ ...prev, createTask: { ...prev.createTask, [projectId]: true } }));
    try {
      const taskData = newTask[projectId];
      await API.post("/tasks", {
        ...taskData,
        status: 1,
        project_id: projectId,
      });
      setNewTask(prev => ({ ...prev, [projectId]: {} }));
      await fetchTasks(projectId);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create task.");
    } finally {
      setLoadingStates(prev => ({ ...prev, createTask: { ...prev.createTask, [projectId]: false } }));
    }
  };

  // Modify saveEdit function
  // const saveEdit = async (task, projectId) => {
  //   setLoadingStates(prev => ({...prev, saveEdit: {...prev.saveEdit, [task.id]: true}}));
  //   try {
  //     const updatedTask = {
  //       ...editValues,
  //       completed_at: editValues.status === 3 ? new Date(): null,
  //     };
  //     await API.put(`/tasks/${task.id}`, updatedTask);
  //     setEditTaskId(null);
  //     setEditValues({});
  //     await fetchTasks(projectId);
  //   } catch (err) {
  //     alert("Failed to update task");
  //   } finally {
  //     setLoadingStates(prev => ({...prev, saveEdit: {...prev.saveEdit, [task.id]: false}}));
  //   }
  // };

  // Modify deleteTask function
  const deleteTask = async (taskId, projectId) => {
    setLoadingStates(prev => ({ ...prev, deleteTask: { ...prev.deleteTask, [taskId]: true } }));
    try {
      await API.delete(`/tasks/${taskId}`);
      await fetchTasks(projectId);
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
      status: task.status,
      completed_at: task.completed_at
    });
  };

  const cancelEditing = () => {
    setEditTaskId(null);
    setEditValues({});
  };

  const saveEdit = async (task, projectId) => {
    setLoadingTasks(true)
    try {
      const updatedTask = {
        ...editValues,
        completed_at: editValues.status === 3 ? new Date() : null,
      };
      console.log(updatedTask)
      await API.put(`/tasks/${task.id}`, updatedTask);
      setEditTaskId(null);
      setEditValues({});
      fetchTasks(projectId);
      setLoadingTasks(false)
    } catch (err) {
      setLoadingTasks(false)
      alert("Failed to update task");
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Task Tracker</h1>
        <div className="flex gap-4">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
            className="flex-1 border text-black border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={createProject}
            disabled={!projectName.trim() || isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Create Project'
            )}
          </button>
        </div>
      </header>

      {projectLoading ? (
        <div className="flex justify-center items-center py-12">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/project/${project.id}`)}
            >
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{project.name}</h2>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteProject(project.id);
                  }}
                  disabled={loadingStates.deleteProject[project.id]}
                  className="text-red-500 hover:text-red-700 disabled:opacity-50"
                >
                  {loadingStates.deleteProject[project.id] ? 'Deleting...' : 'Delete'}
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {tasks[project.id] === undefined ? (
                    <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    `${tasks[project.id]?.length || 0} tasks`
                  )}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startEditingProject(project);
                  }}
                  className="text-blue-500 text-sm hover:text-blue-700"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
