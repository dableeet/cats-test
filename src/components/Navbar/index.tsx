import { useContext } from 'react';
import Button from './Button/Index';
import style from './styles.module.scss';
import { CatsContext } from '../../contexts/CatsContext';

export default function Navbar() {
  const { galleryType, toggleGallery } = useContext(CatsContext);

  const btns = [
    {
      onClick: () => toggleGallery('allCats'),
      isDisabled: galleryType === 'allCats',
      title: 'Все котики',
    },
    {
      onClick: () => toggleGallery('favCats'),
      isDisabled: galleryType === 'favCats',
      title: 'Любимые котики',
    },
  ];

  return (
    <nav className={style['navbar']}>
      <ul className={style['btn-list']}>
        {btns.map((btn) => (
          <Button key={btn.title} {...btn} />
        ))}
      </ul>
    </nav>
  );
}
