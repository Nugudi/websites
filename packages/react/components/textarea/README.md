# @nugudi/react-components-textarea

A flexible textarea component with built-in error states, character counting, and resize options.

## Installation

```bash
pnpm add @nugudi/react-components-textarea
```

## Import

```tsx
import { Textarea, useTextarea } from "@nugudi/react-components-textarea";
import "@nugudi/react-components-textarea/style.css";
```

## Basic Usage

```tsx
import { Textarea } from "@nugudi/react-components-textarea";
import "@nugudi/react-components-textarea/style.css";

function App() {
  return <Textarea placeholder="Share your thoughts..." />;
}
```

## Features

### With Label

```tsx
import { Textarea } from "@nugudi/react-components-textarea";
import { VStack } from "@nugudi/react-components-layout";

function FeedbackForm() {
  return (
    <VStack gap={16}>
      <Textarea 
        label="Feedback" 
        placeholder="Tell us what you think..." 
      />
      
      <Textarea 
        label="Comments" 
        placeholder="Additional comments (optional)" 
      />
    </VStack>
  );
}
```

### Error States

```tsx
import { Textarea } from "@nugudi/react-components-textarea";
import { VStack } from "@nugudi/react-components-layout";

function ValidationExample() {
  return (
    <VStack gap={16}>
      <Textarea
        label="Review"
        placeholder="Write your review..."
        isError={true}
        errorMessage="Review must be at least 10 characters long."
      />
      
      <Textarea
        label="Description"
        placeholder="Enter description..."
        invalid={true}
        errorMessage="This field is required."
      />
    </VStack>
  );
}
```

### Resize Options

```tsx
import { Textarea } from "@nugudi/react-components-textarea";
import { VStack, Title } from "@nugudi/react-components-layout";

function ResizeExamples() {
  return (
    <VStack gap={24}>
      <VStack gap={8}>
        <Title level={4}>No Resize</Title>
        <Textarea
          placeholder="Fixed size textarea"
          resize="none"
        />
      </VStack>

      <VStack gap={8}>
        <Title level={4}>Vertical Only (Default)</Title>
        <Textarea
          placeholder="Resize vertically only"
          resize="vertical"
        />
      </VStack>

      <VStack gap={8}>
        <Title level={4}>Horizontal Only</Title>
        <Textarea
          placeholder="Resize horizontally only"
          resize="horizontal"
        />
      </VStack>

      <VStack gap={8}>
        <Title level={4}>Both Directions</Title>
        <Textarea
          placeholder="Resize in any direction"
          resize="both"
        />
      </VStack>
    </VStack>
  );
}
```

### Character Counter

The `maxLength` prop automatically displays a character counter in the bottom-right corner.

```tsx
import { Textarea } from "@nugudi/react-components-textarea";
import { VStack, Title } from "@nugudi/react-components-layout";

function CharacterLimitExamples() {
  return (
    <VStack gap={24}>
      <VStack gap={8}>
        <Title level={4}>Tweet Composer</Title>
        <Textarea 
          placeholder="What's happening?" 
          maxLength={280} 
        />
      </VStack>

      <VStack gap={8}>
        <Title level={4}>Bio</Title>
        <Textarea 
          label="Bio"
          placeholder="Tell us about yourself..." 
          maxLength={160}
          resize="none"
        />
      </VStack>

      <VStack gap={8}>
        <Title level={4}>Product Description</Title>
        <Textarea 
          label="Description"
          placeholder="Describe your product in detail..." 
          maxLength={500}
          rows={5}
        />
      </VStack>
    </VStack>
  );
}
```

### Controlled Component

```tsx
import React from "react";
import { Textarea } from "@nugudi/react-components-textarea";
import { VStack, Body } from "@nugudi/react-components-layout";

function ControlledTextarea() {
  const [value, setValue] = React.useState("");
  const [touched, setTouched] = React.useState(false);
  
  const minLength = 20;
  const hasError = touched && value.length < minLength;

  return (
    <VStack gap={16}>
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setTouched(true)}
        maxLength={200}
        placeholder="Enter at least 20 characters..."
        isError={hasError}
        errorMessage={hasError ? `Please enter at least ${minLength} characters` : undefined}
      />
      
      <Body size={2} tone="secondary">
        Character count: {value.length}/200
      </Body>
    </VStack>
  );
}
```

## Real-World Examples

### Comment Section

```tsx
import { Textarea } from "@nugudi/react-components-textarea";
import { VStack, HStack, Button } from "@nugudi/react-components-layout";

function CommentBox() {
  const [comment, setComment] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async () => {
    if (comment.trim().length < 10) return;
    
    setIsSubmitting(true);
    // Submit comment
    await submitComment(comment);
    setComment("");
    setIsSubmitting(false);
  };

  return (
    <VStack gap={12}>
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        maxLength={500}
        rows={3}
        resize="vertical"
      />
      
      <HStack gap={8} justify="flex-end">
        <Button 
          variant="secondary" 
          onClick={() => setComment("")}
          disabled={!comment || isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={comment.trim().length < 10 || isSubmitting}
        >
          {isSubmitting ? "Posting..." : "Post Comment"}
        </Button>
      </HStack>
    </VStack>
  );
}
```

### Support Ticket Form

```tsx
import { Textarea } from "@nugudi/react-components-textarea";
import { VStack, Input, Select } from "@nugudi/react-components-layout";

function SupportTicket() {
  return (
    <VStack gap={20}>
      <Input 
        label="Subject"
        placeholder="Brief description of your issue"
        required
      />
      
      <Select label="Category" required>
        <option value="">Select category</option>
        <option value="technical">Technical Issue</option>
        <option value="billing">Billing</option>
        <option value="feature">Feature Request</option>
        <option value="other">Other</option>
      </Select>
      
      <Textarea
        label="Description"
        placeholder="Please provide detailed information about your issue..."
        maxLength={1000}
        rows={6}
        required
        resize="vertical"
      />
      
      <Textarea
        label="Steps to Reproduce (if applicable)"
        placeholder="1. Go to...\n2. Click on...\n3. See error..."
        rows={4}
        resize="vertical"
      />
    </VStack>
  );
}
```

### Product Review

```tsx
import { Textarea } from "@nugudi/react-components-textarea";
import { VStack, HStack, Title, Body } from "@nugudi/react-components-layout";

function ProductReview({ productName }) {
  const [rating, setRating] = React.useState(0);
  const [title, setTitle] = React.useState("");
  const [review, setReview] = React.useState("");
  const [pros, setPros] = React.useState("");
  const [cons, setCons] = React.useState("");

  return (
    <VStack gap={24}>
      <VStack gap={8}>
        <Title level={3}>Write a Review for {productName}</Title>
        <Body size={2} tone="secondary">
          Share your experience with other customers
        </Body>
      </VStack>

      <VStack gap={20}>
        <Input
          label="Review Title"
          placeholder="Summarize your experience"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
        />

        <Textarea
          label="Your Review"
          placeholder="Tell us what you liked or disliked about this product..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          maxLength={1500}
          rows={6}
          resize="vertical"
        />

        <HStack gap={16}>
          <VStack gap={8} flex={1}>
            <Textarea
              label="Pros"
              placeholder="What did you like?"
              value={pros}
              onChange={(e) => setPros(e.target.value)}
              maxLength={300}
              rows={3}
              resize="none"
            />
          </VStack>

          <VStack gap={8} flex={1}>
            <Textarea
              label="Cons"
              placeholder="What could be improved?"
              value={cons}
              onChange={(e) => setCons(e.target.value)}
              maxLength={300}
              rows={3}
              resize="none"
            />
          </VStack>
        </HStack>
      </VStack>
    </VStack>
  );
}
```

## Form Integration

### React Hook Form

```tsx
import { useForm } from "react-hook-form";
import { Textarea } from "@nugudi/react-components-textarea";
import { VStack } from "@nugudi/react-components-layout";

function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack gap={20}>
        <Textarea
          {...register("message", {
            required: "Message is required",
            minLength: {
              value: 20,
              message: "Message must be at least 20 characters",
            },
            maxLength: {
              value: 500,
              message: "Message cannot exceed 500 characters",
            },
          })}
          label="Message"
          placeholder="Enter your message..."
          maxLength={500}
          isError={!!errors.message}
          errorMessage={errors.message?.message}
          rows={5}
        />
        
        <button type="submit">Send Message</button>
      </VStack>
    </form>
  );
}
```

### With Zod Validation

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "@nugudi/react-components-textarea";
import { VStack } from "@nugudi/react-components-layout";

const formSchema = z.object({
  feedback: z
    .string()
    .min(10, "Feedback must be at least 10 characters")
    .max(500, "Feedback cannot exceed 500 characters"),
  suggestions: z
    .string()
    .min(5, "Please provide at least 5 characters")
    .optional(),
  additionalNotes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

function FeedbackForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack gap={20}>
        <Textarea
          label="Feedback *"
          placeholder="Share your feedback (10-500 characters)"
          {...register("feedback")}
          maxLength={500}
          isError={!!errors.feedback}
          errorMessage={errors.feedback?.message}
          rows={4}
        />

        <Textarea
          label="Suggestions"
          placeholder="Any suggestions for improvement?"
          {...register("suggestions")}
          isError={!!errors.suggestions}
          errorMessage={errors.suggestions?.message}
          rows={3}
        />

        <Textarea
          label="Additional Notes"
          placeholder="Anything else you'd like to add?"
          {...register("additionalNotes")}
          resize="vertical"
          rows={2}
        />

        <button type="submit">Submit Feedback</button>
      </VStack>
    </form>
  );
}
```

### Controller Pattern

```tsx
import { Controller, useForm } from "react-hook-form";
import { Textarea } from "@nugudi/react-components-textarea";
import { VStack } from "@nugudi/react-components-layout";

function AdvancedForm() {
  const { control, handleSubmit, watch } = useForm();
  const contentValue = watch("content");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack gap={20}>
        <Controller
          name="content"
          control={control}
          rules={{
            required: "Content is required",
            validate: {
              noSpam: (value) => 
                !value.includes("spam") || "Content contains prohibited words",
              minWords: (value) => 
                value.split(" ").length >= 5 || "Please write at least 5 words",
            },
          }}
          render={({ field, fieldState }) => (
            <Textarea
              {...field}
              label="Content"
              placeholder="Write your content..."
              isError={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              maxLength={1000}
              rows={6}
            />
          )}
        />
        
        <Body size={2} tone="secondary">
          Word count: {contentValue?.split(" ").filter(Boolean).length || 0}
        </Body>
        
        <button type="submit">Submit</button>
      </VStack>
    </form>
  );
}
```

## Custom Hook

### useTextarea

The `useTextarea` hook provides state management and accessibility features for custom textarea implementations.

```tsx
import { useTextarea } from "@nugudi/react-components-textarea";

function CustomTextarea() {
  const { textareaProps, isFocused } = useTextarea({
    invalid: false,
    errorMessage: "Error message",
    required: true,
    // ... other HTML textarea attributes
  });

  return (
    <div className={`custom-wrapper ${isFocused ? "focused" : ""}`}>
      <textarea {...textareaProps} />
    </div>
  );
}
```

## Props

### TextareaProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"full"` | - | Width sizing option |
| `label` | `string` | - | Label text for the textarea |
| `isError` | `boolean` | `false` | Error state indicator |
| `errorMessage` | `string` | - | Error message to display |
| `invalid` | `boolean` | `false` | Invalid state for aria-invalid |
| `resize` | `"none" \| "vertical" \| "horizontal" \| "both"` | `"vertical"` | Resize behavior |
| `maxLength` | `number` | - | Maximum character limit (shows counter) |
| `rows` | `number` | - | Number of visible text lines |
| `placeholder` | `string` | - | Placeholder text |
| `value` | `string` | - | Controlled value |
| `onChange` | `(e: ChangeEvent) => void` | - | Change handler |
| `...props` | `TextareaHTMLAttributes` | - | All standard HTML textarea attributes |

### useTextarea Props

| Prop | Type | Description |
|------|------|-------------|
| `invalid` | `boolean` | Sets aria-invalid attribute |
| `errorMessage` | `string` | Error message for aria-describedby |
| `...props` | `TextareaHTMLAttributes` | All standard HTML textarea attributes |

### useTextarea Return

| Property | Type | Description |
|----------|------|-------------|
| `textareaProps` | `object` | Props to spread on textarea element with accessibility attributes |
| `isFocused` | `boolean` | Current focus state |

## Accessibility

- **ARIA Support**: Automatic `aria-invalid`, `aria-describedby`, and `aria-required` attributes
- **Label Association**: Proper `htmlFor` and `id` linking between label and textarea
- **Error Announcements**: Error messages are properly announced to screen readers
- **Keyboard Navigation**: Full keyboard support for all interactions
- **Focus Management**: Clear focus indicators and states

## Best Practices

1. **Always provide labels** for better accessibility
2. **Use appropriate resize options** based on content type
3. **Set reasonable maxLength** for user guidance
4. **Provide clear error messages** for validation
5. **Use controlled components** for complex form logic
6. **Consider mobile experience** when setting rows and resize options
7. **Test with screen readers** for accessibility compliance

## TypeScript

Full TypeScript support with exported types:

```tsx
import type { TextareaProps, UseTextareaProps, UseTextareaReturn } from "@nugudi/react-components-textarea";
```