
const https = require('https');
const querystring = require('querystring');
const Languages = require('../utils/supported_languages');
const tokenGenerator = require("../utils/g_token");
const { TranslatorResponseModel } = require("../models/translator_response_model");
const { TranslationUtils } = require('../utils/translation_utils');

function Exception(message) {
	this.message = message;
}

function v1(from, to, text, callback) {

	if (from) {
		from = from.toLowerCase();
	}
	if (to) {
		to = to.toLowerCase();
	}

	var detectlanguage = false;

	if (from == undefined) {
		detectlanguage = true;
	} else if (!(from in Languages.languages)) {
		throw new Exception("Cannot translate from unknown language: " + from);
	}

	if (to == undefined || !(to in Languages.languages)) {
		throw new Exception("Cannot translate to unknown language: " + to);
	}

	if (text == undefined || text.length == 0) {
		throw new Exception("Cannot translate undefined or empty text string");
	}
	if (text.length >= 5000) {
		throw new Exception("Service only can detect less than 5000 characters");
	}

	text = querystring.escape(text);

	var options = {
		host: 'translate.google.com',
		port: 443,
		path: '/translate_a/single?client=gtx&ie=UTF-8&oe=UTF-8' + (detectlanguage ? "&sl=auto" : '&sl=' + from) + '&tl=' + to + '&dt=t&q=' + text + '&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&dt=at&op=translate',
		headers: {
			'Accept': 'application/json;charset=utf-8',
			'Accept-Language': 'en-US,en;q=0.5',
			'Content-Type': 'application/json'
		}
	};
	https.get(options, response => {
		var content = '';
		response.on('data', chunk => {
			content += chunk;
		});
		response.on('end', () => {

			content = eval(content);

			var translated = {
				text: '',
				originalText: '',
				sourceLanguage: '',
				correctionSourceText: '',
				translationLanguage: '',
				isCorrect: true,
				source: {
					synonyms: [],
					pronunciation: [],
					definitions: [],
					examples: []
				},
				translations: []
			};


			if (content[7] != null && content[7].length !== 0) {
				translated.isCorrect = false;
				translated.correctionSourceText = content[7][1];
				translated.text = content[0][0][0];
			} else {
				translated.text = content[0][0][0];
				translated.originalText = content[0][0][1];
				translated.translationLanguage = to;

				// source lang code
				if (content[8] != null && content[8][0] != null) {
					if (content[8][0].length > 0) {
						content[8][0].forEach(sourceLang => {
							translated.sourceLanguage = sourceLang[0] + sourceLang[1];
						});
					}
				}
				//target translations
				if (content[1] != null) {
					content[1].forEach(translation => {
						var type = {
							type: translation[0], // noun
							translations: [],
						}
						translation[2].forEach(translations => {
							var define = {
								word: translations[0],
								translations: translations[1],
								article: translations[4],
								frequency: translations[3]
							}
							type.translations.push(define);
						});
						translated.translations.push(type);

					});
				}

				//definitions
				if (content[12] != null) {

					content[12].forEach(definitions => {
						var define = {
							type: definitions[0],
							definitions: []
						};
						definitions[1].forEach(one => {
							define.definitions.push({
								id: one[1],
								definition: one[0],
								example: one[2]
							});
						});
						translated.source.definitions.push(define);

					});
				}

				//source synonyms => put inside of definitions and create a field call "synonyms"
				if (content[11] != null) {
					content[11].forEach(synonyms => {
						var define = [];
						synonyms[1].forEach(one => {
							define.push({
								id: one[1],
								words: one[0]
							});
						})
						translated.source.synonyms.push(define);
					});
				}


				//pronunciation
				if (content[0][1] != null) {
					content[0][1].forEach(pronunciation => {
						if (pronunciation != null) {
							translated.source.pronunciation.push(pronunciation);
						}
					});
				}



				//examples
				if (content[13] != null && content[13][0] != null) {
					var TextWithoutTags = '';
					content[13][0].forEach(examples => {
						if (examples != null) {
							TextWithoutTags = examples[0].replace(/(<([^>]+)>)/ig, "");
							translated.source.examples.push(TextWithoutTags);
						}
					});
				}
			}
			callback(translated);
			try {
				var json = JSON.parse(content);
				callback({
					success: true,
					message: 'success',
					data: json,
				});
			} catch (e) {
				callback({
					success: false,
					message: 'Unhandler error',
					data: {}
				});
			}
		});
	});
}


async function v2(from, to, text, callback) {

	if (from) {
		from = from.toLowerCase();
	}
	if (to) {
		to = to.toLowerCase();
	}

	var detectlanguage = false;

	if (from == undefined) {
		detectlanguage = true;
	} else if (!(from in Languages.languages)) {
		throw new Exception("Cannot translate from unknown language: " + from);

	}
	if (text == undefined || text.length == 0) {
		throw new Exception("Cannot translate undefined or empty text string");
	}

	if (to == undefined || !(to in Languages.languages)) {
		throw new Exception("Cannot translate to unknown language: " + to);
	}

	if (text.length >= 5000) {
		throw new Exception("Service only can detect less than 5000 characters");
	}

	// source language
	let sl = detectlanguage ? "auto" : from;

	// Generate Google Translate token for the text to be translated.
	let tokeng = await tokenGenerator.get(text);

	// query params
	const body = {
		client: "gtx",
		ie: "UTF-8",
		oe: "UTF-8",
		dj: 1,
		sl: sl,
		tl: to,
		hl: to,
		dt: ["md", "rw", "t", "bd", "ex", "rm", "ss", "at", "dp", "mt", "rtm", "qca", "ld"],
		ie: "UTF-8",
		oe: "UTF-8",
		otf: 1,
		ssel: 0,
		tsel: 0,
		kc: 7,
		text: text,
		op: "translate",
		[tokeng.name]: tokeng.value
	};

	let path = `/translate_a/single?${querystring.stringify(body)}`;

	var options = {
		host: 'translate.googleapis.com',
		port: 443,
		path: path,
		headers: {
			'Accept': 'application/json;charset=utf-8',
			'Accept-Language': 'en-US,en;q=0.5',
			'Content-Type': 'application/json',
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36'
		}
	};

	https.get(options, response => {
		var content = '';
		response.on('data', chunk => {
			content += chunk;

		});
		response.on('end', () => {

			try {
				// parse response data
				var json = JSON.parse(content);

				/// set data model
				let model = new TranslatorResponseModel(json);

				// new model response
				let formatModel = {
					sentences: model.data.sentences,
					translate_src: to,
					src_lang: model.data.src || undefined,
					detected_lang: model.data.ld_result.srclangs[0] || undefined,
					spell: model.data.spell,
					synsets: model.data.synsets,
					dict: model.data.dict,
					alternative_translations: model.data.alternative_translations,
					definitions: model.data.definitions,
					examples: model.data.examples,
					related_words: model.data.relatedWords,
					confidence: model.data.confidence,
				};

				callback({
					success: true,
					message: 'success',
					data: formatModel,
				});
			} catch (e) {
				callback({
					success: false,
					message: 'Unhandler error',
					data: {}
				});
			}


		});
	});




}

module.exports = {
	v1,
	v2,
}
