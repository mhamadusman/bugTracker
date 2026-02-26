import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  secure: true 
});
console.log('cloudinary configured :: ' , cloudinary.config)
export default cloudinary;