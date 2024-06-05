import { useEffect, useState } from "react";
import { CategoryData } from "../../types";

const Live = () => {
  const [liveChannels, setLiveChannels] = useState<CategoryData>();
  const [category, setCategory] = useState<string>("");
  // const [currentVideo, setCurrentVideo] = useState<string>("");
  useEffect(() => {
    const canais = window.localStorage.getItem("Canais");

    if (canais !== null) {
      const testo = JSON.parse(canais);
      console.log("testo: ", testo);

      setLiveChannels(JSON.parse(canais));
    }
  }, []);

  return liveChannels ? (
    <div className=" hidden lg:flex flex-row w-full">
      <div className="w-1/4">
        <h1>Categorias</h1>
        <ul>
          {Object.keys(liveChannels ?? []).map((mainGroup, index) => {
            return (
              <li
                onClick={() => setCategory(mainGroup)}
                key={`${index + mainGroup}`}
              >
                {mainGroup}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="w-2/6">
        <h1>Ao vivo</h1>
        <ul>
          {Object.keys(liveChannels[category]).map((mainGroup) => {
            console.log("mainGroup: ", mainGroup);
            // return <li key={`${index + mainGroup}`}>{mainGroup[1]}</li>;
            return <li>oi</li>;
          })}
        </ul>
      </div>
      <div className="w-3/5">Video</div>
    </div>
  ) : (
    <> Ops</>
  );
};

export default Live;
