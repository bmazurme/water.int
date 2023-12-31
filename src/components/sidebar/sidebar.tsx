import React, { useEffect } from 'react';
import classNames from 'classnames';
import { useErrorBoundary } from 'react-error-boundary';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

import Header from './components/header';
import List from './components/list';

import { useUser } from '../../hooks';
import { useLocalStorage } from '../../hooks/use-local-storage';
import { useGetBookByIdMutation } from '../../store/api';

import style from './sidebar.module.css';

export default function Sidebar() {
  const user = useUser();
  const { showBoundary } = useErrorBoundary();
  const [isOpen, setIsOpen] = useLocalStorage('sidebar', false);
  const [getBookById, { isLoading }] = useGetBookByIdMutation();

  const button = {
    handler: () => setIsOpen(!isOpen),
    component: isOpen ? ChevronLeftIcon : ChevronRightIcon,
  };

  useEffect(() => {
    const getData = async () => {
      if (user && 'projectId' in user && user?.projectId) {
        try {
          await getBookById(user?.projectId);
        } catch (err) {
          showBoundary(err);
        }
      }
    };

    getData();
  }, [user?.projectId]);

  return (
    <div className={classNames(style.sidebar, { [style.open]: isOpen })}>
      <Header isOpen={isOpen} button={button} />
      <List isOpen={isOpen} isLoading={isLoading} />
    </div>
  );
}
