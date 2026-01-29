import multer from 'multer';

export const uploadImage = (folder) =>{
    const storage = multer.diskStorage({
        destination: `./public/images/${folder}`,
        filename: (req, file, cb)=>{
            cb(null, "Id-"+ Date.now() + "-" + file.originalname);
        }
    });

    const upload = multer({storage}).single("img");
    return upload;
}