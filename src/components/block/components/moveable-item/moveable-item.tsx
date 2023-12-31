/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import React, { useRef } from 'react';
import { useParams } from 'react-router';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';

import Item from '../item';

import { useUpdateBlocksMutation } from '../../../../store/api';

import { TYPE } from '../../../../utils';

export default function MoveableItem({ moveCardHandler, moveItemDrop, ...props }: TypeMovableItem | any) {
  const childRef = useRef<HTMLLIElement | null>(null);
  const [updateBlocks] = useUpdateBlocksMutation();
  const { bookId } = useParams();

  const changeItemColumn = async (
    currentItem: TypeItem & { currentColumnIndex: number, id: string },
    columnName: number,
  ) => {
    if (columnName !== currentItem.currentColumnIndex) {
      await updateBlocks({ currentItem, columnName, bookId: bookId! });
    }
  };

  const [, drop] = useDrop({
    accept: TYPE.ITEM,
    hover(
      item: TypeItem & { currentColumnIndex: number, id: string, index: number },
      monitor: DropTargetMonitor<TypeItem & { currentColumnIndex: number, id: string, index: number }, unknown>,
    ) {
      if (!childRef.current) {
        return;
      }
      const dragIndex: number = item.index;
      const hoverIndex: number = props.index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = childRef.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveCardHandler(dragIndex, hoverIndex, item);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
    collect: (monitor) => ({ isOver: monitor.isOver(), canDrop: monitor.canDrop() }),
    async drop(item, monitor) {
      await moveItemDrop();
    },
    canDrop: () => true,
  });

  const [{ opacity }, drag] = useDrag({
    type: TYPE.ITEM,
    item: { ...props },
    end: async (item, monitor) => {
      const dropResult: { name: number } = monitor.getDropResult()!;

      if (dropResult) {
        const { name: currName } = dropResult;
        await changeItemColumn(item, currName);
      }
    },
    collect: (monitor) => ({ opacity: monitor.isDragging() ? 0.4 : 1 }),
  });

  drag(drop(childRef));

  return (<Item itemData={{ ...props, childRef, opacity }} />);
}
