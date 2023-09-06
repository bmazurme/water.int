/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';

import Blocks from '../blocks';
import WorkplaceHeader from '../workplace-header';
import WorkplaceTools from '../workplace-tools';

import { useBook } from '../../hooks';

export default function Board() {
  const data = useBook();

  return (
    <>
      {data && (
        <>
          <WorkplaceHeader />
          <Blocks />
          <WorkplaceTools />
        </>
      )}
    </>
  );
}