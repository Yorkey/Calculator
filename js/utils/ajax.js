var headers = require('./headers');
var url = require('./url');

module.exports = function(opts) {
    opts = Object.assign({},{
        method:'get',
        type:'json',
        headers:headers['json'],
        credentials: 'include'//send cookies in a cross-origin resource sharing (CORS) request
    },opts);
    opts.method = opts.method.toLowerCase();
    if(typeof opts.body != 'undefined') {
        if(opts.method == 'get') {
            var target = url(opts.url).setParams(opts.body || {});
            opts.url = target.toString();

            opts.body = undefined;
            delete opts.body;
        }
        if(opts.method == 'post') {
            if(typeof(opts.body)=="object"){
                opts.body.format="json";
            }
            opts.body = typeof opts.body == 'string' ? opts.body : url.serialize(opts.body);

        }
    }
    if(opts.method == 'post'){
        //post请求要求头部必须有'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' 或者
        //multipart/form-data(后者主要用于文件上传？)
       // opts.body.format = "json";  // 不加此行 返回不为json格式
    }else{
        opts.headers = Object.assign({},opts.headers,headers[opts.type]);
    }
    //opts.headers = opts.method == 'post' ? headers['form'] : headers[opts.type];
    console.log("--------",opts);
    return fetch(opts.url, opts).then(function(response) {
        if(!response.ok) {
            var error = new Error();
            error.name = response.status;
            error.data = response;
            console.warn("---fetch error---");
            console.warn("--------",opts);
            console.warn(error.name,error.data);
            throw error;
        }

        //if (opts.type == 'json') {
        //    return response.json();
        //} else {
        //    return response.text();
        //}
        return response.text().then(function(text) {
            console.log('netinfo',opts, text);
            if(opts.type == 'json') {
                return JSON.parse(text);
            }
            else {
                return text;
            }
        });
    });
};