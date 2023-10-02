import React, { useState, ChangeEvent } from "react";
import { StyledHome } from "./Home.styles";

const HomePage: React.FC = () => {
  const [playlistData, setPlaylistData] = useState<{
    [key: string]: any[];
  } | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
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

  const parseM3U = (data: string) => {
    const lines = data.split("\n");

    let currentCategory: string | null = null;
    const categories: { [key: string]: any[] } = {};

    for (const line of lines) {
      if (line.trim() === "#EXTM3U") {
        // Início da lista de reprodução
      } else if (line.startsWith("#EXTINF:")) {
        // Informações sobre a faixa, como duração e metadados
        const extinfMatch = line.match(/#EXTINF:(-?\d+) (.+)/);
        if (extinfMatch) {
          const metadata = extinfMatch[2];

          // Extrair informações de tvg-name, tvg-logo e group-title, se disponíveis
          const tvgNameMatch = metadata.match(/tvg-name="([^"]+)"/);
          const tvgLogoMatch = metadata.match(/tvg-logo="([^"]+)"/);
          const groupTitleMatch = metadata.match(/group-title="([^"]+)"/);

          if (groupTitleMatch) {
            currentCategory = groupTitleMatch[1];
          } else {
            currentCategory = null;
          }
        }
      } else if (line.trim() !== "" && line.startsWith("http")) {
        // URL da mídia
        if (currentCategory) {
          if (!categories[currentCategory]) {
            categories[currentCategory] = [];
          }
          categories[currentCategory].push({ "Media URL": line });
        }
      }
    }

    setPlaylistData(categories);
  };

  return (
    <StyledHome>
      <p>Home</p>

      <input type="file" onChange={handleFileChange} />

      {playlistData &&
        Object.keys(playlistData).map((category, index) => (
          <div key={index}>
            <h2>{category}</h2>
            <ul>
              {playlistData[category].map((item, itemIndex) => (
                <li key={itemIndex}>
                  <a href={item["Media URL"]}>Item {itemIndex + 1}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
    </StyledHome>
  );
};

export default HomePage;
