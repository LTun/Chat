
var http = require('http');

var fs = require('fs');

// var qs = require('queryString');

var index = fs.readFileSync('index.html', (err) => {
    console.log('fs.readFileSync: cannot read file "index.html"');
    console.log(err.message);
});

var rect = fs.readFileSync('rect.html', (err) => {
    console.log('fs.readFileSync: cannot read file "rect.html"');
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

function writeData(data) {
    fs.writeFile('data/data.txt', data, (err) => {
        if (err) {
            console.log(err.message);
            console.log('Cannot create file "data/data.txt"');
        }
    });
}

http.createServer((request, response) => {
    console.log();
    console.log(request.socket.remoteAddress);
    console.log(request.url);
    if (request.method === 'POST') {
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
            writeData(JSON.stringify(data));

            console.log(tempData);
        });
    }
    else if (request.url === '/') {
        response.writeHead(200, {'Content-Type': 'text/html', 'Access-Control-Allow-Origin': 'http://192.168.1.146:8080'});
        response.end(index);
        console.log('index');
    }
    else if (isUrlCorrect('/dataCount', request.url)) {
        response.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': 'http://192.168.1.146:8080'});
        response.end(String(data.length));
        console.log('dataCount');
    }
    else if (isUrlCorrect('/data', request.url)) {
        response.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': 'http://192.168.1.146:8080'});
        response.end(JSON.stringify(data));
        console.log('data');
    }
    else if (isUrlCorrect('/rect', request.url)) {
        response.writeHead(200, {'Content-Type': 'text/html', 'Access-Control-Allow-Origin': 'http://192.168.1.146:8080'});
        response.end(rect);
        console.log('rect');
    }
    else {
        response.writeHead(404);
        response.end();
        console.log('404');
    }
    
}).listen(8080);

console.log('Server created on port: 8080.');

console.log(data);