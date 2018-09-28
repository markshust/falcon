export const toGridTemplate = (items: string[][]) => {
  const columnTemplate = items.shift();
  if (!columnTemplate) return;

  const gridAreas = items
    .map(item => {
      const rowTemplate = item.length > columnTemplate.length ? item.shift() : '';
      return `"${item.join(' ')}" ${rowTemplate}`;
    })
    .join(' ');

  return `${gridAreas} / ${columnTemplate.join(' ')}`;
};
