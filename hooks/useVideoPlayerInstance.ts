import { useVideoPlayer } from "expo-video";

const useVideoPlayerInstance = (uri: string) => {
    const player = useVideoPlayer(uri, (player) => {
      player.loop = true;
      player.play();
    });
    return player;
  };
  
  export default useVideoPlayerInstance