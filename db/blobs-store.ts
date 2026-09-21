import { getStore } from "@netlify/blobs";
import type { Answer } from "../lib/game";

export type GameResult = {
  id: number;
  name: string;
  company: string;
  role: string;
  contact: string;
  score: number;
  answers: Answer[];
  runKey: string;
  createdAt: string;
};

const KEY = "results";

function store() {
  return getStore("game-results");
}

async function readAll(): Promise<GameResult[]> {
  const data = await store().get(KEY, { type: "json" });
  return Array.isArray(data) ? (data as GameResult[]) : [];
}

async function writeAll(results: GameResult[]) {
  await store().setJSON(KEY, results);
}

export async function listResults(limit = 100) {
  const results = await readAll();
  return results
    .slice()
    .sort((a, b) => b.id - a.id)
    .slice(0, limit)
    .map(({ id, name, company, role, contact, score, createdAt }) => ({
      id,
      name,
      company,
      role,
      contact,
      score,
      createdAt,
    }));
}

export async function insertResult(input: {
  name: string;
  company: string;
  role: string;
  contact: string;
  score: number;
  answers: Answer[];
  runKey: string;
}) {
  const results = await readAll();
  if (results.some((r) => r.runKey === input.runKey)) return;
  const id = results.reduce((max, r) => Math.max(max, r.id), 0) + 1;
  results.push({
    id,
    ...input,
    createdAt: new Date().toISOString(),
  });
  await writeAll(results);
}

export async function deleteResult(id: number) {
  const results = await readAll();
  await writeAll(results.filter((r) => r.id !== id));
}
