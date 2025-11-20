import { VStack } from "@nugudi/react-components-layout";

export const CafeteriaDetailError = () => {
  return (
    <VStack width="full" gap={16}>
      <div className="flex h-96 w-full items-center justify-center bg-zinc-100">
        <p className="text-zinc-500">식당 정보를 불러올 수 없습니다.</p>
      </div>
    </VStack>
  );
};
