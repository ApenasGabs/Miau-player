import { ChangeEvent, FC, useEffect, useState } from "react";
import { MediaProps } from "../../types";

const Home: FC = () => {
  const [playlistData, setPlaylistData] = useState<Record<
    string,
    Record<string, MediaProps[]>
  > | null>(null);

  useEffect(() => {
    // Carregar dados do localStorage ao carregar a página
    const savedData = loadAllCategoriesFromLocalStorage();
    if (Object.keys(savedData).length > 0) {
      setPlaylistData(savedData);
    }
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const contents = e.target?.result as string;
        if (contents) {
          parseM3U(contents);
        }
      };

      reader.readAsText(file);
    }
  };

  const parseM3U = (data: string): void => {
    let currentCategory: string | null = null;

    const pattern =
      /#EXTINF:-1 tvg-name="(.*?)" tvg-logo="(.*?)" group-title="(.*?)",(.*?)\n(.*?)\n/g;
    let match: RegExpExecArray | null = null;

    while ((match = pattern.exec(data)) !== null) {
      const currentTitle = match[4]; // Salva o título da faixa
      const urlLine = match[5];
      const logo = match[2];

      // Extrair informações de tvg-name, tvg-logo e group-title, se disponíveis
      const groupTitleMatch = match[3];

      if (groupTitleMatch != null) {
        currentCategory = groupTitleMatch;
      } else {
        currentCategory = null;
      }

      if (currentCategory != null) {
        const [mainGroup, subGroup, ...rest] = currentCategory.split(" | ");
        const finalSubGroup =
          [subGroup, ...rest].filter(Boolean).join(" | ") || "No Subgroup";
        saveCategoryToLocalStorage(mainGroup, finalSubGroup, {
          videoUrl: urlLine,
          title: currentTitle,
          logo,
        });
      }
    }

    // Atualiza o estado com os dados do localStorage
    const updatedData = loadAllCategoriesFromLocalStorage();
    setPlaylistData(updatedData);
  };

  const saveCategoryToLocalStorage = (
    mainGroup: string,
    subGroup: string,
    mediaItem: MediaProps
  ) => {
    const savedData = localStorage.getItem(mainGroup);
    let categoryData: Record<string, MediaProps[]> = {};

    if (savedData) {
      categoryData = JSON.parse(savedData);
    }

    if (!(subGroup in categoryData)) {
      categoryData[subGroup] = [];
    }

    categoryData[subGroup].push(mediaItem);

    localStorage.setItem(mainGroup, JSON.stringify(categoryData));
  };

  const loadAllCategoriesFromLocalStorage = (): Record<
    string,
    Record<string, MediaProps[]>
  > => {
    const allCategories: Record<string, Record<string, MediaProps[]>> = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const categoryData = localStorage.getItem(key);
        if (categoryData) {
          allCategories[key] = JSON.parse(categoryData);
        }
      }
    }

    return allCategories;
  };

  return (
    <div>
      <p>Home</p>

      <input type="file" onChange={handleFileChange} />

      {playlistData &&
        Object.keys(playlistData).map((mainGroup, index) => (
          <div key={index}>
            <h2>{mainGroup}</h2>
            {Object.keys(playlistData[mainGroup]).map((subGroup, subIndex) => (
              <div key={subIndex}>
                <h3>{subGroup}</h3>
                <ul>
                  {playlistData[mainGroup][subGroup].map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <img src={item.logo} alt={item.title + "image"} />
                      <a href={item.videoUrl}>{item.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};

export default Home;
