import * as React from "react";
import { Body } from "../typography";
import type { ListItemProps } from "./types";

const ListItem = (props: ListItemProps, ref: React.Ref<HTMLLIElement>) => {
  // TODO: Text 컴포넌트로 변경
  return <Body {...props} ref={ref} as="li" />;
};

const _ListItem = React.forwardRef(ListItem);
export { _ListItem as ListItem };
