import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { appConfig } from "../../config/app.js";

/**
 * A class for interacting with an S3 bucket.
 */
export class S3FileManager {
  /**
   * Creates a new instance of the `S3FileManager` class.
   */
  constructor() {
    /**
     * The S3 client instance.
     * @type {S3Client}
     */
    this.client = new S3Client(appConfig.AWS_S3_CONFIG);
  }

  /**
   * Uploads a file to the S3 bucket.
   * @param {Buffer} data - The file data to upload.
   * @param {string} fileName - The name of the file to upload.
   * @param {string} contentType - The content type of the file to upload.
   * @returns {Promise<PutObjectCommandOutput>} - A promise that resolves with the response from the S3 API.
   * @throws {Error} - Throws an error if the upload fails.
   */
  async uploadFile(data, fileName, contentType) {
    try {
      const command = new PutObjectCommand({
        Bucket: appConfig.AWS_S3_BUCKET,
        Body: data,
        Key: fileName,
        ContentType: contentType,
      });

      const response = await this.client.send(command);

      return response;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  /**
   * Gets a file from the S3 bucket.
   * @param {string} filePath - The path of the file to get.
   * @returns {Promise<Buffer>} - A promise that resolves with the file data as a buffer.
   * @throws {Error} - Throws an error if the file retrieval fails.
   */
  async getFile(filePath) {
    try {
      const command = new GetObjectCommand({
        Bucket: appConfig.AWS_S3_BUCKET,
        Key: filePath,
      });

      const response = await this.client.send(command);

      const byteArray = await response.Body.transformToByteArray();

      return byteArray;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  /**
   * Gets a signed URL for a file in the S3 bucket.
   * @param {string} filePath - The path of the file to get a signed URL for.
   * @param {number} [minutesToExpire=10] - The number of minutes until the signed URL expires.
   * @returns {Promise<string>} - A promise that resolves with the signed URL.
   * @throws {Error} - Throws an error if the signed URL retrieval fails.
   */
  async getFileSignedUrl(filePath, minutesToExpire = 10) {
    try {
      const command = new GetObjectCommand({
        Bucket: appConfig.AWS_S3_BUCKET,
        Key: filePath,
      });

      const signedUrl = await getSignedUrl(this.client, command, {
        expiresIn: minutesToExpire * 60,
      });

      return signedUrl;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  /**
   * Deletes a file from the S3 bucket.
   * @param {string} filePath - The path of the file to delete.
   * @returns {Promise<DeleteObjectCommandOutput>} - A promise that resolves with the response from the S3 API.
   * @throws {Error} - Throws an error if the file deletion fails.
   */
  async deleteFile(filePath) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: appConfig.AWS_S3_BUCKET,
        Key: filePath,
      });

      const response = await this.client.send(command);

      return response;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  /**
   * Deletes multiple files from the S3 bucket.
   * @param {string[]} [filePaths=[]] - An array of file paths to delete.
   * @returns {Promise<string>} - A promise that resolves with a string containing the deleted file paths.
   * @throws {Error} - Throws an error if the file deletion fails.
   */
  async deleteMultipleFiles(filePaths = []) {
    try {
      const command = new DeleteObjectsCommand({
        Bucket: appConfig.AWS_S3_BUCKET,
        Delete: {
          Objects: filePaths.map((filePath) => ({ Key: filePath })),
        },
      });

      const { Deleted } = await this.client.send(command);

      const deletedFiles = Deleted.map((d) => ` • ${d.Key}`).join(",");

      return deletedFiles;
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
