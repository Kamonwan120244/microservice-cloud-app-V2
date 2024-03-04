import { Button, Modal, Spin } from 'antd';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons';
interface WordCheckedItem {
  text: string;
  isCorrect: boolean;
}
interface ModalScoreProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  wordChecked: WordCheckedItem[];
  isLoading: boolean;
  patternDisplay: string;
  randomWord: string[];
}

const ModalScore: React.FC<ModalScoreProps> = ({
  isModalOpen,
  setIsModalOpen,
  wordChecked,
  isLoading,
  patternDisplay,
  randomWord,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const randomWordShared = randomWord.slice(0, patternDisplay.length);
  const wordCheckedShared = randomWord.slice(0, patternDisplay.length);

  const accuracyPercentage =
    (wordChecked.filter((value) => value.isCorrect).length /
      randomWordShared.length) *
    100;

  const groupPatternArray = () => {
    const groupedArray: WordCheckedItem[][] = [];
    let currentIndex = 0;

    for (let i = 0; i < patternDisplay.length; i++) {
      const pattern = parseInt(patternDisplay[i]);

      if (
        i === patternDisplay.length - 1 ||
        pattern !== parseInt(patternDisplay[i + 1])
      ) {
        const currentGroup = wordChecked.slice(currentIndex, i + 1);
        groupedArray.push(currentGroup);
        currentIndex = i + 1;
      }
    }

    return groupedArray;
  };

  const groupedArray = groupPatternArray();

  const handleClose = () => {
    setCurrentPage(0);
    setIsModalOpen(false);
  };

  const handleNext = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    setCurrentPage(currentPage - 1);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 0:
        return (
          <div style={{ textAlign: 'center' }}>
            <h1>Eye Test Succeed</h1>
            <h3>your score is</h3>
            {!isLoading ? <Spin /> : <h1>{accuracyPercentage.toFixed(2)}%</h1>}
          </div>
        );
      case 1:
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <h1 style={{ padding: '16px 0' }}>Snellen Chart Result</h1>
            {groupedArray.map((value, index) => {
              return (
                <div key={index} style={{ display: 'flex', gap: '16px' }}>
                  {value.map((data: any, i) => {
                    return (
                      <h1
                        key={i}
                        style={{ color: data?.isCorrect ? '#333' : '#fd3c2a' }}
                      >
                        {data?.text}
                      </h1>
                    );
                  })}
                </div>
              );
            })}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      open={isModalOpen}
      onCancel={handleClose}
      centered
      footer={[
        currentPage !== 0 && (
          <Button
            key="back"
            onClick={handlePrev}
            disabled={currentPage === 0}
            icon={<ArrowLeftOutlined />}
          >
            Previous
          </Button>
        ),
        currentPage !== 1 && (
          <Button key="next" type="primary" onClick={handleNext}>
            Next
            <ArrowRightOutlined />
          </Button>
        ),
        currentPage !== 0 && (
          <Button key="close" onClick={handleClose}>
            Close
          </Button>
        ),
      ]}
    >
      {renderContent()}
    </Modal>
  );
};

export default ModalScore;
