var translator = require('../api_controller/translator');
var supportedLangs = require('../utils/supported_languages');
module.exports = (app) => {

    app.get('/api/v1/translate', function (req, res) {
        try {
            translator.v1(req.query.from, req.query.to, req.query.text, response => {
        
                if (response['isCorrect'] == true) {
                    return res.status(201).json({
                        success: true,
                        message: 'success',
                        data: response
                    });
                } else {
                    translator.v1(req.query.from, req.query.to, req.query.text, didYouMean => {
                        if (response.isCorrect == false) {
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
            // get response
            await translator.v2(req.query.from, req.query.to, req.query.text, response => {
                // send response
                return res.status(201).json(response);

            });
        } catch (err) {
            // error response
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