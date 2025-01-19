import { useState } from 'react';
import { TextField, Button, Container, Typography, Alert } from '@mui/material';
import { createItem } from '../services/api';

const CreateItem = () => {
  const [formData, setFormData] = useState({ name: '', description: '', color: '', price: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState('');

  const validateField = (field: string, value: string) => {
    let error = '';
    if (!value.trim()) {
      error = `${field} is required`;
    } else {
      if (field === 'name' && !/^[a-zA-Z0-9 ]+$/.test(value)) {
        error = 'Name must contain only letters and numbers';
      } else if ((field === 'description' || field === 'color') && !/^[a-zA-Z ]+$/.test(value)) {
        error = `${field} must contain only letters`;
      }
    }
    return error;
  };

  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};
    newErrors.name = validateField('Name', formData.name);
    newErrors.description = validateField('Description', formData.description);
    newErrors.color = validateField('Color', formData.color);
    if (!formData.price.trim() || isNaN(Number(formData.price))) {
      newErrors.price = 'Valid price is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).every(key => newErrors[key] === '');
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prevState => ({ ...prevState, [field]: value }));
    setErrors(prevErrors => ({ ...prevErrors, [field]: validateField(field, value) }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    try {
      await createItem(formData);
      setSuccess('Item created successfully!');
      setFormData({ name: '', description: '', color: '', price: '' });
      setErrors({});
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Create Item</Typography>
      {success && <Alert severity="success">{success}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField fullWidth margin="normal" label="Name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} error={!!errors.name} helperText={errors.name} />
        <TextField fullWidth margin="normal" label="Description" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} error={!!errors.description} helperText={errors.description} />
        <TextField fullWidth margin="normal" label="Color" value={formData.color} onChange={(e) => handleChange('color', e.target.value)} error={!!errors.color} helperText={errors.color} />
        <TextField fullWidth margin="normal" label="Price" value={formData.price} onChange={(e) => handleChange('price', e.target.value)} error={!!errors.price} helperText={errors.price} type="number" />
        <Button type="submit" variant="contained" color="primary">Create</Button>
      </form>
    </Container>
  );
};

export default CreateItem;
