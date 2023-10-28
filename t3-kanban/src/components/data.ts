import { Column, Task, Kanban } from "@/types";

export const defaultKanbans: Kanban[] = [
  {
    id: "kanban1",
    title: "Kanban 1",
  },
  {
    id: "kanban2",
    title: "Kanban 2",
  },
];

export const defaultCols: Column[] = [
  {
    id: "todo",
    title: "Todo",
    color: "bg-teal-100",
    textColor: "text-teal-800",
  },
  {
    id: "doing",
    title: "Work in progress",
    color: "bg-pink-100",
    textColor: "text-pink-800",
  },
  {
    id: "done",
    title: "Done",
    color: "bg-amber-100",
    textColor: "text-amber-800",
  },
];

export const defaultTasks: Task[] = [
  {
    id: "1",
    columnId: "todo",
    content: "List admin APIs for dashboard",
  },
  {
    id: "2",
    columnId: "todo",
    content:
      "Develop user registration functionality with OTP delivered on SMS after email confirmation and phone number confirmation",
  },
  {
    id: "3",
    columnId: "doing",
    content: "Conduct security testing",
  },
  {
    id: "4",
    columnId: "doing",
    content: "Analyze competitors",
  },
  {
    id: "5",
    columnId: "done",
    content: "Create UI kit documentation",
  },
  {
    id: "6",
    columnId: "done",
    content: "Dev meeting",
  },
  {
    id: "7",
    columnId: "done",
    content: "Deliver dashboard prototype",
  },
  {
    id: "8",
    columnId: "todo",
    content: "Optimize application performance",
  },
  {
    id: "9",
    columnId: "todo",
    content: "Implement data validation",
  },
  {
    id: "10",
    columnId: "todo",
    content: "Design database schema",
  },
  {
    id: "11",
    columnId: "todo",
    content: "Integrate SSL web certificates into workflow",
  },
  {
    id: "12",
    columnId: "doing",
    content: "Implement error logging and monitoring",
  },
  {
    id: "13",
    columnId: "doing",
    content: "Design and implement responsive UI",
  },
];
