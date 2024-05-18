class TranslationUtils {

    static parseHtmlWords(text) {
        // Array to store the words
        let words = [];

        // RegEx to find HTML tags with content
        const regex = /<[^>]+>([^<]+)<\/[^>]+>/g;

        // Text to convert
        const spell_html = text || '';

        // Find and extract content from HTML tags
        let match;
        while ((match = regex.exec(spell_html)) !== null) {
            words.push(match[1].trim());
        }

        // Return the array of words or undefined if it is empty
        return words.length > 0 ? words : undefined;
    }

    static removeHtmlTags(text) {
        // validate input type
        if (typeof text !== 'string') {
            return '';
        }

        // RegEx to find and delete  HTML tags 
        const regex = /<\/?[^>]+(>|$)/g;
        const cleanText = text.replace(regex, '');

        return cleanText.trim();
    }
}

module.exports = {
    TranslationUtils
};
