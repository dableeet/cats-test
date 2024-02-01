import style from './styles.module.scss';

export default function Button({
  onClick,
  isDisabled,
  title,
}: {
  onClick: () => void;
  isDisabled: boolean;
  title: string;
}) {
  return (
    <li className={style['btn-box']}>
      <button
        onClick={onClick}
        disabled={isDisabled}
        className={style['btn']}
        type="button"
      >
        {title}
      </button>
    </li>
  );
}
