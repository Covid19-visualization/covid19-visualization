var exports = (module.exports = {});

const sendHandler = (res, code, data, isError) => {
    let payload = data ? data : []
    !isError
        ? res.send({ ...code, data: payload })
        : res.send({ ...code, message: payload })
}

exports.sendError = (res, code, error) => {
    sendHandler(res, code, error, true)
}

exports.sendComplete = (res, code, data) => {
    sendHandler(res, code, data, false)
}

exports.RESPONSE_CODE = {
    ERROR: {
        NOT_EXISTENT: {
            success: false,
            status: 404
        },
        SERVER_ERROR: {
            success: false,
            status: 500
        }
    },
    SUCCESS: {
        OK: {
            success: true,
            status: 200,
        },
        ALREADY_EXISTENT: {
            success: true,
            status: 202
        }
    }
}