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
    dateCreated: new Date(2020, 0o1, 0o2, 10, 30, 0, 0),
  },
  {
    id: "2",
    columnId: "todo",
    content:
      "Develop user registration functionality with OTP delivered on SMS after email confirmation and phone number confirmation",
    dateCreated: new Date(2020, 0o3, 0o2, 10, 30, 0, 0),
  },
  {
    id: "3",
    columnId: "doing",
    content: "Conduct security testing",
    dateCreated: new Date(2021, 0o1, 0o3, 10, 30, 0, 0),
  },
  {
    id: "4",
    columnId: "doing",
    content: "Analyze competitors",
    dateCreated: new Date(2020, 0o1, 0o6, 10, 30, 0, 0),
  },
  {
    id: "5",
    columnId: "done",
    content: "Create UI kit documentation",
    dateCreated: new Date(2020, 0o1, 0o5, 10, 30, 0, 0),
  },
  {
    id: "6",
    columnId: "done",
    content: "Dev meeting",
    dateCreated: new Date(2020, 0o1, 0o7, 10, 30, 0, 0),
  },
  {
    id: "7",
    columnId: "done",
    content: "Deliver dashboard prototype",
    dateCreated: new Date(2020, 0o1, 8, 10, 30, 0, 0),
  },
  {
    id: "8",
    columnId: "todo",
    content: "Optimize application performance",
    dateCreated: new Date(2020, 0o1, 9, 10, 30, 0, 0),
  },
  {
    id: "9",
    columnId: "todo",
    content: "Implement data validation",
    dateCreated: new Date(2020, 0o2, 0o2, 10, 30, 0, 0),
  },
  {
    id: "10",
    columnId: "todo",
    content: "Design database schema",
    dateCreated: new Date(2020, 0o2, 0o5, 10, 30, 0, 0),
  },
  {
    id: "11",
    columnId: "todo",
    content: "Integrate SSL web certificates into workflow",
    dateCreated: new Date(2020, 0o1, 12, 10, 30, 0, 0),
  },
  {
    id: "12",
    columnId: "doing",
    content: "Implement error logging and monitoring",
    dateCreated: new Date(2020, 0o1, 13, 10, 30, 0, 0),
  },
  {
    id: "13",
    columnId: "doing",
    content: "Design and implement responsive UI",
    dateCreated: new Date(2020, 0o1, 14, 10, 30, 0, 0),
  },
];
