import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { Column, Id, Task } from "../types";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import TaskCard from "./TaskCard";

// Component: ColumnContainer
// This component represents a single column in a Kanban board.
// It allows for column title editing, task management, and sorting.

// Interface so that the props passed in needs to have all these properties
interface Props {
  // the property column is found in types.ts, the rest are mostly functions
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  updateTask: (id: Id, content: string) => void;
  deleteTask: (id: Id) => void;
  tasks: Task[];
}

const getColumnColors = (): string => {
  const columnColors: string[] = ["bg-teal-200", "bg-pink-200", "bg-amber-200"];
  const colorIndex: number = Math.floor(Math.random() * 2);

  return columnColors[colorIndex];
};

//These props will be found in KanbanBoard
function ColumnContainer({
  column,
  deleteColumn,
  updateColumn,
  createTask,
  tasks,
  deleteTask,
  updateTask,
}: Props) {
  const [editMode, setEditMode] = useState(false);

  // Memoize the array of task IDs by mapping the tasks array
  // This ensures the IDs are recalculated only when tasks change.
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    // This configures the useSortable hook for columns, not draggables.
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  // When the column container is being dragged, highlight the it's estimated position
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className=" bg-purple-100 opacity-40 border-2 border-pink-500 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col "
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className=" bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-3xl flex flex-col"
    >
    {/* This is the column's header color  */}
      <div
        className=" text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between "
        {...attributes}
        {...listeners}
        // When column header is clicked, it will be editable
        onClick={() => {
          setEditMode(true);
        }}
      >

        <div className="flex gap-2">
          <div className=" flex justify-center items-center bg-columnBackgroundColor px-2 py-1 text-sm rounded-full ">
            0
          </div>

          {/* When the column header is not being edited, show the title  */}
          {!editMode && column.title}

          {/* However when it is being edited, change the bg fo the text input */}
          {editMode && (
            <input
              className="bg-black focus:border-rose-500 border rounded outline-none px-2"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => {
                setEditMode(false);
              }}
              // Exit edit mode when the Enter key is pressed
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>

        {/* Column Deletion*/}
        <button
          className="rounded px-1 py-2 "
          onClick={() => {
            deleteColumn(column.id);
          }}
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Column task container */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        {/* This SortableContext is for the columnlist of task */}
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
      {/* Column footer */}
      <button
        className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black"
        onClick={() => {
          createTask(column.id);
        }}
      >
        <PlusIcon className="h-5 w-5" />
        Add task
      </button>
    </div>
  );
}

export default ColumnContainer;
