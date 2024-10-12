// to handle errors in api (we are making a different file for this bcz we want to streamline the error syntax of api error  ):
// in this we made a constructor in which we defined that what an api error looks like.
// and we are overwriting them (duration "39:00" in "https://www.youtube.com/watch?v=S5EpsMjel-M&t=1401s")
class ApiError extends Error{
    constructor(
        statusCode,
        message= "Something went wrong",
        errors = [],
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors
    }
    
}

export {ApiError}