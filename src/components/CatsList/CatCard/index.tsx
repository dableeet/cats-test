import { ICat } from '../../../contexts/CatsContext';
import { MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import style from './styles.module.scss';
import { useState } from 'react';

interface CatCardProps extends ICat {
  onClick: ({ url, id }: ICat) => void;
}

export default function CatCard({
  url,
  id,
  onClick,
  isFavorite,
}: CatCardProps) {
  const [likeIsHovered, setLikeIsHovered] = useState(false);
  const [cardIsHovered, setCardIsHovered] = useState(false);
  const [isCurrentFavorite, setIsCurrentFavorite] = useState(false);

  return (
    <li
      className={style['cat-box']}
      onMouseEnter={() => setCardIsHovered(true)}
      onMouseLeave={() => setCardIsHovered(false)}
    >
      <img className={style['cat-image']} src={url} alt={id} />
      {cardIsHovered && (
        <button
          onMouseEnter={() => setLikeIsHovered(true)}
          onMouseLeave={() => setLikeIsHovered(false)}
          onClick={() =>
            setIsCurrentFavorite((prevState) => {
              onClick({ url, id, isFavorite: !prevState });
              return !prevState;
            })
          }
          type="button"
          className={style['cat-like-btn']}
        >
          {!likeIsHovered && !isFavorite && !isCurrentFavorite ? (
            <MdFavoriteBorder size={48} />
          ) : (
            <MdFavorite size={48} />
          )}
        </button>
      )}
    </li>
  );
}
