const middlewareFunction = (req, res, next) => {
    let {id}= req.headers;
    if(!id){
        return res.status(400).json({message:"id is required in headers"}); 
    }
    req.customData=id;
    console.log('Middleware function executed');
    next();
};

const secondMiddlewareFunction = (req, res, next) => {
    let customData= req.customData;
    if(!customData){
        return res.status(400).json({message:"id is required in query"}); 
    }   
    console.log('Second middleware function executed');
    next();
}
module.exports = {  middlewareFunction, secondMiddlewareFunction};