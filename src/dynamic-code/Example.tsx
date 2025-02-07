import Form from "./Form";
import { generateOutput } from "./generate";
import type { Input } from "./state";

export default async function Example() {
  const input: Input = { name: "World" };
  const output = await generateOutput(input);

  return <Form initialState={{ input, output }} />;
}
