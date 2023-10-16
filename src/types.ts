export type Id = string | number;

export type Column = {
  id: Id;
  title: string;
  color?: "bg-slate-300"
};

export type Task = {
  id: Id;
  columnId: Id;
  content: string;
};