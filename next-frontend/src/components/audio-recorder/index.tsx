import React, {
  Dispatch,
  SetStateAction,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Button, notification } from 'antd';
import { Container3 } from '@/styles/login.style';
import {
  AudioOutlined,
  PauseCircleFilled,
  PlayCircleFilled,
} from '@ant-design/icons';
import axios from 'axios';
import { pb } from '@/pages/_app';

interface AudioRecorderProps {
  setIsStart: Dispatch<SetStateAction<boolean>>;
  setTimer: Dispatch<SetStateAction<number>>;
  setElapsedTime: Dispatch<SetStateAction<number>>;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setOrderDisplay: Dispatch<SetStateAction<number>>;
  setRandomWord: Dispatch<SetStateAction<string[]>>;
  randomWord?: string[];
  characters: string;
}
export interface AudioRecorderRef {
  stopRecording: () => void;
}

const AudioRecorder: React.ForwardRefRenderFunction<
  AudioRecorderRef,
  AudioRecorderProps
> = (
  {
    setIsStart,
    setTimer,
    setElapsedTime,
    randomWord,
    setIsModalOpen,
    setOrderDisplay,
    setRandomWord,
    characters,
  },
  ref
) => {
  useImperativeHandle(ref, () => ({
    stopRecording,
  }));
  const [permission, setPermission] = React.useState<boolean>(false);
  const mediaRecorder = React.useRef<any>(null);
  const [recordingStatus, setRecordingStatus] =
    React.useState<string>('inactive');
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [audioChunks, setAudioChunks] = React.useState<any[]>([]);
  const [audio, setAudio] = React.useState<string | null>(null);
  const mimeType = 'audio/wav';

  const [api, contextHolder] = notification.useNotification();

  const getMicrophonePermission = async () => {
    if ('MediaRecorder' in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
      } catch (err: any) {
        alert(err.message);
      }
    } else {
      alert('The MediaRecorder API is not supported in your browser.');
    }
  };

  const startRecording = async () => {
    setRandomWord([
      characters.charAt(Math.floor(Math.random() * characters.length)),
    ]);
    setOrderDisplay(0);
    setElapsedTime(0);
    setIsStart(true);
    setRecordingStatus('recording');
    //create new Media recorder instance using the stream
    const media = new MediaRecorder(
      stream as MediaStream,
      { type: mimeType } as MediaRecorderOptions
    );
    //set the MediaRecorder instance to the mediaRecorder ref
    mediaRecorder.current = media;
    //invokes the start method to start the recording process
    mediaRecorder.current.start();
    let localAudioChunks: any[] = [];
    mediaRecorder.current.ondataavailable = (event: any) => {
      if (typeof event.data === 'undefined') return;
      if (event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);
  };

  const blobToBase64 = (blob: Blob) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function () {
        resolve(reader.result);
      };
    });
  };

  const stopRecording = async () => {
    setIsStart(false);
    setTimer((prevTimer) => prevTimer + 1);
    // setElapsedTime(0);
    setIsModalOpen(true);

    setRecordingStatus('inactive');
    //stops the recording instance
    // mediaRecorder.stop();
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = async () => {
      //creates a blob file from the audiochunks data
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      //creates a playable URL from the blob file.
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudio(audioUrl);

      const formData = new FormData();
      formData.append('user_id', pb.authStore.model?.id as string);
      formData.append('data', audioBlob);

      try {
        await axios.post(`/speech-upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        api.success({
          message: 'Upload Success',
        });
      } catch (error: any) {
        api.error({
          message: 'Upload Failed',
          description: error?.message,
        });
      }

      setAudioChunks([]);
    };
  };

  return (
    <Container3>
      {contextHolder}
      {/* <h2>Audio Recorder</h2> */}

      <div className="audio-controls">
        {!permission ? (
          <Button
            type="primary"
            icon={<AudioOutlined />}
            onClick={() => getMicrophonePermission()}
          >
            Get Microphone
          </Button>
        ) : null}
        {permission && recordingStatus === 'inactive' ? (
          <Button
            type="primary"
            icon={<PlayCircleFilled />}
            onClick={() => startRecording()}
          >
            StartRecording
          </Button>
        ) : null}
        {recordingStatus === 'recording' ? (
          <Button
            type="primary"
            icon={<PauseCircleFilled />}
            onClick={() => stopRecording()}
          >
            StopRecording
          </Button>
        ) : null}
      </div>
      {audio ? (
        <div className="audio-container">
          {/* <audio src={audio} controls></audio> */}
        </div>
      ) : null}
    </Container3>
  );
};

export default forwardRef(AudioRecorder);
