export interface LinkedListNode<T> {
  data: T
  next: LinkedListNode<T> | null
}

export interface LinkedList<T> {
  head: LinkedListNode<T> | null
  last: LinkedListNode<T> | null
  size: number
}

export function createLinkedList<T>(data: T[]) {
  let head!: LinkedListNode<T>
  let last!: LinkedListNode<T>
  data.forEach((t, index) => {
    const node: LinkedListNode<T> = {
      data: t,
      next: null,
    }

    if (index === 0) {
      head = node
      last = node
    }
    else {
      last.next = node
    }
  })

  const list = {
    head,
    size: data.length,
    last,
  }

  function isEmpty() {
    return list.head === null || list.size === 0
  }

  function findNode(node: LinkedListNode<T>) {
    if (isEmpty())
      return null

    let pre = null
    let cur: LinkedListNode<T> | null = list.head

    while (cur !== null) {
      if (node === cur) {
        return [pre, cur, cur.next] as const
      }
      else {
        pre = cur
        cur = cur.next
      }
    }
    return null
  }

  function moveToHead(node: LinkedListNode<T>) {
    const result = findNode(node)
    if (result) {
      const [pre, cur, next] = result
      if (pre)
        pre.next = next

      cur.next = list.head
      list.head = cur
    }
  }

  return {
    list,
    isEmpty,
    moveToHead,
  }
}
