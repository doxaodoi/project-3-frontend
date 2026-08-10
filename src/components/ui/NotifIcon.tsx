import { Sparkle, Check, ChatBubble, Bell } from "./Icon";
import { cn } from "@/lib/cn";

export type NotifKind = "match" | "claim" | "message" | "system";

const config: Record<NotifKind, { bg: string; Icon: typeof Sparkle }> = {
  match: { bg: "bg-rust", Icon: Sparkle },
  claim: { bg: "bg-found", Icon: Check },
  message: { bg: "bg-[#c8703f]", Icon: ChatBubble },
  system: { bg: "bg-faint", Icon: Bell },
};

export function NotifIcon({
  kind,
  size = 34,
}: {
  kind: NotifKind;
  size?: number;
}) {
  const { bg, Icon } = config[kind];
  return (
    <span
      className={cn(
        "flex flex-none items-center justify-center rounded-full text-white",
        bg,
      )}
      style={{ width: size, height: size }}
    >
      <Icon size={size * 0.44} />
    </span>
  );
}
