export default class PriorityQueue<T> {
    private _elements: T[];
    private _comparator: (a: T, b: T) => number;

    constructor(comparator: (a: T, b: T) => number) {
      this._elements = [];
      this._comparator = comparator;
    }

    enqueue(element: T): void {
      this._elements.push(element);
      this._elements.sort((a, b) => this._comparator(a, b));
    }

    dequeue(): T {
      return this._elements.shift();
    }

    isEmpty(): boolean {
      return this._elements.length === 0;
    }

    contains(elementIndex: number): boolean {
      return this._elements.some((element: any) => element.index === elementIndex);
    }
}
  