import { Dialog } from '../../component/mixin/Dialog.js';
import { Network } from '../../component/mixin/Network.js';
import { Loading } from '../../component/mixin/Loading.js';

export default function(comp) {

    comp = Network(comp);
    comp = Dialog(comp);
    comp = Loading(comp);
    return comp;
};