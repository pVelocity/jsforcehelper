/*global PV*/
'use strict';

/* jshint strict: true */
/* jshint node: true */
/* jshint unused: false */

var jsforce = require('jsforce');

module.exports = {
    connect: function(jsapi, username, password, url, pollInterval, pollTimeout) {
        return new jsapi.pvserver.Promise(function(resolve, reject) {
            if (PV.isObject(jsapi.sfdcConn) === false) {
                if (PV.isNumber(pollInterval) === false) {
                    pollInterval = 5000;
                }
                if (PV.isNumber(pollTimeout) === false) {
                    pollTimeout = 60000 * 10;
                }

                var conn = new jsforce.Connection({
                    loginUrl: url
                });

                conn.bulk = jsapi.pvserver.Promise.promisifyAll(conn.bulk);
                conn.bulk.pollInterval = pollInterval;
                conn.bulk.pollTimeout = pollTimeout;
                conn.login(username, password, function(err, userInfo) {
                    if (err) {
                        jsapi.logger.error(err);
                        resolve(false);
                    } else {
                        jsapi.sfdcConn = conn;
                        resolve(true);
                    }
                });
            } else {
                resolve(true);
            }
        });
    },

    connectWithSession: function(jsapi, pollInterval, pollTimeout) {
        return new jsapi.pvserver.Promise(function(resolve, reject) {
            if (PV.isObject(jsapi.sfdcConn) === false) {
                if (PV.isNumber(pollInterval) === false) {
                    pollInterval = 5000;
                }
                if (PV.isNumber(pollTimeout) === false) {
                    pollTimeout = 60000 * 10;
                }
                jsapi.sfdc.isSession = true;

                var conn = null;
                try {
                    conn = new jsforce.Connection({
                        instanceUrl: jsapi.sfdc.instance_url,
                        accessToken: jsapi.sfdc.access_token
                    });
                    conn.bulk.pollInterval = pollInterval;
                    conn.bulk.pollTimeout = pollTimeout;
                    conn.bulk = jsapi.pvserver.Promise.promisifyAll(conn.bulk);

                    jsapi.sfdcConn = conn;
                    resolve(true);
                } catch (reason) {
                    jsapi.logger.error(reason);
                    resolve(false);
                }
            } else {
                resolve(true);
            }
        });
    },

    query: function(jsapi, soql) {
        var resp = {
            'done': false,
            'total': -1,
            'fetched': 0,
            'maxLoop': 10,
            'loop': 0,
            'nextLocator': null,
            'locators': [],
            'records': []
        };

        return new jsapi.pvserver.Promise(function(resolve, reject) {
            jsapi.sfdcConn.query(soql, function(err, result) {
                if (err) {
                    try {
                        jsapi.logger.error(err);
                    } catch (e) {
                        reject(err);
                    }
                } else {
                    resp.total = result.totalSize;
                    resp.fetched = result.records.length;
                    resp.records.push.apply(resp.records, result.records);
                    if (result.done === true) {
                        resp.done = true;
                        resp.nextLocator = null;
                        resp.locators = [];
                        resolve(resp);
                    } else {
                        resp.nextLocator = result.nextRecordsUrl;
                        resp.locators.push(result.nextRecordsUrl);
                        this.queryMore(jsapi, resp).then(function(queryMoreResp) {
                            resolve(queryMoreResp);
                        });
                    }
                }
            }.bind(this));
        }.bind(this));
    },

    queryMore: function(jsapi, resp) {
        return new jsapi.pvserver.Promise(function(resolve, reject) {
            jsapi.sfdcConn.queryMore(resp.nextLocator, function(err, result) {
                if (err) {
                    try {
                        jsapi.logger.error(err);
                    } catch (e) {
                        reject(err);
                    }
                } else {
                    resp.records.push.apply(resp.records, result.records);
                    resp.fetched = resp.fetched + result.records.length;

                    if (result.done === true) {
                        resp.done = true;
                        resp.nextLocator = null;
                        resp.locators = [];
                        resolve(resp);
                    } else {
                        resp.nextLocator = result.nextRecordsUrl;
                        resp.locators.push(result.nextRecordsUrl);
                        this.queryMore(jsapi, resp).then(function(queryMoreResp) {
                            resolve(queryMoreResp);
                        });
                    }
                }
            }.bind(this));
        }.bind(this));
    },

    describe: function(jsapi, objectName) {
        return new jsapi.pvserver.Promise(function(resolve, reject) {
            jsapi.sfdcConn.describe(objectName, function(err, meta) {
                if (err) {
                    try {
                        jsapi.logger.error(err);
                    } catch (e) {
                        reject(err);
                    }
                } else {
                    var metaInfo = {};

                    metaInfo.fields = {};
                    meta.fields.forEach(function(field) {
                        var fieldMeta = {};
                        fieldMeta.type = field.type;
                        fieldMeta.createable = field.createable;
                        fieldMeta.updateable = field.updateable;
                        fieldMeta.picklistValues = [];
                        fieldMeta.defaultPicklistValue = null;
                        field.picklistValues.forEach(function(picklistValue) {
                            if (picklistValue.active) {
                                fieldMeta.picklistValues.push(picklistValue.value);
                            }
                            if (picklistValue.defaultValue) {
                                fieldMeta.defaultPicklistValue = picklistValue.value;
                            }
                        });

                        metaInfo.fields[field.name] = fieldMeta;
                    });
                    resolve(metaInfo);
                }
            });
        });
    },

    insert: function(jsapi, objectName, records) {
        return new jsapi.pvserver.Promise(function(resolve, reject) {
            jsapi.sfdcConn.sobject(objectName).create(records, function(err, res) {
                if (err) {
                    try {
                        jsapi.logger.error(err);
                    } catch (e) {
                        reject(err);
                    }
                } else {
                    var errors = [];
                    var response = PV.ensureArray(res);
                    for (var i = 0; i < response.length; i++) {
                        if (response[i].success === false) {
                            errors.push('Error #' + i + ' ' + response[i].errors.join(', '));
                        }
                    }

                    if (errors.length > 0) {
                        jsapi.logger.error({
                            message: errors.join('\n'),
                            code: 'Salesforce Insert Error'
                        }, false);
                    }
                    resolve(response);
                }
            });
        });
    },

    delete: function(jsapi, objectName, records) {
        return new jsapi.pvserver.Promise(function(resolve, reject) {
            jsapi.sfdcConn.sobject(objectName).del(records, function(err, res) {
                if (err) {
                    try {
                        jsapi.logger.error(err);
                    } catch (e) {
                        reject(err);
                    }
                } else {
                    var errors = [];
                    var response = PV.ensureArray(res);
                    for (var i = 0; i < response.length; i++) {
                        if (response[i].success === false) {
                            errors.push('Error #' + i + ' ' + response[i].errors.join(', '));
                        }
                    }

                    if (errors.length > 0) {
                        jsapi.logger.error({
                            message: errors.join('\n'),
                            code: 'Salesforce Delete Error'
                        }, false);
                    }
                    resolve(response);
                }
            });
        });
    },

    update: function(jsapi, objectName, records) {
        return new jsapi.pvserver.Promise(function(resolve, reject) {
            jsapi.sfdcConn.sobject(objectName).update(records, function(err, res) {
                if (err) {
                    try {
                        jsapi.logger.error(err);
                    } catch (e) {
                        reject(err);
                    }
                } else {
                    var errors = [];
                    var response = PV.ensureArray(res);
                    for (var i = 0; i < response.length; i++) {
                        if (response[i].success === false) {
                            errors.push('Error #' + i + ' ' + response[i].errors.join(', '));
                        }
                    }

                    if (errors.length > 0) {
                        jsapi.logger.error({
                            message: errors.join('\n'),
                            code: 'Salesforce Update Error'
                        }, false);
                    }
                    resolve(response);
                }
            });
        });
    },

    upsert: function(jsapi, objectName, records, extIdField) {
        return new jsapi.pvserver.Promise(function(resolve, reject) {
            jsapi.sfdcConn.sobject(objectName).upsert(records, extIdField, function(err, res) {
                if (err) {
                    try {
                        jsapi.logger.error(err);
                    } catch (e) {
                        reject(err);
                    }
                } else {
                    var errors = [];
                    var response = PV.ensureArray(res);
                    for (var i = 0; i < response.length; i++) {
                        if (response[i].success === false) {
                            errors.push('Error #' + i + ' ' + response[i].errors.join(', '));
                        }
                    }

                    if (errors.length > 0) {
                        jsapi.logger.error({
                            message: errors.join('\n'),
                            code: 'Salesforce Upsert Error'
                        }, false);
                    }
                    resolve(response);
                }
            });
        });
    },

    bulkInsert: function(jsapi, objectName, records) {
        return jsapi.sfdcConn.bulk.loadAsync(objectName, 'insert', records).then(function(res) {
            var errors = [];
            var response = PV.ensureArray(res);
            for (var i = 0; i < response.length; i++) {
                if (response[i].success === false) {
                    errors.push('Error #' + i + ' ' + response[i].errors.join(', '));
                }
            }

            if (errors.length > 0) {
                jsapi.logger.error({
                    message: errors.join('\n'),
                    code: 'Salesforce Bulk Insert '
                }, false);
            }
            return response;
        }).catch(function(reason) {
            jsapi.logger.error(reason);
            return null;
        });
    },

    bulkDelete: function(jsapi, objectName, records) {
        return jsapi.sfdcConn.bulk.loadAsync(objectName, 'delete', records).then(function(res) {
            var errors = [];
            var response = PV.ensureArray(res);
            for (var i = 0; i < response.length; i++) {
                if (response[i].success === false) {
                    errors.push('Error #' + i + ' ' + response[i].errors.join(', '));
                }
            }

            if (errors.length > 0) {
                jsapi.logger.error({
                    message: errors.join('\n'),
                    code: 'Salesforce Bulk Delete Error'
                }, false);
            }
            return response;
        }).catch(function(reason) {
            jsapi.logger.error(reason);
            return null;
        });
    },

    bulkUpdate: function(jsapi, objectName, records) {
        return jsapi.sfdcConn.bulk.loadAsync(objectName, 'update', records).then(function(res) {
            var errors = [];
            var response = PV.ensureArray(res);
            for (var i = 0; i < response.length; i++) {
                if (response[i].success === false) {
                    errors.push('Error #' + i + ' ' + response[i].errors.join(', '));
                }
            }

            if (errors.length > 0) {
                jsapi.logger.error({
                    message: errors.join('\n'),
                    code: 'Salesforce Bulk Update '
                }, false);
            }
            return response;
        }).catch(function(reason) {
            jsapi.logger.error(reason);
            return null;
        });
    },

    bulkUpsert: function(jsapi, objectName, records, extIdField) {
        return jsapi.sfdcConn.bulk.loadAsync(objectName, 'upsert', {
            'extIdField': extIdField
        }, records).then(function(res) {
            var errors = [];
            var response = PV.ensureArray(res);
            for (var i = 0; i < response.length; i++) {
                if (response[i].success === false) {
                    errors.push('Error #' + i + ' ' + response[i].errors.join(', '));
                }
            }

            if (errors.length > 0) {
                jsapi.logger.error({
                    message: errors.join('\n'),
                    code: 'Salesforce Bulk Upsert Error'
                }, false);
            }
            return response;
        }).catch(function(reason) {
            jsapi.logger.error(reason);
            return null;
        });
    }
};
