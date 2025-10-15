import React, { useState, useEffect } from 'react'
import { Container, Navbar, Nav, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap'
import BeneficiaryCard from './BeneficiaryCard'

const Dashboard = ({ user, onLogout }) => {
  const [beneficiaries, setBeneficiaries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchBeneficiaries()
  }, [])

  const fetchBeneficiaries = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/beneficiaries')
      if (!response.ok) {
        throw new Error('Failed to fetch beneficiaries')
      }
      const data = await response.json()
      setBeneficiaries(data)
    } catch (err) {
      setError('Error loading beneficiaries: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id, newStatus, remarks = '') => {
    try {
      const response = await fetch('/api/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: newStatus, remarks })
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      const result = await response.json()
      
      if (result.success) {
        setBeneficiaries(prev =>
          prev.map(beneficiary =>
            beneficiary.id === id
              ? { ...beneficiary, status: newStatus, remarks }
              : beneficiary
          )
        )
      }
    } catch (err) {
      setError('Error updating status: ' + err.message)
    }
  }

  const filteredBeneficiaries = beneficiaries.filter(beneficiary => {
    if (filter === 'all') return true
    return beneficiary.status === filter
  })

  const stats = {
    total: beneficiaries.length,
    pending: beneficiaries.filter(b => b.status === 'Pending').length,
    approved: beneficiaries.filter(b => b.status === 'Approved').length,
    rejected: beneficiaries.filter(b => b.status === 'Rejected').length
  }

  return (
    <>
      <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand>Beneficiary Dashboard</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              <Navbar.Text className="me-3">
                Welcome, {user?.name}
              </Navbar.Text>
              <Button variant="outline-light" onClick={onLogout}>
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title className="text-primary">{stats.total}</Card.Title>
                <Card.Text>Total Beneficiaries</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title className="text-warning">{stats.pending}</Card.Title>
                <Card.Text>Pending Review</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title className="text-success">{stats.approved}</Card.Title>
                <Card.Text>Approved</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title className="text-danger">{stats.rejected}</Card.Title>
                <Card.Text>Rejected</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Filter Buttons */}
        <Row className="mb-3">
          <Col>
            <Button
              variant={filter === 'all' ? 'primary' : 'outline-primary'}
              className="me-2"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'Pending' ? 'warning' : 'outline-warning'}
              className="me-2"
              onClick={() => setFilter('Pending')}
            >
              Pending
            </Button>
            <Button
              variant={filter === 'Approved' ? 'success' : 'outline-success'}
              className="me-2"
              onClick={() => setFilter('Approved')}
            >
              Approved
            </Button>
            <Button
              variant={filter === 'Rejected' ? 'danger' : 'outline-danger'}
              onClick={() => setFilter('Rejected')}
            >
              Rejected
            </Button>
          </Col>
        </Row>

        {/* Beneficiaries List */}
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <Row>
            {filteredBeneficiaries.map(beneficiary => (
              <Col key={beneficiary.id} lg={6} className="mb-4">
                <BeneficiaryCard
                  beneficiary={beneficiary}
                  onStatusUpdate={handleStatusUpdate}
                />
              </Col>
            ))}
          </Row>
        )}

        {!loading && filteredBeneficiaries.length === 0 && (
          <Alert variant="info" className="text-center">
            No beneficiaries found for the selected filter.
          </Alert>
        )}
      </Container>
    </>
  )
}

export default Dashboard;