import React from 'react';

import Container from '../../components/container';
import Workplace from '../../components/workplace';

import style from './main.module.css';

export default function Main() {
  return (
    <div className={style.app}>
      <Container sidebar header children={<Workplace />} />
    </div>
  );
}