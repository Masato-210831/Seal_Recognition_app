import React, { useRef, useState, useMemo } from "react";

const Home = () => {
  const inputRef = useRef(null);
  const [inputFiles, setInputFiles] = useState("");
  console.log("現在のinputFileの中身は:", inputFiles[0]);

  const selectedFileArray = useMemo(() => {
    return inputFiles ? [...Array.from(inputFiles)] : [];
  }, [inputFiles]);

  const handleChange = (e) => {
    if (!e.target.files) return;
    if (!inputRef.current?.files) return; //?.はオプショナルチェーン, ??はnull合体演算子
    const newFileArray = [
      ...selectedFileArray,
      ...Array.from(e.target.files),
    ].filter(
      (
        file,
        index,
        self // [...].filterで現在処理しているfile, index, array自体のself
      ) => self.findIndex((f) => f.name === file.name) === index // 重複を削除 -> 現在処理しているfileとindexが同じならTrueでfilterされない
    );

    const dt = new DataTransfer();
    newFileArray.forEach((file) => dt.items.add(file));
    inputRef.current.files = dt.files; // input内のFileListを更新
    setInputFiles(dt.files); // Reactのstateを更新
  };

  const handleDelete = (index) => {
    if (!inputRef.current?.files) return;
    const dt = new DataTransfer();
    selectedFileArray.forEach((file, i) => i !== index && dt.items.add(file));
    inputRef.current.files = dt.files; // input内のFileListを更新
    setInputFiles(dt.files); // Reactのstateを更新
  };

  return (
    <div>
      <h3>ファイルのアップロード</h3>
      <input ref={inputRef} type="file" multiple onChange={handleChange} />
      <div>
        {selectedFileArray.map((file, index) => (
          <div
            key={file.name}
            className="flex items-center justify-between gap-2"
          >
            <div>{file.name}</div>
            <button onClick={() => handleDelete(index)}>削除</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
