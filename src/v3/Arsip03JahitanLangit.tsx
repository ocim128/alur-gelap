import script from '../../episodes/009-jahitan-langit/chat-script.json';
import {ArsipPlayer} from './ArsipPlayer';
import type {ChatScriptV3} from './types';

export const arsip03Script = script as ChatScriptV3;

export function Arsip03JahitanLangit() {
  return <ArsipPlayer script={arsip03Script} />;
}
