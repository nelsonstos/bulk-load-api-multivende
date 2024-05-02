class ResponseUtil {

    response(statusCode, data , message) {
        return {
            statusCode: statusCode,
            data: data,
            message: message
        };
    }
}

module.exports =  new ResponseUtil;