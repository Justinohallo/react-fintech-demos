#!/usr/bin/env bash
# Runs /challenge NN headlessly, one fresh Claude Code session per challenge,
# sequentially on main. Stops at the first blocker or missing commit.
# Usage: scripts/build-mocks.sh [from] [to]   e.g. scripts/build-mocks.sh 3 10
set -euo pipefail
cd "$(dirname "$0")/.."
from=${1:-1}; to=${2:-10}
mkdir -p logs

for n in $(seq "$from" "$to"); do
  nn=$(printf %02d "$n"); task="T-$((n + 1))"
  before=$(git rev-parse HEAD)
  echo "▶ $task · challenge $nn · log: logs/$task.log"

  claude -p "/challenge $nn" --model sonnet > "logs/$task.log" 2>&1 \
    || { echo "✗ $task: claude exited non-zero. See logs/$task.log"; exit 1; }

  subject=$(git log -1 --format=%s)
  if [ "$(git rev-parse HEAD)" = "$before" ]; then
    echo "✗ $task: no commit made. See logs/$task.log"; exit 1
  elif [[ "$subject" == BLOCKED* ]]; then
    echo "■ $task blocked: $subject — see BLOCKERS.md"; exit 2
  elif [[ "$subject" != "$task"* ]]; then
    echo "✗ $task: last commit doesn't name the task: $subject"; exit 1
  fi
  echo "✓ $subject"
done
echo "Done. Review logs/, then: git push"
