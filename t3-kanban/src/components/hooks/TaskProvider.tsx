import React, { createContext, useContext, useState, ReactNode } from "react";
import { Task } from "@/types";
import { api } from "@/utils/api";

// Create a context for the theme
interface TaskContextType {
  tasks: Task[];
  updateTask: (
    task: Task,
    changes: { title?: string; taskContentText?: string },
  ) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
}

export function TaskProvider({ children }: TaskProviderProps) {
  const [tasks, setTasks] = useState<Task[]>(allTasks || []);

  // Use the updateTask mutation
  const {
    mutate: updateTaskMutate,
    isLoading: isUpdatingLoading,
    isError: isUpdatingError,
  } = api.task.updateTask.useMutation();

  function updateTask(
    task: Task,
    changes: { title?: string; taskContentText?: string },
  ) {
    updateTaskMutate(
      {
        id: task.id,
        ...changes,
      },
      {
        onSuccess: (updatedTaskData) => {
          // Handle the updated task. For example, you could refresh your tasks list or update local state
          console.log("Task updated successfully");
          function updateTaskInArray(tasks: Task[], updatedTaskData: any) {
            return tasks.map((task: Task) => {
              if (task.id === updatedTaskData.id) {
                // Found the matching task, return a new object with the updated information
                return {
                  ...task,
                  ...updatedTaskData,
                };
              }
              // This isn't the task we're looking for, so we return the original
              return task;
            });
          }

          setTasks((currentTasks) =>
            updateTaskInArray(currentTasks, updatedTaskData),
          );
        },
        onError: (error) => {
          // Handle the error case
          console.error("Error updating task:", error);
          // Update the UI to show an error message if needed
        },
      },
    );
  }
  return (
    <TaskContext.Provider value={{ tasks, updateTask }}>
      {children}
    </TaskContext.Provider>
  );
}

// Custom hook to access the task context
export function useTheme() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTask must be within a");
  }
  return context;
}

// function App() {
//   return (
//     <ThemeProvider>
//       <MainContent />
//     </ThemeProvider>
//   );
// }

// function MainContent() {
//   const { theme, toggleTheme } = useTheme();

//   return (
//     <div className={`App ${theme}`}>
//       <h1>Theme Switcher</h1>
//       <button onClick={toggleTheme}>Toggle Theme</button>
//     </div>
//   );
// }

// export default App;
