import "@nugudi/react-components-layout/style.css";
import {
  List as _List,
  Body,
  ListItem,
  OrderedList,
  UnorderedList,
} from "@nugudi/react-components-layout";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof _List> = {
  title: "Components/Layout/List",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const OrderedListStory: Story = {
  render: () => (
    <OrderedList spacing={12}>
      <ListItem>
        <Body fontSize="b1">1번</Body>
      </ListItem>
      <ListItem>
        <Body fontSize="b2">2번</Body>
      </ListItem>
      <ListItem>
        <Body fontSize="b3">3번</Body>
      </ListItem>
    </OrderedList>
  ),
};

export const UnorderedListStory: Story = {
  render: () => (
    <UnorderedList spacing={12}>
      <ListItem>
        <Body fontSize="b1">1번</Body>
      </ListItem>
      <ListItem>
        <Body fontSize="b2">2번</Body>
      </ListItem>
      <ListItem>
        <Body fontSize="b3">3번</Body>
      </ListItem>
    </UnorderedList>
  ),
};

export const ListStory: Story = {
  render: () => (
    <_List variant="ordered" spacing={12}>
      <ListItem>
        <Body fontSize="b1">1번</Body>
      </ListItem>
      <ListItem>
        <Body fontSize="b2">2번</Body>
      </ListItem>
      <ListItem>
        <Body fontSize="b3">3번</Body>
      </ListItem>
    </_List>
  ),
};
