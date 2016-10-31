import { Dialog } from './Dialog.js';
import { Loading } from './Loading.js';

export default function(comp) {

    comp = Dialog(comp);
    comp = Loading(comp);
    return comp;
};