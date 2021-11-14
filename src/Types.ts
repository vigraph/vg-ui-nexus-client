// Common types for Nexus Client

export type QueueStatus =
{
  state: string;        // 'idle', 'waiting', 'active'
  position?: number;    // Position in queue - 0, not in queue, 1 = active
  total?: number;       // Total people in the queue
  time?: number;        // Seconds before our turn / end of turn
};

