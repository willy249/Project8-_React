import React, { useEffect } from "react";

const Search = ({ search, inputValue, setInputValue }) => {
  const inputHandler = (e) => {
    setInputValue(e.target.value);
  };
  const buttonHandler = () => {
    inputValue !== "" && search();
  };

  const handleKeyDown = (event) => {
    // 判断是否按下的是 Enter 键（Enter 键的 keyCode 是 13）
    if (event.keyCode === 13) {
      // 执行按钮点击的逻辑
      buttonHandler();
    }
  };

  // 在组件挂载时添加键盘事件监听器
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    // 在组件卸载时移除键盘事件监听器
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputValue, setInputValue]);

  return (
    <div className="search">
      <input
        value={inputValue}
        onChange={inputHandler}
        className="input"
        type="text"
      />
      <button onClick={buttonHandler}>Search</button>
    </div>
  );
};

export default Search;
