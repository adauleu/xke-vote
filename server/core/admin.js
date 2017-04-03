const fs = require('fs');

const saveSlots = (slots) =>
  fs.writeFile('./build/main/storage/slots.json', JSON.stringify(slots), (err) => {
    if (err) throw err;
  });

const readSlots = () => fs.readFileSync('./build/main/storage/slots.json');

module.exports = {
  saveSlots,
  readSlots,
};
