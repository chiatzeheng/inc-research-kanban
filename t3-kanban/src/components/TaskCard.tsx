import { useEffect, useRef, useState } from "react";
import { Id, Task } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TrashIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
  columnColor: string;
}

function TaskCard({ task, deleteTask, updateTask, columnColor }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "Task", task },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  // whole section here is just to make sure textarea expands together with the text
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
    const target = event.target as HTMLTextAreaElement;
    target.style.height = "auto";
    target.style.height = `${target.scrollHeight}px`;
  };

  useEffect(() => {
    if (editMode && textAreaRef.current) {
      const textarea = textAreaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [editMode]);

  // end of section

  if (isDragging) {
    return (
      <div
        className=" bg-mainBackgroundColor relative flex min-h-[50px] cursor-grab items-center rounded-lg border-2 border-rose-500 p-4 text-left opacity-30 "
        ref={setNodeRef}
        style={style}
      />
    );
  }

  if (editMode) {
    return (
      <div
        className="relative flex h-auto cursor-grab items-center rounded-lg bg-white p-4 text-left text-black hover:ring-2 hover:ring-inset hover:ring-rose-500"
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      >
        <div
          className={
            "absolute top-0 -ml-4 -mt-1 flex h-6 w-full cursor-grab justify-center rounded-md "
          }
          {...attributes}
          {...listeners}
        >
          {/* remmeber to delete this */}
          {task.dateCreated.toISOString()}
          <EllipsisHorizontalIcon className="h-8 w-8 text-slate-300" />
        </div>
        <textarea
          ref={textAreaRef}
          onInput={handleInput}
          className="h-auto w-full resize-none rounded border-none bg-transparent px-2 py-1 text-black focus:outline-none "
          value={task.content}
          onClick={(e) => e.stopPropagation()}
          autoFocus
          placeholder="Task content here"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
              toggleEditMode();
            }
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className=""
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
      {/* h-[100px] min-h-[100px]  */}
      <div
        className="task relative flex items-center rounded-lg  bg-white p-4 text-left text-black hover:shadow-md hover:ring-0 "
        onClick={toggleEditMode}
      >
        <p className="my-auto h-auto w-full overflow-x-hidden whitespace-pre-wrap break-words  px-2 py-1 text-black">
          {task.content}
        </p>
        <div
          className={
            "absolute top-0 -ml-4 -mt-1 flex h-6 w-full cursor-grab justify-center rounded-md "
          }
          {...attributes}
          {...listeners}
        >
          <EllipsisHorizontalIcon className="h-8 w-8 text-slate-300" />
        </div>

        {mouseIsOver && (
          <button
            onClick={() => {
              deleteTask(task.id);
            }}
            className="bg-columnBackgroundColor -translate-y-1.2 absolute right-0 mr-3 opacity-60 hover:bg-black hover:bg-opacity-5 "
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default TaskCard;
