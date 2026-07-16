import { requireProfile } from "@/lib/data";
import { TaskWizard } from "@/components/tasks/TaskWizard";

export const metadata = { title: "Post a task — Task Flow" };
export const dynamic = "force-dynamic";

export default async function NewTaskPage() {
  await requireProfile();

  return (
    <div className="animate-fade-in">
      <h1 className="text-h2">Post a new task</h1>
      <p className="mt-2 text-xl text-ink-soft">
        Tell us what you need and we&apos;ll find a trusted helper for you.
      </p>
      <div className="card mt-6">
        <TaskWizard />
      </div>
    </div>
  );
}
