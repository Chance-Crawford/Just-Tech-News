// see google docs, handlebars.js, Creating custom helper functions in handlebars for Date Formats, etc.
// file meant for defining custom helper functions to use in handlebars templates.

module.exports = {
    // returns a formatted date, to use in handlebars templates
    format_date: date => {
      return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(
        date
      ).getFullYear()}`;
    },
    // Next up, we want the words "point" and "comment" to appear in their plural forms 
    // only when there are multiple points and comments, respectively.
    format_plural: (word, amount) => {
        if (amount !== 1) {
          return `${word.toLowerCase()}s`;
        }
    
        return word.toLowerCase();
    },
    // Lastly, we want to visually shorten the URLs on the front end.
    // It's worth noting that not all URLs will end in / routes. Sometimes they'll 
    // end with a query string, meaning that we'll want to cut things off 
    // before the ? character.
    format_url: url => {
        return url
        // replace all the things we wont need, cover all use cases of what a url
        // could be.
          .replace('http://', '')
          .replace('https://', '')
          .replace('www.', '')
          // split the string after the replacements took place, and only
          // get the first item in the array, which should now be the simplified website
          // url by itself.
          .split('/')[0]
          .split('?')[0];
    }
  }