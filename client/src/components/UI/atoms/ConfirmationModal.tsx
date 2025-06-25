import styled from "styled-components";

import { ConfirmModalType } from "../../../types";

const StyledModal = styled.div`
  position: fixed;
  inset: 0; 
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;

  > div {
    background: #f3aadb;
    padding: 20px 25px;
    border-radius: 8px;
    max-width: 400px;
    width: 90%;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);

    h2 {
      color: #87085d;
      margin-bottom: 12px;
    }

    p {
      margin-bottom: 20px;
      font-size: 16px;
      color: #333;
    }

    button {
      padding: 10px 18px;
      font-size: 15px;
      border-radius: 6px;
      cursor: pointer;
      border: none;
      margin: 0 8px;
      transition: background-color 0.3s ease;
    }

    button.confirm {
      background-color: #f3aadb;
      color: #87085d;
      border: 1px solid #87085d;

      &:hover {
        background-color: #e97fc3;
      }
    }

    button.cancel {
      background-color: #242424;
      border: 1px solid #f3aadb;
      color: #f3aadb;

      &:hover {
        background-color: #e97fc3;
        color: #87085d;
      }
    }
  }
`;

const ConfirmModal: React.FC<ConfirmModalType> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
}) => {
    if (!isOpen) return null;

    return (
        <StyledModal>
            <div>
                {title && <h2>{title}</h2>}
                <p>{message}</p>
                <button className="confirm" onClick={onConfirm}>
                    Yes
                </button>
                <button className="cancel" onClick={onCancel}>
                    No
                </button>
            </div>
        </StyledModal>
    );
};

export default ConfirmModal;
