function totalWords(req, res) {
const token = req.headers['x-access-token'];
    let jour = limit[token].date;
        jour=jour.getDate();
    
    let jourCourant = (new Date()).getDate();
    if (jourCourant !== jour) {
       limit[token].date = jourCourant;
        limit[token].words = 0;
    }
    const tab = req.body.split(/\n|\s/);
    limit[token].words += tab.length;
    return limit[token].words;
}
module.exports = totalWords;