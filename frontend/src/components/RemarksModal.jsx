import React, { useState } from 'react'
import { Modal, Button, Form, Alert } from 'react-bootstrap'

const RemarksModal = ({ show, onHide, onSubmit, actionType, beneficiaryName }) => {
  const [remarks, setRemarks] = useState('')

  const handleSubmit = () => {
    onSubmit(remarks)
    setRemarks('')
  }

  const handleClose = () => {
    setRemarks('')
    onHide()
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {actionType === 'Approved' ? 'Approve' : 'Reject'} Beneficiary
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Alert variant={actionType === 'Approved' ? 'success' : 'danger'}>
          You are about to <strong>{actionType.toLowerCase()}</strong> the application for{' '}
          <strong>{beneficiaryName}</strong>
        </Alert>

        <Form.Group>
          <Form.Label>Remarks (Optional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter any remarks or comments..."
          />
        </Form.Group>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button 
          variant={actionType === 'Approved' ? 'success' : 'danger'} 
          onClick={handleSubmit}
        >
          Confirm {actionType}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default RemarksModal