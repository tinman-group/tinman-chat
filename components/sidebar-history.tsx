"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  useSidebar
} from "@/components/ui/sidebar";
import type { Chat } from "@/lib/db/schema";
import { fetcher } from "@/lib/utils";
import { isToday, isYesterday, subMonths, subWeeks } from "date-fns";
import { motion } from "framer-motion";
import type { User } from "next-auth";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import useSWRInfinite from "swr/infinite";
import { LoaderIcon } from "./icons";
import { ChatItem } from "./sidebar-history-item";

type ChatGroup = {
  label: string;
  chats: Chat[];
};

export interface ChatHistory {
  chats: Array<Chat>;
  hasMore: boolean;
}

const PAGE_SIZE = 20;

function SidebarSystemMessage({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`text-sidebar-foreground/50 flex w-full flex-row items-center justify-center gap-2 px-2 text-center text-xs ${className}`}
    >
      {children}
    </div>
  );
}

const groupChatsByDate = (chats: Chat[]): ChatGroup[] => {
  const now = new Date();
  const oneWeekAgo = subWeeks(now, 1);
  const oneMonthAgo = subMonths(now, 1);

  const today: ChatGroup = { label: "Today", chats: [] };
  const yesterday: ChatGroup = { label: "Yesterday", chats: [] };
  const lastWeek: ChatGroup = { label: "Last 7 days", chats: [] };
  const lastMonth: ChatGroup = { label: "Last 30 days", chats: [] };
  const older: ChatGroup = { label: "Older than last month", chats: [] };

  chats.forEach((chat) => {
    const chatDate = new Date(chat.createdAt);

    if (isToday(chatDate)) {
      today.chats.push(chat);
    } else if (isYesterday(chatDate)) {
      yesterday.chats.push(chat);
    } else if (chatDate > oneWeekAgo) {
      lastWeek.chats.push(chat);
    } else if (chatDate > oneMonthAgo) {
      lastMonth.chats.push(chat);
    } else {
      older.chats.push(chat);
    }
  });

  return [today, yesterday, lastWeek, lastMonth, older].filter(
    (group) => group.chats.length > 0
  );
};

export function getChatHistoryPaginationKey(
  pageIndex: number,
  previousPageData: ChatHistory
) {
  if (previousPageData && previousPageData.hasMore === false) {
    return null;
  }

  if (pageIndex === 0) return `/api/history?limit=${PAGE_SIZE}`;

  const firstChatFromPage = previousPageData.chats.at(-1);

  if (!firstChatFromPage) return null;

  return `/api/history?ending_before=${firstChatFromPage.id}&limit=${PAGE_SIZE}`;
}

export function SidebarHistory({ user }: { user: User | undefined }) {
  const { setOpenMobile } = useSidebar();
  const { id } = useParams();

  const {
    data: paginatedChatHistories,
    setSize,
    isValidating,
    isLoading,
    mutate
  } = useSWRInfinite<ChatHistory>(getChatHistoryPaginationKey, fetcher, {
    fallbackData: []
  });

  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const hasReachedEnd = paginatedChatHistories
    ? paginatedChatHistories.some((page) => page.hasMore === false)
    : false;

  const hasEmptyChatHistory = paginatedChatHistories
    ? paginatedChatHistories.every((page) => page.chats.length === 0)
    : false;

  const handleDelete = async () => {
    const deletePromise = fetch(`/api/chat?id=${deleteId}`, {
      method: "DELETE"
    });

    toast.promise(deletePromise, {
      loading: "Deleting chat...",
      success: () => {
        mutate((chatHistories) => {
          if (chatHistories) {
            return chatHistories.map((chatHistory) => ({
              ...chatHistory,
              chats: chatHistory.chats.filter((chat) => chat.id !== deleteId)
            }));
          }
        });

        return "Chat deleted successfully";
      },
      error: "Failed to delete chat"
    });

    setShowDeleteDialog(false);

    if (deleteId === id) {
      router.push("/");
    }
  };

  if (!user) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarSystemMessage>
            Login to save and revisit previous chats!
          </SidebarSystemMessage>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (isLoading) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Today</SidebarGroupLabel>
        <SidebarGroupContent>
          <div className="flex flex-col">
            {[44, 32, 28, 64, 52].map((item) => (
              <div
                key={item}
                className="flex h-8 items-center gap-2 rounded-md px-2"
              >
                <div
                  className="bg-sidebar-accent-foreground/10 h-4 max-w-[--skeleton-width] flex-1 rounded-md"
                  style={
                    {
                      "--skeleton-width": `${item}%`
                    } as React.CSSProperties
                  }
                />
              </div>
            ))}
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (hasEmptyChatHistory) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarSystemMessage>
            Your conversations will appear here once you start chatting!
          </SidebarSystemMessage>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <>
      {paginatedChatHistories &&
        (() => {
          const chatsFromHistory = paginatedChatHistories.flatMap(
            (paginatedChatHistory) => paginatedChatHistory.chats
          );

          const chatGroups = groupChatsByDate(chatsFromHistory);

          return (
            <>
              {chatGroups.map((group) => (
                <SidebarGroup key={group.label}>
                  <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.chats.map((chat) => (
                        <ChatItem
                          key={chat.id}
                          chat={chat}
                          isActive={chat.id === id}
                          onDelete={(chatId) => {
                            setDeleteId(chatId);
                            setShowDeleteDialog(true);
                          }}
                          setOpenMobile={setOpenMobile}
                        />
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}

              <motion.div
                onViewportEnter={() => {
                  if (!isValidating && !hasReachedEnd) {
                    setSize((size) => size + 1);
                  }
                }}
              />

              {hasReachedEnd ? (
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarSystemMessage className="mt-8">
                      You have reached the end of your chat history.
                    </SidebarSystemMessage>
                  </SidebarGroupContent>
                </SidebarGroup>
              ) : (
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarSystemMessage className="mt-8 p-2 dark:text-zinc-400">
                      <div className="animate-spin">
                        <LoaderIcon />
                      </div>
                      <div>Loading Chats...</div>
                    </SidebarSystemMessage>
                  </SidebarGroupContent>
                </SidebarGroup>
              )}
            </>
          );
        })()}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              chat and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
