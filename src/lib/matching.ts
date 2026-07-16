import type { Tasker, Task, TaskCategory } from "./types";
import { categoryMeta } from "./constants";

/**
 * Rank verified taskers by how well they suit a task. Skill match is the
 * biggest factor, then reputation and reliability. This powers the
 * "immediate availability from suitable taskers" experience after posting.
 */
export function suitableTaskers(
  taskers: Tasker[],
  category: TaskCategory,
  city?: string | null,
): Tasker[] {
  return taskers
    .map((t) => {
      let score = 0;
      if (t.skills.includes(category)) score += 100;
      if (city && t.city.toLowerCase() === city.toLowerCase()) score += 20;
      if (t.background_checked) score += 8;
      if (t.identity_verified) score += 5;
      score += t.rating * 6;
      score += Math.min(t.tasks_completed, 300) / 40;
      return { t, score };
    })
    .filter((x) => x.score >= 100) // must have the required skill
    .sort((a, b) => b.score - a.score)
    .map((x) => x.t);
}

/**
 * A warm, plain-language confirmation a tasker "sends" when a senior requests
 * them. Keeps the flow alive end-to-end without a live second user.
 */
export function availabilityMessage(tasker: Tasker, task: Task): string {
  const cat = categoryMeta(task.category).label.toLowerCase();
  const when = task.scheduled_date
    ? "on your requested day"
    : "at a time that works for you";
  return (
    `Hello! This is ${tasker.name}. I'd be happy to help with your ` +
    `${cat} task${task.title ? ` ("${task.title}")` : ""}. ` +
    `I'm available ${when} and confirmed. ${tasker.response_time} — ` +
    `feel free to send me any details and I'll take good care of it.`
  );
}

/** A short system line posted to the task thread when a helper is matched. */
export function matchSystemMessage(tasker: Tasker): string {
  return (
    `${tasker.name} — a background-checked, verified helper — has confirmed ` +
    `they can help. You can message them below or schedule a time.`
  );
}
