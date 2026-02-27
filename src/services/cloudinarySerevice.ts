import cloudinary from "../config/cloudinary";

export class CloudinaryService {
  static async deleteImage(publicId: string): Promise<any> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error("Cloudinary Delete Error:", error);
    }
  }
}
