"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

function timeLabel(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function Messaging() {
  const { user } = useAuth();
  const [convos, setConvos] = useState<ConversationDTO[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [mobileView, setMobileView] = useState<"list" | "thread">("list");
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedIdRef = useRef<number | null>(null);
  selectedIdRef.current = selectedId;

  const refreshList = useCallback(() => {
    return convApi
      .list()
      .then((list) => {
        setConvos(list);
        return list;
      })
      .catch(() => [] as ConversationDTO[]);
  }, []);

  const selectConversation = useCallback((id: number) => {
    setSelectedId(id);
    setMobileView("thread");
    // Optimistically clear the unread dot, then tell the server
    setConvos((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c)),
    );
    convApi.markConversationRead(id).catch(() => {});
  }, []);

  // Initial conversation load
  useEffect(() => {
    refreshList()
      .then((list) => {
        if (list.length > 0 && !selectedIdRef.current) {
          selectConversation(list[0].id);
        }
      })
      .finally(() => setLoadingList(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Poll the conversation list (unread counts + previews) every 8s
  useEffect(() => {
    const t = setInterval(() => {
      if (document.visibilityState === "visible") refreshList();
    }, 8000);
    return () => clearInterval(t);
  }, [refreshList]);

  // Load + poll messages for the selected conversation every 4s
  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;

    const load = (showSpinner: boolean) => {
      if (showSpinner) setLoadingMsgs(true);
      convApi
        .messages(selectedId)
        .then((msgs) => {
          if (!cancelled) setMessages(msgs);
        })
        .catch(() => {})
        .finally(() => {
          if (showSpinner && !cancelled) setLoadingMsgs(false);
        });
    };

    load(true);
    const t = setInterval(() => {
      if (document.visibilityState === "visible") load(false);
    }, 4000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [selectedId]);

  // Auto-scroll to the newest message
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const active = useMemo(
    () => convos.find((c) => c.id === selectedId),
    [convos, selectedId],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return convos;
    return convos.filter(
      (c) =>
        c.otherUser.fullName.toLowerCase().includes(q) ||
        (c.itemTitle ?? "").toLowerCase().includes(q) ||
        (c.lastMessagePreview ?? "").toLowerCase().includes(q),
    );
  }, [convos, search]);

  function send() {
    const text = draft.trim();
    if (!text || !selectedId) return;
    setDraft("");
    convApi
      .send(selectedId, text)
      .then((msg) => {
        setMessages((m) => [...m, msg]);
        refreshList();
      })
      .catch(() => {
        // Restore the draft so the user doesn't lose their text
        setDraft(text);
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
    <div className="my-4 flex h-[calc(100dvh-108px)] overflow-hidden rounded-[14px] border border-line2 bg-paper md:my-5 md:h-[600px] md:max-h-[calc(100vh-190px)]">
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
          <div className="flex items-center gap-2 rounded-lg border border-line bg-card px-3 py-2.5 focus-within:border-rust">
            <Search size={15} className="flex-none text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations"
              className="w-full bg-transparent text-[13px] text-ink placeholder:text-muted focus:outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-5 py-8 text-center text-[13px] text-ink3">
              No conversations match “{search}”.
            </div>
          ) : (
            filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => selectConversation(c.id)}
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
                  <span
                    className={cn(
                      "block truncate text-[12.5px]",
                      c.unreadCount > 0 ? "font-semibold text-ink" : "text-ink3",
                    )}
                  >
                    {c.lastMessagePreview ?? "No messages yet"}
                  </span>
                </span>
                {c.unreadCount > 0 && (
                  <span className="flex h-[18px] min-w-[18px] flex-none items-center justify-center rounded-full bg-rust px-1 text-[10px] font-bold text-white">
                    {c.unreadCount}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Thread */}
      <div
        className={cn(
          "min-w-0 flex-1 flex-col bg-panel md:flex",
          mobileView === "list" ? "hidden" : "flex",
        )}
      >
        {active && (
          <>
            <div className="flex flex-none items-center gap-3 border-b border-line bg-paper px-4 py-3.5 sm:px-[22px]">
              <button
                onClick={() => setMobileView("list")}
                className="text-2xl leading-none text-ink2 md:hidden"
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

            <div
              ref={scrollRef}
              className="flex flex-1 flex-col gap-2 overflow-y-auto p-4 sm:gap-3.5 sm:p-[22px]"
            >
              {loadingMsgs && messages.length === 0 ? (
                <div className="py-8 text-center text-sm text-ink3">Loading...</div>
              ) : messages.length === 0 ? (
                <div className="py-8 text-center text-sm text-ink3">
                  No messages yet — say hello.
                </div>
              ) : (
                messages.map((m) => {
                  const mine = m.senderId === user?.id;
                  return (
                    <div
                      key={m.id}
                      className={cn(
                        "flex max-w-[82%] flex-col sm:max-w-[68%]",
                        mine ? "self-end items-end" : "self-start items-start",
                      )}
                    >
                      <div
                        className={cn(
                          "whitespace-pre-wrap break-words px-3.5 py-2.5 text-[14px] leading-relaxed shadow-sm",
                          mine
                            ? "rounded-[14px_14px_4px_14px] bg-ink text-paper"
                            : "rounded-[14px_14px_14px_4px] border border-line2 bg-white text-ink",
                        )}
                      >
                        {m.body}
                      </div>
                      <span className="mt-1 px-1 text-[10.5px] text-faint">
                        {timeLabel(m.createdAt)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex flex-none items-center gap-2 border-t border-line bg-paper px-3 py-3 sm:gap-3 sm:px-[22px]">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Write a message..."
                className="min-w-0 flex-1 rounded-[9px] border border-line bg-card px-3.5 py-3 text-sm text-ink placeholder:text-muted focus:border-rust focus:outline-none"
              />
              <button
                onClick={send}
                disabled={!draft.trim()}
                aria-label="Send"
                className="flex flex-none items-center gap-2 rounded-[9px] bg-rust px-4 py-3 text-sm font-semibold text-paper hover:bg-rustdark disabled:opacity-50"
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
