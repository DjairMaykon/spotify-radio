import fsPromises from 'fs/promises'
import fs from 'fs'
import { extname, join } from 'path'
import config from './config.js'

const {
    dir: {
        publicDirectory
    }
} = config

export class Service {
    createFileStream(filename) {
        return fs.createReadStream(filename)
    }

    async getFileInfo(file) {
        const fullFilePath = join(publicDirectory, file)
        // valida se existe o arquivo
        await fsPromises.access(fullFilePath)
        const fileType = extname(fullFilePath)
        return {
            type: fileType,
            name: fullFilePath
        }
    }

    async getFileStream(file) {
        const {
            name, type
        } = await this.getFileInfo(file)
        return {
            stream: this.createFileStream(name),
            type
        }
    }
}