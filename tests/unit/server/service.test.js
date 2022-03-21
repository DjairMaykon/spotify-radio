import { 
    jest,
    describe, 
    test, 
    expect,
    beforeEach
} from '@jest/globals'
import config from '../../../server/config.js'
import TestUtil from '../_util/testUtil.js'
import { Service } from '../../../server/service.js'
import fsPromises from 'fs/promises'
import fs from 'fs'

const {
  dir: {
    publicDirectory
  }
} = config

describe('#Service', () => {
    beforeEach(() => {
        jest.restoreAllMocks()
        jest.clearAllMocks()
    })
    
    test('createFileStream must return a readbleStream By filename read', () => {
      const stream = TestUtil.generateReadableStream()

      jest.spyOn(
        fs,
        fs.createReadStream.name
      ).mockReturnValue(stream)

      const service = new Service()
      const myFile = 'file.ext'
      const returnedStream = service.createFileStream(myFile)

      expect(returnedStream).toStrictEqual(stream)
      expect(fs.createReadStream).toHaveBeenCalledWith(myFile)
    })
    
    test('getFileInfo must return a full Path for given file and fileType', async () => {
      const file = 'file.ext'
      const fullFilePath = `${publicDirectory}/${file}`
      const ext = '.ext'

      jest.spyOn(
        fsPromises,
        fsPromises.access.name  
      ).mockReturnValue()

      const service = new Service()
      const returnedObject = await service.getFileInfo(file)

      expect(fsPromises.access).toHaveBeenCalledWith(fullFilePath)
      expect(returnedObject).toEqual({
        type: ext, name: fullFilePath
      })
    })
    
    test('getFileStream must return a stream of a file and the type of them', async () => {
      const stream = TestUtil.generateReadableStream(['abc'])
      const file = 'file.ext'
      const fullFilePath = `${publicDirectory}/${file}`
      const ext = '.ext'

      const service = new Service()
      jest.spyOn(
        service,
        service.getFileInfo.name
      ).mockResolvedValue({
        name: fullFilePath, type: ext
      })

      jest.spyOn(
        service,
        service.createFileStream.name
      ).mockReturnValue(stream)

      const returnedObject = await service.getFileStream(file)

      expect(service.getFileInfo).toHaveBeenCalledWith(file)
      expect(service.createFileStream).toHaveBeenCalledWith(fullFilePath)
      expect(returnedObject).toStrictEqual({
        type: ext, stream: stream
      })
    })
})