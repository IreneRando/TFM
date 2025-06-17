import { createContext, useState } from 'react';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [medications, setMedications] = useState([]);

  return (
    <TaskContext.Provider value={{ tasks, setTasks, medications, setMedications }}>
      {children}
    </TaskContext.Provider>
  );
};
