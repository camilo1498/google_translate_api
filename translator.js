'use strict';
var https = require('https');
var querystring = require('querystring');
var Languages = require('./supported_languages');



function Exception(message) {
	this.message = message;
}

module.exports = (from ,to ,text ,callback) => {
	
	if (from){
		from = from.toLowerCase();
	}
	if (to){
		to = to.toLowerCase();
	}

	var detectlanguage = false;

	if (from == undefined){
		detectlanguage = true;
	} else if ( !(from in Languages.languages) ){
		throw new Exception("Cannot translate from unknown language: " + from);
	}

	if(to == undefined || !(to in Languages.languages)){
		throw new Exception("Cannot translate to unknown language: " + to);
	}
	
	if (text == undefined || text.length == 0 ){
		throw new Exception("Cannot translate undefined or empty text string");
	}
	
	/*
	sl => source, 
	tl => translation language, 
	dt =>
		{
			dt => detection text,
			q => source text, 
			bd => dictionary, 
			ex => examples, 
			ld => ?, 
			md => definitions, 
			qca => ?, 
			rw => see also<list>, 
			rm => transcriptions, 
			ss => sysnonyms, 
			t => translation/translated text, 
			at => alternative translations
		}*/

	text = querystring.escape(text);

	var options = {
		host: 'translate.google.com',
		port: 443,
		path: '/translate_a/single?client=gtx&ie=UTF-8&oe=UTF-8' + ( detectlanguage ? "&sl=auto" : '&sl=' + from ) + '&tl='+to+'&dt=t&q='+text+'&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&dt=at',
		headers:{
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
				text:'',
				originalText:'',
				sourceLanguage:'',
				translationLanguage:'',
				isCorrect:true,
				source:{
					synonyms:[],
					pronunciation:[],
					definitions:[],
					examples:[]
				},
				translations:[]
			};
			

			if (content[7] != null && content[7].length !== 0){
				translated.isCorrect = false;
				translated.text = content[7][1];
			}else{
				translated.text = content[0][0][0];
				translated.originalText = content[0];
				
				translated.translationLanguage = to;

				if(content[8]!=null && content[8][0] != null){
					if(content[8][0].length > 0){
						content[8][0].forEach(sourceLang => {
							translated.sourceLanguage = sourceLang[0]+sourceLang[1];
						});
					}
				}
				//target translations
				if(content[1] !=null){
					content[1].forEach(translation => {
						var type = {
							type:translation[0], // noun
							translations:[],
						}
						translation[2].forEach(translations => {
							type.translations.push([
								translations[0], // word
								translations[1], // translations
								translations[4], // article
								translations[3]  // frecuency
							]);
						});
						translated.translations.push(type);
						
					});
				}

				
				//source synonyms
				if(content[11]!=null && content[11][0]!=null && content[11][0][1]!=null){
					if(content[11][0][1].length > 0){
						content[11][0][1].forEach(synonyms => {
							translated.source.synonyms.push(synonyms[0]);
						});
					}
				}				
				
				//pronunciation
				if(content[0][1]!=null){
					content[0][1].forEach(pronunciation => {
						if(pronunciation != null){
							translated.source.pronunciation.push(pronunciation);
						}
					});
				}
				

				//definitions
				if(content[12]!=null){
					
					content[12].forEach(definitions => {
						var define = {
							type:definitions[0],
							definitions:[]
						};
						definitions[1].forEach(one => {
							define.definitions.push({
								definition:one[0],
								example:one[2]
							});
						});
						translated.source.definitions.push(define);
						
					});
				}


				//examples
				if(content[13]!=null && content[13][0]!=null){
					var TextWithoutTags = '';
					content[13][0].forEach(examples => {
						if(examples != null){
							TextWithoutTags = examples[0].replace(/(<([^>]+)>)/ig, "");
							translated.source.examples.push(TextWithoutTags);
						}
					});
				}
			}
			callback(translated);
		});
	});
}