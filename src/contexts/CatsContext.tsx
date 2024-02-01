import axios from 'axios';
import {
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

type CatsList = ICat[] | null;

export interface ICat {
  id: string;
  url: string;
  isFavorite: boolean;
}

export interface ICatsContext {
  cats: CatsList;
  isLoading: boolean;
  loadingTriggerItem: RefObject<HTMLLIElement> | null;
  favoritesWorker: ({ id, url }: ICat) => void;
  galleryType: string;
  toggleGallery: (galleryType: 'allCats' | 'favCats') => void;
  showSpinner: boolean;
}

export const CatsContext = createContext<ICatsContext>({
  cats: [],
  isLoading: false,
  loadingTriggerItem: null,
  favoritesWorker: () => null,
  galleryType: 'allCats',
  toggleGallery: () => null,
  showSpinner: false,
});

export default function CatsContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [galleryType, setGalleryType] = useState<'allCats' | 'favCats'>(
    'allCats'
  );

  const [cats, setCats] = useState<CatsList>(null);

  const [isLoading, setIsLoading] = useState(false);

  const loadingTriggerItem = useRef<HTMLLIElement>(null);

  const allCats = useRef<CatsList>(cats);

  const favoriteCats = useRef<CatsList>([]);

  const showSpinner = galleryType !== 'favCats';

  useEffect(() => {
    getFavoriteCatsFromStorage();
  }, []);

  useEffect(() => {
    if (galleryType === 'favCats') {
      return;
    }

    const observer = new IntersectionObserver(
      (cats) => {
        if (cats[0].isIntersecting) {
          getCats();
        }
      },
      { threshold: 1 }
    );

    const { current } = loadingTriggerItem;

    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [loadingTriggerItem, galleryType]);

  useEffect(() => {
    if (!isLoading && galleryType === 'allCats') {
      setCats(allCats.current);
    }
  }, [isLoading, galleryType]);

  const getCats = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        'https://api.thecatapi.com/v1/images/search?limit=35',
        {
          headers: {
            'x-api-key':
              'live_PeNgercyyNtOVgl5dCEC1I3l5xpvzXu2HWdU1tZl1Dy2OXEmnzUw6LcGLZOBvbqR',
          },
        }
      );

      allCats.current = allCats.current ? [...allCats.current, ...data] : data;
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }, [galleryType, cats]);

  const toggleCats = useCallback(
    (galleryType: 'allCats' | 'favCats') => {
      if (galleryType === 'favCats') {
        setCats(favoriteCats.current);
      }

      if (galleryType === 'allCats') {
        setCats(allCats.current);
      }
    },
    [cats, galleryType]
  );

  const getFavoriteCatsFromStorage = useCallback(() => {
    const catsFromStorage: ICat[] = JSON.parse(
      localStorage.getItem('favoriteCats')!
    );

    favoriteCats.current = catsFromStorage;
  }, [favoriteCats.current]);

  const updateAllCatsList = (isFavorite: boolean, id: string) => {
    allCats.current =
      allCats.current &&
      allCats.current.map((el) => (el.id === id ? { ...el, isFavorite } : el));
  };

  const favoritesWorker = useCallback(
    (cat: ICat) => {
      if (favoriteCats.current?.find((favCat) => favCat.id === cat.id)) {
        favoriteCats.current = favoriteCats.current.filter(
          (favCat) => favCat.id !== cat.id
        );
        updateAllCatsList(false, cat.id);
        // allCats.current =
        //   allCats.current &&
        //   allCats.current.map((el) =>
        //     el.id === cat.id ? { ...el, isFavorite: false } : el
        //   );
      } else {
        favoriteCats.current = favoriteCats.current
          ? [...favoriteCats.current, { ...cat, isFavorite: true }]
          : [{ ...cat, isFavorite: true }];

        // allCats.current =
        //   allCats.current &&
        //   allCats.current.map((el) =>
        //     el.id === cat.id ? { ...el, isFavorite: true } : el
        //   );
        updateAllCatsList(true, cat.id);
      }

      if (galleryType === 'favCats') {
        setCats(favoriteCats.current);
      }

      localStorage.setItem(
        'favoriteCats',
        JSON.stringify(favoriteCats.current)
      );
    },
    [favoriteCats.current, galleryType]
  );

  const toggleGallery = useCallback(
    (galleryType: 'allCats' | 'favCats') => {
      toggleCats(galleryType);
      setGalleryType(galleryType);
    },
    [galleryType, favoriteCats.current, allCats.current]
  );

  return (
    <CatsContext.Provider
      value={{
        cats,
        isLoading,
        loadingTriggerItem,
        favoritesWorker,
        galleryType,
        toggleGallery,
        showSpinner,
      }}
    >
      {children}
    </CatsContext.Provider>
  );
}
