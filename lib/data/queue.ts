export class Queue<T> {
  #buffer: (T | undefined)[] = [];
  #head = 0;
  #tail = 0;
  #size = 0;

  static of<T>(value: T): Queue<T> {
    const queue = new Queue<T>();
    queue.enqueue(value);
    return queue;
  }

  isEmpty(): boolean {
    return this.#size === 0;
  }

  enqueue(value: T): void {
    if (this.#size === this.#buffer.length) {
      this.#grow();
    }

    this.#buffer[this.#tail] = value;
    if (++this.#tail === this.#buffer.length) this.#tail = 0;
    this.#size++;
  }

  dequeue(): T | void {
    if (this.#size === 0) {
      return;
    }

    const value = this.#buffer[this.#head];
    this.#buffer[this.#head] = undefined; // for GC
    if (++this.#head === this.#buffer.length) this.#head = 0;
    this.#size--;

    return value;
  }

  #grow(): void {
    const newCapacity = this.#buffer.length === 0 ? 4 : this.#buffer.length * 2;
    const newBuffer = new Array<T | undefined>(newCapacity);

    for (let i = 0; i < this.#size; i++) {
      newBuffer[i] = this.#buffer[(this.#head + i) % this.#buffer.length];
    }

    this.#buffer = newBuffer;
    this.#head = 0;
    this.#tail = this.#size;
  }
}
