import { useContext } from 'react';
import CatsList from '../CatsList';

import style from './styles.module.scss';
import { CatsContext } from '../../contexts/CatsContext';
import { SyncLoader } from 'react-spinners';

export default function Main() {
  const { isLoading, showSpinner } = useContext(CatsContext);

  return (
    <main className={style.main}>
      <CatsList />
      {showSpinner && (
        <SyncLoader
          loading={isLoading}
          color="rgb(69, 143, 255)"
          cssOverride={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '124px',
          }}
        />
      )}
    </main>
  );
}
