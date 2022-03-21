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
import { Controller } from '../../../server/controller.js'

const {
  dir: {
    publicDirectory
  }
} = config

describe('#Controller', () => {
    beforeEach(() => {
        jest.restoreAllMocks()
        jest.clearAllMocks()
    })
    
    test('getFileStream must return a readbleStream By filename read', async () => {
      const stream = TestUtil.generateReadableStream()
      const file = 'file.ext'
      const type = '.ext'

      jest.spyOn(
        Service.prototype,
        Service.prototype.getFileStream.name
      ).mockReturnValue({
        stream: stream, type: type
      })

      const controller = new Controller()
      const returnedObject = await controller.getFileStream(file)

      expect(returnedObject).toStrictEqual({
        stream: stream, type: type
      })
      expect(Service.prototype.getFileStream).toHaveBeenCalledWith(file)
    })
})