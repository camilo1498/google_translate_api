var translator = require('./translator');
module.exports = (app) => {
    
    app.get('/api/translate', function(req, res) {
        try{
            console.log('res' + req.query[0]);
            translator(req.query.from , req.query.to , req.query.text, response => {
                //console.log(response);
                if(response['isCorrect'] == true){
                    return res.status(201).json({
                        success: true,
                        data: response
                    });
                } else{
                    translator(req.query.from , req.query.to , req.query.text, didYouMean =>{		
                        if(response.isCorrect==false){
                            console.log('did you mean : %s ?',didYouMean.text);
                            return res.status(201).json({
                                success: true,
                                data: didYouMean
                            });
                        }
                    });
                }
            }); 
        } catch(err){
            return res.status(501).json({
                success: false,
                message: err['message']
            });
        }
    });
    
}