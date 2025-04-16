const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const cheerio = require('cheerio');
const zlib = require('zlib');

const app = express();

// 启用 CORS
app.use(cors());

// 创建代理中间件工厂函数
function createDynamicProxy(req) {
    const targetUrl = req.query.url || 'https://www.bilibili.com';
    
    return createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true,
        selfHandleResponse: true,
        onProxyRes: function(proxyRes, req, res) {
            // 添加允许跨域的响应头
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            
            const contentType = proxyRes.headers['content-type'];
            const contentEncoding = proxyRes.headers['content-encoding'];
            
            if (contentType && contentType.includes('text/html')) {
                let chunks = [];
                
                proxyRes.on('data', chunk => {
                    chunks.push(chunk);
                });

                proxyRes.on('end', function() {
                    let buffer = Buffer.concat(chunks);
                    
                    // 处理压缩的内容
                    if (contentEncoding === 'gzip') {
                        buffer = zlib.gunzipSync(buffer);
                    } else if (contentEncoding === 'deflate') {
                        buffer = zlib.inflateSync(buffer);
                    }

                    let body = buffer.toString('utf8');

                    try {
                        const $ = cheerio.load(body, { decodeEntities: false });
                        $('a[target="_blank"]').removeAttr('target');
                        body = $.html();
                        
                        res.set('Content-Type', 'text/html; charset=utf-8');
                        res.set('Access-Control-Allow-Origin', '*');
                        res.removeHeader('Content-Encoding');
                        res.send(body);
                    } catch (error) {
                        console.error('处理HTML时出错:', error);
                        res.set('Content-Type', 'text/html; charset=utf-8');
                        res.set('Access-Control-Allow-Origin', '*');
                        res.send(body);
                    }
                });
            } else {
                proxyRes.pipe(res);
            }
        }
    });
}

// 处理代理请求
app.use('/', (req, res, next) => {
    createDynamicProxy(req)(req, res, next);
});

// 启动服务器
const port = 3000;
app.listen(port, () => {
    console.log(`代理服务器运行在 http://localhost:${port}`);
    console.log('使用方式: http://localhost:3000?url=要代理的网址');
}); 