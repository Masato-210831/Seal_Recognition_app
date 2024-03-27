import React, { useRef, useState, useMemo } from "react";
import { Box } from "@mui/system";

const UploadBtn = ({ inputFiles, setInputFiles }) => {
  const inputRef = useRef(null);

  const selectedFileArray = useMemo(() => {
    return inputFiles ? [...Array.from(inputFiles)] : [];
  }, [inputFiles]);

  const handleChange = (e) => {
    if (!e.target.files) return;
    if (!inputRef.current?.files) return; //?.はオプショナルチェーン
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
    <>
      <input ref={inputRef} type="file" multiple onChange={handleChange} />
      <Box mb={3}>
        {selectedFileArray.map((file, index) => (
          <Box key={file.name} display="flex" gap={2} mt={1} mr={1}>
            <div>{file.name}</div>
            <button onClick={() => handleDelete(index)}>削除</button>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default UploadBtn;
