export class PriorityQueue<T> {
  private heap: { priority: number; value: T }[] = [];

  // Enqueue an element with its priority
  enqueue(value: T, priority: number): void {
    this.heap.push({ value, priority });
    this.bubbleUp();
  }

  // Dequeue the element with the highest priority (largest priority number)
  dequeue(): T {
    if (this.isEmpty()) throw new Error("Queue is empty");

    const root = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last!;
      this.sinkDown();
    }
    return root.value;
  }

  // Peek the highest priority element
  peek(): T | undefined {
    return this.heap[0]?.value;
  }

  // Check if the queue is empty
  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  // Bubble up to maintain heap property
  private bubbleUp(): void {
    let index = this.heap.length - 1;
    const element = this.heap[index];

    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];

      // If the element's priority is less than the parent's, stop (we want the higher priority at the top)
      if (element.priority <= parent.priority) break;

      // Swap with the parent
      this.heap[index] = parent;
      this.heap[parentIndex] = element;
      index = parentIndex;
    }
  }

  // Sink down to maintain heap property after dequeue
  private sinkDown(): void {
    let index = 0;
    const length = this.heap.length;
    const element = this.heap[0];

    while (true) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let swapIndex: number | null = null;

      if (leftChildIndex < length) {
        const leftChild = this.heap[leftChildIndex];
        if (leftChild.priority > element.priority) {
          swapIndex = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        const rightChild = this.heap[rightChildIndex];
        if (
          (swapIndex === null && rightChild.priority > element.priority) ||
          (swapIndex !== null &&
            rightChild.priority > this.heap[swapIndex].priority)
        ) {
          swapIndex = rightChildIndex;
        }
      }

      if (swapIndex === null) break;

      // Swap with the child having higher priority
      this.heap[index] = this.heap[swapIndex];
      this.heap[swapIndex] = element;
      index = swapIndex;
    }
  }
}
