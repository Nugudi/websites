import * as React from "react";
import { Box } from "./Box";
import type { BoxProps } from "./types";

export type ListItemProps = BoxProps;

const ListItem = (props: ListItemProps, ref: React.Ref<HTMLLIElement>) => {
  return <Box {...props} ref={ref as React.Ref<HTMLElement>} as="li" />;
};

const _ListItem = React.forwardRef(ListItem);
export { _ListItem as ListItem };
