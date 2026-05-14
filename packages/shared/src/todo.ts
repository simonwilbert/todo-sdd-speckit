/** API `Todo` resource (ISO date strings on the wire). */
export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TodoCreate = {
  text: string;
};

export type TodoPatch = {
  text?: string;
  completed?: boolean;
};

export type TodoReplace = {
  text: string;
  completed: boolean;
};
