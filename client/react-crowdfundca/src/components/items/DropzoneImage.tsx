import React, { Component } from "react";
import { DropzoneArea, FileObject, createFileFromUrl, readFile } from "mui-file-dropzone";
import { submitData, fetchImage } from '../../services/apiService';


const DropzoneImage = ({ initialImages = [], onFilesChange }: { initialImages: string[]; onFilesChange: (files: File[]) => void }) => {
  const [files, setFiles] = React.useState<File[]>([]);
  let imageFileList: File[] = [];
  
  const startFetchImages = () => {
    for(let i = 0; i < initialImages.length; i++){
      const imgName = initialImages[i].split('/').pop();
      fetchImage(`/api/project/image/${imgName}`, afterFetchOneImage);
    }
  }

  const afterFetchOneImage = async (url: any) => {
    imageFileList.push(url);
    if(imageFileList.length == initialImages.length){
      setFiles(imageFileList);
    }
    return;
  }

  React.useEffect(() => {
    startFetchImages();
  }, [initialImages]);

  const handleChange = (newFiles:any) => {
    onFilesChange(newFiles);
  };
  
  return (
    <div>
      {files.length==initialImages.length  && (
        <DropzoneArea 
          onChange={handleChange}
          clearOnUnmount={true}
          initialFiles={files}
          filesLimit={5}
          fileObjects={[]}
          acceptedFiles={['image/*']}
          dropzoneText={"Drag and drop an image here or click"}
      />
      )}
    </div>
  );
};

export default DropzoneImage;