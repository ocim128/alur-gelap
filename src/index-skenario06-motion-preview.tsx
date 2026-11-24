import {Composition, registerRoot} from 'remotion';
import {motionPreviewDuration, Skenario06VisualMotionPreview} from './Skenario06VisualMotionPreview';

const PreviewRoot = () => <Composition id="Skenario06VisualMotionPreview" component={Skenario06VisualMotionPreview} width={270} height={480} fps={30} durationInFrames={motionPreviewDuration} />;

registerRoot(PreviewRoot);
