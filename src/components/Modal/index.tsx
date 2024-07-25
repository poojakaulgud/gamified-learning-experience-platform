import React, { ReactNode, useState } from 'react';
import { Modal } from 'flowbite-react';

interface ModalProps {
  header: string;
  children: ReactNode;
  classes: string;
}

const LeaderboardModal: React.FC<ModalProps> = ({
  classes,
  children,
  header,
}) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <React.Fragment>
      <div className="flex flex-shrink-0 items-center justify-center">
        <button
          className="btn-icon btn-circle flex items-center justify-center"
          onClick={() => setOpenModal(true)}
        >
          <i className="fa-solid fa-up-right-and-down-left-from-center text-xl">
            {''}
          </i>
        </button>
      </div>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>{header}</Modal.Header>
        <Modal.Body>
          <div className={`${classes} shadow-xl`}>{children}</div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default LeaderboardModal;
