import "@nugudi/react-components-layout/style.css";
import {
  List as _List,
  ListItem,
  OrderedList,
  UnorderedList,
} from "@nugudi/react-components-layout";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof _List> = {
  title: "React Components/Layout/List",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const OrderedListStory: Story = {
  render: () => (
    <OrderedList spacing={3}>
      <ListItem fontSize="b1">1번</ListItem>
      <ListItem fontSize="b2">2번</ListItem>
      <ListItem fontSize="b3">3번</ListItem>
    </OrderedList>
  ),
};

export const UnorderedListStory: Story = {
  render: () => (
    <UnorderedList spacing={3}>
      <ListItem fontSize="b1">1번</ListItem>
      <ListItem fontSize="b2">2번</ListItem>
      <ListItem fontSize="b3">3번</ListItem>
    </UnorderedList>
  ),
};

export const ListStory: Story = {
  render: () => (
    <_List variant="ordered" spacing={3}>
      <ListItem fontSize="b1">1번</ListItem>
      <ListItem fontSize="b2">2번</ListItem>
      <ListItem fontSize="b3">3번</ListItem>
    </_List>
  ),
};
