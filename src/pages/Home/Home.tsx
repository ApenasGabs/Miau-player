import { ChangeEvent, FC, useEffect, useState } from "react";

interface MediaProps {
  videoUrl: string;
  title: string;
}

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
          console.log("contents: ", contents);
          parseM3U(contents);
        }
      };

      reader.readAsText(file);
    }
  };

  const parseM3U = (data: string): void => {
    // eslint-disable-next-line no-debugger
    debugger;
    const lines = data.split("\n");
    let currentCategory: string | null = null;

    for (let i = 0; i < lines.length; i += 2) {
      const extinfLine = lines[i] ? lines[i].trim() : "";
      const urlLine = lines[i + 1] ? lines[i + 1].trim() : "";

      if (extinfLine.startsWith("#EXTINF:") && urlLine.startsWith("http")) {
        const extinfMatch = extinfLine.match(/#EXTINF:(-?\d+), (.+)/);
        if (extinfMatch != null) {
          const metadata = extinfMatch[2];
          const currentTitle = metadata; // Salva o título da faixa

          // Extrair informações de tvg-name, tvg-logo e group-title, se disponíveis
          const groupTitleMatch = metadata.match(/group-title="([^"]+)"/);

          if (groupTitleMatch != null) {
            currentCategory = groupTitleMatch[1];
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
            });
          }
        }
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
