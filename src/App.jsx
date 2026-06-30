import { useState, useEffect } from 'react'
import { Clock, Plus, Zap, CheckCircle2, Bot, Target, BarChart2, ChevronDown } from 'lucide-react'
import { getNextBestAction } from './ai'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Submit Hackathon Project', deadline: '2026-06-30T23:59', priority: 'High', status: 'pending' },
    { id: 2, title: 'Review Code', deadline: '2026-06-30T20:00', priority: 'Medium', status: 'pending' }
  ])
  const [aiResponse, setAiResponse] = useState({ advice: "NEXUS Core is analyzing your schedule...", actions: [] })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDeadline, setNewTaskDeadline] = useState("")
  const [newTaskPriority, setNewTaskPriority] = useState("Medium")
  const [focusMode, setFocusMode] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const fetchAiAdvice = async () => {
      setIsAnalyzing(true);
      try {
        const response = await getNextBestAction(tasks);
        setAiResponse(response);
      } catch (e) {
        setAiResponse({ advice: "NEXUS Core offline. Could not fetch AI advice.", actions: [] });
      }
      setIsAnalyzing(false);
    };
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
        id: Date.now() + Math.random(),
        title: action.title,
        deadline: action.deadline,
        priority: action.priority || 'Medium',
        status: 'pending'
      };
      setTasks(prev => [...prev, newTask]);
      
      setAiResponse(prev => ({
        ...prev,
        actions: prev.actions.filter(a => a.title !== action.title)
      }));
    }
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Derived stats
  const highPriorityCount = tasks.filter(t => t.priority === 'High').length;
  
  // Sort tasks by deadline for rendering
  const sortedTasks = [...tasks].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  const displayedTasks = focusMode && sortedTasks.length > 0 ? [sortedTasks[0]] : sortedTasks;

  return (
    <>
      <div className="bg-glow-1"></div>
      <div className="bg-glow-2"></div>
      <div className="bg-glow-3"></div>
      
      <div className="app-container">
      <header className="header animate-slide-up">
        <div className="logo" style={{ textTransform: 'uppercase', letterSpacing: '2px', textShadow: 'var(--glow-primary)' }}>
          <Zap size={32} />
          <span className="logo-text">NEXUS</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="glass" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart2 size={18} color="var(--primary)" />
            <span style={{ fontSize: '0.9rem' }}>{tasks.length} Active | {highPriorityCount} High</span>
          </div>
          <button 
            onClick={() => setFocusMode(!focusMode)} 
            className="btn btn-ghost" 
            style={{ border: focusMode ? '1px solid var(--primary)' : '1px solid transparent', color: focusMode ? 'var(--primary)' : 'inherit' }}
          >
            <Target size={18} />
            {focusMode ? 'Exit Focus Mode' : 'Focus Mode'}
          </button>
        </div>
      </header>

      <main className="main-grid">
        <section className="task-section animate-slide-up" style={{ animationDelay: '0.1s' }}>
          
          {!focusMode && (
            <div className="glass glass-panel" style={{ borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ marginBottom: '1rem' }}>Initiate New Directive</h3>
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
                <div className="custom-select-container">
                  <div 
                    className={`custom-select-display ${dropdownOpen ? 'open' : ''}`}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <span>{newTaskPriority} Priority</span>
                    <ChevronDown size={18} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                  </div>
                  {dropdownOpen && (
                    <div className="custom-select-options">
                      {['High', 'Medium', 'Low'].map(p => (
                        <div 
                          key={p}
                          className="custom-select-option"
                          onClick={() => {
                            setNewTaskPriority(p);
                            setDropdownOpen(false);
                          }}
                        >
                          {p} Priority
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button type="submit" className="btn btn-primary" style={{ flex: '0 0 auto' }}>
                  <Plus size={18} /> Add
                </button>
              </form>
            </div>
          )}

          <h2 style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {focusMode ? 'Primary Target Acquired' : 'Active Directives'}
          </h2>
          
          <div className="task-list">
            {displayedTasks.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>All clear. System idling.</p>
            ) : displayedTasks.map((task, idx) => (
              <div 
                key={task.id} 
                className="glass glass-panel" 
                style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem',
                  border: focusMode ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: focusMode ? 'var(--glow-primary)' : 'none',
                  transform: focusMode ? 'scale(1.02)' : 'none',
                  transition: 'all 0.3s ease'
                }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: focusMode ? '1.5rem' : '1.1rem', color: focusMode ? 'var(--primary)' : 'inherit' }}>{task.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    Deadline: {new Date(task.deadline).toLocaleString()}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '999px', 
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    backgroundColor: task.priority === 'High' ? 'rgba(255, 0, 85, 0.15)' : task.priority === 'Medium' ? 'rgba(255, 170, 0, 0.15)' : 'rgba(0, 255, 170, 0.15)',
                    color: task.priority === 'High' ? 'var(--danger)' : task.priority === 'Medium' ? 'var(--warning)' : 'var(--success)',
                    border: `1px solid ${task.priority === 'High' ? 'var(--danger)' : task.priority === 'Medium' ? 'var(--warning)' : 'var(--success)'}`
                  }}>
                    {task.priority}
                  </span>
                  <button onClick={() => removeTask(task.id)} className="btn btn-ghost" style={{ padding: '0.5rem', color: 'var(--text-muted)' }} title="Mark complete">
                    <CheckCircle2 size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="ai-section animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="glass glass-panel pulse-border" style={{ position: 'sticky', top: '2rem', borderTop: '2px solid var(--primary)' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', textShadow: 'var(--glow-primary)' }}>
              <Bot size={24} />
              NEXUS Core
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Proactive Intelligence Engine Online.
            </p>
            <div style={{ padding: '1.5rem', backgroundColor: 'rgba(0, 240, 255, 0.05)', borderRadius: '12px', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
              <h4 style={{ color: 'var(--primary)', marginBottom: '0.75rem', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Analysis</h4>
              
              {isAnalyzing ? (
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--primary)' }}>
                  <Bot className="animate-spin" size={18} />
                  Processing vectors...
                </div>
              ) : (
                <>
                  <p style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: '1rem', color: 'var(--text-main)' }}>
                    {aiResponse.advice}
                  </p>
                  
                  {aiResponse.actions && aiResponse.actions.length > 0 && (
                    <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(0,240,255,0.2)', paddingTop: '1rem' }}>
                      <p style={{ fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Recommended Actions:</p>
                      {aiResponse.actions.map((action, idx) => (
                        <button 
                          key={idx} 
                          className="btn btn-primary" 
                          style={{ width: '100%', marginBottom: '0.5rem', fontSize: '0.85rem', justifyContent: 'flex-start' }}
                          onClick={() => executeAiAction(action)}
                        >
                          <Plus size={16} />
                          {action.type === 'ADD_TASK' ? `Breakdown: ${action.title}` : 'Execute'}
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
    </>
  )
}

export default App
