import { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Alert, MenuItem, Select, FormControl, InputLabel, Card, CardContent, Grid } from '@mui/material';
import { addEvent, fetchItems } from '../services/api';

interface Item {
  id: string;
  name: string;
}

interface FormData {
  type: string;
  location: string;
  custodian: string;
  notes: string;
  status: string;
}

const eventTypes = ['LOCATION_UPDATE', 'CUSTODIAN_CHANGE', 'STATUS_UPDATE'];
const statuses = ['PENDING', 'IN TRANSIT', 'DELIVERED', 'RETURNED'];

const AddEvent = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [formData, setFormData] = useState<FormData>({ type: '', location: '', custodian: '', notes: '', status: '' });
  const [errors, setErrors] = useState<{ [K in keyof FormData]?: string }>({});
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchItemsList = async () => {
      try {
        const data = await fetchItems();
        if (Array.isArray(data)) {
          setItems(data);
        } else {
          console.error('Unexpected API response:', data);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchItemsList();
  }, []);

  const handleSelectChange = (event: any) => {
    setSelectedItemId(event.target.value);
  };

  const validateField = (field: keyof FormData, value: string) => {
    let error = '';
    if (!value.trim()) {
      error = `${field} is required`;
    } else {
      if (field === 'type' && !eventTypes.includes(value)) {
        error = 'Invalid event type selected';
      } else if (
        (field === 'location' || field === 'custodian' || field === 'notes') &&
        !/^[a-zA-Z0-9 ]+$/.test(value)
      ) {
        error = `${field} must contain only letters and numbers`;
      }
    }
    return error;
  };

  const validateForm = () => {
    let newErrors: { [K in keyof FormData]?: string } = {};
    (Object.keys(formData) as (keyof FormData)[]).forEach(field => {
      newErrors[field] = validateField(field, formData[field]);
    });
    setErrors(newErrors);
    return Object.keys(newErrors).every(key => newErrors[key as keyof FormData] === '');
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prevState => ({ ...prevState, [field]: value }));
    setErrors(prevErrors => ({ ...prevErrors, [field]: validateField(field, value) }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    try {
      await addEvent(selectedItemId, formData);
      setSuccess('Event added successfully!');
      setFormData({ type: '', location: '', custodian: '', notes: '', status: '' });
      setErrors({});
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '10px' }}>
      <Card className="form-card" elevation={3}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Add Event
          </Typography>
          {success && <Alert severity="success" className="alert-success">{success}</Alert>}
          <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>Select Item</InputLabel>
                  <Select value={selectedItemId} onChange={handleSelectChange}>
                    {items.map((item) => (
                      <MenuItem key={item.id} value={item.id}>{`${item.name} - ${item.id}`}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {selectedItemId && (
                <>
                  <Grid item xs={12}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Event Type</InputLabel>
                      <Select value={formData.type} onChange={(e) => handleChange('type', e.target.value)} error={!!errors.type}>
                        {eventTypes.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth size="small" label="Location" variant="outlined" value={formData.location} onChange={(e) => handleChange('location', e.target.value)} error={!!errors.location} helperText={errors.location} className="input-field" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth size="small" label="Custodian" variant="outlined" value={formData.custodian} onChange={(e) => handleChange('custodian', e.target.value)} error={!!errors.custodian} helperText={errors.custodian} className="input-field" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth size="small" label="Notes" variant="outlined" value={formData.notes} onChange={(e) => handleChange('notes', e.target.value)} error={!!errors.notes} helperText={errors.notes} className="input-field" />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Status</InputLabel>
                      <Select value={formData.status} onChange={(e) => handleChange('status', e.target.value)} error={!!errors.status}>
                        {statuses.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} className="button-container" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="submit" variant="contained" color="primary" size="large" className="styled-button">
                      Add Event
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AddEvent;
