// see google docs, handlebars.js, Creating custom helper functions in handlebars for Date Formats, etc.
// tests helper functions that we made to use in handlebars HTML templates

// functions imported from utils/helpers.js
const {format_date, format_plural, format_url} = require('../utils/helpers');


// tests
test('format_date() returns a date string', () => {
    const date = new Date('2020-03-20 16:12:03');
  
    expect(format_date(date)).toBe('3/20/2020');
});

test('format words to be plural or singular depending on quantity', () =>{
    expect(format_plural('Tiger', 2)).toBe('tigers');
    expect(format_plural('Lion', 1)).toBe('lion');
});

test('format_url() returns a simplified url string', () => {
    const url1 = format_url('http://test.com/page/1');
    const url2 = format_url('https://www.coolstuff.com/abcdefg/');
    const url3 = format_url('https://www.google.com?q=hello');
  
    expect(url1).toBe('test.com');
    expect(url2).toBe('coolstuff.com');
    expect(url3).toBe('google.com');
});