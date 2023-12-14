import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Search from "../components/Search";
import Picture from "../components/Picture";

const HomePage = () => {
  let [data, setData] = useState(null); //圖片資料
  let [errorMessage, setErrorMessage] = useState(null); //錯誤訊息
  let [inputValue, setInputValue] = useState(""); //搜尋輸入值(input)
  let [page, setPage] = useState(1); //頁數
  let [currentSearch, setCurrentSearch] = useState(""); //當前搜尋值(button)
  let [count, setCount] = useState(0);

  const auth = process.env.REACT_APP_API_KEY;
  const initialURL = "https://api.pexels.com/v1/curated?page=1&per_page=15";
  const searchURL = `https://api.pexels.com/v1/search?query=${inputValue}&page=1&per_page=15`;

  // 使用 useCallback 包裹 search 函数
  const search = useCallback(
    async (url) => {
      try {
        let result = await axios.get(url, {
          headers: { Authorization: auth },
        });
        if (result.data.photos.length !== 0) {
          setErrorMessage(null);
          setData(result.data.photos);
          setCurrentSearch(inputValue);
        } else {
          setErrorMessage(`找不到符合搜尋字詞「${inputValue}」的圖片。`);
        }
      } catch {
        setErrorMessage("請求失敗，請重新嘗試。");
      }
    },
    [auth, inputValue]
  );

  const morePicture = async () => {
    try {
      let newURL;
      setPage(page + 1);
      if (currentSearch === "") {
        newURL = `https://api.pexels.com/v1/curated?page=${
          page + 1
        }&per_page=15`;
      } else {
        newURL = `https://api.pexels.com/v1/search?query=${currentSearch}&page=${
          page + 1
        }&per_page=15`;
      }
      let result = await axios.get(newURL, {
        headers: { Authorization: auth },
      });
      setData(data.concat(result.data.photos));
    } catch {
      setErrorMessage("請求失敗，請重新嘗試。");
    }
  };

  const handleButtonClick = () => {
    setInputValue("");
    setCount(count + 1);
  };

  useEffect(() => {
    search(initialURL);
  }, [count, search, initialURL]);

  return (
    <div style={{ minHeight: "100vh" }}>
      <Search
        search={() => {
          search(searchURL);
        }}
        inputValue={inputValue}
        setInputValue={setInputValue}
      />
      {errorMessage && (
        <div className="search">
          <p>{errorMessage}</p>
        </div>
      )}
      {errorMessage && (
        <div className="morePicture">
          <button onClick={handleButtonClick}>返回精選圖片</button>
        </div>
      )}

      {!errorMessage && (
        <div className="pictures">
          {data &&
            data.map((photo) => {
              return <Picture key={photo.id} data={photo} />;
            })}
        </div>
      )}
      {!errorMessage && (
        <div className="morePicture">
          <button onClick={morePicture}>更多圖片</button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
