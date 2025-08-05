import * as React from "react";
import { OrderedList } from "./OrderedList";
import type { ListProps } from "./types";
import { UnorderedList } from "./UnOrderedList";

const List = (
  props: ListProps,
  ref: React.Ref<HTMLOListElement | HTMLUListElement>,
) => {
  const { variant = "unordered", ...rest } = props;

  if (variant === "unordered") {
    return <UnorderedList {...rest} ref={ref as React.Ref<HTMLUListElement>} />;
  }

  return <OrderedList {...rest} ref={ref as React.Ref<HTMLOListElement>} />;
};

const _List = React.forwardRef(List);
export { _List as List };
