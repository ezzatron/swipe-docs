import { LinkIcon } from "lucide-react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import innerText from "react-innertext";
import { getTitleSlugger } from "../composable/get-title-slugger";
import { u } from "../u";

type Props = ComponentProps<"h1" | "h2" | "h3" | "h4" | "h5" | "h6"> & {
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: ReactNode;
};

export default function Heading({ as, children, ...props }: Props) {
  const H = as;
  const id = props.id ?? getTitleSlugger()(children);

  const heading = (
    <H {...props} id={id}>
      {children}
    </H>
  );

  if (!id) return heading;

  return (
    <div className="heading-group group relative">
      <H {...props} id={id}>
        {children}
      </H>

      <Link
        href={u`#${id}`}
        aria-label={`Permalink: ${innerText(children)}`}
        className="absolute top-[50%] -left-6 grid size-6 translate-y-[-50%] place-items-center"
      >
        <LinkIcon
          aria-hidden
          className="size-4 text-transparent group-hover:text-inherit group-has-focus-visible:text-inherit"
        />
      </Link>
    </div>
  );
}
