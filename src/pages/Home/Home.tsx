import { ChangeEvent, FC, useEffect, useState } from "react";

const Home: FC = () => {
  const [playlistData, setPlaylistData] = useState<Record<
    string,
    Record<string, { "Media URL": string }[]>
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
        parseM3U(contents);
      };

      reader.readAsText(file);
    }
  };

  const parseM3U = (data: string): void => {
    const lines = data.split("\n");

    let currentCategory: string | null = null;

    for (const line of lines) {
      if (line.trim() === "#EXTM3U") {
        // Início da lista de reprodução
      } else if (line.startsWith("#EXTINF:")) {
        // Informações sobre a faixa, como duração e metadados
        const extinfMatch = line.match(/#EXTINF:(-?\d+) (.+)/);
        if (extinfMatch != null) {
          const metadata = extinfMatch[2];
          // Extrair informações de tvg-name, tvg-logo e group-title, se disponíveis
          const groupTitleMatch = metadata.match(/group-title="([^"]+)"/);

          if (groupTitleMatch != null) {
            currentCategory = groupTitleMatch[1];
          } else {
            currentCategory = null;
          }
        }
      } else if (line.trim() !== "" && line.startsWith("http")) {
        // URL da mídia
        if (currentCategory != null) {
          const [mainGroup, subGroup, ...rest] = currentCategory.split(" | ");
          const finalSubGroup = [subGroup, ...rest].filter(Boolean).join(" | ") || "No Subgroup";
          saveCategoryToLocalStorage(mainGroup, finalSubGroup, { "Media URL": line });
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
    mediaItem: { "Media URL": string }
  ) => {
    const savedData = localStorage.getItem(mainGroup);
    let categoryData: Record<string, { "Media URL": string }[]> = {};

    if (savedData) {
      categoryData = JSON.parse(savedData);
    }

    if (!(subGroup in categoryData)) {
      categoryData[subGroup] = [];
    }

    categoryData[subGroup].push(mediaItem);

    localStorage.setItem(mainGroup, JSON.stringify(categoryData));
  };

  const loadAllCategoriesFromLocalStorage = (): Record<string, Record<string, { "Media URL": string }[]>> => {
    const allCategories: Record<string, Record<string, { "Media URL": string }[]>> = {};

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
                      <a href={item["Media URL"]}>Item {itemIndex + 1}</a>
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
