import React, { useState } from 'react'
import { Card, Badge, Button, Row, Col, ListGroup, Modal } from 'react-bootstrap'
import RemarksModal from './RemarksModal'

const BeneficiaryCard = ({ beneficiary, onStatusUpdate }) => {
  const [showRemarksModal, setShowRemarksModal] = useState(false)
  const [actionType, setActionType] = useState('')
  const [showImageModal, setShowImageModal] = useState(false)

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Approved': return 'success'
      case 'Rejected': return 'danger'
      case 'Pending': return 'warning'
      default: return 'secondary'
    }
  }

  const getAuthenticityVariant = (status) => {
    switch (status) {
      case 'Verified': return 'success'
      case 'Suspicious': return 'warning'
      case 'Fraud': return 'danger'
      default: return 'secondary'
    }
  }

  const handleStatusAction = (type) => {
    setActionType(type)
    setShowRemarksModal(true)
  }

  const handleRemarksSubmit = (remarks) => {
    onStatusUpdate(beneficiary.id, actionType, remarks)
    setShowRemarksModal(false)
  }

  const openMapLink = () => {
    const { lat, lon } = beneficiary.location_validation.registered_location
    window.open(`https://www.google.com/maps?q=${lat},${lon}`, '_blank')
  }

  return (
    <>
      <Card className="h-100 shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">{beneficiary.name}</h5>
          <Badge bg={getStatusVariant(beneficiary.status)}>
            {beneficiary.status}
          </Badge>
        </Card.Header>

        <Card.Body>
          {/* Photo Section */}
          <div className="text-center mb-3">
            <img
              src={beneficiary.photo}
              alt={beneficiary.name}
              className="img-fluid rounded cursor-pointer"
              style={{ maxHeight: '200px', cursor: 'pointer' }}
              onClick={() => setShowImageModal(true)}
            />
            <div className="mt-2">
              <small className="text-muted">Click image to enlarge</small>
            </div>
          </div>

          {/* Authenticity Score */}
          <Row className="mb-3">
            <Col>
              <strong>Authenticity:</strong>
              <Badge 
                bg={getAuthenticityVariant(beneficiary.authenticity.status)} 
                className="ms-2"
              >
                {beneficiary.authenticity.status} ({beneficiary.authenticity.score})
              </Badge>
            </Col>
          </Row>

          {/* Location Validation */}
          <Row className="mb-3">
            <Col>
              <strong>Location:</strong>
              {beneficiary.location_validation.within_radius !== null ? (
                <Badge 
                  bg={beneficiary.location_validation.within_radius ? 'success' : 'danger'} 
                  className="ms-2"
                >
                  {beneficiary.location_validation.within_radius ? 'Within Radius' : 'Outside Radius'}
                </Badge>
              ) : (
                <Badge bg="secondary" className="ms-2">Not Available</Badge>
              )}
              {beneficiary.location_validation.registered_location && (
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="ms-2"
                  onClick={openMapLink}
                >
                  View Map
                </Button>
              )}
            </Col>
          </Row>

          {/* Detected Objects */}
          <div className="mb-3">
            <strong>Detected Objects:</strong>
            <div className="mt-1">
              {Object.entries(beneficiary.detected_objects.object_summary).map(([object, count]) => (
                <Badge key={object} bg="info" className="me-1 mb-1">
                  {object}: {count}
                </Badge>
              ))}
            </div>
          </div>

          {/* Detailed Object Results */}
          <div className="mb-3">
            <strong>Detailed Analysis:</strong>
            <ListGroup variant="flush" className="mt-1">
              {beneficiary.detected_objects.detailed_results.slice(0, 3).map((result, index) => (
                <ListGroup.Item key={index} className="px-0 py-1">
                  <small>
                    {result.object}: <strong>{result.confidence}%</strong>
                  </small>
                </ListGroup.Item>
              ))}
            </ListGroup>
            {beneficiary.detected_objects.detailed_results.length > 3 && (
              <small className="text-muted">
                +{beneficiary.detected_objects.detailed_results.length - 3} more objects
              </small>
            )}
          </div>

          {/* Remarks */}
          {beneficiary.remarks && (
            <div className="mb-3">
              <strong>Remarks:</strong>
              <div className="text-muted small mt-1">{beneficiary.remarks}</div>
            </div>
          )}
        </Card.Body>

        <Card.Footer>
          {beneficiary.status === 'Pending' && (
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Button 
                variant="success" 
                size="sm"
                onClick={() => handleStatusAction('Approved')}
              >
                Approve
              </Button>
              <Button 
                variant="danger" 
                size="sm"
                onClick={() => handleStatusAction('Rejected')}
              >
                Reject
              </Button>
            </div>
          )}
        </Card.Footer>
      </Card>

      {/* Image Preview Modal */}
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{beneficiary.name} - Photo</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img
            src={beneficiary.photo}
            alt={beneficiary.name}
            className="img-fluid"
          />
        </Modal.Body>
      </Modal>

      {/* Remarks Modal */}
      <RemarksModal
        show={showRemarksModal}
        onHide={() => setShowRemarksModal(false)}
        onSubmit={handleRemarksSubmit}
        actionType={actionType}
        beneficiaryName={beneficiary.name}
      />
    </>
  )
}

export default BeneficiaryCard;