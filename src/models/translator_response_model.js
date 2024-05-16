class TranslatorResponseModel {
    constructor(data) {

        this.data = new Data(
            data["sentences"],
            data["dict"],
            data["src"],
            data["alternative_translations"],
            data["confidence"],
            data["spell"],
            data["ld_result"],
            data["synsets"],
            data["definitions"],
            data["examples"],
        );
    }
}

class Sentence {
    constructor(trans, orig, backend, translit, src_translit) {
        this.trans = trans || undefined;
        this.orig = orig || undefined;
        this.backend = backend || undefined;
        this.translit = translit || undefined;
        this.src_translit = src_translit || undefined;
    }
}

class Entry {
    constructor(word, reverse_translation, score, previous_word) {
        this.word = word || undefined;
        this.reverse_translation = reverse_translation || undefined;
        this.score = score || undefined;
        this.previous_word = previous_word || undefined;
    }
}

class Dict {
    constructor(pos, terms, entry, base_form, pos_enum) {
        this.pos = pos || undefined;
        this.terms = terms || undefined;
        this.entry = entry ? entry.map(e => new Entry(e["word"], e["reverse_translation"], e["score"], e["previous_word"])) : undefined;
        this.base_form = base_form || undefined;
        this.pos_enum = pos_enum || undefined;
    }
}

class Alternative {
    constructor(word_postproc, score, has_preceding_space, attach_to_next_token, backends) {
        this.word_postproc = word_postproc || undefined;
        this.score = score || undefined;
        this.has_preceding_space = has_preceding_space || undefined;
        this.attach_to_next_token = attach_to_next_token || undefined;
        this.backends = backends || undefined;
    }
}

class AlternativeTranslation {
    constructor(src_phrase, alternative, srcunicodeoffsets, raw_src_segment, start_pos, end_pos) {
        this.src_phrase = src_phrase || undefined;
        this.alternative = alternative ? alternative.map(a => new Alternative(a["word_postproc"], a["score"], a["has_preceding_space"], a["attach_to_next_token"], a["backends"])) : undefined;
        this.srcunicodeoffsets = srcunicodeoffsets || undefined;
        this.raw_src_segment = raw_src_segment || undefined;
        this.start_pos = start_pos || undefined;
        this.end_pos = end_pos || undefined;
    }
}

class Spell {
    constructor(spell_html_res, spell_res, correction_type, confident) {
        this.spell_html_res = spell_html_res || undefined;
        this.spell_res = spell_res || undefined;
        this.correction_type = correction_type || undefined;
        this.confident = confident || undefined;
    }
}

class LdResult {
    constructor(srclangs, srclangs_confidences, extended_srclangs) {
        this.srclangs = srclangs || undefined;
        this.srclangs_confidences = srclangs_confidences || undefined;
        this.extended_srclangs = extended_srclangs || undefined;
    }
}

class LabelInfo {
    constructor(register) {
        this.register = register || undefined;
    }
}

class SynsetEntry {
    constructor(synonym, definition_id, label_info) {
        this.synonym = synonym || undefined;
        this.definition_id = definition_id || undefined;
        this.label_info = label_info ? new LabelInfo(label_info["register"]) : undefined;
    }
}

class Synset {
    constructor(pos, entry, base_form, pos_enum) {
        this.pos = pos || undefined;
        this.entry = entry ? entry.map(e => new SynsetEntry(e["synonym"], e["definition_id"], e["label_info"])) : undefined;
        this.base_form = base_form || undefined;
        this.pos_enum = pos_enum || undefined;
    }
}

class DefinitionEntry {
    constructor(gloss, definition_id, example, label_info) {
        this.gloss = gloss || undefined;
        this.definition_id = definition_id || undefined;
        this.example = example || undefined;
        this.label_info = label_info ? new LabelInfo(label_info["register"]) : undefined;
    }
}

class Definition {
    constructor(pos, entry, base_form, pos_enum) {
        this.pos = pos || undefined;
        this.entry = entry ? entry.map(e => new DefinitionEntry(e["gloss"], e["definition_id"], e["example"], e["label_info"])) : undefined;
        this.base_form = base_form || undefined;
        this.pos_enum = pos_enum || undefined;
    }
}

class Example {
    constructor(text, definition_id) {
        this.text = text || undefined;
        this.definition_id = definition_id || undefined;
    }
}

class Examples {
    constructor(example) {
        this.example = example ? example.map(e => new Example(e["text"], e["definition_id"])) : undefined;
    }
}

class Data {
    constructor(sentences, dict, src, alternative_translations, confidence, spell, ld_result, synsets, definitions, examples) {

        this.sentences = sentences ? sentences.map(s => new Sentence(s["trans"], s["orig"], s["backend"], s["translit"], s["src_translit"])) : undefined;
        this.dict = dict ? dict.map(d => new Dict(d["pos"], d["terms"], d["entry"], d["base_form"], d["pos_enum"])) : undefined;
        this.src = src || undefined;
        this.alternative_translations = alternative_translations ? alternative_translations.map(at => new AlternativeTranslation(at["src_phrase"], at["alternative"], at["srcunicodeoffsets"], at["raw_src_segment"], at["start_pos"], at["end_pos"])) : undefined;
        this.confidence = confidence || undefined;
        this.spell = spell ? new Spell(spell["spell_html_res"], spell["spell_res"], spell["correction_type"], spell["confident"]) : undefined;
        this.ld_result = ld_result ? new LdResult(ld_result["srclangs"], ld_result["srclangs_confidences"], ld_result["extended_srclangs"]) : undefined;
        this.synsets = synsets ? synsets.map(s => new Synset(s["pos"], s["entry"], s["base_form"], s["pos_enum"])) : undefined;
        this.definitions = definitions ? definitions.map(d => new Definition(d["pos"], d["entry"], d["base_form"], d["pos_enum"])) : undefined;
        this.examples = examples ? new Examples(examples["example"]) : undefined;
    }
}



module.exports = {
    TranslatorResponseModel,
}
