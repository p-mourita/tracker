import React, { useState } from 'react';
import { Plus, Calendar, Users, CheckCircle2, Circle, Clock, Search, TrendingUp, Edit2, Trash2, Save, X } from 'lucide-react';

export default function ProjectTracker() {
  const [projects, setProjects] = useState([
    { id: 1, name: 'Website Redesign', description: 'Complete overhaul of company website', deadline: '2025-01-15', owner: 'Sarah Chen', status: 'active', priority: 'high' },
    { id: 2, name: 'Mobile App Launch', description: 'iOS and Android app development', deadline: '2025-02-28', owner: 'Mike Johnson', status: 'planning', priority: 'high' }
  ]);
  
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Design mockups', projectId: 1, assignee: 'Alex Kim', status: 'done', priority: 'high', dueDate: '2024-12-10' },
    { id: 2, title: 'Develop homepage', projectId: 1, assignee: 'Jordan Lee', status: 'in-progress', priority: 'high', dueDate: '2024-12-15' },
    { id: 3, title: 'User testing', projectId: 1, assignee: 'Sarah Chen', status: 'todo', priority: 'medium', dueDate: '2024-12-20' },
    { id: 4, title: 'API development', projectId: 2, assignee: 'Chris Park', status: 'in-progress', priority: 'high', dueDate: '2025-01-05' }
  ]);

  const [view, setView] = useState('board');
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const addProject = (p) => {
    setProjects([...projects, { ...p, id: Date.now() }]);
    setShowProjectForm(false);
  };

  const addTask = (t) => {
    setTasks([...tasks, { ...t, id: Date.now() }]);
    setShowTaskForm(false);
  };

  const updateProject = (p) => {
    setProjects(projects.map(pr => pr.id === p.id ? p : pr));
    setEditProject(null);
  };

  const updateTask = (t) => {
    setTasks(tasks.map(ta => ta.id === t.id ? t : ta));
    setEditTask(null);
  };

  const deleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
    setTasks(tasks.filter(t => t.projectId !== id));
  };

  const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));

  const getStats = (pid) => {
    const pts = tasks.filter(t => t.projectId === pid);
    const done = pts.filter(t => t.status === 'done').length;
    return { total: pts.length, done, pct: pts.length ? Math.round((done / pts.length) * 100) : 0 };
  };

  const filtered = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <TrendingUp className="text-blue-600" size={36} />
            Ultimate Project Tracker
          </h1>
          <p className="text-gray-600 mt-2">Enterprise-grade project management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Stat label="Total Projects" value={projects.length} color="blue" />
          <Stat label="Active" value={projects.filter(p => p.status === 'active').length} color="green" />
          <Stat label="Total Tasks" value={tasks.length} color="purple" />
          <Stat label="Completed" value={tasks.filter(t => t.status === 'done').length} color="orange" />
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-wrap gap-4">
          <div className="flex gap-2">
            <button onClick={() => setView('board')} className={`px-4 py-2 rounded-lg font-semibold ${view === 'board' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
              Task Board
            </button>
            <button onClick={() => setView('projects')} className={`px-4 py-2 rounded-lg font-semibold ${view === 'projects' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
              Projects
            </button>
          </div>
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <button onClick={() => setShowProjectForm(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Plus size={18} /> New Project
          </button>
          <button onClick={() => setShowTaskForm(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
            <Plus size={18} /> New Task
          </button>
        </div>

        {view === 'projects' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(p => <ProjectCard key={p.id} project={p} stats={getStats(p.id)} onEdit={setEditProject} onDelete={deleteProject} />)}
          </div>
        ) : (
          <TaskBoard tasks={tasks} projects={projects} onEdit={setEditTask} onDelete={deleteTask} />
        )}

        {(showProjectForm || editProject) && (
          <ProjectForm
            project={editProject}
            onSave={editProject ? updateProject : addProject}
            onClose={() => { setShowProjectForm(false); setEditProject(null); }}
          />
        )}

        {(showTaskForm || editTask) && (
          <TaskForm
            task={editTask}
            projects={projects}
            onSave={editTask ? updateTask : addTask}
            onClose={() => { setShowTaskForm(false); setEditTask(null); }}
          />
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  const colors = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    purple: 'border-purple-500',
    orange: 'border-orange-500'
  };
  return (
    <div className={`bg-white p-6 rounded-xl shadow-md border-l-4 ${colors[color]}`}>
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

function ProjectCard({ project, stats, onEdit, onDelete }) {
  const days = project.deadline ? Math.ceil((new Date(project.deadline) - new Date()) / 86400000) : null;
  const statusColors = { planning: 'bg-purple-100 text-purple-700', active: 'bg-blue-100 text-blue-700', 'on-hold': 'bg-orange-100 text-orange-700', completed: 'bg-green-100 text-green-700' };
  const priorityColors = { high: 'bg-red-100 text-red-700 border-red-300', medium: 'bg-yellow-100 text-yellow-700 border-yellow-300', low: 'bg-green-100 text-green-700 border-green-300' };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border">
      <div className="flex justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{project.name}</h3>
          <p className="text-gray-600 text-sm mb-3">{project.description}</p>
          <div className="flex gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[project.status]}`}>{project.status}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${priorityColors[project.priority]}`}>{project.priority}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onEdit(project)} className="text-blue-600"><Edit2 size={18} /></button>
          <button onClick={() => onDelete(project.id)} className="text-red-600"><Trash2 size={18} /></button>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users size={16} />
          <span>{project.owner || 'Unassigned'}</span>
        </div>
        {project.deadline && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={16} className={days < 7 ? 'text-red-500' : ''} />
            <span className={days < 7 ? 'text-red-500 font-semibold' : 'text-gray-600'}>
              {days > 0 ? `${days} days left` : 'Overdue'}
            </span>
          </div>
        )}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span className="font-semibold">{stats.done}/{stats.total} tasks</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all" style={{ width: `${stats.pct}%` }} />
          </div>
          <div className="text-right text-xs text-gray-500 mt-1">{stats.pct}%</div>
        </div>
      </div>
    </div>
  );
}

function TaskBoard({ tasks, projects, onEdit, onDelete }) {
  const cols = { todo: 'To Do', 'in-progress': 'In Progress', review: 'Review', done: 'Done' };
  const priorityColors = { high: 'bg-red-100 text-red-700 border-red-300', medium: 'bg-yellow-100 text-yellow-700 border-yellow-300', low: 'bg-green-100 text-green-700 border-green-300' };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {Object.entries(cols).map(([status, label]) => (
        <div key={status} className="bg-gray-50 rounded-lg p-4 min-h-[400px]">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            {status === 'done' ? <CheckCircle2 size={18} /> : <Circle size={18} />}
            {label}
            <span className="ml-auto bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
              {tasks.filter(t => t.status === status).length}
            </span>
          </h3>
          <div className="space-y-3">
            {tasks.filter(t => t.status === status).map(task => {
              const proj = projects.find(p => p.id === task.projectId);
              return (
                <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-semibold text-gray-800 text-sm">{task.title}</h4>
                    <div className="flex gap-1">
                      <button onClick={() => onEdit(task)} className="text-blue-600"><Edit2 size={14} /></button>
                      <button onClick={() => onDelete(task.id)} className="text-red-600"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${priorityColors[task.priority]}`}>{task.priority}</span>
                    {proj && <span className="text-xs text-gray-500 truncate">{proj.name}</span>}
                  </div>
                  {task.assignee && (
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Users size={12} />
                      <span>{task.assignee}</span>
                    </div>
                  )}
                  {task.dueDate && (
                    <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                      <Clock size={12} />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function ProjectForm({ project, onSave, onClose }) {
  const [form, setForm] = useState(project || { name: '', description: '', deadline: '', owner: '', status: 'planning', priority: 'medium' });

  const handleSubmit = () => {
    if (!form.name) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{project ? 'Edit Project' : 'New Project'}</h2>
          <button onClick={onClose} className="text-gray-500"><X size={24} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Project Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="Enter project name" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg" rows="3" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})} className="w-full px-4 py-2 border rounded-lg">
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
              <select value={form.priority} onChange={(e) => setForm({...form, priority: e.target.value})} className="w-full px-4 py-2 border rounded-lg">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Owner</label>
              <input type="text" value={form.owner} onChange={(e) => setForm({...form, owner: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Deadline</label>
              <input type="date" value={form.deadline} onChange={(e) => setForm({...form, deadline: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={handleSubmit} className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2">
              <Save size={18} />
              {project ? 'Update' : 'Create'}
            </button>
            <button onClick={onClose} className="px-6 bg-gray-200 py-3 rounded-lg hover:bg-gray-300 font-semibold">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskForm({ task, projects, onSave, onClose }) {
  const [form, setForm] = useState(task || { title: '', projectId: '', assignee: '', status: 'todo', priority: 'medium', dueDate: '' });

  const handleSubmit = () => {
    if (!form.title || !form.projectId) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{task ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} className="text-gray-500"><X size={24} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Task Title *</label>
            <input type="text" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Project *</label>
            <select value={form.projectId} onChange={(e) => setForm({...form, projectId: parseInt(e.target.value)})} className="w-full px-4 py-2 border rounded-lg">
              <option value="">Select project</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})} className="w-full px-4 py-2 border rounded-lg">
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
              <select value={form.priority} onChange={(e) => setForm({...form, priority: e.target.value})} className="w-full px-4 py-2 border rounded-lg">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Assignee</label>
              <input type="text" value={form.assignee} onChange={(e) => setForm({...form, assignee: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
              <input type="date" value={form.dueDate} onChange={(e) => setForm({...form, dueDate: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={handleSubmit} className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold flex items-center justify-center gap-2">
              <Save size={18} />
              {task ? 'Update' : 'Create'}
            </button>
            <button onClick={onClose} className="px-6 bg-gray-200 py-3 rounded-lg hover:bg-gray-300 font-semibold">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
