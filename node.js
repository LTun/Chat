
const https = require('https');
// const http = require('http');

const fs = require('fs');

const option = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

const password = 'Ugoku,Ugoku';

// var qs = require('queryString');

const index = fs.readFileSync('index.html', (err) => {
    console.log('fs.readFileSync: cannot read file "index.html"');
    console.log(err.message);
});

const chat = fs.readFileSync('chat.html', (err) => {
    console.log('fs.readFileSync: cannot read file "chat.html"');
    console.log(err.message);
});

const rect = fs.readFileSync('rect.html', (err) => {
    console.log('fs.readFileSync: cannot read file "rect.html"');
    console.log(err.message);
});

const error404 = fs.readFileSync('error404.html', (err) => {
    console.log('fs.readFileSync: cannot read file "rect.html"');
    console.log(err.message);
});

const loginBackground = fs.readFileSync('image/2.jpg', (err) => {
    console.log('fs.readFileSync: cannot read file "image/2.jpg"');
    console.log(err.message);
});


// var countData;
// var data;
// var temp_data;

// try {
//     countData = fs.readFileSync('count.txt', (err) => {
//         console.log('fs.readFileSync: cannot read file "count.txt"');
//         console.log(err.message);
//     }).toString();
    
// }
// catch (err) {
//     console.log('No data stored before');
//     console.log('Making first now');

//     countData = 0;
//     fs.writeFile('count.txt', '0');
// }

// if (countData !== '0') {
//     console.log(countData);
//     let rawData = fs.readFileSync('data' + countData + '.txt', (err) => {
//         console.log('fs.readFileSync: cannot read file "data.txt"');
//         console.log(err.message);
//     });

//     var data = JSON.parse(rawData);
// }

var data = new Array();
var tempData;

try {
    let rawData = fs.readFileSync('data/data.txt', (err) => {
        if (err) {
            console.log(err.message);
            console.log('Cannot open file "data.txt"');
        }
    });

    try {
        data = JSON.parse(rawData);
    }
    catch (err) {
        // 
    }
}
catch (err) {
    console.log('No data file, making now.');
    fs.writeFile('data/data.txt', '', (err) => {
        if (err) {
            console.log(err.message);
            console.log('Cannot create file "data/data.txt"');
        }
    });
}


function isUrlCorrect(url1, url2) {
    if (url1 > url2)
        return false;

    for (let i = 0; i < url1.length; i++) {
        if (url1[i] !== url2[i])
            return false;
    }
    return true;
}

function writeData() {
    fs.writeFile('data/data.txt', JSON.stringify(data), (err) => {
        if (err) {
            console.log(err.message);
            console.log('Cannot create file "data/data.txt"');
        }
    });
}

function server(request, response) {
    console.log();
    console.log(request.socket.remoteAddress);
    console.log(request.url);

    if (isUrlCorrect('/dataCount', request.url)) {
        response.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'});
        response.end(String(data.length));
        console.log('dataCount');
    }
    else if (request.method === 'POST') {
        if (isUrlCorrect('/post', request.url)) {
            let body = '';
    
            request.on('data', (data2) => {
                body += data2;
    
                if (body.length > 1e6)
                    request.destroy();
            });

            request.on('end', () => {
                tempData = JSON.parse(body);
                let time = new Date();
                tempData['time'] = time.getHours() + 'h' + time.getMinutes() + 'm';
                data.push(tempData);
                writeData();
    
                console.log(tempData);
            });

            response.writeHead(200, {'Access-Control-Allow-Origin': '*'});
            response.end();
        }
        else if (isUrlCorrect('/login', request.url)){
            let body = '';

            request.on('data', (data2) => {
                body += data2;

                if (body.length > 1e6)
                    request.destroy();
            });

            response.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'})

            request.on('end', () => {
                tempData = JSON.parse(body);

                if (tempData.passwd === password && tempData.username) {
                    response.end('/LTunChat?username=' + tempData.username);
                }
                else {
                    response.end('wrong');
                }

                console.log(tempData);
            });
        }
    }
    else if (isUrlCorrect('/data', request.url)) {
        response.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'});
        response.end(JSON.stringify(data));
        console.log('data');
    }
    else if (request.url === '/') {
        response.writeHead(200, {'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*'});
        response.end(index);
        console.log('index');
    }
    else if (isUrlCorrect('/LTunChat', request.url)) {
        response.writeHead(200, {'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*'});
        response.end(chat);
        console.log('chat');
    }
    else if (isUrlCorrect('/image/2.jpg', request.url)) {
        response.writeHead(200, {'Content-Type': 'image/jpeg', 'Access-Control-Allow-Origin': '*'});
        response.end(loginBackground);
        console.log('loginBackground');
    }
    else if (isUrlCorrect('/rect', request.url)) {
        response.writeHead(200, {'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*'});
        response.end(rect);
        console.log('rect');
    }
    else {
        response.writeHead(200, {'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*'});
        response.end(error404);
        console.log('404');
    }
}

https.createServer(option, server).listen(443);
// http.createServer(server).listen(80);

console.log('Server created on port: 443.');

console.log(data);