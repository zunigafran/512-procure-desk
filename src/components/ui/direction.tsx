import * as React from 'react';
import { I18nManager, View, type ViewProps } from 'react-native';

type Direction = 'ltr' | 'rtl';

const DirectionContext = React.createContext<Direction | undefined>(undefined);

/**
 * Provides a reading direction to all descendants, mirroring Radix UI's
 * DirectionProvider. Falls back to the device setting (I18nManager) when
 * no provider is mounted.
 */
function DirectionProvider({
  dir,
  children,
}: {
  dir: Direction;
  children: React.ReactNode;
}) {
  return (
    <DirectionContext.Provider value={dir}>{children}</DirectionContext.Provider>
  );
}

function useDirection(localDir?: Direction): Direction {
  const globalDir = React.useContext(DirectionContext);
  return localDir ?? globalDir ?? (I18nManager.isRTL ? 'rtl' : 'ltr');
}

/**
 * Layout container that applies the current reading direction to its children
 * by flipping the flex direction of row layouts.
 */
function DirectionView({
  dir,
  style,
  ...props
}: ViewProps & { dir?: Direction }) {
  const direction = useDirection(dir);
  return <View style={[{ direction }, style]} {...props} />;
}

export { DirectionProvider, DirectionView, useDirection };
export type { Direction };
