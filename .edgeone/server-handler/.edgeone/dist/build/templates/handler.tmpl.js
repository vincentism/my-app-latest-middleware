

import express from 'express'
import { PassThrough, Readable } from 'stream';
import {
  createRequestContext,
  runWithRequestContext,
} from './.edgeone/dist/run/handlers/request-context.cjs'
import serverHandler from './.edgeone/dist/run/handlers/server.js'
import { getTracer } from './.edgeone/dist/run/handlers/tracer.cjs'

import path from 'path';
import fs from 'fs';

const metaFilePath = path.join(process.cwd(), '../meta.json');
// 读取现有的meta.json文件（如果存在）
let existingMetaData = {};
if (fs.existsSync(metaFilePath)) {
  try {
    const existingContent = fs.readFileSync(metaFilePath, 'utf-8');
    existingMetaData = JSON.parse(existingContent);
  } catch (error) {
    console.warn('Failed to parse existing meta.json:', error);
  }
}


process.env.USE_REGIONAL_BLOBS = '{{useRegionalBlobs}}'
export default async function handler(req, context) {
  const requestContext = createRequestContext(req, context)
  requestContext.nextRoutes = existingMetaData.nextRoutes;
  const tracer = getTracer()

  const handlerResponse = await runWithRequestContext(requestContext, () => {
    return tracer.withActiveSpan('Next.js Server Handler', async (span) => {
      // span.setAttributes({
      //   'account.id': context.account.id,
      //   'deploy.id': context.deploy.id,
      //   'request.id': context.requestId,
      //   'site.id': context.site.id,
      //   'http.method': req.method,
      //   'http.target': req.url,
      //   isBackgroundRevalidation: requestContext.isBackgroundRevalidation,
      //   monorepo: false,
      //   cwd: process.cwd(),
      // })
      const response = await serverHandler(req, context, span, requestContext)
      // span.setAttributes({
      //   'http.status_code': response.status,
      // })
      return response
    })
  })

  if (requestContext.serverTiming) {
    handlerResponse.headers.set('server-timing', requestContext.serverTiming)
  }

  return handlerResponse
}

export const config = {
  path: '/*',
  preferStatic: true,
}

const app = express()
const port = 9000

app.all(/.*/, async (req, res) => {
  try {
    // 调用Next.js handler
    const handlerResponse = await handler({
      ...req,
      headers: {
        ...req.headers,
        // 明确告诉Next.js不要返回压缩内容
        'accept-encoding': 'identity'
      }
    }, {});

    // 检查响应头是否包含gzip压缩
    const isGzipped = handlerResponse.headers?.get('content-encoding') === 'gzip';
    
    // 设置响应头
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    
    if (handlerResponse.body) {
      // 创建解压流
      // const zlib = require('zlib');
      // const decompressStream = isGzipped ? 
      //   zlib.createGunzip() : 
      //   new require('stream').PassThrough();

      const decompressStream = new PassThrough();
      
      // 处理Web ReadableStream
      const nodeStream = Readable.fromWeb(handlerResponse.body);
      
      // 管道处理
      nodeStream
        .pipe(decompressStream)
        .pipe(res);

    } else {
      // 非流式响应直接发送
      res.send(handlerResponse);
    }
  } catch (error) {
    console.error('SSR Error:', error);
    res.status(500).send(`<html><body><h1>Error</h1><p>${error.message}</p></body></html>`);
  }
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
