import { SetStateAction } from "react";

interface EventTargetType {
  target: { value: SetStateAction<string> };
}

export type { EventTargetType };
