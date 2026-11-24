import script from '../../episodes/008-pagi-jam-dua/chat-script.json';
import {ArsipPlayer} from './ArsipPlayer';
import type {ChatScriptV3} from './types';

export const arsip02Script = script as ChatScriptV3;

export function Arsip02PagiJamDua() {
  return <ArsipPlayer script={arsip02Script} />;
}
