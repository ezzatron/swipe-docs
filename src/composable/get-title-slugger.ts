import { cache } from "react";
import { createTitleSlugger } from "./impasto-react";

export const getTitleSlugger = cache(createTitleSlugger);
