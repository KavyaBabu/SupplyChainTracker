import { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Alert, MenuItem, Select, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { addEvent, fetchItems } from '../services/api';

interface Item {
  id: string;
  name: string;
}

const eventTypes = ['LOCATION_UPDATE', 'CUSTODIAN_CHANGE', 'STATUS_UPDATE'];
const statuses = ['PENDING', 'IN TRANSIT', 'DELIVERED', 'RETURNED'];

const AddEvent = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [formData, setFormData] = useState({ type: '', location: '', custodian: '', notes: '', status: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
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

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setSelectedItemId(event.target.value);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prevState => ({ ...prevState, [field]: value }));
    setErrors(prevErrors => ({ ...prevErrors, [field]: value.trim() ? '' : `${field} is required` }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (Object.values(formData).some(value => !value.trim())) {
      setErrors({ type: 'All fields are required' });
      return;
    }
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
    <Container>
      <Typography variant="h4" gutterBottom>Add Event</Typography>
      {success && <Alert severity="success">{success}</Alert>}
      <FormControl fullWidth margin="normal">
        <InputLabel>Select Item</InputLabel>
        <Select value={selectedItemId} onChange={handleSelectChange}>
          {items.map((item) => (
            <MenuItem key={item.id} value={item.id}>{`${item.name} - ${item.id}`}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedItemId && (
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Event Type</InputLabel>
            <Select value={formData.type} onChange={(e) => handleChange('type', e.target.value)}>
              {eventTypes.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField fullWidth margin="normal" label="Location" value={formData.location} onChange={(e) => handleChange('location', e.target.value)} error={!!errors.location} helperText={errors.location} />
          <TextField fullWidth margin="normal" label="Custodian" value={formData.custodian} onChange={(e) => handleChange('custodian', e.target.value)} error={!!errors.custodian} helperText={errors.custodian} />
          <TextField fullWidth margin="normal" label="Notes" value={formData.notes} onChange={(e) => handleChange('notes', e.target.value)} error={!!errors.notes} helperText={errors.notes} />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select value={formData.status} onChange={(e) => handleChange('status', e.target.value)}>
              {statuses.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary">Add Event</Button>
        </form>
      )}
    </Container>
  );
};

export default AddEvent;
