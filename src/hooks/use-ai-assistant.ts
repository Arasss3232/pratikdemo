import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  aiListConversations,
  aiCreateConversation,
  aiDeleteConversation,
  aiRenameConversation,
  aiGetMessages,
  aiSendMessage,
  aiApproveProposal,
  aiRejectProposal,
  aiUndoProposal,
} from "@/lib/ai-assistant.functions";

export type Conversation = {
  id: string;
  title: string;
  category: string | null;
  pinned: boolean;
  archived: boolean;
  last_message_at: string;
  created_at: string;
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  metadata: any;
  proposal_id: string | null;
  created_at: string;
};

export type Proposal = {
  id: string;
  action_type: string;
  target_table: string;
  target_id: string;
  summary: string;
  before_value: Record<string, any>;
  after_value: Record<string, any>;
  proposed_changes: Record<string, any>;
  risk_level: string;
  status: "pending" | "applied" | "rejected" | "undone" | "failed";
  reversible: boolean;
  error_message: string | null;
  created_at: string;
  applied_at: string | null;
};

export type SendContext = { actionType: string; targetId: string } | null;

export function useAiAssistant() {
  const listFn = useServerFn(aiListConversations);
  const createFn = useServerFn(aiCreateConversation);
  const deleteFn = useServerFn(aiDeleteConversation);
  const renameFn = useServerFn(aiRenameConversation);
  const getMessagesFn = useServerFn(aiGetMessages);
  const sendFn = useServerFn(aiSendMessage);
  const approveFn = useServerFn(aiApproveProposal);
  const rejectFn = useServerFn(aiRejectProposal);
  const undoFn = useServerFn(aiUndoProposal);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [proposals, setProposals] = useState<Record<string, Proposal>>({});
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const bootedRef = useRef(false);

  const refreshConversations = useCallback(async () => {
    const list = (await listFn()) as Conversation[];
    setConversations(list);
    return list;
  }, [listFn]);

  const loadMessages = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const res = (await getMessagesFn({ data: { conversationId: id } })) as {
          messages: Message[];
          proposals: Record<string, Proposal>;
        };
        setMessages(res.messages ?? []);
        setProposals(res.proposals ?? {});
      } finally {
        setLoading(false);
      }
    },
    [getMessagesFn],
  );

  const selectConversation = useCallback(
    async (id: string) => {
      setActiveId(id);
      await loadMessages(id);
    },
    [loadMessages],
  );

  const newConversation = useCallback(
    async (title?: string) => {
      const created = (await createFn({ data: { title: title ?? "Yeni görüşme" } })) as Conversation;
      const list = await refreshConversations();
      const target = list.find((c) => c.id === created.id) ?? created;
      setActiveId(target.id);
      setMessages([]);
      setProposals({});
      return target;
    },
    [createFn, refreshConversations],
  );

  const deleteConversation = useCallback(
    async (id: string) => {
      await deleteFn({ data: { id } });
      const list = await refreshConversations();
      if (activeId === id) {
        const next = list[0];
        if (next) await selectConversation(next.id);
        else {
          setActiveId(null);
          setMessages([]);
          setProposals({});
        }
      }
    },
    [deleteFn, refreshConversations, activeId, selectConversation],
  );

  const renameConversation = useCallback(
    async (id: string, title: string) => {
      await renameFn({ data: { id, title } });
      await refreshConversations();
    },
    [renameFn, refreshConversations],
  );

  const send = useCallback(
    async (content: string, ctx: SendContext) => {
      if (!activeId) return;
      const now = new Date().toISOString();
      const optimistic: Message = {
        id: `tmp-${Date.now()}`,
        role: "user",
        content,
        metadata: ctx ? { context: ctx } : {},
        proposal_id: null,
        created_at: now,
      };
      setMessages((m) => [...m, optimistic]);
      setSending(true);
      try {
        const res = (await sendFn({
          data: { conversationId: activeId, content, context: ctx },
        })) as { assistantMessage: Message | null; proposal: Proposal | null };
        if (res.assistantMessage) {
          setMessages((m) => [...m, res.assistantMessage as Message]);
        }
        if (res.proposal) {
          setProposals((p) => ({ ...p, [res.proposal!.id]: res.proposal as Proposal }));
        }
        await refreshConversations();
      } finally {
        setSending(false);
      }
    },
    [activeId, sendFn, refreshConversations],
  );

  const approve = useCallback(
    async (id: string, force = false) => {
      const updated = (await approveFn({ data: { id, force } })) as Proposal;
      if (updated) setProposals((p) => ({ ...p, [updated.id]: updated }));
      return updated;
    },
    [approveFn],
  );
  const reject = useCallback(
    async (id: string) => {
      const updated = (await rejectFn({ data: { id } })) as Proposal;
      if (updated) setProposals((p) => ({ ...p, [updated.id]: updated }));
      return updated;
    },
    [rejectFn],
  );
  const undo = useCallback(
    async (id: string) => {
      const updated = (await undoFn({ data: { id } })) as Proposal;
      if (updated) setProposals((p) => ({ ...p, [updated.id]: updated }));
      return updated;
    },
    [undoFn],
  );

  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;
    (async () => {
      const list = await refreshConversations();
      if (list.length > 0) await selectConversation(list[0].id);
    })().catch(() => {
      /* soft-fail; UI shows empty state */
    });
  }, [refreshConversations, selectConversation]);

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId],
  );

  return {
    conversations,
    active,
    activeId,
    messages,
    proposals,
    loading,
    sending,
    selectConversation,
    newConversation,
    deleteConversation,
    renameConversation,
    send,
    approve,
    reject,
    undo,
  };
}
