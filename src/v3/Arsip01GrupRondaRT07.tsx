import script from '../../episodes/007-grup-ronda-rt07/chat-script.json';
import {ArsipPlayer} from './ArsipPlayer';
import type {ChatScriptV3} from './types';

export const arsip01Script = script as ChatScriptV3;

export function Arsip01GrupRondaRT07() {
  return <ArsipPlayer script={arsip01Script} />;
}
