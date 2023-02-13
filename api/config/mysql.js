'use strict'

const mysql = require('mysql')
const dotenv = require('dotenv')
const { v4: uuidv4 } = require('uuid')

dotenv.config({ path: '../../.env' })

const MySQL_Host = process.env.MYSQL_HOST
const MySQL_Username = process.env.MYSQL_USERNAME
const MySQL_Password = process.env.MYSQL_PASSWORD
const MySQL_Database = process.env.MYSQL_DATABASE

const connection = mysql.createConnection({
    host: MySQL_Host,
    user: MySQL_Username,
    password: MySQL_Password,
    database: MySQL_Database
})

const setupServer = () => {
    const connect = mysql.createConnection({
        host: MySQL_Host,
        user: MySQL_Username,
        password: MySQL_Password
    })

    return new Promise((resolve, reject) => {
        connect.connect((err) => {
            err ? (
                reject(err)
            ) : (
                connect.query(`CREATE DATABASE IF NOT EXISTS ${MySQL_Database}`, (err, result) => {
                    err ? (
                        reject(err)
                    ) : (
                        connect.end((err) => {
                            err ? (
                                reject(err)
                            ) : (
                                connection.connect((err) => {
                                    err ? (
                                        reject(err)
                                    ) : (
                                        connection.query('CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, phone VARCHAR(12) unique, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)', (err, result) => {
                                            err ? (
                                                reject(err)
                                            ) : (
                                                connection.query('CREATE TABLE IF NOT EXISTS groups (id INT AUTO_INCREMENT PRIMARY KEY, code VARCHAR(100) unique, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)', (err, result) => {
                                                    err ? (
                                                        reject(err)
                                                    ) : (
                                                        connection.query('CREATE TABLE IF NOT EXISTS users_groups (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, group_id INT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)', (err, result) => {
                                                            err ? (
                                                                reject(err)
                                                            ) : (
                                                                connection.end((err) => {
                                                                    err ? (
                                                                        reject(err)
                                                                    ) : (
                                                                        resolve()
                                                                    )
                                                                })
                                                            )
                                                        })
                                                    )
                                                })
                                            )
                                        })
                                    )
                                })
                            )
                        })
                    )
                })
            )
        })
    })
}

const userCreate = (user = {}) => {
    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            err ? (
                reject(err)
            ) : (
                connection.query('SELECT * FROM users WHERE phone = ?', user.phone, (err, result) => {
                    err ? (
                        reject(err)
                    ) : (
                        result.length > 0 ? (
                            resolve('User already exists')
                        ) : (
                            connection.query('INSERT INTO users SET ?', user, (err, result) => {
                                err ? (
                                    reject(err)
                                ) : (
                                    connection.end((err) => {
                                        err ? (
                                            reject(err)
                                        ) : (
                                            resolve(result)
                                        )
                                    })
                                )
                            })
                        )
                    )
                })
            )
        })
    })
}

const groupCreate = (group = {}) => {
    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            err ? (
                reject(err)
            ) : (
                connection.query('INSERT INTO groups SET ?', group, (err, result) => {
                    err ? (
                        reject(err)
                    ) : (
                        connection.end((err) => {
                            err ? (
                                reject(err)
                            ) : (
                                resolve(result)
                            )
                        })
                    )
                })
            )
        })
    })
}

const groupJoin = (user = {}) => {
    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            err ? (
                reject(err)
            ) : (
                user.forEach(element => {
                    connection.query('SELECT * FROM users_groups WHERE user_id = ? AND group_id = ?', [element.user_id, element.group_id], (err, result) => {
                        err ? (
                            reject(err)
                        ) : (
                            result.length > 0 ? (
                                console.log('User already joined'),
                                resolve('User already joined')
                            ) : (
                                connection.query('INSERT INTO users_groups SET ?', element, (err, result) => {
                                    err ? (
                                        reject(err)
                                    ) : (
                                        connection.end((err) => {
                                            err ? (
                                                reject(err)
                                            ) : (
                                                resolve(result)
                                            )
                                        })
                                    )
                                })
                            )
                        )
                    })
                }),
                connection.end()
            )
        })
    })
}

const userGetGroup = (user) => {
    return new Promise((resolve, reject) => {
        let sql = 'Select * from Users u inner join Users_Groups ug on u.id = ug.user_id inner join Groups g on ug.group_id = g.id where u.phone = ?'
        connection.connect((err) => {
            err ? (
                reject(err)
            ) : (
                connection.query(sql, user, (err, result) => {
                // connection.query('SELECT * FROM users_groups WHERE user_id = ?', user, (err, result) => {
                    err ? (
                        reject(err)
                    ) : (
                        connection.end((err) => {
                            err ? (
                                reject(err)
                            ) : (
                                console.log(result),
                                resolve(result)
                            )
                        })
                    )
                })
            )
        })
    })
}

const dataUser = {
    phone: '081234567890'
}

const dataGroup = {
    code: uuidv4()
}

const dataGroupJoin = [
    {
        user_id: 1,
        group_id: 1
    },
    {
        user_id: 1,
        group_id: 2
    }
]

// userGetGroup(dataUser.phone)
// groupJoin(dataGroupJoin)
// groupCreate(dataGroup)
// userCreate(dataUser)
// setupServer()

module.exports = {
    setupServer,
    userCreate
}