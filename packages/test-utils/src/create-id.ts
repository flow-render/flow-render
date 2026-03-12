let idCount = 0;

export function createId () {
  return `${ idCount++ }--${ Math.random().toString(36) }`;
}
