import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
let ai;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey: apiKey });
}

export async function getNextBestAction(tasks) {
  if (!tasks || tasks.length === 0) {
    return {
      advice: "You have no pending tasks. Great job! Take a break.",
      actions: []
    };
  }

  const prompt = `
    You are a proactive productivity agent. The user has the following tasks:
    ${JSON.stringify(tasks)}
    
    Based on the deadlines and priority, identify the absolute most important task to work on RIGHT NOW. 
    Provide a short, actionable piece of advice (max 3 sentences). 
    CRITICAL: For the most urgent or largest task, you MUST automatically break it down into 2 to 3 concrete subtasks.
    
    You MUST respond in valid JSON format matching this schema exactly:
    {
      "advice": "Your short string of advice to the user.",
      "actions": [
        {
          "type": "ADD_TASK",
          "title": "Subtask 1: [Actionable step]",
          "priority": "High",
          "deadline": "2026-06-30T12:00"
        },
        {
          "type": "ADD_TASK",
          "title": "Subtask 2: [Actionable step]",
          "priority": "Medium",
          "deadline": "2026-06-30T14:00"
        }
      ]
    }
  `;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
      });
      let resultText = response.text;
      // Remove markdown formatting if present
      if (resultText.startsWith('```json')) {
        resultText = resultText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      } else if (resultText.startsWith('```')) {
        resultText = resultText.replace(/^```\n?/, '').replace(/\n?```$/, '');
      }
      return JSON.parse(resultText);
    } catch (error) {
      console.error("Gemini API Error:", error);
      return getMockResponse(tasks);
    }
  } else {
    // Fallback if no API key is provided
    return getMockResponse(tasks);
  }
}

function getMockResponse(tasks) {
  const sortedTasks = [...tasks].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  const urgentTask = sortedTasks[0];
  
  return {
    advice: `The most urgent item is "${urgentTask.title}". I recommend breaking it down into smaller steps to get started immediately.`,
    actions: [
      {
        type: "ADD_TASK",
        title: `Start first draft for ${urgentTask.title}`,
        priority: "High",
        deadline: urgentTask.deadline
      }
    ]
  };
}
