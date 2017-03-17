import _ from 'lodash';
import fs from 'fs';

export const saveSlots = (slots) => {
  fs.writeFile('./build/main/storage/slots.json', JSON.stringify(slots), (err) => {
    if (err) throw err;
  });
};

export const readSlots = () => {
  return fs.readFileSync('./build/main/storage/slots.json');
};
