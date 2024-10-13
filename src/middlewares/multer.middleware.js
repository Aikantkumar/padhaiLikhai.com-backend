import multer from "multer"

// got this code from "https://www.npmjs.com/package/multer"
const storage = multer.diskStorage({
    // cb means callback
    destination: function (req, file, cb) {
      cb(null, './public/temp') //here we will give the destination where we will keep all our files
    },
    filename: function (req, file, cb) {
     
      cb(null, file.originalname)
    }
  })
  
  export const upload = multer({ storage: storage })