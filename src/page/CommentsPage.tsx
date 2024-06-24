import React, { useState, useEffect } from "react";
import { Comment, Receipt } from "../utils/types";
import { API } from "../services/apiUrls";
import { useTokenReset } from "../services/loginHandleToToken";
import { Card, Select, Button, Modal } from "antd"; // Import Ant Design components

const { Option } = Select;

function CommentsPage() {
  const api = useTokenReset();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [selectedReceiptId, setSelectedReceiptId] = useState<number | null>(
    null
  );
  const [comments, setComments] = useState<Comment[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

  const getAllReceipts = async () => {
    try {
      const response = await api.get(API.RECEIPTS.GET_ALL);
      setReceipts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getCommentsByReceipt = async (id: number) => {
    try {
      const response = await api.get(
        API.COMMENTS.GET_BY_RECEIPT_ID + id.toString()
      );
      setComments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteComment = async () => {
    if (commentToDelete !== null) {
      try {
        await api.delete(API.COMMENTS.DELETE + commentToDelete.toString());
        setComments(
          comments.filter((comment) => comment.commentId !== commentToDelete)
        );
      } catch (error) {
        console.error(error);
      } finally {
        setIsModalVisible(false);
        setCommentToDelete(null);
      }
    }
  };

  useEffect(() => {
    getAllReceipts();
  }, []);

  useEffect(() => {
    if (selectedReceiptId !== null) {
      getCommentsByReceipt(selectedReceiptId);
    }
  }, [selectedReceiptId]);

  const showModal = (commentId: number) => {
    setCommentToDelete(commentId);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCommentToDelete(null);
  };

  return (
    <div style={{ minHeight: "100vh", padding: 20 }}>
      <Select
        value={selectedReceiptId}
        onChange={(value) => setSelectedReceiptId(value)}
        style={{ width: 200, marginBottom: 20 }}
        placeholder="Select a receipt"
      >
        {receipts.map((receipt: Receipt) => (
          <Option key={receipt.id} value={receipt.id}>
            {receipt.receiptName}
          </Option>
        ))}
      </Select>
      <div>
        {comments.map((comment) => (
          <Card
            key={comment.commentId}
            title={comment.userName}
            style={{ marginBottom: 10 }}
            extra={
              <Button
                type="primary"
                danger
                onClick={() => showModal(comment.commentId)}
              >
                Sil
              </Button>
            }
          >
            <p>{comment.comment}</p>
            <small>{comment.createdDate}</small>
          </Card>
        ))}
      </div>
      <Modal
        title="Yorumu Sil"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              key="back"
              onClick={handleCancel}
              style={{ marginRight: 10 }}
            >
              Hayır
            </Button>
            <Button
              key="submit"
              type="primary"
              style={{ width: "70px" }}
              danger
              onClick={deleteComment}
            >
              Evet
            </Button>
          </div>
        }
      >
        <p>Silmek istediğinize emin misiniz?</p>
      </Modal>
    </div>
  );
}

export default CommentsPage;
