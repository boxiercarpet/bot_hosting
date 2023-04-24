import ftpd from 'ftpd'
import fs from 'fs'
import logger from './logger.js'
import sql from './sql.js'
import bcrypt from "bcrypt";
import { log } from 'console';

const options = {
    pasvPortRangeStart: 1025,
    pasvPortRangeEnd: 1050,
    getInitialCwd: function(connection, callback) {
        callback(null, '/');
    },
    getRoot: function(connection, callback) {
        var rootPath = process.cwd() + '/bots/' + connection.username;
        fs.exists(rootPath, function(exists) {
            if (exists) {
                callback(null, rootPath);
            } else {
                fs.mkdir(rootPath, function(err) {
                    callback(err, rootPath);
                });
            }
        });
    },
};

const server = new ftpd.FtpServer('0.0.0.0', options);

server.on('error', function(error) {
    console.log('FTP Server error:', error);
});

server.on('client:connected', function(connection) {
    logger.log('FTP', 'New connection: ' + connection.socket.remoteAddress);
    var user

    connection.on('command:user', function(username, success, failure) {
        sql.query("SELECT * FROM users WHERE username = ?", [username], function(err, result) {
            if (err) return failure(err)
            if (result.length === 0) return failure()
            user = result[0]
            return success(username)
        })
    });
    connection.on('command:pass', function(pass, success, failure) {
        if (bcrypt.compareSync(pass, user.password)) {
            logger.log("FTP", connection.socket.remoteAddress + " Logged in as " + user.username)
            return success(user.username)
        } else {
            return failure()
        }
    });
}); 

// server.on('client:disconnected', function(connection) {
//     logger.log('FTP', 'Client disconnected: ' + connection.socket.remoteAddress);
// });

server.listen(21, function() {
    logger.log("FTP", "Listening on port 21")
});

export default server