import React, { useEffect, useRef, useState } from 'react';
import { Button, notification } from 'antd';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import AudioRecorder, { AudioRecorderRef } from '../audio-recorder';
import { pb } from '@/pages/_app';
import { Record } from 'pocketbase';
import ModalScore from '../modal-score';

const EyeTest = () => {
  const audioRecorderRef = useRef<AudioRecorderRef>(null);
  const [listFontSize, setListFontSize] = React.useState<Record>();
  const [api, contextHolder] = notification.useNotification();

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const patternDisplay = '12345678';
  // const patternDisplay = '112222333333444444555555666666777777888888';
  const timerDuration = 3;
  const clinic_id = pb.authStore.model?.clinic_id;

  const [isStart, setIsStart] = React.useState(false);
  const [timer, setTimer] = React.useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  // console.log('🚀 ~ EyeTest ~ elapsedTime:', elapsedTime);
  const [orderDisplay, setOrderDisplay] = useState(0);
  const [word, setWord] = useState<Record[]>([]);
  const [randomWord, setRandomWord] = useState<string[]>([
    characters.charAt(Math.floor(Math.random() * characters.length)),
  ]);
  console.log('🚀 ~ EyeTest ~ randomWord:', randomWord);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const getRandomWord = React.useCallback(() => {
    setRandomWord((prevRandomWord) => [
      ...prevRandomWord,
      characters.charAt(Math.floor(Math.random() * characters.length)),
    ]);
    setOrderDisplay((prev) => prev + 1);
  }, [characters]);

  const getFontSize = React.useCallback(async () => {
    try {
      const result = await pb
        .collection('font_size')
        .getFirstListItem(`clinic_id="${clinic_id}"`);

      setListFontSize(result);
    } catch (error: any) {
      api.error({
        message: 'Error',
        description: error?.message,
      });
    }
  }, [api, clinic_id]);

  const fetchData = React.useCallback(async () => {
    try {
      const result = await pb.collection('words').getList(1, 1, {
        filter: `user_id='${pb.authStore.model?.id}'`,
        sort: '-created',
      });
      setWord(result.items);
    } catch (error: any) {
      api.error({
        message: 'Error',
        description: error?.message,
      });
    }
  }, [api]);

  pb.collection('words').subscribe('*', () => {
    fetchData();
  });

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (isStart) {
      intervalId = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isStart]);

  useEffect(() => {
    if (elapsedTime >= timerDuration && isStart) {
      getRandomWord();
      if (orderDisplay === patternDisplay.length - 1) {
        setIsStart(false);
        setOrderDisplay(0);
        if (audioRecorderRef.current) {
          audioRecorderRef.current.stopRecording();
        }
      }
      setElapsedTime(0);
    }
  }, [
    elapsedTime,
    isStart,
    getRandomWord,
    orderDisplay,
    patternDisplay.length,
  ]);

  useEffect(() => {
    getFontSize();
  }, [getFontSize]);

  useEffect(() => {
    fetchData();

    return () => {
      pb.collection('words').unsubscribe();
    };
  }, [fetchData]);

  return (
    <>
      {contextHolder}
      <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
        <CountdownCircleTimer
          key={timer}
          isPlaying={isStart}
          duration={timerDuration}
          size={60}
          strokeWidth={4}
          colors={['#65bd3f', '#f8d666', '#fd3c2a']}
          colorsTime={[3, 1, 0]}
          onComplete={() => {
            return { shouldRepeat: true, delay: 0 };
          }}
        >
          {({ remainingTime }) => (
            <p style={{ fontSize: '28px' }}>{remainingTime}</p>
          )}
        </CountdownCircleTimer>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flex: 1,
          alignItems: 'center',
        }}
      >
        {isStart ? (
          <p
            style={{
              fontSize: `${
                listFontSize?.['level_' + patternDisplay.charAt(orderDisplay)] /
                10
              }cm`,
              lineHeight: `${
                listFontSize?.['level_' + patternDisplay.charAt(orderDisplay)] /
                10
              }cm`,
            }}
          >
            {randomWord[orderDisplay]}
          </p>
        ) : orderDisplay !== 0 ? (
          <h1>STOP</h1>
        ) : (
          <h1>START</h1>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <AudioRecorder
          ref={audioRecorderRef}
          setIsStart={setIsStart}
          setTimer={setTimer}
          setElapsedTime={setElapsedTime}
          randomWord={randomWord}
          setIsModalOpen={setIsModalOpen}
          setOrderDisplay={setOrderDisplay}
          setRandomWord={setRandomWord}
          characters={characters}
        />
      </div>
      {/* <ModalScore isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} /> */}
    </>
  );
};

export default EyeTest;
