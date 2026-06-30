import { useState, useEffect } from 'react'
import { Clock, Plus, Zap, CheckCircle2, Bot } from 'lucide-react'
import { getNextBestAction } from './ai'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Submit Hackathon Project', deadline: '2026-06-30T23:59', priority: 'High', status: 'pending' },
    { id: 2, title: 'Review Code', deadline: '2026-06-30T20:00', priority: 'Medium', status: 'pending' }
  ])
  const [aiResponse, setAiResponse] = useState({ advice: "Analyzing your tasks...", actions: [] })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDeadline, setNewTaskDeadline] = useState("")
  const [newTaskPriority, setNewTaskPriority] = useState("Medium")

  useEffect(() => {
    const fetchAiAdvice = async () => {
      setIsAnalyzing(true);
      try {
        const response = await getNextBestAction(tasks);
        setAiResponse(response);
      } catch (e) {
        setAiResponse({ advice: "Could not fetch AI advice at this time.", actions: [] });
      }
      setIsAnalyzing(false);
    };
    // Debounce slightly to avoid spamming API on every keystroke/task change
    const timer = setTimeout(() => {
      fetchAiAdvice();
    }, 1000);
    return () => clearTimeout(timer);
  }, [tasks]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle || !newTaskDeadline) return;
    
    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      deadline: newTaskDeadline,
      priority: newTaskPriority,
      status: 'pending'
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    setNewTaskDeadline("");
    setNewTaskPriority("Medium");
  };

  const executeAiAction = (action) => {
    if (action.type === 'ADD_TASK') {
      const newTask = {
        id: Date.now(),
        title: action.title,
        deadline: action.deadline,
        priority: action.priority || 'Medium',
        status: 'pending'
      };
      setTasks([...tasks, newTask]);
      
      // Remove the executed action from the suggestions
      setAiResponse(prev => ({
        ...prev,
        actions: prev.actions.filter(a => a.title !== action.title)
      }));
    }
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="app-container">
      <header className="header animate-slide-up">
        <div className="logo">
          <Clock size={28} />
          The Last-Minute Life Saver
        </div>
      </header>

      <main className="main-grid">
        <section className="task-section animate-slide-up" style={{ animationDelay: '0.1s' }}>
          
          <div className="glass glass-panel">
            <h3 style={{ marginBottom: '1rem' }}>Add New Task</h3>
            <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <input 
                className="input" 
                style={{ flex: '1 1 100%' }}
                placeholder="Task title..." 
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                required
              />
              <input 
                type="datetime-local" 
                className="input" 
                style={{ flex: 1 }}
                value={newTaskDeadline}
                onChange={(e) => setNewTaskDeadline(e.target.value)}
                required
              />
              <select 
                className="input" 
                style={{ flex: 1 }}
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
              <button type="submit" className="btn btn-primary" style={{ flex: '0 0 auto' }}>
                <Plus size={18} /> Add
              </button>
            </form>
          </div>

          <h2 style={{ marginTop: '2rem' }}>Your Tasks</h2>
          <div className="task-list">
            {tasks.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>All caught up! No active tasks.</p>
            ) : tasks.map(task => (
              <div key={task.id} className="glass glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{task.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    Deadline: {new Date(task.deadline).toLocaleString()}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '999px', 
                    fontSize: '0.8rem',
                    backgroundColor: task.priority === 'High' ? 'rgba(239, 68, 68, 0.2)' : task.priority === 'Medium' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    color: task.priority === 'High' ? 'var(--danger)' : task.priority === 'Medium' ? 'var(--warning)' : 'var(--success)'
                  }}>
                    {task.priority}
                  </span>
                  <button onClick={() => removeTask(task.id)} className="btn btn-ghost" style={{ padding: '0.5rem', color: 'var(--text-muted)' }} title="Mark complete">
                    <CheckCircle2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="ai-section animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="glass glass-panel" style={{ position: 'sticky', top: '2rem' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
              <Zap size={24} />
              AI Coach
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Your proactive assistant is managing your schedule.
            </p>
            <div style={{ padding: '1.5rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
              <h4 style={{ color: 'var(--primary)', marginBottom: '0.75rem', fontSize: '1.1rem' }}>Next Best Action</h4>
              
              {isAnalyzing ? (
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--text-muted)' }}>
                  <Bot className="animate-spin" size={18} />
                  Analyzing tasks...
                </div>
              ) : (
                <>
                  <p style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                    {aiResponse.advice}
                  </p>
                  
                  {aiResponse.actions && aiResponse.actions.length > 0 && (
                    <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Suggested Automations:</p>
                      {aiResponse.actions.map((action, idx) => (
                        <button 
                          key={idx} 
                          className="btn btn-primary" 
                          style={{ width: '100%', marginBottom: '0.5rem', fontSize: '0.9rem' }}
                          onClick={() => executeAiAction(action)}
                        >
                          <Plus size={16} />
                          {action.type === 'ADD_TASK' ? `Add Task: ${action.title}` : 'Execute Action'}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
