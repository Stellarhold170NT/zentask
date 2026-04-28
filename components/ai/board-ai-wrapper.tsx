"use client";

import { useMemo } from "react";
import { type TamboTool } from "@tambo-ai/react";
import { z } from "zod";
import { TamboProvider } from "./tambo-provider";
import { AIChatSidebar } from "./ai-chat-sidebar";
import {
  aiMoveCard,
  aiCreateCard,
  aiUpdateCard,
  aiGetBoardStatus,
} from "@/app/(dashboard)/ai-actions";

interface BoardAIWrapperProps {
  boardId: string;
  orgSlug: string;
  projectId: string;
  columns: { id: string; name: string }[];
  cards: {
    id: string;
    title: string;
    description: string | null;
    priority: string | null;
    dueDate: Date | null;
    labels: string[] | null;
    assigneeId: string | null;
    assigneeName: string | null;
    columnId: string;
  }[];
  members: { userId: string; fullName: string | null; email: string }[];
}

export function BoardAIWrapper({
  boardId,
  orgSlug,
  projectId,
  columns,
  cards,
  members,
}: BoardAIWrapperProps) {
  const columnList = columns.map((c) => c.name).join(", ");
  const cardList = cards
    .map(
      (c) => `"${c.title}" (in ${columns.find((col) => col.id === c.columnId)?.name})`
    )
    .join(", ");

  const tools = useMemo<TamboTool[]>(
    () => [
      {
        name: "moveCard",
        description: `Move a card to a different column. Available columns: ${columnList}. Current cards: ${cardList}.`,
        tool: async ({
          cardTitle,
          targetColumn,
        }: {
          cardTitle: string;
          targetColumn: string;
        }) => {
          const matches = cards.filter(
            (c) => c.title.toLowerCase() === cardTitle.toLowerCase()
          );
          if (matches.length === 0) {
            return { error: `Card "${cardTitle}" not found` };
          }
          if (matches.length > 1) {
            return {
              error: `Multiple cards match "${cardTitle}". Please be more specific.`,
              candidates: matches.map((c) => c.title),
            };
          }
          return aiMoveCard(matches[0].id, targetColumn, orgSlug, projectId, boardId);
        },
        toolSchema: z
          .function()
          .args(
            z.object({
              cardTitle: z.string().describe("The exact title of the card to move"),
              targetColumn: z.string().describe("The exact name of the target column"),
            })
          )
          .returns(z.any()),
      },
      {
        name: "createCard",
        description: `Create a new card in a column. Available columns: ${columnList}.`,
        tool: async ({
          columnName,
          title,
          description,
          priority,
          dueDate,
          labels,
          assigneeEmail,
        }: {
          columnName: string;
          title: string;
          description?: string;
          priority?: "low" | "medium" | "high";
          dueDate?: string;
          labels?: string[];
          assigneeEmail?: string;
        }) => {
          return aiCreateCard(
            columnName,
            title,
            description,
            priority,
            dueDate,
            labels,
            assigneeEmail,
            orgSlug,
            projectId,
            boardId
          );
        },
        toolSchema: z
          .function()
          .args(
            z.object({
              columnName: z
                .string()
                .describe("The exact name of the column to create the card in"),
              title: z.string().describe("The title of the new card"),
              description: z.string().optional().describe("Optional description"),
              priority: z
                .enum(["low", "medium", "high"])
                .optional()
                .describe("Optional priority"),
              dueDate: z
                .string()
                .optional()
                .describe("Optional due date in ISO format (YYYY-MM-DD)"),
              labels: z
                .array(z.string())
                .optional()
                .describe("Optional array of label strings"),
              assigneeEmail: z
                .string()
                .optional()
                .describe("Optional email of assignee"),
            })
          )
          .returns(z.any()),
      },
      {
        name: "updateCard",
        description: `Update a card's properties. Available cards: ${cards.map((c) => `"${c.title}"`).join(", ")}.`,
        tool: async ({
          cardTitle,
          updates,
        }: {
          cardTitle: string;
          updates: {
            title?: string;
            description?: string;
            priority?: "low" | "medium" | "high";
            dueDate?: string | null;
            labels?: string[];
            assigneeEmail?: string | null;
          };
        }) => {
          const matches = cards.filter(
            (c) => c.title.toLowerCase() === cardTitle.toLowerCase()
          );
          if (matches.length === 0) return { error: `Card "${cardTitle}" not found` };
          if (matches.length > 1) {
            return {
              error: `Multiple cards match "${cardTitle}". Please be more specific.`,
              candidates: matches.map((c) => c.title),
            };
          }
          return aiUpdateCard(matches[0].id, updates, orgSlug, projectId, boardId);
        },
        toolSchema: z
          .function()
          .args(
            z.object({
              cardTitle: z
                .string()
                .describe("The exact title of the card to update"),
              updates: z
                .object({
                  title: z.string().optional(),
                  description: z.string().optional(),
                  priority: z.enum(["low", "medium", "high"]).optional(),
                  dueDate: z.string().optional().nullable(),
                  labels: z.array(z.string()).optional(),
                  assigneeEmail: z.string().optional().nullable(),
                })
                .describe("The fields to update"),
            })
          )
          .returns(z.any()),
      },
      {
        name: "getBoardStatus",
        description:
          "Get the current board status including overdue tasks, high priority items, and task distribution across columns.",
        tool: async () => {
          return aiGetBoardStatus(orgSlug, projectId, boardId);
        },
        toolSchema: z.function().args().returns(z.any()),
      },
    ],
    [boardId, orgSlug, projectId, columns, cards]
  );

  return (
    <TamboProvider tools={tools}>
      <AIChatSidebar
        boardId={boardId}
        orgSlug={orgSlug}
        projectId={projectId}
        columns={columns}
        cards={cards}
        members={members}
      />
    </TamboProvider>
  );
}
