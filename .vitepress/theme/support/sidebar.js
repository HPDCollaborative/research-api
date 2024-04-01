export function getFlatSideBarLinks(menuBlocks) {
  let links = [];

  if (Array.isArray(menuBlocks)) {
    for (const block of menuBlocks) {
      if (block.items && Array.isArray(block.items)) {
        links.push(...block.items);
      }
    }
  } else {
    console.error('menuBlocks is not iterable:', menuBlocks);
  }

  return links;
}
