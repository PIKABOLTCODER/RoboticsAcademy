import React, {  useEffect, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

const PlayPause = (props) => {
  const [loading, setLoading] = useState(false);
  const [paused, setPaused] = useState(true);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const callback = (message) => {
      const state = message.data.state;
      setPaused(
        state === "paused" || state === "visualization_ready" || state === "connected"
      );
      setDisabled(
        !(
          state === "connected" ||
          state === "visualization_ready" ||
          state === "application_running" ||
          state === "paused"
        )
      );
    };

    window.RoboticsExerciseComponents.commsManager.subscribe(
      [window.RoboticsExerciseComponents.commsManager.events.STATE_CHANGED],
      callback
    );

    return () => {
      window.RoboticsExerciseComponents.commsManager.unsubscribe(
        [window.RoboticsExerciseComponents.commsManager.events.STATE_CHANGED],
        callback
      );
    };
  }, []);

  const play = () => {
    console.log(`Play run`);
    setLoading(true);
    const editorCode = RoboticsReactComponents.CodeEditor.getCode();
    runCode(editorCode);
  
  };

  const config = JSON.parse(
    document.getElementById("exercise-config").textContent)

  const runCode = (code) => {
    window.RoboticsExerciseComponents.commsManager
      .run({code: code, template:config[0].template})
      .then(() => {
        console.log("running");
      })
      .catch((response) => {
        let linterMessage = JSON.stringify(response.data.message).split("\\n");
        RoboticsReactComponents.MessageSystem.Alert.showAlert(linterMessage);
        console.log(`Received linter message ·${linterMessage}`);
        setLoading(false);
      });
  };

  const pause = () => {
    console.log(`Pause run`);
    setLoading(true);

    window.RoboticsExerciseComponents.commsManager
      .pause()
      .then(() => {
        console.log("paused");
      })
      .catch((response) => console.log(response))
      .finally(() => setLoading(false));
  };

  return (
    <LoadingButton
      disabled={disabled}
      id={"loadIntoRobot"}
      loading={loading}
      color={"secondary"}
      onClick={paused ? play : pause}
      sx={{ m: 0.5 }}
      variant={"outlined"}
    >
      {paused ? <PlayArrowIcon /> : <PauseIcon />}
    </LoadingButton>
  );
};

export default PlayPause;
