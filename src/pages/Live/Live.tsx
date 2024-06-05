import { useEffect, useState } from "react";
import { CategoryData } from "../../types";
import { resolveFinalUrl } from "./services/LiveServices";

const Live = () => {
  const [liveChannels, setLiveChannels] = useState<CategoryData>();
  const [category, setCategory] = useState<string>("");
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>("");

  useEffect(() => {
    const canais = window.localStorage.getItem("Canais");
    if (canais !== null) {
      setLiveChannels(JSON.parse(canais));
    }
  }, []);

  const handleVideoClick = async (url: string) => {
    const finalUrl = await resolveFinalUrl(url);
    setCurrentVideoUrl(finalUrl);
  };

  return liveChannels ? (
    <div className="hidden lg:flex flex-row w-full">
      <div className="w-1/4">
        <h1>Categorias</h1>
        <ul>
          {Object.keys(liveChannels).map((mainGroup, index) => (
            <li
              onClick={() => setCategory(mainGroup)}
              key={`${index + mainGroup}`}
              className="cursor-pointer"
            >
              {mainGroup}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-2/6">
        <h1>Ao vivo</h1>
        <ul>
          {category &&
            Object.keys(liveChannels[category]).map((subGroup, subIndex) => (
              <div key={`${subIndex + subGroup}`}>
                {liveChannels[category].map((item, itemIndex) => (
                  <li
                    onClick={() => handleVideoClick(item.videoUrl)}
                    className="cursor-pointer"
                    key={`${itemIndex + item.title}`}
                  >
                    {item.title}
                  </li>
                ))}
              </div>
            ))}
        </ul>
      </div>
      <div className="w-3/5">
        {currentVideoUrl ? (
          <video controls autoPlay src={currentVideoUrl} />
        ) : (
          <p>Selecione um canal</p>
        )}
      </div>
    </div>
  ) : (
    <>Ops</>
  );
};

export default Live;
