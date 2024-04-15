const generateSlug = (name) => {
    return name.toLowerCase().replace(/\s+/g, '_');
}

module.exports = {
    generateSlug
}