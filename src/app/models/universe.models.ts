export interface Poem {
  num: string;
  lines: string;
  quote: string;
}

export interface Memory {
  icon: string;
  title: string;
  poem: string;
  quote: string;
  color: string;
}

export interface FutureDream {
  text: string;
}

export interface SceneState {
  current: number;
  previous: number;
  isTransitioning: boolean;
}
