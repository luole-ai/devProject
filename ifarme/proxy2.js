const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const cheerio = require('cheerio');
const zlib = require('zlib');

const app = express();

// 配置 CORS，允许携带凭证
app.use(cors({
    credentials: true,
    origin: true // 允许所有来源，在生产环境中应该设置具体的域名
}));

// 创建代理中间件工厂函数
function createDynamicProxy(req) {
    const targetUrl = req.query.url || 'https://www.bilibili.com';
    const targetUrlObj = new URL(targetUrl);
    
    return createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true,
        cookieDomainRewrite: {
            '*': '' // 重写所有cookie域名为空，使其变成相对路径
        },
        secure: false, // 允许无效证书
        withCredentials: true, // 允许发送凭证
        selfHandleResponse: true,
        onProxyReq: (proxyReq, req) => {
            // 转发原始请求中的 cookie
            const cookie = req.headers.cookie;
            if (cookie) {
                proxyReq.setHeader('Cookie', cookie);
            }
            
            // 设置目标网站的 host
            proxyReq.setHeader('Host', targetUrlObj.host);
        },
        onProxyRes: function(proxyRes, req, res) {
            // 处理响应头中的 cookie
            if (proxyRes.headers['set-cookie']) {
                proxyRes.headers['set-cookie'] = proxyRes.headers['set-cookie'].map(cookie => {
                    return cookie
                        .replace(/Domain=[^;]+;/i, '') // 移除 Domain 属性
                        .replace(/Secure/gi, ''); // 移除 Secure 标志
                });
            }

            // 添加允许跨域的响应头
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
            
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
                        res.removeHeader('Content-Encoding');
                        res.send(body);
                    } catch (error) {
                        console.error('处理HTML时出错:', error);
                        res.set('Content-Type', 'text/html; charset=utf-8');
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