var translator = require('./translator');
var supportedLangs = require('./supported_languages');
module.exports = (app) => {

    app.get('/api/v1/translate', function (req, res) {
        try {
            console.log('res' + req.query[0]);
            translator.v1(req.query.from, req.query.to, req.query.text, response => {
                //console.log(response);
                if (response['isCorrect'] == true) {
                    return res.status(201).json({
                        success: true,
                        message: 'success',
                        data: response
                    });
                } else {
                    translator.v1(req.query.from, req.query.to, req.query.text, didYouMean => {
                        if (response.isCorrect == false) {
                            console.log('did you mean : %s ?', didYouMean.correctionSourceText);
                            return res.status(201).json({
                                success: true,
                                data: didYouMean,
                                message: 'success'
                            });
                        }
                    });
                }
            });
        } catch (err) {
            return res.status(501).json({
                success: false,
                message: err['message'],
                data: {}
            });
        }
    });

    app.get('/api/v2/translate', async function (req, res) {
        try {

            await translator.v2(req.query.from, req.query.to, req.query.text, response => {


                return res.status(201).json(response);

            });
        } catch (err) {
            return res.status(501).json({
                success: false,
                message: err['message'],
                data: {}
            });
        }
    });

    app.get('/api/supported-langs', async function (req, res) {
        try {
            var langList = []
            Object.entries(supportedLangs.languages).map((key, value) => langList.push({
                'lang_code': key[0],
                'lang_name': key[1]
            }))

            return res.status(200).json({
                success: true,
                data: {
                    'total_count': langList.length,
                    'date_time': new Date().toISOString().slice(0, 10),
                    'items': langList
                }
            });

        } catch (err) {
            return res.status(501).json({
                success: false,
                message: err['message'],
                data: {}
            });
        }

    });

}