module.exports.createSlug = function(value) {
  return value
    .toLowerCase()
    .replace(/[^\w\s]+/g, '')
    .trim()
    .replace(/[\s]+/g, '-');
}
