import Form from "./Form";
import { generateTree } from "./generate";

export default async function Example() {
  const initialName = "World";

  return (
    <Form
      initialName={initialName}
      initialTree={await generateTree(initialName)}
    />
  );
}
