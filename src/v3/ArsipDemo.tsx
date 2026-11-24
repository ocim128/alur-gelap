import demoScript from './demo/chat-script.json';
import {ArsipPlayer} from './ArsipPlayer';
import type {ChatScriptV3} from './types';

export const arsipDemoScript = demoScript as ChatScriptV3;

export function ArsipDemo() {
  return <ArsipPlayer script={arsipDemoScript} />;
}
