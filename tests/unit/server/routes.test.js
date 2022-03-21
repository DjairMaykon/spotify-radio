import { 
    jest,
    describe, 
    test, 
    expect,
    beforeEach
} from '@jest/globals'
import config from '../../../server/config.js'
import { handler } from '../../../server/routes.js'
import TestUtil from '../_util/testUtil.js'
import { Controller } from '../../../server/controller.js'

const {
    location,
    pages: {
        homeHTML, controllerHTML
    },
    constants: {
        CONTENT_TYPE
    }
} = config

describe('#Routes - test suite for api response', () => {
    beforeEach(() => {
        jest.restoreAllMocks()
        jest.clearAllMocks()
    })
    
    test(`GET / - should redirect to home page`, async () => {
        const params = TestUtil.defaultHandleParams()
        params.request.method = 'GET'
        params.request.url = '/'

        await handler(...params.values())
        expect(params.response.writeHead).toHaveBeenCalledWith(302, {
            'Location': location.home
        })
        expect(params.response.end).toHaveBeenCalled()
    })
    test(`GET /home - should response with ${homeHTML} file stream`, async () => {
        const params = TestUtil.defaultHandleParams()
        params.request.method = 'GET'
        params.request.url = '/home'
        const mockFileStream = TestUtil.generateReadableStream(['data'])
    
        jest.spyOn(
          Controller.prototype,
          Controller.prototype.getFileStream.name,
        ).mockResolvedValue({
          stream: mockFileStream,
        })
    
        jest.spyOn(
          mockFileStream,
          "pipe"
        ).mockReturnValue()
    
        await handler(...params.values())
    
        expect(Controller.prototype.getFileStream).toBeCalledWith(homeHTML)
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response)
    })
    test(`GET /controller - should response with ${controllerHTML} file stream`, async () => {
        const params = TestUtil.defaultHandleParams()
        params.request.method = 'GET'
        params.request.url = '/controller'
        const mockFileStream = TestUtil.generateReadableStream(['data'])
    
        jest.spyOn(
          Controller.prototype,
          Controller.prototype.getFileStream.name,
        ).mockResolvedValue({
          stream: mockFileStream,
        })
    
        jest.spyOn(
          mockFileStream,
          "pipe"
        ).mockReturnValue()
    
        await handler(...params.values())
    
        expect(Controller.prototype.getFileStream).toBeCalledWith(controllerHTML)
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response)
    })
    describe('GET /file.ext - should response with file stream', () => {
        test(`GET /file.ext - .ext is .html, .css or .js`, async () => {
            const params = TestUtil.defaultHandleParams()
            params.request.method = 'GET'
            params.request.url = '/style.css'
            const type = '.css'
            const mockFileStream = TestUtil.generateReadableStream(['data'])
        
            jest.spyOn(
              Controller.prototype,
              Controller.prototype.getFileStream.name,
            ).mockResolvedValue({
              stream: mockFileStream,
              type
            })
        
            jest.spyOn(
              mockFileStream,
              "pipe"
            ).mockReturnValue()
        
            await handler(...params.values())
            
            expect(Controller.prototype.getFileStream).toBeCalledWith(params.request.url)
            expect(params.response.writeHead).toHaveBeenCalledWith(200, {
                'Content-Type': CONTENT_TYPE[type]
            })
            expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response)
        })
        test(`GET /file.ext - .ext not is .html, .css or .js`, async () => {
            const params = TestUtil.defaultHandleParams()
            params.request.method = 'GET'
            params.request.url = '/file.ext'
            const type = '.ext'
            const mockFileStream = TestUtil.generateReadableStream(['data'])
        
            jest.spyOn(
              Controller.prototype,
              Controller.prototype.getFileStream.name,
            ).mockResolvedValue({
              stream: mockFileStream,
              type
            })
        
            jest.spyOn(
              mockFileStream,
              "pipe"
            ).mockReturnValue()
        
            await handler(...params.values())
            
            expect(Controller.prototype.getFileStream).toBeCalledWith(params.request.url)
            expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response)
            expect(params.response.writeHead).not.toHaveBeenCalled()
        })
    })
    
    describe('unknown request', () => {
        test(`GET /unknown - given a inexistent route it should response with 404`, async () => {
            const params = TestUtil.defaultHandleParams()
            params.request.method = 'GET'
            params.request.url = '/unknown'
        
            await handler(...params.values())
            
            expect(params.response.writeHead).toHaveBeenCalledWith(404)
            expect(params.response.end).toHaveBeenCalled()
        })
        test(`POST /unknown - given a post request it should response with 404`, async () => {
            const params = TestUtil.defaultHandleParams()
            params.request.method = 'POST'
            params.request.url = '/unknown'
        
            await handler(...params.values())
            
            expect(params.response.writeHead).toHaveBeenCalledWith(404)
            expect(params.response.end).toHaveBeenCalled()
        })
    })

    describe('exceptions', () => {
        test(`given a inexistent file it should response with 404`, async () => {
            const params = TestUtil.defaultHandleParams()
            params.request.method = 'GET'
            params.request.url = '/index.png'

            jest.spyOn(
              Controller.prototype,
              Controller.prototype.getFileStream.name,
            ).mockRejectedValue(new Error('Error: ENOENT: no such file or directy'))
        
            await handler(...params.values())
            
            expect(params.response.writeHead).toHaveBeenCalledWith(404)
            expect(params.response.end).toHaveBeenCalled()
        })
        test(`given a error it should response with 500`, async () => {
            const params = TestUtil.defaultHandleParams()
            params.request.method = 'GET'
            params.request.url = '/index.png'

            jest.spyOn(
              Controller.prototype,
              Controller.prototype.getFileStream.name,
            ).mockRejectedValue(new Error('Error'))
        
            await handler(...params.values())
            
            expect(params.response.writeHead).toHaveBeenCalledWith(500)
            expect(params.response.end).toHaveBeenCalled()
        })
    })
})