import { useContext } from 'react';
import { CatsContext, ICatsContext } from '../../contexts/CatsContext';

import CatCard from './CatCard';
import style from './styles.module.scss';

export default function CatsList() {
  const { cats, loadingTriggerItem, favoritesWorker, galleryType } =
    useContext<ICatsContext>(CatsContext);

  return (
    <>
      <ul className={style.list}>
        {cats &&
          cats.map((cat) => (
            <CatCard
              onClick={favoritesWorker}
              key={crypto.randomUUID()}
              {...cat}
            />
          ))}
        <li ref={loadingTriggerItem} className={style['hidden-item']} />
      </ul>
      {galleryType === 'favCats' && !cats?.length && (
        <p className={style.notify}>Вам еще не понравился ни один котик ...</p>
      )}
    </>
  );
}
