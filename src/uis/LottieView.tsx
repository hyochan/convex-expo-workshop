import {css} from '@emotion/native';
import type {LottieViewProps} from 'lottie-react-native';
import LottieReactNative from 'lottie-react-native';

import DoobooLoading from '../../assets/lotties/dooboo_loading.json';

export type LottieSourceType = 'cpk-loading';

function LottieView(
  props: Omit<LottieViewProps, 'source'> & {
    type?: LottieSourceType;
  },
): JSX.Element {
  return (
    <LottieReactNative
      autoPlay
      speed={2}
      style={css`
        margin: 12px 0;
        width: 64px;
        height: 64px;
        align-self: center;
      `}
      {...props}
      source={DoobooLoading}
    />
  );
}

export default LottieView;
