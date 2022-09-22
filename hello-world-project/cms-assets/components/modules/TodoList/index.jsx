import { Island } from "@hubspot/cms-components";
import TodoListProvider from "../../islands/TodoList.jsx?island";
export { default as fields } from "./fields.jsx";

export const meta = {
  label: `Todo List Module`,
};

export const Component = (fieldValues) => {
  console.log("Field values:", fieldValues.todo_group);

  return (
    // In the future (when we are using occurrences), can remove the array brackets for todos since todo_group will be array by default.
    <Island
      id={`todo-list-island`}
      module={TodoListProvider}
      hydrateOn="load"
      todos={[fieldValues.todo_group]}
    />
  );
};