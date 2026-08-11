"use client";

import { useEffect, useMemo, useState } from "react";
import {
  conversations as convApi,
  type ConversationDTO,
  type MessageDTO,
} from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Search, Lock, Send } from "@/components/ui/Icon";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";

const COLORS = ["#c8703f", "#5a7baa", "#6b8f5e", "#8a72a8", "#b5451f"];

function pickColor(id: number) {
  return COLORS[id % COLORS.length];
}

function initial(name: string) {
  return name.charAt(0).toUpperCase();
}

export function Messaging() {
  const { user } = useAuth();
  const [convos, setConvos] = useState<ConversationDTO[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [mobileView, setMobileView] = useState<"list" | "thread">("list");
  const [draft, setDraft] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  // Load conversations
  useEffect(() => {
    convApi
      .list()
      .then((list) => {
        setConvos(list);
        if (list.length > 0 && !selectedId) setSelectedId(list[0].id);
      })
      .catch(() => {})
      .finally(() => setLoadingList(false));
  }, []);

  // Load messages when selected conversation changes
  useEffect(() => {
    if (!selectedId) return;
    setLoadingMsgs(true);
    convApi
      .messages(selectedId)
      .then(setMessages)
      .catch(() => {})
      .finally(() => setLoadingMsgs(false));
  }, [selectedId]);

  const active = useMemo(
    () => convos.find((c) => c.id === selectedId),
    [convos, selectedId],
  );

  function send() {
    const text = draft.trim();
    if (!text || !selectedId) return;
    setDraft("");
    convApi.send(selectedId, text).then((msg) => {
      setMessages((m) => [...m, msg]);
    });
  }

  if (loadingList) {
    return (
      <div className="mx-auto max-w-[600px] pt-6">
        <ListSkeleton rows={5} />
      </div>
    );
  }

  if (convos.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="font-serif text-2xl font-semibold">No conversations yet</div>
        <p className="mt-2 text-sm text-ink3">
          Conversations appear when a claim is approved.
        </p>
      </div>
    );
  }

  return (
    <div className="my-5 flex h-[600px] max-h-[calc(100vh-150px)] overflow-hidden rounded-[14px] border border-line2 bg-paper md:max-h-[calc(100vh-190px)]">
      {/* Conversation list */}
      <div
        className={cn(
          "w-full flex-none flex-col border-r border-line md:flex md:w-80",
          mobileView === "thread" ? "hidden" : "flex",
        )}
      >
        <div className="px-5 pb-3 pt-[18px] font-serif text-xl font-semibold">
          Messages
        </div>
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 rounded-lg border border-line bg-card px-3 py-2.5 text-[13px] text-muted">
            <Search size={15} />
            Search conversations
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {convos.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedId(c.id);
                setMobileView("thread");
              }}
              className={cn(
                "flex w-full items-center gap-3 border-b border-panel px-[18px] py-3.5 text-left transition-colors",
                c.id === selectedId
                  ? "border-l-[3px] border-l-rust bg-panel"
                  : "hover:bg-panel/60",
              )}
            >
              <span
                className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-full font-bold text-white"
                style={{ backgroundColor: pickColor(c.otherUser.id) }}
              >
                {initial(c.otherUser.fullName)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex justify-between">
                  <span className="text-sm font-semibold">{c.otherUser.fullName}</span>
                  <span className="text-[11px] text-faint">
                    {c.lastMessageAt
                      ? new Date(c.lastMessageAt).toLocaleDateString()
                      : ""}
                  </span>
                </span>
                <span className="block truncate text-[12.5px] text-ink3">
                  {c.lastMessagePreview ?? "No messages yet"}
                </span>
              </span>
              {c.unreadCount > 0 && (
                <span className="h-[9px] w-[9px] flex-none rounded-full bg-rust" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Thread */}
      <div
        className={cn(
          "flex-1 flex-col bg-panel md:flex",
          mobileView === "list" ? "hidden" : "flex",
        )}
      >
        {active && (
          <>
            <div className="flex items-center gap-3 border-b border-line bg-paper px-4 py-3.5 sm:px-[22px]">
              <button
                onClick={() => setMobileView("list")}
                className="text-ink2 md:hidden"
                aria-label="Back to conversations"
              >
                ‹
              </button>
              <span
                className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full font-bold text-white"
                style={{ backgroundColor: pickColor(active.otherUser.id) }}
              >
                {initial(active.otherUser.fullName)}
              </span>
              <div className="min-w-0">
                <div className="text-[15px] font-semibold">{active.otherUser.fullName}</div>
                <div className="truncate text-xs text-ink3">
                  {active.itemTitle ? `About: ${active.itemTitle}` : ""}
                </div>
              </div>
              <div className="ml-auto flex flex-none items-center gap-1.5 rounded-full bg-[#e6efe4] px-2.5 py-[5px] font-mono text-[11px] text-found">
                <Lock size={12} />
                <span className="hidden sm:inline">CONTACTS HIDDEN</span>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-3.5 overflow-y-auto p-5 sm:p-[22px]">
              {loadingMsgs ? (
                <div className="py-8 text-center text-sm text-ink3">Loading...</div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "max-w-[78%] px-3.5 py-[11px] text-sm leading-snug sm:max-w-[64%]",
                      m.senderId === user?.id
                        ? "self-end rounded-[12px_12px_3px_12px] bg-ink text-[#f1ece1]"
                        : "self-start rounded-[12px_12px_12px_3px] border border-line2 bg-card text-ink",
                    )}
                  >
                    {m.body}
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center gap-3 border-t border-line bg-paper px-4 py-3.5 sm:px-[22px]">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Write a message..."
                className="flex-1 rounded-[9px] border border-line bg-card px-3.5 py-3 text-sm text-ink placeholder:text-muted focus:border-rust focus:outline-none"
              />
              <button
                onClick={send}
                aria-label="Send"
                className="flex items-center gap-2 rounded-[9px] bg-rust px-4 py-3 text-sm font-semibold text-paper hover:bg-rustdark"
              >
                <Send size={16} />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
