import { Button } from "@nugudi/react-components-button";
import { Emphasis, Heading } from "@nugudi/react-components-layout";

export default function Home() {
  return (
    <div>
      <Heading as="h1" fontSize="h1" color="main">
        Nugudi UI 컴포넌트 테스트
      </Heading>
      <Emphasis fontSize="e1" color="blackAlpha">
        Emphasis
      </Emphasis>
      <Button color="main">Click me</Button>
      <div
        style={{
          marginTop: 10,
        }}
      />
      <Button color="blackAlpha" size="lg">
        Click me
      </Button>
    </div>
  );
}
