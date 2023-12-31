import { useMemo, useState, Fragment, useEffect } from "react";
import { api } from "@/utils/api";
// import { Column, Id, Task } from "@/types";
import type { Column, Kanban, Task } from "@prisma/client";
import ColumnContainer from "@/components/ColumnContainer";
import Layout from "@/components/Layout";
import Banner from "@/components/Banner";
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
import TaskCard from "@/components/TaskCard";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  BarsArrowDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { defaultCols, defaultTasks } from "@/components/data";
import SearchBarModal from "@/components/SearchBarModal";
import { Menu, Transition } from "@headlessui/react";
import { cornersOfRectangle } from "@dnd-kit/core/dist/utilities/algorithms/helpers";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

function KanbanBoard() {
  // const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  // const [columns, setColumns] = useState<Column[]>(defaultCols);
  //Col is active only when it is being moved. activeColumn is a Column type which contains the id and title
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  //Task is active only when it is being moved. activeTask is a Task type which contains the id, columnId, content
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [ifFiltered, setIfFiltered] = useState<boolean>(false);
  const [ifSort, setIfSort] = useState<boolean>(false);
  const {
    mutate: addTaskMutate,
    isLoading: isAddingLoading,
    isError: isAddingError,
  } = api.task.addTask.useMutation();

  // Use the updateTask mutation
  const {
    mutate: updateTaskMutate,
    isLoading: isUpdatingLoading,
    isError: isUpdatingError,
  } = api.task.updateTask.useMutation();

  const {
    mutate: deleteTaskMutate,
    isLoading: isDeleting,
    isError: isDeleteError,
  } = api.task.deleteTask.useMutation();

  const {
    mutate: addColumnMutate,
    isLoading: isAddingColumnLoading,
    isError: isAddingColumnError,
  } = api.column.addColumn.useMutation();
  const {
    mutate: deleteColumnMutate,
    isLoading: isDeleteColumnLoading,
    isError: isDeleteColumnError,
  } = api.column.deleteColumn.useMutation();

  // Defines the user interaction criteria to activate the Pointer Sensor
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // Minimum distance for activation
      },
    }),
  );

  //remove this hard coded id aft stuff gets sorted out
  const kanbanId = "clogwxon60000ftv8wra099a2";
  const {
    data: kanbanData,
    isLoading: kanbanIsLoading,
    isError: kanbanIsError,
  } = api.kanban.getById.useQuery({ id: kanbanId });
  console.log(kanbanData);
  const allTasks = (kanbanData?.columns || []).flatMap(
    (column) => column.tasks || [],
  );

  const [columns, setColumns] = useState<Column[]>(kanbanData?.columns || []);
  const [tasks, setTasks] = useState<Task[]>(allTasks || []);

  useEffect(() => {
    if (kanbanData) {
      setColumns(kanbanData.columns || []);
      const newTasks = kanbanData.columns.reduce<Task[]>(
        (acc, column) => [...acc, ...column.tasks],
        [],
      );
      setTasks(newTasks);
    }
  }, [kanbanData]);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  useEffect(() => {
    // if (query.trim().length === 0 || query === undefined) {
    //   setIfFiltered(false);
    //   return setTasks(defaultTasks);
    // } else {
    //   const filteredTasks = tasks.filter((task) =>
    //     task.content.toLowerCase().includes(query.toLowerCase()),
    //   );
    //   setIfFiltered(true);
    //   return setTasks(filteredTasks);
    // }
  }, [query]);

  function sortTasks(type: string) {
    // let sortedTasks;
    // switch (type) {
    //   case "Latest Update":
    //     sortedTasks = [...tasks].sort(
    //       (a: Task, b: Task) =>
    //         b.dateCreated.getTime() - a.dateCreated.getTime(),
    //     );
    //     setTasks(sortedTasks);
    //     break;
    //   case "A-Z":
    //     sortedTasks = [...tasks].sort((a, b) =>
    //       a.content.localeCompare(b.content),
    //     );

    //     console.log("hello");
    //     setTasks(sortedTasks);

    //     break;

    //   default:
    //     break;
    // }
    setIfSort(true);
  }
  function sortColumns(type: string) {
    // let sortedColumns;

    // switch (type) {
    //   case "A-Z":
    //     sortedColumns = [...columns].sort((a: Column, b: Column) =>
    //       a.title.localeCompare(b.title),
    //     );
    //     setColumns(sortedColumns);
    //     break;

    //   case "Most Tasks":
    //     const columnTaskCounts = columns.map((column) => {
    //       const taskCount = tasks.filter(
    //         (task) => task.columnId === column.id,
    //       ).length;

    //       return {
    //         ...column,
    //         taskCount,
    //       };
    //     });

    //     const columnsSortedByTaskCount = [...columnTaskCounts].sort(
    //       (a, b) => b.taskCount - a.taskCount,
    //     );

    //     setColumns(columnsSortedByTaskCount);

    //     break;
    //   default:
    //     break;
    // }
    setIfSort(true);
  }
  function createTask(column: Column) {
    const newTempTask = {
      columnId: column.id,
      title: "Untitled",
      taskContentText: "",
    };
    addTaskMutate(newTempTask, {
      onSuccess: (task) => {
        setTasks((currentTasks) => [...currentTasks, task]);
      },
      onError: (error) => {
        console.error("Error creating card:", error);
      },
    });
  }
  function deleteColumn(column: Column) {
    // const filteredColumns = columns.filter((col) => col.id !== id);
    // setColumns(filteredColumns);
    let columnID = column.id;
    deleteColumnMutate(
      { id: column.id },
      {
        onSuccess: () => {
          // Remove the task from the local state as well
          setColumns((currentColumns) =>
            currentColumns.filter((column) => column.id !== columnID),
          );
          console.log("Deleted Column");
        },
        onError: (error) => {
          console.error("Error deleting task:", error);
        },
      },
    );
  }

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

  function deleteTask(task: Task) {
    let taskId = task.id;
    deleteTaskMutate(
      { id: taskId },
      {
        onSuccess: () => {
          // Remove the task from the local state as well
          setTasks((currentTasks) =>
            currentTasks.filter((task) => task.id !== taskId),
          );
          console.log("Deleted Task");
        },
        onError: (error) => {
          console.error("Error deleting task:", error);
        },
      },
    );
  }

  return (
    <Layout>
      <div className="m-auto flex min-h-screen w-10/12 flex-col p-4">
        <Banner />
        {/* provider makes use of the React Context API to share data between draggable and droppable components and hooks. */}
        <div className="my-5 flex justify-end gap-4">
          {ifSort && (
            <button
              // onClick={() => {
              //   setColumns(defaultCols);
              //   setTasks(defaultTasks);
              //   setIfSort(false);
              // }}
              className="-mr-5 flex items-center rounded-lg font-semibold text-gray-400 hover:bg-slate-100 hover:text-gray-600 focus:outline-none"
            >
              <XMarkIcon className="m-2 h-6 w-6 text-gray-500" />
            </button>
          )}
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="flex items-center rounded-lg px-2 font-semibold text-gray-400 hover:bg-slate-100 hover:text-gray-600 focus:outline-none ">
                <span className="sr-only">Open filter options</span>
                Sort By:{" "}
                <BarsArrowDownIcon className="m-2 h-6 w-6  text-gray-500 " />
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "flex w-full justify-start px-4 py-2 text-sm",
                        )}
                        onClick={() => sortTasks("Latest Update")}
                      >
                        Tasks: Latest Update
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "flex w-full justify-start px-4 py-2 text-sm",
                        )}
                        onClick={() => sortTasks("A-Z")}
                      >
                        Tasks: A-Z
                      </button>
                    )}
                  </Menu.Item>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "flex w-full justify-start px-4 py-2 text-sm",
                        )}
                        onClick={() => sortColumns("A-Z")}
                      >
                        Columns: A-Z
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "flex w-full justify-start px-4 py-2 text-sm",
                        )}
                        onClick={() => sortColumns("Most Tasks")}
                      >
                        Columns: Most Tasks
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>

          <button
            onClick={() => {
              if (ifFiltered) {
                setIfFiltered(false), setTasks(defaultTasks);
              }

              setOpenSearch(true);
            }}
            className="outline:none flex items-center rounded-md hover:bg-slate-100 hover:shadow-sm focus:outline-none"
          >
            {ifFiltered ? (
              <XMarkIcon className="m-2 h-6 w-6 text-gray-500" />
            ) : (
              <MagnifyingGlassIcon className="m-2 h-6 w-6 text-gray-500" />
            )}
          </button>
        </div>

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
          <div className="mx-0 gap-2 sm:mx-auto md:mx-auto">
            <div className="grid grid-cols-4 gap-4 sm:grid-cols-1 md:grid-cols-2 mmd:grid-cols-3 lg:grid-cols-4">
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
              {/* Button to add a new column */}
              <button
                className=" bg-mainBackgroundColor border-columnBackgroundColor mx-5 grid h-[500px] max-h-[500px] w-72 cursor-pointer place-content-center gap-2 rounded-lg bg-slate-200 p-4 shadow-md transition duration-150 ease-in-out hover:bg-slate-100 hover:text-slate-500 hover:shadow-lg active:bg-slate-400 active:text-slate-200 active:shadow-inner "
                onClick={() => {
                  createNewColumn();
                }}
              >
                <PlusIcon className="h-[100px] w-[100px]" />
              </button>
            </div>
          </div>

          {/*
            Display a visual overlay for draggable items during drag operations.
            When an item is being dragged, it visually indicates that it can be moved out of its container.
            This overlay helps users understand where the item can be placed when dropped.
          */}
          {typeof document !== "undefined" &&
            createPortal(
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
                      (task) => task.columnId === activeColumn.id,
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
              document.body,
            )}
        </DndContext>
      </div>
      <SearchBarModal
        open={openSearch}
        setOpen={setOpenSearch}
        query={query}
        setQuery={setQuery}
      />
    </Layout>
  );

  // CUD OF TASKS =======================================================================================================

  // Creates a new task and adds it to the list of tasks.
  // function createTask(columnId: Id) {
  //   // Generate a unique task ID and initialize a new task object.
  //   const newTask: Task = {
  //     // id: generateId(), // Generate a unique ID (random number) for the task.
  //     columnId, // Associate the task with the specified column.
  //     taskContent: `Task ${tasks.length + 1}`, //Default task
  //     createdAt: new Date(),
  //   };

  //   // adds new task to the lisat
  //   setTasks([...tasks, newTask]);
  // }

  // Deletes a task with the specified ID from the list of tasks.
  // function deleteTask(id: Id) {
  //   // Create a new array of tasks, excluding the task with the given ID.
  //   const newTasks = tasks.filter((task) => task.id !== id);

  //   // Update the tasks state with the new array, effectively removing the task.
  //   setTasks(newTasks);
  // }

  // Update the content of a task
  // function updateTask(id: Id, content: string) {
  //   // Create a new array of tasks, where the task with the given ID is updated with new content.
  //   const newTasks = tasks.map((task) => {
  //     // checks if the current task is not the one that needs to be updated.

  //     if (task.id !== id) {
  //       return task;
  //     } else {
  //       if (task.content === content) return task;
  //       task.dateCreated = new Date();
  //       return { ...task, content };
  //     }
  //   });

  //   // Update the tasks state with the modified task list.
  //   setTasks(newTasks);
  // }

  // =====================================================================================================================
  // CRUD OF COLS  =======================================================================================================

  //Creates a new col and adds it to the list of cols.
  function createNewColumn() {
    //  let newColumn = getColumnColors(columns[columns.length - 1]); //shows latest column color so color doesnt get matched twice

    const columnToAdd = {
      title: `Column ${columns.length + 1}`,
      kanbanId: kanbanId,
    };
    addColumnMutate(columnToAdd, {
      onSuccess: (column) => {
        setColumns((currentColumns) => [...currentColumns, column]);
      },
      onError: (error) => {
        console.error("Error creating card:", error);
      },
    });
  }

  //deletes both col with a certain id but also deletes the tasks associated with it

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

  // Handles what happens after you drop an item
  function onDragEnd(event: DragEndEvent) {
    //reset column and task
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;

    // if over is false, that means draggable has not dropped on valid droppables
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // If the active and over elements have the same ID, no action is needed
    if (activeId === overId) return;

    // Check if the active element is a column. if not, return
    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    console.log("DRAG END");

    // Update the state of 'columns' by moving the active column to the position of 'over' column
    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  // Handles what happens when an item is dragged over a droppable column
  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    console.log(active);
    console.log(over);
    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";
    const isOverAColumn = over.data.current?.type === "Column";

    // Dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        // If tasks belong to different columns
        if (tasks[activeIndex]!.columnId !== tasks[overIndex]!.columnId) {
          tasks[activeIndex]!.columnId = tasks[overIndex]!.columnId;
        }
        // if (tasks[activeIndex]!.columnId !== tasks[overIndex].columnId) {
        //   tasks[activeIndex]!.columnId = tasks[overIndex].columnId;
        // }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    // Dropping a Task over a Column
    else if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const lastIndexInColumn = tasks.reduce((lastIndex, task, index) => {
          if (task.columnId === overId) {
            return index;
          }
          return lastIndex;
        }, -1);

        // If tasks belong to different columns

        if (tasks[activeIndex]!.columnId !== overId) {
          tasks[activeIndex]!.columnId = overId;
        }

        return arrayMove(tasks, activeIndex, lastIndexInColumn + 1);
      });
    }
  }
}

// =====================================================================================================================

// function generateId() {
//   /* Generate a random number between 0 and 10000 */
//   return Math.floor(Math.random() * 10001);
// }

// =========================================================================
// This is to generate a color for each columns  (not used??)

export default KanbanBoard;
