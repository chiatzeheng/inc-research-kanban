import { useMemo, useState } from "react";
import { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import { PlusIcon } from "@heroicons/react/24/outline";
import { defaultCols, defaultTasks } from "./data";

function KanbanBoard() {

  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [tasks, setTasks] = useState<Task[]>(defaultTasks);

  //Col is active only when it is being moved. activeColumn is a Column type which contains the id and title
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  //Task is active only when it is being moved. activeTask is a Task type which contains the id, columnId, content
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Defines the user interaction criteria to activate the Pointer Sensor
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // Minimum distance for activation
      },
    })
  );


  return (
    <div className="bg-blue-100 m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px] ">

      {/* provider makes use of the React Context API to share data between draggable and droppable components and hooks. */}
      <DndContext
        //sensors help dnd detect user interaction
        sensors={sensors}

        //when activation constraints declared in the sensors are triggered
        onDragStart={onDragStart}

        //Draggable item dropped
        onDragEnd={onDragEnd}

        //draggable item is held over a droppable container
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </div>
          <button
            className=" h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2 flex gap-2 "
            onClick={() => {
              createNewColumn();
            }}
          >
            <PlusIcon className="h-5 w-5" />
            Add Column
          </button>
        </div>

        {/*
          Display a visual overlay for draggable items during drag operations.
          When an item is being dragged, it visually indicates that it can be moved out of its container.
          This overlay helps users understand where the item can be placed when dropped.
        */}
        {createPortal(
          <DragOverlay>
            {/* When a col is being dragged, make sure that a task's columnId updates accordingly and display it */}
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {/* Display the active task when it's being dragged */}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );

// CUD OF TASKS =======================================================================================================

  // Creates a new task and adds it to the list of tasks. 
  function createTask(columnId: Id) {
    // Generate a unique task ID and initialize a new task object.
    const newTask: Task = {
      id: generateId(), // Generate a unique ID (random number) for the task.
      columnId, // Associate the task with the specified column.
      content: `Task ${tasks.length + 1}`, //Default task
    };

    // adds new task to the lisat
    setTasks([...tasks, newTask]);
  }

  // Deletes a task with the specified ID from the list of tasks.
  function deleteTask(id: Id) {
    // Create a new array of tasks, excluding the task with the given ID.
    const newTasks = tasks.filter((task) => task.id !== id);

    // Update the tasks state with the new array, effectively removing the task.
    setTasks(newTasks);
  }

// Update the content of a task 
function updateTask(id: Id, content: string) {
  // Create a new array of tasks, where the task with the given ID is updated with new content.
  const newTasks = tasks.map((task) => {
     // checks if the current task is not the one that needs to be updated.
    if (task.id !== id) return task;
    return { ...task, content };
  });

  // Update the tasks state with the modified task list.
  setTasks(newTasks);
}


// =====================================================================================================================
// CRUD OF COLS  =======================================================================================================

 //Creates a new col and adds it to the list of cols. 
  function createNewColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  }

  //deletes both col with a certain id but also deletes the tasks associated with it
  function deleteColumn(id: Id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);

    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
  }

  function updateColumn(id: Id, title: string) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    setColumns(newColumns);
  }

// =====================================================================================================================
// EVENT HANDLING  =====================================================================================================

  // Handle the start of a drag operation.
  function onDragStart(event: DragStartEvent) {
    // Check if the dragged item is a column or a task
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    console.log("DRAG END");

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          // Fix introduced after video recording
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;
        console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}

// =====================================================================================================================

function generateId() {
  /* Generate a random number between 0 and 10000 */
  return Math.floor(Math.random() * 10001);
}

export default KanbanBoard;
