# Comment Component

A flexible comment component for displaying user comments with avatars, usernames, levels, timestamps, and support for nested replies.

## Installation

```bash
pnpm add @nugudi/react-components-comment
```

## Basic Usage

```tsx
import { Comment } from '@nugudi/react-components-comment';

// Basic comment
<Comment
  username="John Doe"
  level={5}
  timeAgo="3 minutes ago"
  content="This is a great article! Thanks for sharing."
/>

// With avatar
<Comment
  avatar={<img src="/avatar.jpg" alt="John" />}
  username="John Doe"
  level={5}
  timeAgo="3 minutes ago"
  content="This is a great article! Thanks for sharing."
/>
```

## With Avatar Component

Use with the Avatar component for consistent styling:

```tsx
import { Comment } from "@nugudi/react-components-comment";
import { Avatar } from "@nugudi/react-components-avatar";

<Comment
  avatar={<Avatar name="Jane Smith" src="/jane-avatar.jpg" size="sm" />}
  username="Jane Smith"
  level={12}
  timeAgo="1 hour ago"
  content="Really helpful information. I learned a lot from this post!"
/>;
```

## With Next.js Image

Optimize avatar images with Next.js:

```tsx
import { Comment } from "@nugudi/react-components-comment";
import Image from "next/image";

<Comment
  avatar={
    <Image
      src="/user-avatar.jpg"
      alt="User"
      width={40}
      height={40}
      className="rounded-full"
    />
  }
  username="Alex Kim"
  level={8}
  timeAgo="30 minutes ago"
  content="Great explanation! This cleared up my confusion."
/>;
```

## Nested Replies

Create threaded conversations with nested comments:

```tsx
import { Comment } from "@nugudi/react-components-comment";
import { VStack } from "@nugudi/react-components-layout";

function CommentThread() {
  return (
    <VStack gap={0}>
      <Comment
        avatar={<Avatar name="Original Poster" src="/op.jpg" size="sm" />}
        username="Original Poster"
        level={10}
        timeAgo="2 hours ago"
        content="What do you think about this new feature?"
      >
        <Comment
          avatar={<Avatar name="Reply User" src="/user1.jpg" size="sm" />}
          username="Reply User"
          level={5}
          timeAgo="1 hour ago"
          content="I think it's fantastic! Really improves the workflow."
          isReply
        />

        <Comment
          avatar={<Avatar name="Another User" src="/user2.jpg" size="sm" />}
          username="Another User"
          level={7}
          timeAgo="45 minutes ago"
          content="Agreed! This will save so much time."
          isReply
        />
      </Comment>
    </VStack>
  );
}
```

## Deep Nested Replies (Reply to Reply)

Handle multi-level reply threads:

```tsx
import { Comment } from "@nugudi/react-components-comment";
import { VStack, Box } from "@nugudi/react-components-layout";
import { Avatar } from "@nugudi/react-components-avatar";

function DeepThreadedComments() {
  return (
    <VStack gap={0}>
      {/* Original comment */}
      <Comment
        avatar={<Avatar name="John Smith" src="/john.jpg" size="sm" />}
        username="John Smith"
        level={15}
        timeAgo="3 hours ago"
        content="Has anyone tried the new API endpoints? I'm having some issues with authentication."
      >
        {/* First level reply */}
        <Comment
          avatar={<Avatar name="Sarah Lee" src="/sarah.jpg" size="sm" />}
          username="Sarah Lee"
          level={20}
          timeAgo="2 hours ago"
          content="Yes, I had the same issue. You need to include the new auth header."
          isReply
        >
          {/* Reply to reply (nested deeper) */}
          <Comment
            avatar={<Avatar name="John Smith" src="/john.jpg" size="sm" />}
            username="John Smith"
            level={15}
            timeAgo="1 hour ago"
            content="Thanks Sarah! Which header specifically? I tried Bearer token but it's not working."
            isReply
          >
            {/* Another nested reply */}
            <Comment
              avatar={<Avatar name="Sarah Lee" src="/sarah.jpg" size="sm" />}
              username="Sarah Lee"
              level={20}
              timeAgo="45 minutes ago"
              content="Use 'X-Auth-Token' instead of 'Authorization'. Here's the format: X-Auth-Token: Bearer {token}"
              isReply
            />

            {/* Additional helper joining the thread */}
            <Comment
              avatar={<Avatar name="Mike Chen" src="/mike.jpg" size="sm" />}
              username="Mike Chen"
              level={12}
              timeAgo="30 minutes ago"
              content="Sarah is right! Also make sure you're using the v2 endpoint, not v1."
              isReply
            />
          </Comment>
        </Comment>

        {/* Another first level reply in parallel */}
        <Comment
          avatar={<Avatar name="Alex Kim" src="/alex.jpg" size="sm" />}
          username="Alex Kim"
          level={8}
          timeAgo="1.5 hours ago"
          content="Check the documentation update from yesterday. They changed the auth flow."
          isReply
        >
          {/* Reply to this branch */}
          <Comment
            avatar={<Avatar name="John Smith" src="/john.jpg" size="sm" />}
            username="John Smith"
            level={15}
            timeAgo="1 hour ago"
            content="Oh, I missed that update. Thanks for the heads up!"
            isReply
          />
        </Comment>
      </Comment>
    </VStack>
  );
}
```

## Q&A Style with Best Answer

Highlight accepted answers in Q&A threads:

```tsx
import { Comment } from "@nugudi/react-components-comment";
import { VStack, Box, HStack, Badge } from "@nugudi/react-components-layout";
import { Avatar } from "@nugudi/react-components-avatar";

function QAThread() {
  return (
    <VStack gap={16}>
      {/* Question */}
      <Comment
        avatar={<Avatar name="Questioner" src="/user.jpg" size="sm" />}
        username="Questioner"
        level={5}
        timeAgo="Yesterday"
        content="How do I implement infinite scroll with React Query?"
      >
        <HStack gap={8} marginTop={8} marginLeft={48}>
          <Badge tone="informative" size="sm">
            Question
          </Badge>
        </HStack>

        {/* Accepted Answer */}
        <Box marginTop={16} padding={12} borderRadius="md" background="yellow">
          <Comment
            avatar={<Avatar name="Expert" src="/expert.jpg" size="sm" />}
            username="Expert"
            level={30}
            timeAgo="23 hours ago"
            content="Use the useInfiniteQuery hook with getNextPageParam. Here's a complete example..."
            isReply
          >
            <HStack gap={8} marginTop={8} marginLeft={48}>
              <Badge tone="positive" size="sm">
                ✓ Accepted Answer
              </Badge>
              <Badge tone="purple" size="sm">
                Expert
              </Badge>
            </HStack>

            {/* Reply to accepted answer */}
            <Comment
              avatar={<Avatar name="Questioner" src="/user.jpg" size="sm" />}
              username="Questioner"
              level={5}
              timeAgo="22 hours ago"
              content="Perfect! This is exactly what I needed. The getNextPageParam part was what I was missing."
              isReply
            />
          </Comment>
        </Box>

        {/* Other answers */}
        <Comment
          avatar={<Avatar name="Helper" src="/helper.jpg" size="sm" />}
          username="Helper"
          level={12}
          timeAgo="20 hours ago"
          content="Also consider using intersection observer for better performance."
          isReply
        >
          {/* Discussion on this answer */}
          <Comment
            avatar={<Avatar name="Another Dev" src="/dev.jpg" size="sm" />}
            username="Another Dev"
            level={7}
            timeAgo="18 hours ago"
            content="Good point! Intersection observer reduces unnecessary checks."
            isReply
          />
        </Comment>
      </Comment>
    </VStack>
  );
}
```

## Comment List

Display a list of comments:

```tsx
import { Comment } from "@nugudi/react-components-comment";
import { VStack, Divider } from "@nugudi/react-components-layout";

function CommentList({ comments }) {
  return (
    <VStack gap={16}>
      {comments.map((comment, index) => (
        <div key={comment.id}>
          <Comment
            avatar={
              <Avatar
                name={comment.username}
                src={comment.avatarUrl}
                size="sm"
              />
            }
            username={comment.username}
            level={comment.level}
            timeAgo={comment.timeAgo}
            content={comment.content}
          />
          {index < comments.length - 1 && <Divider />}
        </div>
      ))}
    </VStack>
  );
}
```

## With Actions

Add interaction buttons to comments:

```tsx
import { Comment } from "@nugudi/react-components-comment";
import { HStack, Box } from "@nugudi/react-components-layout";
import { Button } from "@nugudi/react-components-button";

function InteractiveComment({ comment }) {
  return (
    <Box>
      <Comment
        avatar={<Avatar name={comment.username} />}
        username={comment.username}
        level={comment.level}
        timeAgo={comment.timeAgo}
        content={comment.content}
      />

      <HStack gap={8} marginTop={8} marginLeft={48}>
        <Button size="sm" variant="neutral">
          Like
        </Button>
        <Button size="sm" variant="neutral">
          Reply
        </Button>
        <Button size="sm" variant="neutral">
          Report
        </Button>
      </HStack>
    </Box>
  );
}
```

## Blog Comments Section

Complete blog comments implementation:

```tsx
import { Comment } from "@nugudi/react-components-comment";
import {
  VStack,
  Title,
  Body,
  Divider,
  Box,
} from "@nugudi/react-components-layout";
import { Button } from "@nugudi/react-components-button";
import { Textarea } from "@nugudi/react-components-textarea";
import { useState } from "react";

function BlogComments() {
  const [comments, setComments] = useState([
    {
      id: 1,
      username: "Tech Enthusiast",
      level: 15,
      timeAgo: "2 days ago",
      content: "This is exactly what I was looking for! Great tutorial.",
      avatarUrl: "/user1.jpg",
      replies: [
        {
          id: 2,
          username: "Author",
          level: 20,
          timeAgo: "1 day ago",
          content: "Thank you! Glad you found it helpful.",
          avatarUrl: "/author.jpg",
        },
      ],
    },
  ]);

  return (
    <VStack gap={24}>
      <Title fontSize="t2">Comments ({comments.length})</Title>

      {/* Add comment form */}
      <Box padding={16} background="zinc" borderRadius="lg">
        <VStack gap={12}>
          <Textarea placeholder="Add a comment..." rows={3} />
          <HStack justify="flex-end">
            <Button size="sm">Post Comment</Button>
          </HStack>
        </VStack>
      </Box>

      <Divider />

      {/* Comments list */}
      <VStack gap={20}>
        {comments.map((comment) => (
          <div key={comment.id}>
            <Comment
              avatar={
                <Avatar name={comment.username} src={comment.avatarUrl} />
              }
              username={comment.username}
              level={comment.level}
              timeAgo={comment.timeAgo}
              content={comment.content}
            >
              {comment.replies?.map((reply) => (
                <Comment
                  key={reply.id}
                  avatar={
                    <Avatar name={reply.username} src={reply.avatarUrl} />
                  }
                  username={reply.username}
                  level={reply.level}
                  timeAgo={reply.timeAgo}
                  content={reply.content}
                  isReply
                />
              ))}
            </Comment>
          </div>
        ))}
      </VStack>
    </VStack>
  );
}
```

## Forum Discussion

Forum-style threaded discussion:

```tsx
import { Comment } from "@nugudi/react-components-comment";
import { VStack, HStack, Badge, Box } from "@nugudi/react-components-layout";

function ForumDiscussion() {
  return (
    <VStack gap={16}>
      <Comment
        avatar={<Avatar name="Question Asker" />}
        username="Question Asker"
        level={3}
        timeAgo="5 hours ago"
        content="How can I optimize this React component for better performance?"
      >
        <HStack gap={8} marginTop={8} marginLeft={48}>
          <Badge tone="informative" size="sm">
            Question
          </Badge>
          <Badge tone="warning" size="sm">
            Unanswered
          </Badge>
        </HStack>

        <Box marginTop={16}>
          <Comment
            avatar={<Avatar name="Expert Developer" />}
            username="Expert Developer"
            level={25}
            timeAgo="3 hours ago"
            content="You can use React.memo for components that receive the same props frequently. Also consider useMemo and useCallback for expensive computations."
            isReply
          >
            <HStack gap={8} marginTop={8} marginLeft={48}>
              <Badge tone="positive" size="sm">
                Helpful
              </Badge>
              <Badge tone="purple" size="sm">
                Expert
              </Badge>
            </HStack>
          </Comment>

          <Comment
            avatar={<Avatar name="Another Dev" />}
            username="Another Dev"
            level={10}
            timeAgo="2 hours ago"
            content="Don't forget about code splitting and lazy loading for larger components!"
            isReply
          />
        </Box>
      </Comment>
    </VStack>
  );
}
```

## Product Reviews

Use for product review sections:

```tsx
import { Comment } from "@nugudi/react-components-comment";
import { VStack, HStack, Title, Body } from "@nugudi/react-components-layout";
import { Badge } from "@nugudi/react-components-badge";

function ProductReview({ review }) {
  return (
    <Comment
      avatar={<Avatar name={review.username} src={review.avatar} />}
      username={review.username}
      level={review.level}
      timeAgo={review.date}
      content={review.text}
    >
      <HStack gap={8} marginTop={8} marginLeft={48}>
        <HStack gap={4}>
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} filled={i < review.rating} />
          ))}
        </HStack>
        {review.verified && (
          <Badge tone="positive" size="sm">
            Verified Purchase
          </Badge>
        )}
      </HStack>
    </Comment>
  );
}
```

## Live Chat Comments

Real-time chat or live stream comments:

```tsx
import { Comment } from "@nugudi/react-components-comment";
import { VStack, Box } from "@nugudi/react-components-layout";
import { useEffect, useRef } from "react";

function LiveChat({ messages }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to latest message
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box
      height={400}
      overflowY="auto"
      padding={16}
      background="zinc"
      borderRadius="lg"
    >
      <VStack gap={8}>
        {messages.map((msg, index) => (
          <Comment
            key={index}
            avatar={<Avatar name={msg.username} src={msg.avatar} size="sm" />}
            username={msg.username}
            level={msg.level}
            timeAgo={msg.timeAgo}
            content={msg.content}
          />
        ))}
        <div ref={scrollRef} />
      </VStack>
    </Box>
  );
}
```

## Social Media Style

Social media comment threads:

```tsx
import { Comment } from "@nugudi/react-components-comment";
import { VStack, HStack, Body, Box } from "@nugudi/react-components-layout";

function SocialComment({ comment }) {
  const [likes, setLikes] = useState(comment.likes);
  const [liked, setLiked] = useState(false);

  return (
    <Comment
      avatar={<Avatar name={comment.username} src={comment.avatar} />}
      username={comment.username}
      level={comment.level}
      timeAgo={comment.timeAgo}
      content={comment.content}
    >
      <HStack gap={16} marginTop={8} marginLeft={48}>
        <button
          onClick={() => {
            setLiked(!liked);
            setLikes(liked ? likes - 1 : likes + 1);
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: liked ? "red" : "zinc",
          }}
        >
          <HStack gap={4}>
            <HeartIcon filled={liked} />
            <Body fontSize="b4">{likes}</Body>
          </HStack>
        </button>

        <button
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <Body fontSize="b4">Reply</Body>
        </button>

        <button
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <Body fontSize="b4">Share</Body>
        </button>
      </HStack>
    </Comment>
  );
}
```

## Props

| Prop      | Type        | Default | Description                                           |
| --------- | ----------- | ------- | ----------------------------------------------------- |
| avatar    | `ReactNode` | -       | User avatar element (img, Avatar component, etc.)     |
| username  | `string`    | -       | **Required.** Username or display name                |
| level     | `number`    | -       | **Required.** User level (displayed as "Lv.X")        |
| timeAgo   | `string`    | -       | **Required.** Time ago string (e.g., "3 minutes ago") |
| content   | `string`    | -       | **Required.** Comment text content                    |
| isReply   | `boolean`   | `false` | Whether this is a reply (adds indentation)            |
| className | `string`    | -       | Additional CSS class                                  |
| children  | `ReactNode` | -       | Nested comments or additional content                 |

## Styling

The component uses CSS-in-JS with vanilla-extract. Import the styles:

```tsx
import "@nugudi/react-components-comment/style.css";
```

## Accessibility

- Semantic HTML structure for comments
- Proper heading hierarchy for usernames
- Time elements for timestamps
- Support for screen readers

## TypeScript

The component is fully typed. Import types as needed:

```tsx
import type { CommentProps } from "@nugudi/react-components-comment";

// Comment data structure
interface CommentData {
  id: string;
  username: string;
  level: number;
  avatar?: string;
  content: string;
  timeAgo: string;
  replies?: CommentData[];
}

// Using in component props
interface CommentSectionProps {
  comments: CommentData[];
}
```

## Best Practices

1. **Always provide user level**: Shows user engagement/experience
2. **Use relative time**: "3 minutes ago" is more readable than timestamps
3. **Optimize avatars**: Use proper image optimization (Next.js Image, etc.)
4. **Handle long content**: Consider truncation or "Read more" for long comments
5. **Implement proper nesting**: Limit reply depth for readability
6. **Add interaction options**: Like, reply, report buttons enhance engagement
7. **Show loading states**: For async comment loading
8. **Implement pagination**: For large comment lists
