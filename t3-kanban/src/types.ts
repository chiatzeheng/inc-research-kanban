export type Id = string | number;

export type Column = {
  id: Id;
  title: string;
  color: string;
  textColor: string;
};

export type Task = {
  id: Id;
  columnId: Id;
  content: string;
  dateCreated: Date;
};

export type Kanban = {
  id: Id;
  title: string;
};
