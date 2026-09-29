import { taskFor, type ChallengeNumber } from "@/content/challenges";

export function MockPlaceholder({ number }: { number: ChallengeNumber }) {
  return (
    <main className="grid min-h-screen place-items-center bg-stone-100 p-8 font-sans text-stone-700">
      <h1 className="text-xl font-medium">Mock not built yet — {taskFor(number)}</h1>
    </main>
  );
}
