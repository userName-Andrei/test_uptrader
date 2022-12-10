import React, { ChangeEvent, FC, useRef } from 'react';

interface FilesInputProps {
    className: string,
    setFiles: (a: FileList | null) => void,
    placeholder: string
}

const FilesInput: FC<FilesInputProps> = ({className, setFiles, placeholder}) => {

    const inputRef = useRef<HTMLInputElement>(null);

    const onClickHandler = () => {
        if (inputRef.current) {
            inputRef.current.click()
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const filesUploaded = e.currentTarget.files;
        setFiles(filesUploaded)
    }

    return (
        <>
            <button
                type='button'
                className={className}
                onClick={onClickHandler}>
                {placeholder}
            </button>
            <input 
                ref={inputRef} 
                type="file"
                id='file' 
                name='files'
                onChange={onChangeHandler} 
                multiple
                hidden />
        </>
    );
}

export default FilesInput;