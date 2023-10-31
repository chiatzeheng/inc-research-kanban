import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { Column, Id, Task } from "@/types";
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
        className=" mx-5 flex h-[500px] max-h-[500px]  w-72 flex-col rounded-3xl border-2 border-pink-500 bg-purple-100 opacity-40 "
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={
        "mx-5 flex h-[500px] max-h-[500px] w-72 flex-col rounded-3xl pt-2 shadow-md " +
        column.color
      }
    >
      {/* This is the column's header color  */}
      <div
        className={
          "text-md flex h-[60px] cursor-grab justify-between rounded-3xl p-3 font-bold " +
          column.color
        }
        {...attributes}
        {...listeners}
        // When column header is clicked, it will be editable
        onClick={() => {
          setEditMode(true);
        }}
      >
        <div className={`flex gap-2`}>
          <div
            className={`min-w-8 flex h-8 justify-center rounded-3xl px-2 py-1 text-sm text-gray-700 text-opacity-40`}
          >
            {tasks.length}
          </div>

          {/* When the column header is not being edited, show the title  */}
          {!editMode && (
            <span
              className={`block w-full break-all pt-1 ${column.textColor} `}
            >
              {!editMode && column.title}
            </span>
          )}

          {/* However when it is being edited, change the bg fo the text input */}
          {editMode && (
            <input
              className={
                "-ml-1 w-full rounded bg-gray-700 bg-opacity-5 px-1 outline-none " +
                column.textColor
              }
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
      <div className="flex flex-grow flex-col gap-4 overflow-y-auto overflow-x-hidden p-2">
        {/* This SortableContext is for the columnlist of task */}
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              columnColor={column.color}
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
        className="border-columnBackgroundColor border-x-columnBackgroundColor flex items-center gap-2 rounded-md p-4 font-semibold  text-black text-opacity-50 hover:bg-black hover:bg-opacity-5 hover:text-gray-700 active:bg-opacity-10"
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
