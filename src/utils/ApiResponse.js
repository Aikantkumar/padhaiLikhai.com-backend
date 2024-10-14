//this constructor is to handle the api responses(positive responses)
// we want statusCode less than 400 bcz they are set as positive response statuscodes
class ApiResponse{
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode<400
    }
}

export { ApiResponse }